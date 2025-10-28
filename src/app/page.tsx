'use client';

import * as React from 'react';
import { AppLayout } from '@/components/app-layout';
import { ActivityFilters } from '@/components/activity-filters';
import { ActivityCard } from '@/components/activity-card';
import { AiSuggestions } from '@/components/ai-suggestions';
import { mockActivities, mockUsers } from '@/lib/data';
import type { Activity } from '@/lib/types';
import { Separator } from '@/components/ui/separator';

export default function HomePage() {
  const [activities, setActivities] = React.useState<Activity[]>(mockActivities);
  const [filters, setFilters] = React.useState({ sport: '', location: '' });

  const filteredActivities = activities.filter((activity) => {
    return (
      (filters.sport === '' || activity.sport.toLowerCase() === filters.sport.toLowerCase()) &&
      (filters.location === '' || activity.location.toLowerCase().includes(filters.location.toLowerCase()))
    );
  });
  
  const currentUser = mockUsers[0]; // Mock current user

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Discover Activities</h1>
          <p className="text-muted-foreground mt-1">Find your next game and connect with other players.</p>
        </div>
        
        <ActivityFilters onFilterChange={setFilters} />

        <Separator />

        <AiSuggestions currentUser={currentUser} />

        <div>
          <h2 className="text-2xl font-bold tracking-tight font-headline">Available Now</h2>
          {filteredActivities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {filteredActivities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center bg-card p-10 rounded-lg mt-4 border-2 border-dashed">
                <p className="text-lg font-semibold text-muted-foreground">No activities found</p>
                <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters or check back later!</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
