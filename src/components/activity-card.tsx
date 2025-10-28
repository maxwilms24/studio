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
import { Clock, MapPin, Users, ArrowRight } from 'lucide-react';
import type { Activity } from '@/lib/types';
import { SportIcon } from './icons/sport-icons';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ClientTime } from './client-time';

interface ActivityCardProps {
  activity: Activity;
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const playersJoined = activity.participants.reduce((acc, p) => acc + p.participantCount, 0);
  const progress = (playersJoined / activity.totalPlayers) * 100;

  return (
    <Link href={`/activity/${activity.id}`} className="block group">
        <Card className="flex flex-col h-full transition-all duration-300 ease-in-out group-hover:shadow-lg group-hover:border-primary/50 group-hover:-translate-y-1">
        <CardHeader>
            <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <SportIcon sport={activity.sport} className="h-8 w-8 text-primary" />
                <div>
                <CardTitle className="text-xl font-headline">{activity.sport}</CardTitle>
                <CardDescription className="flex items-center gap-1.5 pt-1">
                    <MapPin className="h-3.5 w-3.5" /> {activity.location}
                </CardDescription>
                </div>
            </div>
            <Badge variant={activity.status === 'Open' ? 'secondary' : 'destructive'} className="capitalize border border-border">
                {activity.status}
            </Badge>
            </div>
        </CardHeader>
        <CardContent className="flex-grow space-y-4">
            <div className="flex items-center text-sm text-muted-foreground gap-1.5">
                <Clock className="h-4 w-4" />
                <ClientTime date={activity.time} formatString="EEEE, MMMM d 'at' h:mm a" />
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
        <CardFooter className="flex justify-between items-center">
            <div className="flex items-center -space-x-2">
                {activity.participants.slice(0,4).map((p) => (
                    <Avatar key={p.user.id} className="h-8 w-8 border-2 border-background">
                        <AvatarImage src={p.user.profilePhoto.imageUrl} alt={p.user.name} data-ai-hint={p.user.profilePhoto.imageHint} />
                        <AvatarFallback>{p.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                ))}
                {activity.participants.length > 4 && (
                    <Avatar className="h-8 w-8 border-2 border-background">
                        <AvatarFallback>+{activity.participants.length - 4}</AvatarFallback>
                    </Avatar>
                )}
            </div>
            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                View Details <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </CardFooter>
        </Card>
    </Link>
  );
}
