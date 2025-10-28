import { PlaceHolderImages } from './placeholder-images';
import type { User, Activity, ChatMessage } from './types';

export const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'Alex Johnson',
    profilePhoto: PlaceHolderImages.find(img => img.id === 'user-1')!,
    favoriteSports: ['Basketball', 'Tennis'],
  },
  {
    id: 'u2',
    name: 'Maria Garcia',
    profilePhoto: PlaceHolderImages.find(img => img.id === 'user-2')!,
    favoriteSports: ['Soccer', 'Running'],
  },
  {
    id: 'u3',
    name: 'Chen Wei',
    profilePhoto: PlaceHolderImages.find(img => img.id === 'user-3')!,
    favoriteSports: ['Volleyball', 'Basketball'],
  },
    {
    id: 'u4',
    name: 'Ben Carter',
    profilePhoto: PlaceHolderImages.find(img => img.id === 'user-4')!,
    favoriteSports: ['Running', 'Tennis'],
  },
  {
    id: 'u5',
    name: 'Samantha Bee',
    profilePhoto: PlaceHolderImages.find(img => img.id === 'user-5')!,
    favoriteSports: ['Soccer', 'Volleyball'],
  },
  {
    id: 'u6',
    name: 'Omar Rashid',
    profilePhoto: PlaceHolderImages.find(img => img.id === 'user-6')!,
    favoriteSports: ['Basketball', 'Fencing'],
  },
];

export const mockActivities: Activity[] = [
  {
    id: 'act1',
    organizer: mockUsers[0],
    sport: 'Basketball',
    location: 'Central Park Courts',
    time: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    totalPlayers: 10,
    playersSought: 4,
    status: 'Open',
    participants: [
        { id: 'resp1-accepted', user: mockUsers[0], participantCount: 1 },
        { id: 'resp2-accepted', user: mockUsers[2], participantCount: 2 },
        { id: 'resp3-accepted', user: mockUsers[4], participantCount: 3 },
    ],
    pendingResponses: [
      { id: 'resp4-pending', user: mockUsers[1], participantCount: 1 },
    ],
  },
  {
    id: 'act2',
    organizer: mockUsers[1],
    sport: 'Soccer',
    location: 'Riverside Field',
    time: new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
    totalPlayers: 12,
    playersSought: 5,
    status: 'Open',
    participants: [{ id: 'resp5-accepted', user: mockUsers[1], participantCount: 2 }],
    pendingResponses: [],
  },
  {
    id: 'act3',
    organizer: mockUsers[2],
    sport: 'Volleyball',
    location: 'City Beach',
    time: new Date(new Date().getTime() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
    totalPlayers: 6,
    playersSought: 3,
    status: 'Closed',
    participants: [
        { id: 'resp6-accepted', user: mockUsers[2], participantCount: 1 },
        { id: 'resp7-accepted', user: mockUsers[4], participantCount: 2 },
        { id: 'resp8-accepted', user: mockUsers[1], participantCount: 1 },
        { id: 'resp9-accepted', user: mockUsers[3], participantCount: 2 },
    ],
    pendingResponses: [],
  },
  {
    id: 'act4',
    organizer: mockUsers[3],
    sport: 'Tennis',
    location: 'Community Tennis Center',
    time: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    totalPlayers: 4,
    playersSought: 2,
    status: 'Open',
    participants: [{ id: 'resp10-accepted', user: mockUsers[3], participantCount: 2 }],
    pendingResponses: [
      { id: 'resp11-pending', user: mockUsers[0], participantCount: 1 },
    ],
  },
  {
    id: 'act5',
    organizer: mockUsers[4],
    sport: 'Running',
    location: 'Lakefront Trail',
    time: new Date(new Date().getTime() + 0.5 * 24 * 60 * 60 * 1000), // 12 hours from now
    totalPlayers: 8,
    playersSought: 7,
    status: 'Open',
    participants: [{ id: 'resp12-accepted', user: mockUsers[4], participantCount: 1 }],
    pendingResponses: [],
  },
];

export const mockChatMessages: (activityId: string) => ChatMessage[] = (activityId) => {
    const activity = mockActivities.find(a => a.id === activityId);
    if (!activity || activity.status !== 'Closed') return [];

    return [
        { id: 'msg1', user: activity.organizer, message: "Hey everyone, excited for the game!", timestamp: new Date(activity.time.getTime() - 60 * 60 * 1000)},
        { id: 'msg2', user: activity.participants[1].user, message: "Me too! See you all there.", timestamp: new Date(activity.time.getTime() - 58 * 60 * 1000)},
        { id: 'msg3', user: activity.participants[2].user, message: "I'm bringing the ball. Any other equipment needed?", timestamp: new Date(activity.time.getTime() - 55 * 60 * 1000)},
        { id: 'msg4', user: activity.organizer, message: "Nope, that should be it. Just bring water!", timestamp: new Date(activity.time.getTime() - 50 * 60 * 1000)},
    ]
};
