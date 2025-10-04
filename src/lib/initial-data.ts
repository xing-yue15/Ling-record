import type { Term } from './definitions';

export const initialTerms: Term[] = [
  // --- Base Terms ---
  {
    id: 'fire',
    name: '火',
    type: '基础',
    cost: 1,
    description: {
      spell: '造成 2 点伤害。',
      creature: '召唤一个 2/1 的生物。',
    },
    artId: 'card-art-1',
  },
  {
    id: 'stone',
    name: '石',
    type: '基础',
    cost: 1,
    description: {
      spell: '获得 2 点护甲。',
      creature: '召唤一个 1/2 的生物。',
    },
    artId: 'card-art-2',
  },
  {
    id: 'howl',
    name: '嚎叫',
    type: '基础',
    cost: 2,
    description: {
      spell: '目标生物本回合攻击力-2。',
      creature: '召唤一个 2/2 的生物。召唤时，使所有敌方生物攻击力-1。',
    },
    artId: 'card-art-3',
  },
  {
    id: 'growth',
    name: '生长',
    type: '基础',
    cost: 2,
    description: {
      spell: '给予一个友方生物+2/+2。',
      creature: '召唤一个 1/1 的生物。在你的回合结束时，它获得+1/+1。',
    },
    artId: 'card-art-4',
  },

  // --- Special Terms ---
  {
    id: 'swiftness',
    name: '迅捷 (特殊)',
    type: '特殊',
    cost: 2,
    description: {
      spell: '抽一张牌。',
      creature: '此生物可在召唤的回合进行攻击。',
    },
    artId: 'card-art-1',
  },
  {
    id: 'fear',
    name: '恐惧 (特殊)',
    type: '特殊',
    cost: 3,
    description: {
      spell: '敌方生物下回合无法攻击。',
      creature: '其他生物必须攻击此生物。',
    },
    artId: 'card-art-3',
  },

  // --- Conditional Terms ---
  {
    id: 'high-health',
    name: '如果生命值 > 50% (限定)',
    type: '限定',
    cost: '*0.5',
    description: {
      spell: '如果你的生命值高于50%，此牌法力消耗减半（向上取整）。',
      creature: '如果你的生命值高于50%，此生物法力消耗减半（向上取整）。',
    },
    artId: 'card-art-4',
  },
  {
    id: 'empty-hand',
    name: '如果手牌为空 (限定)',
    type: '限定',
    cost: '*0.5',
    description: {
      spell: '如果你的手牌为空，此牌法力消耗减半（向上取整）。',
      creature: '如果你的手牌为空，此生物法力消耗减半（向上取整）。',
    },
    artId: 'card-art-2',
  },
];
