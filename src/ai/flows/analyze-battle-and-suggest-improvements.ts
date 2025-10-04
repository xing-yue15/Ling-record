'use server';
/**
 * @fileOverview Analyzes a recent battle and suggests improvements to card creation and strategy.
 *
 * - analyzeBattleAndSuggestImprovements - A function that analyzes a battle and provides improvement suggestions.
 * - AnalyzeBattleAndSuggestImprovementsInput - The input type for the analyzeBattleAndSuggestImprovements function.
 * - AnalyzeBattleAndSuggestImprovementsOutput - The return type for the analyzeBattleAndSuggestImprovements function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeBattleAndSuggestImprovementsInputSchema = z.object({
  battleLog: z
    .string()
    .describe('A detailed log of the recent battle, including card plays, damage dealt, and game state at each turn.'),
  playerDeck: z.string().describe('The player s current deck composition, including the terms used in each card.'),
  opponentDeck: z
    .string()
    .optional()
    .describe('The opponent s deck composition, if known.  Useful for targeted suggestions.'),
  manaCap: z.number().describe('The mana cap used for card creation.'),
});
export type AnalyzeBattleAndSuggestImprovementsInput = z.infer<
  typeof AnalyzeBattleAndSuggestImprovementsInputSchema
>;

const AnalyzeBattleAndSuggestImprovementsOutputSchema = z.object({
  battleAnalysis: z.string().describe('An analysis of the battle, highlighting key moments and decisions.'),
  cardCreationSuggestions: z
    .string()
    .describe('Suggestions for improving card creation, including term combinations and cost optimization.'),
  strategySuggestions: z
    .string()
    .describe('Suggestions for improving battle strategy, including card play order and resource management.'),
});
export type AnalyzeBattleAndSuggestImprovementsOutput = z.infer<
  typeof AnalyzeBattleAndSuggestImprovementsOutputSchema
>;

export async function analyzeBattleAndSuggestImprovements(
  input: AnalyzeBattleAndSuggestImprovementsInput
): Promise<AnalyzeBattleAndSuggestImprovementsOutput> {
  return analyzeBattleAndSuggestImprovementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeBattleAndSuggestImprovementsPrompt',
  input: {schema: AnalyzeBattleAndSuggestImprovementsInputSchema},
  output: {schema: AnalyzeBattleAndSuggestImprovementsOutputSchema},
  prompt: `You are an expert card game analyst, providing detailed feedback to players to improve their gameplay.

Analyze the following battle log and player deck composition, and provide actionable suggestions for improvement.

Battle Log:
{{battleLog}}

Player Deck:
{{playerDeck}}

Opponent Deck (if available):
{{opponentDeck}}

Mana Cap:
{{manaCap}}

Provide specific suggestions for:

*   Battle Analysis: Identify key moments, good and bad decisions, and overall effectiveness.
*   Card Creation Suggestions: Suggest optimal term combinations, cost-effective cards, and potential synergies.
*   Strategy Suggestions: Recommend better card play order, resource management, and adaptation to different opponents.
`, // Changed from prompt to prompt
});

const analyzeBattleAndSuggestImprovementsFlow = ai.defineFlow(
  {
    name: 'analyzeBattleAndSuggestImprovementsFlow',
    inputSchema: AnalyzeBattleAndSuggestImprovementsInputSchema,
    outputSchema: AnalyzeBattleAndSuggestImprovementsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
