'use server';

/**
 * @fileOverview A flow that suggests sport requests to users based on their location and sport preferences.
 *
 * - suggestRelevantActivities - A function that suggests sport requests based on user preferences.
 * - SuggestRelevantActivitiesInput - The input type for the suggestRelevantActivities function.
 * - SuggestRelevantActivitiesOutput - The return type for the suggestRelevantActivities function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ActivitySchema = z.object({
  id: z.string(),
  sport: z.string(),
  location: z.string(),
  playersNeeded: z.number(),
});

const SuggestRelevantActivitiesInputSchema = z.object({
  preferredSports: z.array(z.string()).describe('The user preferred sports.'),
  activities: z.array(ActivitySchema).describe('A list of available activities.'),
});
export type SuggestRelevantActivitiesInput = z.infer<typeof SuggestRelevantActivitiesInputSchema>;

const SuggestRelevantActivitiesOutputSchema = z.array(
    z.object({
        activityId: z.string().describe("The ID of the suggested activity."),
        reason: z.string().describe("A short, compelling reason why the user should join this activity."),
    })
).describe('Suggested sport requests based on user preferences.');
export type SuggestRelevantActivitiesOutput = z.infer<typeof SuggestRelevantActivitiesOutputSchema>;

export async function suggestRelevantActivities(input: SuggestRelevantActivitiesInput): Promise<SuggestRelevantActivitiesOutput> {
  // Can't generate suggestions if there are no preferred sports or activities
  if(input.preferredSports.length === 0 || input.activities.length === 0) return [];
  
  return suggestRelevantActivitiesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRelevantActivitiesPrompt',
  input: {schema: SuggestRelevantActivitiesInputSchema},
  output: {schema: SuggestRelevantActivitiesOutputSchema},
  prompt: `You are a friendly and encouraging sports activity recommender. Your goal is to help users discover activities they'll love.

Based on the user's preferred sports and the list of available activities, you should suggest a few relevant options.

Here are the user's preferred sports:
{{#each preferredSports}}
- {{{this}}}
{{/each}}

Here is a list of currently available activities:
\`\`\`json
{{{jsonStringify activities}}}
\`\`\`

Analyze the list of available activities and select up to 3 that are the best match for the user's preferred sports.
For each suggestion, provide the 'activityId' and a short, exciting 'reason' (max 1-2 sentences) to convince the user to join. For example, if they like basketball, you could say: "Laat je basketbaltalent zien! Er is nog plek voor een paar spelers in het park."

Only suggest activities that match one of the user's preferred sports. Do not suggest activities if there are no matches.
Return an empty array if no relevant activities are found.`,
});

const suggestRelevantActivitiesFlow = ai.defineFlow(
  {
    name: 'suggestRelevantActivitiesFlow',
    inputSchema: SuggestRelevantActivitiesInputSchema,
    outputSchema: SuggestRelevantActivitiesOutputSchema,
  },
  async input => {
    const {output} = await prompt({
        ...input,
        activities: input.activities.map(a => ({ id: a.id, sport: a.sport, location: a.location, playersNeeded: a.playersNeeded })),
    });
    return output || [];
  }
);
