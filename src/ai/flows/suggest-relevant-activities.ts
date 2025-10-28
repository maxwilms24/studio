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

const SuggestRelevantActivitiesInputSchema = z.object({
  location: z.string().describe('The user location.'),
  preferredSports: z.array(z.string()).describe('The user preferred sports.'),
});
export type SuggestRelevantActivitiesInput = z.infer<typeof SuggestRelevantActivitiesInputSchema>;

const SuggestRelevantActivitiesOutputSchema = z.array(z.string()).describe('Suggested sport requests based on user preferences.');
export type SuggestRelevantActivitiesOutput = z.infer<typeof SuggestRelevantActivitiesOutputSchema>;

export async function suggestRelevantActivities(input: SuggestRelevantActivitiesInput): Promise<SuggestRelevantActivitiesOutput> {
  return suggestRelevantActivitiesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRelevantActivitiesPrompt',
  input: {schema: SuggestRelevantActivitiesInputSchema},
  output: {schema: SuggestRelevantActivitiesOutputSchema},
  prompt: `You are a sports activity recommender. Based on the user's location and preferred sports, suggest relevant sport requests.

User Location: {{{location}}}
Preferred Sports: {{#each preferredSports}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Suggest sport requests:
`,
});

const suggestRelevantActivitiesFlow = ai.defineFlow(
  {
    name: 'suggestRelevantActivitiesFlow',
    inputSchema: SuggestRelevantActivitiesInputSchema,
    outputSchema: SuggestRelevantActivitiesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
