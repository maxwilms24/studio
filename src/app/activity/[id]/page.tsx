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
import { mockActivities, mockUsers } from '@/lib/data';
import { Clock, MapPin, Users, Plus, Minus } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ClientTime } from '@/components/client-time';

export default function ActivityDetailPage({ params }: { params: { id: string } }) {
  const activity = mockActivities.find((a) => a.id === params.id);
  const currentUser = mockUsers[0]; // Mock current user

  if (!activity) {
    notFound();
  }

  const isOrganizer = currentUser.id === activity.organizer.id;
  const playersJoined = activity.participants.reduce((acc, p) => acc + p.participantCount, 0);
  const progress = (playersJoined / activity.totalPlayers) * 100;
  
  const isParticipant = activity.participants.some(p => p.user.id === currentUser.id);
  const hasPendingResponse = activity.pendingResponses.some(p => p.user.id === currentUser.id);

  return (
    <AppLayout>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* Main Activity Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <SportIcon sport={activity.sport} className="h-10 w-10 text-primary" />
                  <div>
                    <CardTitle className="text-3xl font-headline">{activity.sport}</CardTitle>
                    <CardDescription className="flex items-center gap-1.5 pt-1">
                        Organized by {activity.organizer.name}
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
                        <ClientTime date={activity.time} formatString="EEEE, MMMM d 'at' h:mm a" />
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
          
          {/* Action/Chat Section */}
          {isOrganizer && activity.status === 'Open' && <ManageParticipants activity={activity} />}
          {activity.status === 'Closed' && isParticipant && <GroupChat activity={activity} currentUser={currentUser} />}
          {!isOrganizer && !isParticipant && activity.status === 'Open' && !hasPendingResponse && <RespondToActivity />}
          {!isOrganizer && hasPendingResponse && (
            <Card className="text-center">
                <CardHeader>
                    <CardTitle className="font-headline">Response Submitted</CardTitle>
                    <CardDescription>Your request to join is pending approval from the organizer.</CardDescription>
                </CardHeader>
            </Card>
          )}

        </div>
        
        {/* Participants List */}
        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Participants ({playersJoined})</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {activity.participants.map(p => (
                    <li key={p.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={p.user.profilePhoto.imageUrl} alt={p.user.name} data-ai-hint={p.user.profilePhoto.imageHint} />
                                <AvatarFallback>{p.user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{p.user.name}</p>
                                {p.user.id === activity.organizer.id && <Badge variant="outline">Organizer</Badge>}
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

function RespondToActivity() {
    // This is a dummy component for UI display. A real implementation would use state.
    const participantCount = 2;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Join this Activity</CardTitle>
                <CardDescription>Are you coming alone or with friends?</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
                 <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon"><Minus className="h-4 w-4" /></Button>
                    <div className="text-xl font-bold w-24 text-center">
                        {participantCount === 1 ? 'Just me' : `Me + ${participantCount - 1}`}
                    </div>
                    <Button variant="outline" size="icon"><Plus className="h-4 w-4" /></Button>
                </div>
                <Button className="w-full sm:w-auto">Send Join Request</Button>
            </CardContent>
        </Card>
    );
}
