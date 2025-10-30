'use client';

import * as React from 'react';
import { AppLayout } from '@/components/app-layout';
import { ActivityFilters } from '@/components/activity-filters';
import { ActivityCard } from '@/components/activity-card';
import { AiSuggestions } from '@/components/ai-suggestions';
import type { Activity, UserProfile } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { useCollection, useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, doc, query, where } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  React.useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);
  
  const activitiesQuery = useMemoFirebase(() => query(collection(firestore, 'activities'), where('status', '==', 'Open')), [firestore]);
  const { data: activities, isLoading: isLoadingActivities } = useCollection<Activity>(activitiesQuery);

  const userProfileRef = useMemoFirebase(() => user ? doc(firestore, 'users', user.uid) : null, [firestore, user]);
  const { data: userProfile, isLoading: isLoadingProfile } = useDoc<UserProfile>(userProfileRef);

  const [filters, setFilters] = React.useState({ sport: '', location: '' });

  const filteredActivities = React.useMemo(() => {
    if (!activities) return [];
    return activities.filter((activity) => {
      return (
        (filters.sport === '' || activity.sport.toLowerCase() === filters.sport.toLowerCase()) &&
        (filters.location === '' || activity.location.toLowerCase().includes(filters.location.toLowerCase()))
      );
    });
  }, [activities, filters]);
  
  const isLoading = isLoadingActivities || (user && isLoadingProfile);

  if (isUserLoading || !user) {
    return (
        <div className="flex justify-center items-center h-screen">
          <p>Laden...</p>
        </div>
    )
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Ontdek Activiteiten</h1>
          <p className="text-muted-foreground mt-1">Vind je volgende wedstrijd en kom in contact met andere spelers.</p>
        </div>
        
        <ActivityFilters onFilterChange={setFilters} />

        <Separator />

        {userProfile && <AiSuggestions currentUser={userProfile} />}

        <div>
          <h2 className="text-2xl font-bold tracking-tight font-headline">Nu Beschikbaar</h2>
          {isLoading && <p>Activiteiten laden...</p>}
          {!isLoading && filteredActivities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {filteredActivities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
          ) : (
            !isLoading && <div className="flex flex-col items-center justify-center text-center bg-card p-10 rounded-lg mt-4 border-2 border-dashed">
                <p className="text-lg font-semibold text-muted-foreground">Geen activiteiten gevonden</p>
                <p className="text-sm text-muted-foreground mt-1">Probeer je filters aan te passen of kom later terug!</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
