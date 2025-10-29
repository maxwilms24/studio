'use client';

import { AppLayout } from '@/components/app-layout';
import { SportIcon } from '@/components/icons/sport-icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useDoc, useFirestore, useMemoFirebase, useUser, updateDocumentNonBlocking } from '@/firebase';
import { DocumentReference, doc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import { useToast } from '@/hooks/use-toast';
import { Camera, MapPin, Pencil, User as UserIcon } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const allSports = ['Basketbal', 'Voetbal', 'Volleybal', 'Tennis', 'Hardlopen', 'Schermen', 'Padel', 'Hockey', 'Wielrennen'];

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isNameEditing, setIsNameEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  
  const [isLocationEditing, setIsLocationEditing] = useState(false);
  const [displayLocation, setDisplayLocation] = useState('');


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

  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.name);
      setDisplayLocation(userProfile.location || '');
    }
  }, [userProfile]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user || !userProfileRef) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      const storage = getStorage();
      const storageRef = ref(storage, `profile-photos/${user.uid}`);
      
      try {
        await uploadString(storageRef, dataUrl, 'data_url');
        const downloadUrl = await getDownloadURL(storageRef);
        
        updateDocumentNonBlocking(userProfileRef, { profilePhotoUrl: downloadUrl });

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

  const handleNameSave = () => {
    if (displayName.trim() && userProfileRef) {
        updateDocumentNonBlocking(userProfileRef, { name: displayName });
        toast({
            title: 'Succes!',
            description: 'Je naam is bijgewerkt.',
        });
        setIsNameEditing(false);
    }
  }

  const handleLocationSave = () => {
    if (displayLocation.trim() && userProfileRef) {
        updateDocumentNonBlocking(userProfileRef, { location: displayLocation });
        toast({
            title: 'Succes!',
            description: 'Je locatie is bijgewerkt.',
        });
        setIsLocationEditing(false);
    }
  }

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

  if (!userProfile || !userProfileRef) {
    return (
        <AppLayout>
            <p>Gebruikersprofiel niet gevonden.</p>
        </AppLayout>
    )
  }


  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative group">
            <Avatar className="h-24 w-24 border-4 border-primary cursor-pointer" onClick={handleAvatarClick}>
              <AvatarImage src={userProfile.profilePhotoUrl} alt={userProfile.name} data-ai-hint={userProfile.profilePhotoHint} />
              <AvatarFallback className="text-3xl">
                {userProfile.profilePhotoUrl ? userProfile.name.charAt(0) : <UserIcon className="h-10 w-10" />}
              </AvatarFallback>
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
          <div className="flex-1 space-y-2">
            {isNameEditing ? (
                 <div className="flex items-center gap-2">
                    <Input 
                        value={displayName} 
                        onChange={(e) => setDisplayName(e.target.value)} 
                        className="text-3xl font-bold tracking-tight font-headline h-auto p-0 border-0"
                    />
                    <Button size="sm" onClick={handleNameSave}>Opslaan</Button>
                    <Button size="sm" variant="ghost" onClick={() => { setIsNameEditing(false); setDisplayName(userProfile.name); }}>Annuleren</Button>
                 </div>
            ) : (
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold tracking-tight font-headline">{userProfile.name}</h1>
                    <Button variant="ghost" size="icon" onClick={() => setIsNameEditing(true)}>
                        <Pencil className="h-5 w-5" />
                    </Button>
                </div>
            )}
            
            {isLocationEditing ? (
                 <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <Input 
                        value={displayLocation} 
                        onChange={(e) => setDisplayLocation(e.target.value)}
                        placeholder='Voeg je locatie toe'
                        className="h-auto p-0 border-0 text-muted-foreground"
                    />
                    <Button size="sm" onClick={handleLocationSave}>Opslaan</Button>
                    <Button size="sm" variant="ghost" onClick={() => { setIsLocationEditing(false); setDisplayLocation(userProfile.location || ''); }}>Annuleren</Button>
                 </div>
            ) : (
                <div className="flex items-center gap-3">
                    <div className='flex items-center gap-1.5 text-muted-foreground'>
                        <MapPin className="h-5 w-5" />
                        <span>{userProfile.location || 'Geen locatie ingesteld'}</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setIsLocationEditing(true)}>
                        <Pencil className="h-5 w-5" />
                    </Button>
                </div>
            )}
            <p className="text-muted-foreground text-sm">Lid sinds {new Date().getFullYear()}</p>
          </div>
        </div>
        
        <Separator />
        
        <FavoriteSportsManager userProfile={userProfile} userProfileRef={userProfileRef} />
        
      </div>
    </AppLayout>
  );
}


function FavoriteSportsManager({ userProfile, userProfileRef }: { userProfile: UserProfile, userProfileRef: DocumentReference }) {
    const [selectedSports, setSelectedSports] = useState<string[]>(userProfile.favoriteSports || []);
    const [isEditing, setIsEditing] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        // Ensure local state is updated if the profile prop changes from outside
        setSelectedSports(userProfile.favoriteSports || []);
    }, [userProfile.favoriteSports]);

    const handleSportSelection = (sport: string) => {
        setSelectedSports(prev => 
            prev.includes(sport) ? prev.filter(s => s !== sport) : [...prev, sport]
        );
    };

    const handleSaveChanges = () => {
        updateDocumentNonBlocking(userProfileRef, { favoriteSports: selectedSports });
        toast({
            title: 'Opgeslagen!',
            description: 'Je favoriete sporten zijn bijgewerkt.'
        });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setSelectedSports(userProfile.favoriteSports || []);
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="font-headline">Favoriete Sporten</CardTitle>
                    <CardDescription>Selecteer de sporten die je het liefst beoefent.</CardDescription>
                </div>
                {!isEditing && (
                    <Button variant="outline" onClick={() => setIsEditing(true)}>Wijzig</Button>
                )}
            </CardHeader>
            <CardContent>
                {isEditing ? (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {allSports.map(sport => (
                                <div key={sport} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={sport}
                                        checked={selectedSports.includes(sport)}
                                        onCheckedChange={() => handleSportSelection(sport)}
                                    />
                                    <Label htmlFor={sport} className="flex items-center gap-2 cursor-pointer">
                                        <SportIcon sport={sport} className="h-5 w-5" />
                                        <span>{sport}</span>
                                    </Label>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                            <Button variant="ghost" onClick={handleCancel}>Annuleren</Button>
                            <Button onClick={handleSaveChanges}>Opslaan</Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-4">
                        {userProfile.favoriteSports && userProfile.favoriteSports.length > 0 ? (
                            userProfile.favoriteSports.map(sport => (
                                <Badge key={sport} variant="secondary" className="text-lg py-2 px-4 border border-border flex items-center gap-2">
                                    <SportIcon sport={sport} className="h-5 w-5" />
                                    <span>{sport}</span>
                                </Badge>
                            ))
                        ) : (
                            <p className="text-muted-foreground">Nog geen favoriete sporten geselecteerd. Klik op 'Wijzig' om ze toe te voegen.</p>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
