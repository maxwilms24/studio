'use client';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ProfilePageContent from './[id]/page';

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading) {
      if (user) {
        // Redirect to the dynamic route for the logged-in user
        router.replace(`/profile/${user.uid}`);
      } else {
        // If no user, redirect to login
        router.replace('/login');
      }
    }
  }, [user, isUserLoading, router]);

  // Render a loading state or nothing while redirecting
  return (
    <div className="flex justify-center items-center h-screen">
      <p>Laden...</p>
    </div>
  );
}
