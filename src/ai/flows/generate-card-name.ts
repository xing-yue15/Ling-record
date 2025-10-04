'use server';

/**
 * @fileOverview This file defines a Genkit flow to generate a creative name for a card based on its terms.
 *
 * - generateCardName - A function that generates a card name based on the provided terms.
 * - GenerateCardNameInput - The input type for the generateCardName function.
 * - GenerateCardNameOutput - The output type for the generateCardName function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCardNameInputSchema = z.object({
  terms: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        type: z.enum(['基础', '特殊', '限定']),
        cost: z.number().or(z.string()),
        description: z.object({
          spell: z.string().optional(),
          creature: z.string().optional(),
        }),
      })
    )
    .describe('An array of terms used to create the card.'),
});
export type GenerateCardNameInput = z.infer<typeof GenerateCardNameInputSchema>;

const GenerateCardNameOutputSchema = z.object({
  cardName: z.string().describe('The generated name for the card.'),
});
export type GenerateCardNameOutput = z.infer<typeof GenerateCardNameOutputSchema>;

export async function generateCardName(input: GenerateCardNameInput): Promise<GenerateCardNameOutput> {
  return generateCardNameFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCardNamePrompt',
  input: {schema: GenerateCardNameInputSchema},
  output: {schema: GenerateCardNameOutputSchema},
  prompt: `You are a creative card game name generator. Generate a name for a card based on the terms used to create it.

Terms:
{{#each terms}}
- {{this.name}} ({{this.type}}) - Cost: {{this.cost}}
{{/each}}

Card Name:`, // Just generate the card name, without any additional text.
});

const generateCardNameFlow = ai.defineFlow(
  {
    name: 'generateCardNameFlow',
    inputSchema: GenerateCardNameInputSchema,
    outputSchema: GenerateCardNameOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
