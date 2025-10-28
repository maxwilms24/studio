'use client';

import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, PlusCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation';
import { useAuth, useFirestore, useUser, addDocumentNonBlocking, useDoc, useMemoFirebase } from '@/firebase';
import { collection, doc, serverTimestamp, Timestamp } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { useEffect } from 'react';

const sports = ['Basketbal', 'Voetbal', 'Volleybal', 'Tennis', 'Hardlopen', 'Schermen', 'Padel', 'Hockey', 'Wielrennen'];

const formSchema = z.object({
  sport: z.string().min(1, 'Selecteer een sport.'),
  location: z.string().min(3, 'Locatie moet minimaal 3 karakters bevatten.'),
  date: z.date({ required_error: 'Een datum is verplicht.' }),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Ongeldig tijdformaat (HH:MM).'),
  totalPlayers: z.coerce.number().min(2, 'Minimaal 2 spelers.').max(50),
  playersNeeded: z.coerce.number().min(1, 'Minimaal 1 speler gezocht.'),
}).refine(data => data.playersNeeded < data.totalPlayers, {
    message: "Aantal gezochte spelers moet minder zijn dan het totaal aantal spelers.",
    path: ["playersNeeded"],
});

export default function CreateActivityPage() {
    const { toast } = useToast();
    const router = useRouter();
    const firestore = useFirestore();
    const { user, isUserLoading } = useUser();

    useEffect(() => {
        if (!isUserLoading && !user) {
            router.push('/login');
        }
    }, [user, isUserLoading, router]);

    const userProfileRef = useMemoFirebase(() => user ? doc(firestore, 'users', user.uid) : null, [firestore, user]);
    const { data: userProfile } = useDoc<UserProfile>(userProfileRef);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
        sport: '',
        location: '',
        time: '18:00',
        totalPlayers: 10,
        playersNeeded: 5,
        },
    });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user || !userProfile) {
        toast({ variant: 'destructive', title: 'Fout', description: 'Je moet ingelogd zijn om een activiteit aan te maken.' });
        return;
    }
    
    const [hours, minutes] = values.time.split(':').map(Number);
    const activityDateTime = new Date(values.date);
    activityDateTime.setHours(hours, minutes);

    const newActivity = {
        organizerId: user.uid,
        organizerName: userProfile.name,
        organizerPhotoUrl: userProfile.profilePhotoUrl,
        organizerPhotoHint: userProfile.profilePhotoHint,
        sport: values.sport,
        location: values.location,
        time: Timestamp.fromDate(activityDateTime),
        totalPlayers: values.totalPlayers,
        playersNeeded: values.playersNeeded,
        status: 'Open',
        participantIds: [user.uid],
        createdAt: serverTimestamp(),
    };

    const activitiesCollection = collection(firestore, 'activities');
    addDocumentNonBlocking(activitiesCollection, newActivity);

    toast({
        title: "Activiteit aangemaakt!",
        description: `Je ${values.sport} wedstrijd staat op de lijst.`,
      });
    router.push('/');
  }

  return (
    <AppLayout>
        <div className="flex items-center gap-4 mb-8">
            <PlusCircle className="h-8 w-8 text-primary" />
            <div>
                <h1 className="text-3xl font-bold tracking-tight font-headline">Nieuwe Activiteit Aanmaken</h1>
                <p className="text-muted-foreground mt-1">Vul de details in om je spel te starten.</p>
            </div>
        </div>
      <Card>
        <CardHeader>
          <CardTitle>Details van de Activiteit</CardTitle>
          <CardDescription>
            Specificeer het wat, waar, wanneer en wie voor jouw sportevenement.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="sport"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sport</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecteer een sport" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {sports.map((sport) => (
                            <SelectItem key={sport} value={sport}>{sport}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Locatie</FormLabel>
                      <FormControl>
                        <Input placeholder="bijv. Vondelpark" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Datum</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? format(field.value, 'PPP') : <span>Kies een datum</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date() || date > new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Tijd (24-uurs formaat)</FormLabel>
                        <FormControl>
                            <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="totalPlayers"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Totaal Benodigde Spelers</FormLabel>
                        <FormControl>
                            <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>De uiteindelijke grootte van de groep.</FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="playersNeeded"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Aantal Spelers dat je Zoekt</FormLabel>
                        <FormControl>
                            <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>Hoeveel mensen je nodig hebt om mee te doen.</FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit">Activiteit Aanmaken</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
