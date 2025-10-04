'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating enemy decks for PVE battles.
 *
 * It includes:
 * - `generateEnemyDeck`: The main function to generate an enemy deck based on difficulty.
 * - `GenerateEnemyDeckInput`: The input type for the `generateEnemyDeck` function.
 * - `GenerateEnemyDeckOutput`: The output type for the `generateEnemyDeck` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEnemyDeckInputSchema = z.object({
  difficulty: z
    .enum(['easy', 'medium', 'hard'])
    .describe('The difficulty level for the enemy deck.'),
});
export type GenerateEnemyDeckInput = z.infer<typeof GenerateEnemyDeckInputSchema>;

const CardSchema = z.object({
  name: z.string().describe('The name of the card.'),
  terms: z.array(z.string()).describe('Array of term IDs used to create the card'),
  finalCost: z.number().describe('The final mana cost of the card.'),
  type: z.enum(['spell', 'creature']).describe('The type of the card.'),
  description: z.string().describe('The description of the card'),
});

const GenerateEnemyDeckOutputSchema = z.object({
  deck: z.array(CardSchema).describe('An array of card objects representing the enemy deck.'),
});
export type GenerateEnemyDeckOutput = z.infer<typeof GenerateEnemyDeckOutputSchema>;

export async function generateEnemyDeck(input: GenerateEnemyDeckInput): Promise<GenerateEnemyDeckOutput> {
  return generateEnemyDeckFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateEnemyDeckPrompt',
  input: {schema: GenerateEnemyDeckInputSchema},
  output: {schema: GenerateEnemyDeckOutputSchema},
  prompt: `You are an expert card game designer. Generate a challenging enemy deck consisting of 20 cards for a PVE battle in a card game, LexicArcana. The game involves combining terms to create cards.

The enemy deck should be designed based on the specified difficulty level: {{{difficulty}}}.

Easy: A simple deck with basic cards and straightforward strategies.
Medium: A more complex deck with more varied cards and strategic combinations.
Hard: A very challenging deck with powerful cards, complex strategies, and unexpected tactics.

Each card in the deck should have a name, an array of term IDs that were used to create the card, its final mana cost, its type (spell or creature), and a description of its effects.

Each card name should be creative.

Make the description detailed, including the effects of the card. Give stats for creature cards.

Output the deck as a JSON array of card objects. Do not include any other explanation.

Example Card:
{
  "name": "Fearsome Howl",
  "terms": ["howl", "fear"],
  "finalCost": 3,
  "type": "spell",
  "description": "Deal 5 damage to the enemy player."
}
`,
});

const generateEnemyDeckFlow = ai.defineFlow(
  {
    name: 'generateEnemyDeckFlow',
    inputSchema: GenerateEnemyDeckInputSchema,
    outputSchema: GenerateEnemyDeckOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
