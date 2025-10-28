'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, User as UserIcon } from 'lucide-react';
import type { Activity, ChatMessage, UserProfile } from '@/lib/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useCollection, useFirestore, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp, orderBy, query } from 'firebase/firestore';

interface GroupChatProps {
    activity: Activity;
    currentUser: any;
    currentUserProfile: UserProfile;
}

export function GroupChat({ activity, currentUser, currentUserProfile }: GroupChatProps) {
  const firestore = useFirestore();
  const [newMessage, setNewMessage] = React.useState('');
  
  const messagesRef = useMemoFirebase(() => 
    collection(firestore, 'activities', activity.id, 'messages'), 
    [firestore, activity.id]
  );
  
  const messagesQuery = useMemoFirebase(() => 
    query(messagesRef, orderBy('timestamp', 'asc')),
    [messagesRef]
  );
  
  const { data: messages } = useCollection<ChatMessage>(messagesQuery);
  const messagesContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);


  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const messageData = {
        senderId: currentUser.uid,
        senderName: currentUserProfile.name,
        senderPhotoUrl: currentUserProfile.profilePhotoUrl,
        senderPhotoHint: currentUserProfile.profilePhotoHint,
        message: newMessage,
        timestamp: serverTimestamp()
    };
    addDocumentNonBlocking(messagesRef, messageData);
    setNewMessage('');
  };

  return (
    <Card className="flex flex-col h-[600px]">
      <CardHeader>
        <CardTitle className="font-headline">Groepschat</CardTitle>
        <CardDescription>Coördineer details met de andere deelnemers.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
        <div ref={messagesContainerRef} className="flex-1 overflow-y-auto pr-4 space-y-4">
            {messages?.map((msg) => {
                const isCurrentUser = msg.senderId === currentUser.uid;
                return (
                    <div key={msg.id} className={cn("flex items-end gap-2", isCurrentUser ? "justify-end" : "justify-start")}>
                        {!isCurrentUser && (
                             <Avatar className="h-8 w-8">
                                <AvatarImage src={msg.senderPhotoUrl} alt={msg.senderName} data-ai-hint={msg.senderPhotoHint} />
                                <AvatarFallback>
                                    {msg.senderPhotoUrl ? msg.senderName.charAt(0) : <UserIcon className="h-4 w-4" />}
                                </AvatarFallback>
                            </Avatar>
                        )}
                        <div className={cn("max-w-xs md:max-w-md p-3 rounded-lg", isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted")}>
                           <p className="text-sm">{msg.message}</p>
                           {msg.timestamp && (
                            <p className={cn("text-xs mt-1", isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground/70")}>
                                {format(msg.timestamp.toDate(), 'p')}
                           </p>
                           )}
                        </div>
                        {isCurrentUser && (
                             <Avatar className="h-8 w-8">
                                <AvatarImage src={currentUserProfile.profilePhotoUrl} alt={currentUserProfile.name} data-ai-hint={currentUserProfile.profilePhotoHint} />
                                <AvatarFallback>
                                     {currentUserProfile.profilePhotoUrl ? currentUserProfile.name.charAt(0) : <UserIcon className="h-4 w-4" />}
                                </AvatarFallback>
                            </Avatar>
                        )}
                    </div>
                );
            })}
        </div>
        <div className="flex items-center gap-2 pt-4 border-t">
          <Input 
            placeholder="Typ je bericht..." 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
          <Button size="icon" onClick={handleSendMessage}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
