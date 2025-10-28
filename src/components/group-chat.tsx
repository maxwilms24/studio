'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import type { Activity, User } from '@/lib/types';
import { mockChatMessages } from '@/lib/data';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface GroupChatProps {
    activity: Activity;
    currentUser: User;
}

export function GroupChat({ activity, currentUser }: GroupChatProps) {
  const messages = mockChatMessages(activity.id);

  return (
    <Card className="flex flex-col h-[600px]">
      <CardHeader>
        <CardTitle className="font-headline">Group Chat</CardTitle>
        <CardDescription>Coordinate details with the other participants.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
        <div className="flex-1 overflow-y-auto pr-4 space-y-4">
            {messages.map((msg, index) => {
                const isCurrentUser = msg.user.id === currentUser.id;
                return (
                    <div key={index} className={cn("flex items-end gap-2", isCurrentUser ? "justify-end" : "justify-start")}>
                        {!isCurrentUser && (
                             <Avatar className="h-8 w-8">
                                <AvatarImage src={msg.user.profilePhoto.imageUrl} alt={msg.user.name} data-ai-hint={msg.user.profilePhoto.imageHint} />
                                <AvatarFallback>{msg.user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        )}
                        <div className={cn("max-w-xs md:max-w-md p-3 rounded-lg", isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted")}>
                           <p className="text-sm">{msg.message}</p>
                           <p className={cn("text-xs mt-1", isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground/70")}>
                                {format(msg.timestamp, 'p')}
                           </p>
                        </div>
                        {isCurrentUser && (
                             <Avatar className="h-8 w-8">
                                <AvatarImage src={msg.user.profilePhoto.imageUrl} alt={msg.user.name} data-ai-hint={msg.user.profilePhoto.imageHint} />
                                <AvatarFallback>{msg.user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        )}
                    </div>
                );
            })}
        </div>
        <div className="flex items-center gap-2 pt-4 border-t">
          <Input placeholder="Type your message..." />
          <Button size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
