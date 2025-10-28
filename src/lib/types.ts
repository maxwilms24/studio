import type { ImagePlaceholder } from './placeholder-images';

export type User = {
  id: string;
  name: string;
  profilePhoto: ImagePlaceholder;
  favoriteSports: string[];
};

export type ActivityStatus = 'Open' | 'Closed' | 'Cancelled';

export type Activity = {
  id: string;
  organizer: User;
  sport: string;
  location: string;
  time: Date;
  totalPlayers: number; // Total slots for the activity
  playersSought: number; // How many players the organizer is looking for
  status: ActivityStatus;
  participants: ActivityResponse[];
  pendingResponses: ActivityResponse[];
};

export type ActivityResponse = {
  id: string;
  user: User;
  participantCount: number; // How many people this user is bringing (1 for just themself)
};

export type ChatMessage = {
  id:string;
  user: User;
  message: string;
  timestamp: Date;
};
