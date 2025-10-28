'use client';

import * as React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { suggestRelevantActivities, SuggestRelevantActivitiesOutput } from '@/ai/flows/suggest-relevant-activities';
import type { UserProfile, Activity } from '@/lib/types';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { SportIcon } from './icons/sport-icons';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';

interface AiSuggestionsProps {
    currentUser: UserProfile;
}

export function AiSuggestions({ currentUser }: AiSuggestionsProps) {
    const firestore = useFirestore();
    const [suggestions, setSuggestions] = React.useState<SuggestRelevantActivitiesOutput>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const { toast } = useToast();

    const openActivitiesQuery = useMemoFirebase(() => 
        query(collection(firestore, 'activities'), where('status', '==', 'Open'))
    , [firestore]);
    const { data: openActivities } = useCollection<Activity>(openActivitiesQuery);

    const getSuggestions = async () => {
        if (!openActivities || openActivities.length === 0) {
            toast({
                variant: 'default',
                title: 'Geen openstaande activiteiten',
                description: 'Er zijn momenteel geen activiteiten om voor te stellen.',
            });
            return;
        }

        setIsLoading(true);
        setSuggestions([]);
        try {
            const result = await suggestRelevantActivities({
                preferredSports: currentUser.favoriteSports,
                activities: openActivities,
            });
            setSuggestions(result);
        } catch (error) {
            console.error("AI suggestie mislukt:", error);
            toast({
                variant: 'destructive',
                title: 'AI Suggestie Mislukt',
                description: 'Kon op dit moment geen sportsuggesties ophalen.',
            });
        } finally {
            setIsLoading(false);
        }
    }

    const hasFavorites = currentUser.favoriteSports && currentUser.favoriteSports.length > 0;

    return (
        <div>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-primary" />
                    <h2 className="text-2xl font-bold tracking-tight font-headline">Voor Jou</h2>
                </div>
                <Button onClick={getSuggestions} disabled={isLoading || !hasFavorites} title={!hasFavorites ? 'Selecteer eerst je favoriete sporten op je profielpagina' : 'Stel Activiteiten Voor'}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Stel Activiteiten Voor
                </Button>
            </div>
            <div className="mt-4">
                {isLoading && (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => (
                            <Card key={i} className="animate-pulse">
                                <CardHeader>
                                    <div className="h-6 w-3/4 bg-muted rounded-md" />
                                </CardHeader>
                                <CardContent>
                                    <div className="h-4 w-full bg-muted rounded-md" />
                                    <div className="h-4 w-1/2 bg-muted rounded-md mt-2" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
                {!isLoading && suggestions.length > 0 && openActivities && (
                     <Carousel opts={{ align: "start", loop: suggestions.length > 2 }} className="w-full">
                        <CarouselContent>
                            {suggestions.map((suggestion) => {
                                const activity = openActivities.find(a => a.id === suggestion.activityId);
                                if (!activity) return null;

                                return (
                                <CarouselItem key={suggestion.activityId} className="md:basis-1/2 lg:basis-1/3">
                                    <div className="p-1 h-full">
                                    <Card className="bg-accent/20 border-accent flex flex-col h-full group">
                                        <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                                            <SportIcon sport={activity.sport} className="w-8 h-8 text-accent-foreground" />
                                            <CardTitle className="text-lg font-headline">{activity.sport}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="flex-grow">
                                            <p className="text-sm text-accent-foreground/80">{suggestion.reason}</p>
                                        </CardContent>
                                        <CardContent>
                                            <Button asChild variant="link" className="p-0 h-auto text-accent-foreground">
                                                <Link href={`/activity/${activity.id}`}>
                                                    Bekijk activiteit <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                                </Link>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                    </div>
                                </CarouselItem>
                                );
                            })}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                )}
                 {!isLoading && suggestions.length === 0 && (
                    <div className="flex flex-col items-center justify-center text-center bg-card p-10 rounded-lg border-2 border-dashed">
                        {!hasFavorites ? (
                            <>
                                <p className="text-lg font-semibold text-muted-foreground">Voeg je favoriete sporten toe!</p>
                                <p className="text-sm text-muted-foreground mt-1">Ga naar je profiel om je favoriete sporten te selecteren voor persoonlijke aanbevelingen.</p>
                                <Button asChild variant="secondary" className="mt-4">
                                    <Link href="/profile">Naar Profiel</Link>
                                </Button>
                            </>
                        ) : (
                            <>
                                <p className="text-lg font-semibold text-muted-foreground">Klik voor suggesties</p>
                                <p className="text-sm text-muted-foreground mt-1">Onze AI staat klaar om je te helpen de perfecte sportactiviteit te vinden!</p>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
