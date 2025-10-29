'use client';

import React from 'react';
import { AppLayout } from '@/components/app-layout';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { Activity, UserProfile } from '@/lib/types';
import { MessageSquare, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SportIcon } from '@/components/icons/sport-icons';
import { ClientTime } from '@/components/client-time';
import { Skeleton } from '@/components/ui/skeleton';

export default function ChatsPage() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  React.useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const participatingActivitiesQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
      collection(firestore, 'activities'), 
      where('participantIds', 'array-contains', user.uid),
      where('status', 'in', ['Full', 'Closed'])
    );
  }, [firestore, user]);

  const { data: chatActivities, isLoading } = useCollection<Activity>(participatingActivitiesQuery);

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <MessageSquare className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">Mijn Chats</h1>
            <p className="text-muted-foreground mt-1">Bekijk de groepschats voor je aankomende activiteiten.</p>
          </div>
        </div>

        {isLoading && (
            <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
            </div>
        )}
        
        {!isLoading && (
          <>
            {chatActivities && chatActivities.length > 0 ? (
              <div className="space-y-4">
                {chatActivities.map((activity) => (
                  <Link key={activity.id} href={`/activity/${activity.id}`} className="block">
                    <Card className="hover:border-primary/50 hover:bg-muted/30 transition-colors">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                            <div className='flex items-center gap-3'>
                                <SportIcon sport={activity.sport} className="h-8 w-8 text-primary" />
                                <div>
                                    <CardTitle className='font-headline'>{activity.sport} - {activity.location}</CardTitle>
                                    <CardDescription><ClientTime date={activity.time.toDate()} formatString="EEEE d MMMM" /></CardDescription>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                <Users className="h-4 w-4" />
                                <span>{activity.participantIds.length}</span>
                            </div>
                        </div>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center bg-card p-10 rounded-lg mt-4 border-2 border-dashed">
                <p className="text-lg font-semibold text-muted-foreground">Geen actieve chats</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Chats worden beschikbaar zodra een activiteit waaraan je deelneemt vol of gesloten is.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
