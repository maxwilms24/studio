'use client';

import React from 'react';
import { AppLayout } from '@/components/app-layout';
import { GroupChat } from '@/components/group-chat';
import { SportIcon } from '@/components/icons/sport-icons';
import { ManageParticipants } from '@/components/manage-participants';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Clock, MapPin, Users, Plus, Minus } from 'lucide-react';
import { notFound, useRouter } from 'next/navigation';
import { ClientTime } from '@/components/client-time';
import { useCollection, useDoc, useFirestore, useMemoFirebase, useUser, addDocumentNonBlocking } from '@/firebase';
import { doc, collection, query, where } from 'firebase/firestore';
import type { Activity, ActivityResponse, Participant, UserProfile } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';


export default function ActivityDetailPage({ params }: { params: { id: string } }) {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  const activityRef = useMemoFirebase(() => doc(firestore, 'activities', params.id), [firestore, params.id]);
  const { data: activity, isLoading: isLoadingActivity } = useDoc<Activity>(activityRef);

  const responsesRef = useMemoFirebase(() => collection(firestore, 'activities', params.id, 'responses'), [firestore, params.id]);
  const { data: responses, isLoading: isLoadingResponses } = useCollection<ActivityResponse>(responsesRef);

  const userProfileRef = useMemoFirebase(() => user ? doc(firestore, 'users', user.uid) : null, [firestore, user]);
  const { data: currentUserProfile, isLoading: isLoadingProfile } = useDoc<UserProfile>(userProfileRef);

  const acceptedResponses = React.useMemo(() => responses?.filter(r => r.status === 'accepted') || [], [responses]);
  const pendingResponses = React.useMemo(() => responses?.filter(r => r.status === 'pending') || [], [responses]);

  const participants = React.useMemo(() => {
    if (!activity || !acceptedResponses) return [];

    const participantList: Participant[] = acceptedResponses.map(r => ({
      id: r.respondentId,
      name: r.respondentName,
      profilePhotoUrl: r.respondentPhotoUrl,
      profilePhotoHint: r.respondentPhotoHint,
      participantCount: r.numberOfParticipants,
      isOrganizer: r.respondentId === activity.organizerId
    }));

    if (!participantList.some(p => p.id === activity.organizerId)) {
      participantList.unshift({
        id: activity.organizerId,
        name: activity.organizerName,
        profilePhotoUrl: activity.organizerPhotoUrl,
        profilePhotoHint: activity.organizerPhotoHint,
        participantCount: 1,
        isOrganizer: true,
      });
    }
    
    return participantList;
  }, [activity, acceptedResponses]);


  const isLoading = isLoadingActivity || isLoadingResponses || isUserLoading || (user && isLoadingProfile);

  if (isLoading) {
    return <AppLayout><p>Loading...</p></AppLayout>;
  }

  if (!activity) {
    notFound();
  }

  const isOrganizer = user?.uid === activity.organizerId;
  const playersJoined = participants.reduce((acc, p) => acc + p.participantCount, 0);
  const progress = (playersJoined / activity.totalPlayers) * 100;
  
  const isParticipant = user ? activity.participantIds.includes(user.uid) : false;
  const hasPendingResponse = pendingResponses.some(p => p.respondentId === user?.uid);

  return (
    <AppLayout>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <SportIcon sport={activity.sport} className="h-10 w-10 text-primary" />
                  <div>
                    <CardTitle className="text-3xl font-headline">{activity.sport}</CardTitle>
                    <CardDescription className="flex items-center gap-1.5 pt-1">
                        Organized by {activity.organizerName}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant={activity.status === 'Open' ? 'secondary' : 'destructive'} className="capitalize text-base px-4 py-2 border-border">
                  {activity.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-md">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-5 w-5 text-primary" />
                        <span>{activity.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-5 w-5 text-primary" />
                        <ClientTime date={activity.time.toDate()} formatString="EEEE, MMMM d 'at' h:mm a" />
                    </div>
                </div>
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium flex items-center gap-1.5">
                        <Users className="h-4 w-4" />
                        Players
                        </span>
                        <span className="text-sm font-bold">{playersJoined} / {activity.totalPlayers}</span>
                    </div>
                    <Progress value={progress} aria-label={`${playersJoined} of ${activity.totalPlayers} players joined`} />
                </div>
            </CardContent>
          </Card>
          
          {isOrganizer && activity.status === 'Open' && <ManageParticipants activity={activity} pendingResponses={pendingResponses} />}
          {activity.status === 'Closed' && isParticipant && user && currentUserProfile && <GroupChat activity={activity} currentUser={user} currentUserProfile={currentUserProfile} />}
          {!isOrganizer && !isParticipant && activity.status === 'Open' && !hasPendingResponse && user && currentUserProfile && <RespondToActivity activity={activity} user={user} userProfile={currentUserProfile} />}
          {!isOrganizer && hasPendingResponse && (
            <Card className="text-center">
                <CardHeader>
                    <CardTitle className="font-headline">Response Submitted</CardTitle>
                    <CardDescription>Your request to join is pending approval from the organizer.</CardDescription>
                </CardHeader>
            </Card>
          )}

        </div>
        
        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Participants ({playersJoined})</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {participants.map(p => (
                    <li key={p.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={p.profilePhotoUrl} alt={p.name} data-ai-hint={p.profilePhotoHint} />
                                <AvatarFallback>{p.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{p.name}</p>
                                {p.isOrganizer && <Badge variant="outline">Organizer</Badge>}
                            </div>
                        </div>
                        {p.participantCount > 1 && <Badge variant="secondary">+{p.participantCount - 1}</Badge>}
                    </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

function RespondToActivity({ activity, user, userProfile }: { activity: Activity, user: any, userProfile: UserProfile }) {
    const [participantCount, setParticipantCount] = React.useState(1);
    const firestore = useFirestore();
    const { toast } = useToast();

    const handleSendRequest = () => {
        const response = {
            activityId: activity.id,
            respondentId: user.uid,
            respondentName: userProfile.name,
            respondentPhotoUrl: userProfile.profilePhotoUrl,
            respondentPhotoHint: userProfile.profilePhotoHint,
            numberOfParticipants: participantCount,
            status: 'pending',
        };
        const responsesCollection = collection(firestore, 'activities', activity.id, 'responses');
        addDocumentNonBlocking(responsesCollection, response);
        toast({ title: 'Request Sent', description: 'Your request to join has been sent to the organizer.' });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Join this Activity</CardTitle>
                <CardDescription>Are you coming alone or with friends?</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
                 <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => setParticipantCount(p => Math.max(1, p - 1))}><Minus className="h-4 w-4" /></Button>
                    <div className="text-xl font-bold w-24 text-center">
                        {participantCount === 1 ? 'Just me' : `Me + ${participantCount - 1}`}
                    </div>
                    <Button variant="outline" size="icon" onClick={() => setParticipantCount(p => Math.min(10, p + 1))}><Plus className="h-4 w-4" /></Button>
                </div>
                <Button className="w-full sm:w-auto" onClick={handleSendRequest}>Send Join Request</Button>
            </CardContent>
        </Card>
    );
}
