import { Flame } from 'lucide-react';
import React from 'react';

export function Logo() {
  return (
    <div className="flex items-center gap-2 group">
      <div className="p-2 bg-primary rounded-lg text-primary-foreground group-hover:scale-110 transition-transform">
        <Flame className="size-5" />
      </div>
      <span className="text-xl font-bold font-headline text-foreground">
        SportConnect
      </span>
    </div>
  );
}
