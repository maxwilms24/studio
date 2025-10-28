'use client';

import { AppLayout } from '@/components/app-layout';
import { SportIcon } from '@/components/icons/sport-icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useDoc, useFirestore, useMemoFirebase, useUser, updateDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import { useToast } from '@/hooks/use-toast';
import { Camera } from 'lucide-react';

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      const storage = getStorage();
      const storageRef = ref(storage, `profile-photos/${user.uid}`);
      
      try {
        await uploadString(storageRef, dataUrl, 'data_url');
        const downloadUrl = await getDownloadURL(storageRef);
        
        updateDocumentNonBlocking(userProfileRef!, { profilePhotoUrl: downloadUrl });

        toast({
          title: 'Succes!',
          description: 'Je profielfoto is bijgewerkt.',
        });

      } catch (error) {
        console.error("Error uploading profile photo: ", error);
        toast({
          variant: 'destructive',
          title: 'Fout',
          description: 'Er is een fout opgetreden bij het uploaden van je foto.',
        });
      }
    };
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

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
            <p>Gebruikersprofiel niet gevonden.</p>
        </AppLayout>
    )
  }


  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="relative group">
            <Avatar className="h-24 w-24 border-4 border-primary cursor-pointer" onClick={handleAvatarClick}>
              <AvatarImage src={userProfile.profilePhotoUrl} alt={userProfile.name} data-ai-hint={userProfile.profilePhotoHint} />
              <AvatarFallback className="text-3xl">{userProfile.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div 
              className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              onClick={handleAvatarClick}
            >
              <Camera className="h-8 w-8 text-white" />
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange}
              className="hidden" 
              accept="image/png, image/jpeg"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">{userProfile.name}</h1>
            <p className="text-muted-foreground mt-1">Lid sinds {new Date().getFullYear()}</p>
          </div>
        </div>
        <Separator />
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Favoriete Sporten</CardTitle>
                <CardDescription>De sporten die je het liefst beoefent.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-4">
                    {userProfile.favoriteSports.map(sport => (
                        <Badge key={sport} variant="secondary" className="text-lg py-2 px-4 border border-border flex items-center gap-2">
                            <SportIcon sport={sport} className="h-5 w-5" />
                            <span>{sport}</span>
                        </Badge>
                    ))}
                     {userProfile.favoriteSports.length === 0 && <p className="text-muted-foreground">Nog geen favoriete sporten geselecteerd.</p>}
                </div>
            </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
