import type { Term } from './definitions';

export const initialTerms: Term[] = [
  // --- 基础词条 (Base Terms) ---
  {
    id: 'damage',
    name: '伤害',
    type: '基础',
    cost: 2, // 示例消耗
    description: {
      spell: '造成 4 点伤害。', // 示例效果 (2X)
      creature: '此生物获得 2 点攻击力。', // 示例效果 (X)
    },
    artId: 'card-art-1',
  },
  {
    id: 'heal',
    name: '治疗',
    type: '基础',
    cost: 2, // 示例消耗 (2X, X=1)
    description: {
      spell: '为一个目标恢复 3 点生命值。', // 示例效果 (3X)
      creature: '此生物获得 2 点生命值。', // 示例效果 (2X)
    },
    artId: 'card-art-4',
  },
  {
    id: 'armor',
    name: '护甲',
    type: '基础',
    cost: 3, // 示例消耗 (3X, X=1)
    description: {
      spell: '给予一个目标 2 点护甲。', // 示例效果 (2X)
      creature: '受到的伤害抵消 1 点。', // 示例效果 (X)
    },
    artId: 'card-art-2',
  },
  
  // --- 特殊词条 (Special Terms) ---
  {
    id: 'multistrike',
    name: '连击',
    type: '特殊',
    cost: 2, // 示例消耗 X=1, (1+1)
    description: {
      spell: '选择目标数量增加 1 个。', // 示例效果 (X)
      creature: '攻击次数增加 1 次。', // 示例效果 (X)
    },
    artId: 'card-art-1',
  },
  {
    id: 'summon',
    name: '通灵',
    type: '特殊',
    cost: 3, // 示例消耗 (3X, X=1)
    description: {
      spell: '从牌库选择一张造物牌，使其获得+1/+1并入场。', // 示例效果 (X)
      creature: '回合结束时，创造 1 个 1/1 的法力造物。', // 示例效果 (X)
    },
    artId: 'card-art-3',
  },
  {
    id: 'reflect',
    name: '反弹',
    type: '特殊',
    cost: 4, // 消耗调整为更合理的值
    description: {
      spell: '免疫下两次受到的伤害，并将其返还给来源。',
      creature: '免疫下一次受到的伤害，并将其返还给来源。',
    },
    artId: 'card-art-2',
  },

  // --- 限定词条 (Conditional Terms) ---
  {
    id: 'delay',
    name: '延迟',
    type: '限定',
    cost: '-3', // 消耗减少
    description: {
      spell: '此效果将在 2 回合后生效。', // 示例效果 (X=1, 2X)
      creature: '此生物将在 2 回合后入场。', // 示例效果 (X=1, 2X)
    },
    artId: 'card-art-3',
  },
  {
    id: 'discard',
    name: '舍弃',
    type: '限定',
    cost: '-6', // 消耗减少
    description: {
      spell: '打出此牌需要丢弃 1 张手牌。', // 示例效果 (X)
      creature: '打出此牌需要丢弃 1 张手牌。', // 示例效果 (X)
    },
    artId: 'card-art-1',
  },
    {
    id: 'blood-price',
    name: '燃血',
    type: '限定',
    cost: '-2', // 消耗减少
    description: {
      spell: '打出此牌需要失去 2 点生命值。', // 示例效果 (2X, X=1)
      creature: '打出此牌需要失去 2 点生命值。', // 示例效果 (2X, X=1)
    },
    artId: 'card-art-4',
  },
];
