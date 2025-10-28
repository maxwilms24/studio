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

const sports = ['Basketball', 'Soccer', 'Volleyball', 'Tennis', 'Running', 'Fencing'];

const formSchema = z.object({
  sport: z.string().min(1, 'Please select a sport.'),
  location: z.string().min(3, 'Location must be at least 3 characters.'),
  date: z.date({ required_error: 'A date is required.' }),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM).'),
  totalPlayers: z.coerce.number().min(2, 'Must have at least 2 players.').max(50),
  playersNeeded: z.coerce.number().min(1, 'Must seek at least 1 player.'),
}).refine(data => data.playersNeeded < data.totalPlayers, {
    message: "Players sought must be less than total players.",
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
        toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to create an activity.' });
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
        title: "Activity Created!",
        description: `Your ${values.sport} game is on the list.`,
      });
    router.push('/');
  }

  return (
    <AppLayout>
        <div className="flex items-center gap-4 mb-8">
            <PlusCircle className="h-8 w-8 text-primary" />
            <div>
                <h1 className="text-3xl font-bold tracking-tight font-headline">Create a New Activity</h1>
                <p className="text-muted-foreground mt-1">Fill out the details to get your game started.</p>
            </div>
        </div>
      <Card>
        <CardHeader>
          <CardTitle>Activity Details</CardTitle>
          <CardDescription>
            Specify the what, where, when, and who for your sporting event.
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
                            <SelectValue placeholder="Select a sport" />
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
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Central Park Courts" {...field} />
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
                      <FormLabel>Date</FormLabel>
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
                              {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
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
                        <FormLabel>Time (24-hour format)</FormLabel>
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
                        <FormLabel>Total Players Needed</FormLabel>
                        <FormControl>
                            <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>The final size of the group.</FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="playersNeeded"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Number of Players You're Seeking</FormLabel>
                        <FormControl>
                            <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>How many people you need to join.</FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit">Create Activity</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
