'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import type { Activity } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface ManageParticipantsProps {
    activity: Activity;
}

export function ManageParticipants({ activity }: ManageParticipantsProps) {
    const { toast } = useToast();
    
    const handleDecision = (name: string, decision: 'accepted' | 'rejected') => {
        toast({
            title: `Request ${decision}`,
            description: `${name}'s request to join has been ${decision}.`
        })
    }
  
    if (activity.pendingResponses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Manage Requests</CardTitle>
          <CardDescription>There are no pending requests to join your activity.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Manage Requests</CardTitle>
        <CardDescription>Accept or reject requests to join your activity.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {activity.pendingResponses.map(response => (
            <li key={response.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={response.user.profilePhoto.imageUrl} alt={response.user.name} data-ai-hint={response.user.profilePhoto.imageHint} />
                        <AvatarFallback>{response.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{response.user.name}</p>
                        <p className="text-sm text-muted-foreground">
                            Wants to bring {response.participantCount} participant{response.participantCount > 1 ? 's' : ''}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="bg-background" onClick={() => handleDecision(response.user.name, 'rejected')}>
                        <X className="h-4 w-4 text-destructive" />
                    </Button>
                    <Button size="icon" onClick={() => handleDecision(response.user.name, 'accepted')}>
                        <Check className="h-4 w-4" />
                    </Button>
                </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
