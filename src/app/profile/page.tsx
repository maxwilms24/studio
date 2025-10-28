'use client';

import { AppLayout } from '@/components/app-layout';
import { SportIcon } from '@/components/icons/sport-icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
        router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const userProfileRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);

  const isLoading = isUserLoading || isProfileLoading;
  
  if (isLoading) {
    return (
        <AppLayout>
            <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-5 w-32" />
                </div>
            </div>
            <Separator />
            <Card>
                <CardHeader>
                <Skeleton className="h-7 w-40" />
                <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent>
                <div className="flex flex-wrap gap-4">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-28" />
                    <Skeleton className="h-10 w-20" />
                </div>
                </CardContent>
            </Card>
            </div>
      </AppLayout>
    )
  }

  if (!userProfile) {
    return (
        <AppLayout>
            <p>User profile not found.</p>
        </AppLayout>
    )
  }


  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <Avatar className="h-24 w-24 border-4 border-primary">
            <AvatarImage src={userProfile.profilePhotoUrl} alt={userProfile.name} data-ai-hint={userProfile.profilePhotoHint} />
            <AvatarFallback className="text-3xl">{userProfile.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">{userProfile.name}</h1>
            <p className="text-muted-foreground mt-1">Member since {new Date().getFullYear()}</p>
          </div>
        </div>
        <Separator />
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Favorite Sports</CardTitle>
                <CardDescription>The sports you love to play the most.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-4">
                    {userProfile.favoriteSports.map(sport => (
                        <Badge key={sport} variant="secondary" className="text-lg py-2 px-4 border border-border flex items-center gap-2">
                            <SportIcon sport={sport} className="h-5 w-5" />
                            <span>{sport}</span>
                        </Badge>
                    ))}
                     {userProfile.favoriteSports.length === 0 && <p className="text-muted-foreground">No favorite sports selected yet.</p>}
                </div>
            </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
