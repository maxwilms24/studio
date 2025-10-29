import type { ImagePlaceholder } from './placeholder-images';
import { Timestamp } from 'firebase/firestore';

export type User = {
  id: string;
  name: string;
  profilePhoto: ImagePlaceholder;
  favoriteSports: string[];
};

export type UserProfile = {
    id: string;
    name: string;
    profilePhotoUrl: string;
    profilePhotoHint: string;
    favoriteSports: string[];
    location?: string;
}

export type ActivityStatus = 'Open' | 'Full' | 'Closed' | 'Cancelled';

export type Activity = {
  id: string;
  organizerId: string;
  organizerName: string;
  organizerPhotoUrl: string;
  organizerPhotoHint: string;
  sport: string;
  location: string;
  time: Timestamp;
  totalPlayers: number;
  playersNeeded: number; 
  status: ActivityStatus;
  participantIds: string[];
};

export type ActivityResponse = {
  id: string;
  activityId: string;
  respondentId: string;
  respondentName: string;
  respondentPhotoUrl: string;
  respondentPhotoHint: string;
  numberOfParticipants: number;
  status: 'pending' | 'accepted' | 'rejected';
};

export type Participant = {
    id: string;
    name: string;
    profilePhotoUrl: string;
    profilePhotoHint: string;
    participantCount: number;
    isOrganizer: boolean;
}

export type ChatMessage = {
  id:string;
  senderId: string;
  senderName: string;
  senderPhotoUrl: string;
  senderPhotoHint: string;
  message: string;
  timestamp: Timestamp;
};
