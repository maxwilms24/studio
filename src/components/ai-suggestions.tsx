'use client';

import * as React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Sparkles, Loader2 } from 'lucide-react';
import { suggestRelevantActivities } from '@/ai/flows/suggest-relevant-activities';
import type { User } from '@/lib/types';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { SportIcon } from './icons/sport-icons';
import { useToast } from '@/hooks/use-toast';

interface AiSuggestionsProps {
    currentUser: User;
}

export function AiSuggestions({ currentUser }: AiSuggestionsProps) {
    const [suggestions, setSuggestions] = React.useState<string[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const { toast } = useToast();

    const getSuggestions = async () => {
        setIsLoading(true);
        setSuggestions([]);
        try {
            const result = await suggestRelevantActivities({
                location: "New York City", // Mock location
                preferredSports: currentUser.favoriteSports,
            });
            setSuggestions(result);
        } catch (error) {
            console.error("AI suggestion failed:", error);
            toast({
                variant: 'destructive',
                title: 'AI Suggestion Failed',
                description: 'Could not fetch sport suggestions at this time.',
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-accent" />
                    <h2 className="text-2xl font-bold tracking-tight font-headline">For You</h2>
                </div>
                <Button onClick={getSuggestions} disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Suggest Activities
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
                {!isLoading && suggestions.length > 0 && (
                     <Carousel opts={{ align: "start", loop: true }} className="w-full">
                        <CarouselContent>
                            {suggestions.map((suggestion, index) => {
                                const sport = suggestion.split(" ")[0] || "Activity";
                                return (
                                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                                    <div className="p-1">
                                    <Card className="bg-accent/20 border-accent">
                                        <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                                            <SportIcon sport={sport} className="w-8 h-8 text-accent-foreground" />
                                            <CardTitle className="text-lg font-headline">{sport}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-accent-foreground/80">{suggestion}</p>
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
                        <p className="text-lg font-semibold text-muted-foreground">No suggestions right now</p>
                        <p className="text-sm text-muted-foreground mt-1">Click the button to get personalized suggestions from our AI!</p>
                    </div>
                )}
            </div>
        </div>
    )
}
