'use client';

import React from 'react';
import { AppLayout } from '@/components/app-layout';
import { ActivityCard } from '@/components/activity-card';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { Activity } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { List } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MyActivitiesPage() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  React.useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const organizedActivitiesQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(firestore, 'activities'), where('organizerId', '==', user.uid));
  }, [firestore, user]);

  const participatingActivitiesQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(firestore, 'activities'), where('participantIds', 'array-contains', user.uid));
  }, [firestore, user]);

  const { data: organizedActivities, isLoading: isLoadingOrganized } = useCollection<Activity>(organizedActivitiesQuery);
  const { data: participatingActivitiesData, isLoading: isLoadingParticipating } = useCollection<Activity>(participatingActivitiesQuery);

  const participatingActivities = React.useMemo(() => {
    if (!participatingActivitiesData || !user) return [];
    // Filter out activities that the user also organized to avoid showing them in both tabs
    return participatingActivitiesData.filter(activity => activity.organizerId !== user.uid);
  }, [participatingActivitiesData, user]);

  const isLoading = isUserLoading || isLoadingOrganized || isLoadingParticipating;

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex items-center gap-4">
            <List className="h-8 w-8 text-primary" />
            <div>
                <h1 className="text-3xl font-bold tracking-tight font-headline">Mijn Activiteiten</h1>
                <p className="text-muted-foreground mt-1">Bekijk de activiteiten die je organiseert of waaraan je deelneemt.</p>
            </div>
        </div>

        {isLoading && <p>Activiteiten laden...</p>}

        {!isLoading && user && (
          <Tabs defaultValue="participating">
            <TabsList className="grid w-full grid-cols-2 md:w-96">
              <TabsTrigger value="participating">Deelnemen</TabsTrigger>
              <TabsTrigger value="organized">Georganiseerd</TabsTrigger>
            </TabsList>
            <TabsContent value="participating" className="mt-6">
              {participatingActivities && participatingActivities.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {participatingActivities.map((activity) => (
                    <ActivityCard key={activity.id} activity={activity} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center bg-card p-10 rounded-lg mt-4 border-2 border-dashed">
                  <p className="text-lg font-semibold text-muted-foreground">Je neemt nog niet deel aan activiteiten.</p>
                  <p className="text-sm text-muted-foreground mt-1">Zoek een leuke activiteit op de 'Ontdek' pagina!</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="organized" className="mt-6">
              {organizedActivities && organizedActivities.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {organizedActivities.map((activity) => (
                    <ActivityCard key={activity.id} activity={activity} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center bg-card p-10 rounded-lg mt-4 border-2 border-dashed">
                  <p className="text-lg font-semibold text-muted-foreground">Je hebt nog geen activiteiten georganiseerd.</p>
                  <p className="text-sm text-muted-foreground mt-1">Maak een nieuwe activiteit aan om te beginnen.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </AppLayout>
  );
}
