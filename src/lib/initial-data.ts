import type { Term } from './definitions';

export const initialTerms: Term[] = [
  // --- Base Terms ---
  {
    id: 'fire',
    name: 'Fire',
    type: '基础',
    cost: 1,
    description: {
      spell: 'Deal 2 damage.',
      creature: 'Summons a 2/1 creature.',
    },
    artId: 'card-art-1',
  },
  {
    id: 'stone',
    name: 'Stone',
    type: '基础',
    cost: 1,
    description: {
      spell: 'Gain 2 armor.',
      creature: 'Summons a 1/2 creature.',
    },
    artId: 'card-art-2',
  },
  {
    id: 'howl',
    name: 'Howl',
    type: '基础',
    cost: 2,
    description: {
      spell: 'Target creature gets -2 attack this turn.',
      creature: 'Summons a 2/2 creature. On summon, gives all enemy creatures -1 attack.',
    },
    artId: 'card-art-3',
  },
  {
    id: 'growth',
    name: 'Growth',
    type: '基础',
    cost: 2,
    description: {
      spell: 'Give a friendly creature +2/+2.',
      creature: 'Summons a 1/1. At the end of your turn, it gets +1/+1.',
    },
    artId: 'card-art-4',
  },

  // --- Special Terms ---
  {
    id: 'swiftness',
    name: 'Swiftness (特殊)',
    type: '特殊',
    cost: 2,
    description: {
      spell: 'Draw a card.',
      creature: 'This creature can attack on the turn it is summoned.',
    },
    artId: 'card-art-1',
  },
  {
    id: 'fear',
    name: 'Fear (特殊)',
    type: '特殊',
    cost: 3,
    description: {
      spell: 'Enemy creatures cannot attack next turn.',
      creature: 'Other creatures must attack this creature.',
    },
    artId: 'card-art-3',
  },

  // --- Conditional Terms ---
  {
    id: 'high-health',
    name: 'If Health > 50% (??)',
    type: '限定',
    cost: '*0.5',
    description: {
      spell: 'If your health is above 50%, this card costs half (rounded up).',
      creature: 'If your health is above 50%, this creature costs half (rounded up).',
    },
    artId: 'card-art-4',
  },
  {
    id: 'empty-hand',
    name: 'If Hand is Empty (??)',
    type: '限定',
    cost: '*0.5',
    description: {
      spell: 'If your hand is empty, this card costs half (rounded up).',
      creature: 'If your hand is empty, this creature costs half (rounded up).',
    },
    artId: 'card-art-2',
  },
];
