import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-battle-and-suggest-improvements.ts';
import '@/ai/flows/generate-card-name.ts';
import '@/ai/flows/generate-enemy-deck.ts';
import '@/ai/flows/suggest-card-combos-for-pve.ts';