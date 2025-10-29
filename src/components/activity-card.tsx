
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Users, ArrowRight, User as UserIcon } from 'lucide-react';
import type { Activity } from '@/lib/types';
import { SportIcon } from './icons/sport-icons';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ClientTime } from './client-time';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
import type { ActivityResponse, Participant } from '@/lib/types';
import React from 'react';

interface ActivityCardProps {
  activity: Activity;
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const firestore = useFirestore();
  
  const responsesRef = useMemoFirebase(() => collection(firestore, 'activities', activity.id, 'responses'), [firestore, activity.id]);
  const acceptedResponsesQuery = useMemoFirebase(() => query(responsesRef, where('status', '==', 'accepted')), [responsesRef]);
  
  const { data: acceptedResponses } = useCollection<ActivityResponse>(acceptedResponsesQuery);
  
  const participants = React.useMemo(() => {
    if (!activity || !acceptedResponses) return [];
    
    const participantList: Participant[] = acceptedResponses.slice(0,4).map(r => ({
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
    
    return participantList.slice(0,4);
  }, [activity, acceptedResponses]);


  const playersJoined = React.useMemo(() => {
    let count = 0;
    if (acceptedResponses) {
        count = acceptedResponses.reduce((acc, p) => acc + p.numberOfParticipants, 0);
    }
    // ensure organizer is counted if not in responses
    if (!acceptedResponses?.some(r => r.respondentId === activity.organizerId)) {
        count +=1;
    }
    return count;
  }, [acceptedResponses, activity.organizerId]);


  const progress = (playersJoined / activity.totalPlayers) * 100;

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Open':
        return 'secondary';
      case 'Full':
        return 'default';
      case 'Closed':
        return 'default';
      case 'Cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  }

  if (!activity.id) {
    return null;
  }

  return (
    <Card className="relative flex flex-col h-full transition-all duration-300 ease-in-out group hover:shadow-lg hover:border-primary/50 hover:-translate-y-1">
        <Link href={`/activity/${activity.id}`} className="absolute inset-0 z-10" aria-label={`Bekijk details voor ${activity.sport} op ${activity.location}`}/>
        <CardHeader className="z-0">
            <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <SportIcon sport={activity.sport} className="h-8 w-8 text-primary" />
                <div>
                <CardTitle className="text-xl font-headline">
                    <span>{activity.sport}</span>
                </CardTitle>
                <CardDescription className="flex items-center gap-1.5 pt-1">
                    <MapPin className="h-3.5 w-3.5" /> {activity.location}
                </CardDescription>
                </div>
            </div>
            <Badge variant={getStatusBadgeVariant(activity.status)} className="capitalize border border-border">
                {activity.status}
            </Badge>
            </div>
        </CardHeader>
        <CardContent className="flex-grow space-y-4 z-0">
            <div className="flex items-center text-sm text-muted-foreground gap-1.5">
                <Clock className="h-4 w-4" />
                <ClientTime date={activity.time.toDate()} formatString="EEEE, d MMMM 'om' HH:mm" />
            </div>
            <div>
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                Spelers
                </span>
                <span className="text-sm font-bold">{playersJoined} / {activity.totalPlayers}</span>
            </div>
            <Progress value={progress} aria-label={`${playersJoined} van de ${activity.totalPlayers} spelers zijn lid geworden`} />
            </div>
        </CardContent>
      <CardFooter className="flex justify-between items-center">
          <div className="flex items-center -space-x-2 z-0">
              {participants?.map((p) => (
                  <Avatar key={p.id} className="h-8 w-8 border-2 border-background">
                      <AvatarImage src={p.profilePhotoUrl} alt={p.name} data-ai-hint={p.profilePhotoHint} />
                      <AvatarFallback>
                          {p.profilePhotoUrl ? p.name.charAt(0) : <UserIcon className="h-4 w-4" />}
                      </AvatarFallback>
                  </Avatar>
              ))}
              {(activity.participantIds?.length || 0) > 4 && (
                  <Avatar className="h-8 w-8 border-2 border-background">
                      <AvatarFallback>+{(activity.participantIds.length) - 4}</AvatarFallback>
                  </Avatar>
              )}
          </div>
          <Button asChild variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity relative z-20">
              <Link href={`/activity/${activity.id}`}>
                  Bekijk Details <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
          </Button>
      </CardFooter>
    </Card>
  );
}
