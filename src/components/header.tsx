'use client';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { LogOut, User as UserIcon } from 'lucide-react';
import { Logo } from './icons/logo';
import { useAuth, useDoc, useMemoFirebase, useUser } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import type { UserProfile } from '@/lib/types';
import { Skeleton } from './ui/skeleton';

export function Header() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);

  const handleLogout = () => {
    auth.signOut();
  };

  const isLoading = isUserLoading || (user && isProfileLoading);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-2">
        <div className="hidden md:block">
            <SidebarTrigger />
        </div>
        <div className="md:hidden">
            <Link href="/">
                <Logo />
            </Link>
        </div>
      </div>
      <div className="flex w-full items-center justify-end gap-4">
        {isLoading && (
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        )}
        {!isLoading && user && userProfile && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10 border-2 border-primary">
                  <AvatarImage src={userProfile.profilePhotoUrl} alt={userProfile.name} data-ai-hint={userProfile.profilePhotoHint} />
                  <AvatarFallback>
                    {userProfile.profilePhotoUrl ? userProfile.name.charAt(0) : <UserIcon className="h-5 w-5" />}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userProfile.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/profile/${user.uid}`}>
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Profiel</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Uitloggen</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
         {!isLoading && !user && (
            <Button asChild>
                <Link href="/login">Inloggen</Link>
            </Button>
         )}
      </div>
    </header>
  );
}
