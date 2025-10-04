'use server';
/**
 * @fileOverview This file defines a Genkit flow to suggest card combinations for PVE mode.
 *
 * - suggestCardCombosForPVE - A function that suggests card combinations effective against specific enemy types.
 * - SuggestCardCombosForPVEInput - The input type for the suggestCardCombosForPVE function.
 * - SuggestCardCombosForPVEOutput - The return type for the suggestCardCombosForPVE function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCardCombosForPVEInputSchema = z.object({
  enemyType: z.string().describe('The type of enemy the player is facing in PVE mode.'),
  playerDeck: z.string().describe('A description of the player\'s current card deck.'),
  availableTerms: z.string().describe('A list of available terms that the player can use to create cards.'),
});
export type SuggestCardCombosForPVEInput = z.infer<typeof SuggestCardCombosForPVEInputSchema>;

const SuggestCardCombosForPVEOutputSchema = z.object({
  suggestedCombos: z.array(z.string()).describe('A list of suggested card combinations that are effective against the specified enemy type.'),
  reasoning: z.string().describe('The reasoning behind the suggested card combinations.'),
});
export type SuggestCardCombosForPVEOutput = z.infer<typeof SuggestCardCombosForPVEOutputSchema>;

export async function suggestCardCombosForPVE(input: SuggestCardCombosForPVEInput): Promise<SuggestCardCombosForPVEOutput> {
  return suggestCardCombosForPVEFlow(input);
}

const suggestCardCombosForPVEPrompt = ai.definePrompt({
  name: 'suggestCardCombosForPVEPrompt',
  input: {schema: SuggestCardCombosForPVEInputSchema},
  output: {schema: SuggestCardCombosForPVEOutputSchema},
  prompt: `You are an expert card game strategist, providing advice to players in PVE mode.

You will suggest effective card combinations based on the enemy type, player's current deck, and available terms.

Enemy Type: {{{enemyType}}}
Player's Deck: {{{playerDeck}}}
Available Terms: {{{availableTerms}}}

Consider the strengths and weaknesses of the enemy type, and how different card combinations can exploit those weaknesses.
Explain the reasoning behind your suggestions.

Output the suggested card combinations and reasoning in a structured format.
`,
});

const suggestCardCombosForPVEFlow = ai.defineFlow(
  {
    name: 'suggestCardCombosForPVEFlow',
    inputSchema: SuggestCardCombosForPVEInputSchema,
    outputSchema: SuggestCardCombosForPVEOutputSchema,
  },
  async input => {
    const {output} = await suggestCardCombosForPVEPrompt(input);
    return output!;
  }
);
