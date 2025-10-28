'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import type { Activity, ActivityResponse } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, updateDocumentNonBlocking } from '@/firebase';
import { doc, arrayUnion } from 'firebase/firestore';

interface ManageParticipantsProps {
    activity: Activity;
    pendingResponses: ActivityResponse[];
}

export function ManageParticipants({ activity, pendingResponses }: ManageParticipantsProps) {
    const { toast } = useToast();
    const firestore = useFirestore();
    
    const handleDecision = (response: ActivityResponse, decision: 'accepted' | 'rejected') => {
        const responseRef = doc(firestore, 'activities', activity.id, 'responses', response.id);
        updateDocumentNonBlocking(responseRef, { status: decision });

        if (decision === 'accepted') {
            const activityRef = doc(firestore, 'activities', activity.id);
            updateDocumentNonBlocking(activityRef, {
                participantIds: arrayUnion(response.respondentId)
            });
        }

        toast({
            title: `Request ${decision}`,
            description: `${response.respondentName}'s request to join has been ${decision}.`
        })
    }
  
    if (!pendingResponses || pendingResponses.length === 0) {
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
          {pendingResponses.map(response => (
            <li key={response.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={response.respondentPhotoUrl} alt={response.respondentName} data-ai-hint={response.respondentPhotoHint} />
                        <AvatarFallback>{response.respondentName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{response.respondentName}</p>
                        <p className="text-sm text-muted-foreground">
                            Wants to bring {response.numberOfParticipants} participant{response.numberOfParticipants > 1 ? 's' : ''}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="bg-background" onClick={() => handleDecision(response, 'rejected')}>
                        <X className="h-4 w-4 text-destructive" />
                    </Button>
                    <Button size="icon" onClick={() => handleDecision(response, 'accepted')}>
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
