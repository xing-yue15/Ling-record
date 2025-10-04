
import type { Term } from './definitions';

export const initialTerms: Term[] = [
  // --- 通用基础词条 (General Base Terms) ---
  {
    id: 'damage',
    name: '伤害X',
    type: '基础',
    cost: 'X',
    description: {
      spell: '对一个目标造成2X点伤害。',
      creature: '获得X点攻击力。',
    },
    artId: 'card-art-1',
  },
  {
    id: 'heal',
    name: '治疗3X',
    type: '基础',
    cost: '2X',
    description: {
      spell: '为一个目标恢复3X点生命值。',
      creature: '获得2X点生命值。',
    },
    artId: 'card-art-4',
  },
  {
    id: 'armor',
    name: '护甲2X',
    type: '基础',
    cost: '3X',
    description: {
      spell: '给予一个目标2X点护甲。',
      creature: '受到伤害抵消X点。',
    },
    artId: 'card-art-2',
  },
  {
    id: 'multistrike',
    name: '连击X',
    type: '基础',
    cost: '*(X+1)',
    description: {
      spell: '选择目标数量增加X个。',
      creature: '攻击次数增加X次。',
    },
    artId: 'card-art-1',
  },
  {
    id: 'summon',
    name: '通灵X',
    type: '基础',
    cost: '3X',
    description: {
      spell: '选择牌库造物卡使其+X/+X 入场。',
      creature: '回合结束创造X个1/1法力造物作战。',
    },
    artId: 'card-art-3',
  },
  {
    id: 'reflect',
    name: '反弹',
    type: '特殊',
    cost: 45,
    description: {
      spell: '免疫两次伤害并返还给施法者/攻击者。',
      creature: '免疫一次伤害并返还给施法者/攻击者。',
    },
    artId: 'card-art-2',
  },
  {
    id: 'delay',
    name: '延迟2X',
    type: '基础',
    cost: '-3X',
    description: {
      spell: 'X回合后可选择是否生效，生效前敌方不可见。',
      creature: 'X回合后可选择是否入场。',
    },
    artId: 'card-art-3',
  },
  {
    id: 'discard',
    name: '舍弃X',
    type: '基础',
    cost: '-6X',
    description: {
      spell: '丢弃X张手牌才能打出。',
      creature: '丢弃X张手牌才能打出。',
    },
    artId: 'card-art-1',
  },
  {
    id: 'blood-price',
    name: '燃血3X',
    type: '基础',
    cost: '-2X',
    description: {
      spell: '失去2X点生命值才能打出。',
      creature: '失去2X点生命值才能打出。',
    },
    artId: 'card-art-4',
  },

  // --- 原初术式 (Primal Art) ---
  {
    id: 'primal-decree',
    name: '律令',
    type: '限定',
    cost: '/5',
    description: {
      spell: '若此牌是本回合所有已打出牌中消耗最高的，则[触发特定效果]。',
      creature: '若此牌是本回合所有已打出牌中消耗最高的，则[触发特定效果]。',
    },
    artId: 'card-art-1',
  },
  {
    id: 'primal-eternal',
    name: '永恒',
    type: '特殊',
    cost: 60,
    description: {
      spell: '除了换牌行为，本牌永远不会离开拥有者手牌。',
      creature: '只会受到“消灭”和“移除”效果的影响。',
    },
    artId: 'card-art-2',
  },
  {
    id: 'primal-seal',
    name: '封印X',
    type: '基础',
    cost: '40X', 
    description: {
      spell: '目标X回合内不能使用法术牌。',
      creature: '目标X回合内不能使用造物牌。',
    },
    artId: 'card-art-3',
  },
  {
    id: 'primal-demise',
    name: '破灭',
    type: '基础',
    cost: 35,
    description: {
      spell: '抵消结算阶段下一张法术牌。',
      creature: '抵消结算阶段下一张造物牌。',
    },
    artId: 'card-art-4',
  },
  {
    id: 'primal-omnipotence',
    name: '全能X',
    type: '基础',
    cost: '1000X', 
    description: {
      spell: '选择一张已知卡牌，增加或减少其X个基础/特殊词条。',
      creature: ' ',
    },
    artId: 'card-art-5',
  },

  // --- 混乱术式 (Chaos Art) ---
  {
    id: 'chaos-overflow',
    name: '溢出',
    type: '限定',
    cost: '/2',
    description: {
      spell: '打出时，若拥有者手牌数量大于或等于7张，则[触发特定效果]。',
      creature: '打出时，若拥有者手牌数量大于或等于7张，则[触发特定效果]。',
    },
    artId: 'card-art-6',
  },
  {
    id: 'chaos-annihilation',
    name: '湮灭',
    type: '特殊',
    cost: '/2',
    description: {
      spell: '摧毁牌库中法术牌，直至与本牌消耗相同才能打出（向上取整）。',
      creature: '回合结束时摧毁牌库中造物牌，直至与本牌消耗相同（向上取整）。',
    },
    artId: 'card-art-1',
  },
  {
    id: 'chaos-overdraft',
    name: '透支X',
    type: '基础',
    cost: '0',
    description: {
      spell: '从牌库中随机抽取X张牌（回合结束时弃牌，直到等于6张）。',
      creature: '从牌库中随机抽取X张牌。',
    },
    artId: 'card-art-2',
  },
  {
    id: 'chaos-substitution',
    name: '代换X',
    type: '基础',
    cost: '50X',
    description: {
      spell: '选择你手中的X张牌，向你的对手发起一次交换提议...[详细规则见文档]',
      creature: '回合结束时选择X张牌，与敌方随机X张牌交换。',
    },
    artId: 'card-art-3',
  },
  {
    id: 'chaos-transfer',
    name: '转移X',
    type: '基础',
    cost: '40X',
    description: {
      spell: '目标下X张法术牌，目标由你决定。',
      creature: '攻击其他造物后，其攻击目标由你决定。',
    },
    artId: 'card-art-4',
  },

  // --- 生命术式 (Life Art) ---
  {
    id: 'life-growth',
    name: '生长',
    type: '特殊',
    cost: 45,
    description: {
      spell: '本局每打出一次，此牌其他数值词条的数值翻倍一次。',
      creature: '攻击后自身攻击力和生命值翻倍。',
    },
    artId: 'card-art-4',
  },
  {
    id: 'life-inspire',
    name: '鼓舞',
    type: '限定',
    cost: '/2',
    description: {
      spell: '战场上有己方造物时[触发特定效果]。',
      creature: '自身攻击并存活后[触发特定效果]。',
    },
    artId: 'card-art-2',
  },
  {
    id: 'life-parasite',
    name: '寄生X',
    type: '基础',
    cost: '3X', 
    description: {
      spell: '给予目标寄生2X（寄生X:回合结束时生命-X，施法者生命+X）。',
      creature: '给予攻击目标寄生 X。',
    },
    artId: 'card-art-1',
  },
  {
    id: 'life-rebirth',
    name: '新生3X',
    type: '基础',
    cost: '5X', 
    description: {
      spell: '目标生命值及上限+3X。',
      creature: '每次受到伤害时自身生命值及上限+X。',
    },
    artId: 'card-art-4',
  },
  {
    id: 'life-revive',
    name: '复活X',
    type: '基础',
    cost: '30+10X', 
    description: {
      spell: '选择2X个死亡造物进入己方战场。',
      creature: '回合结束选择X个己方死亡造物进入己方战场。',
    },
    artId: 'card-art-3',
  },

  // --- 死亡术式 (Death Art) ---
  {
    id: 'death-sacrifice',
    name: '牺牲',
    type: '限定',
    cost: '*2',
    description: {
      spell: '本牌被丢弃时[触发特定效果]。',
      creature: '生命值<=0时[触发特定效果]。',
    },
    artId: 'card-art-1',
  },
  {
    id: 'death-servitude',
    name: '死役',
    type: '特殊',
    cost: 30,
    description: {
      spell: '击杀目标后将其变成造物卡加入己方牌库。',
      creature: '击杀目标后获得其属性值。',
    },
    artId: 'card-art-3',
  },
  {
    id: 'death-void',
    name: '虚无X',
    type: '基础',
    cost: '70X', 
    description: {
      spell: 'X回合内无敌。',
      creature: 'X回合内无敌。',
    },
    artId: 'card-art-2',
  },
  {
    id: 'death-wither',
    name: '凋零X',
    type: '基础',
    cost: '15X',
    description: {
      spell: '消灭所有生命值小于或等于2X的敌方造物。',
      creature: '回合结束消灭所有生命值小于或等于X的造物。',
    },
    artId: 'card-art-6',
  },
  {
    id: 'death-aegis',
    name: '冥护X',
    type: '基础',
    cost: '15X', 
    description: {
      spell: '本回合内目标的生命值不会低于X点。',
      creature: '本回合内生命值不会低于X点。',
    },
    artId: 'card-art-2',
  },

  // --- 爱恋术式 (Love Art) ---
  {
    id: 'love-resonance',
    name: '共鸣',
    type: '限定',
    cost: '/4',
    description: {
      spell: '若对方本回合打出的是法术牌[触发特定效果]。',
      creature: '若对方本回合打出的是造物牌[触发特定效果]。',
    },
    artId: 'card-art-4',
  },
  {
    id: 'love-heartbreak',
    name: '失心',
    type: '特殊',
    cost: 30,
    description: {
      spell: '目标造物无法对施法者攻击。',
      creature: '攻击目标后使其无法攻击自身。',
    },
    artId: 'card-art-1',
  },
  {
    id: 'love-unison',
    name: '同心X',
    type: '基础',
    cost: '20X', 
    description: {
      spell: '选择2个目标，使其在X回合内共享受到的所有效果（数值平均分配）。',
      creature: '回合结束选择1个目标，使其在X回合内共享受到的所有效果。',
    },
    artId: 'card-art-4',
  },
  {
    id: 'love-charm',
    name: '魅惑X',
    type: '基础',
    cost: '10X',
    description: {
      spell: '夺取一个攻击力小于或等于2X的敌方造物的控制权。',
      creature: '回合结束夺取一个攻击力小于或等于X的敌方造物的控制权。',
    },
    artId: 'card-art-3',
  },
  {
    id: 'love-devotion',
    name: '奉献X',
    type: '基础',
    cost: '5X',
    description: {
      spell: '选择并消灭一个生命值小于或等于2X的造物，施法者获得其全部生命值。',
      creature: '回合结束随机消灭一个生命值小于或等于X的造物，自身获得其全部生命值。',
    },
    artId: 'card-art-1',
  },

  // --- 杀戮术式 (Slaughter Art) ---
  {
    id: 'slaughter-maim',
    name: '杀伤',
    type: '限定',
    cost: '/2',
    description: {
      spell: '目标生命值减少后[触发特定效果]。',
      creature: '目标生命值减少后[触发特定效果]。',
    },
    artId: 'card-art-1',
  },
  {
    id: 'slaughter-bloodlust',
    name: '嗜血X',
    type: '特殊',
    cost: '8X', 
    description: {
      spell: '本局造成的伤害永久增加2X。',
      creature: '回合结束所有己方造物的攻击力+X。',
    },
    artId: 'card-art-6',
  },
  {
    id: 'slaughter-expose',
    name: '破绽X',
    type: '基础',
    cost: '4X', 
    description: {
      spell: '本局目标获得的护甲值减少2X点。',
      creature: '攻击目标的护甲值减少2X点。',
    },
    artId: 'card-art-2',
  },
  {
    id: 'slaughter-execute',
    name: '杀机X',
    type: '基础',
    cost: '4X', 
    description: {
      spell: '击杀生命值低于2X的敌方单位。',
      creature: '击杀生命值低于X的敌方单位。',
    },
    artId: 'card-art-5',
  },
  {
    id: 'slaughter-frenzy',
    name: '狂暴X',
    type: '基础',
    cost: '20X', 
    description: {
      spell: 'X回合内，目标造成的伤害和受到的伤害翻倍。',
      creature: 'X回合内，自身造成的伤害和受到的伤害翻倍。',
    },
    artId: 'card-art-6',
  },

  // --- 幸福术式 (Happiness Art) ---
  {
    id: 'happiness-serenity',
    name: '安宁',
    type: '限定',
    cost: '/3',
    description: {
      spell: '若你在上个回合没有受到任何伤害，则[触发特定效果]。',
      creature: '若自身上个回合没有受到任何伤害，回合开始时[触发特定效果]。',
    },
    artId: 'card-art-4',
  },
  {
    id: 'happiness-wish',
    name: '如意',
    type: '特殊',
    cost: 45,
    description: {
      spell: '自身下次打出的法术必定生效。',
      creature: '攻击必定命中。',
    },
    artId: 'card-art-4',
  },
  {
    id: 'happiness-guardian',
    name: '守护',
    type: '基础',
    cost: 40,
    description: {
      spell: '己方造物单位不受敌方法术效果影响。',
      creature: '替拥有者承受伤害。',
    },
    artId: 'card-art-2',
  },
  {
    id: 'happiness-grace',
    name: '恩泽X',
    type: '基础',
    cost: '12X',
    description: {
      spell: '2X回合内自身debuff不会生效。',
      creature: 'X回合内自身debuff不会生效。',
    },
    artId: 'card-art-4',
  },
  {
    id: 'happiness-rapture',
    name: '沉醉X',
    type: '基础',
    cost: '35X', 
    description: {
      spell: 'X回合内，敌方所有造物无法触发效果。',
      creature: '回合结束使X个敌方造物无法触发效果。',
    },
    artId: 'card-art-3',
  },

  // --- 痛苦术式 (Pain Art) ---
  {
    id: 'pain-scar',
    name: '伤痕',
    type: '限定',
    cost: '/2',
    description: {
      spell: '若你在上个回合受到任何伤害，则[触发特定效果]。',
      creature: '若自身上个回合受到任何伤害，回合开始时[触发特定效果]。',
    },
    artId: 'card-art-1',
  },
  {
    id: 'pain-calamity',
    name: '劫难',
    type: '特殊',
    cost: 20,
    description: {
      spell: '回合结束自动打出（无论是在手牌或牌库），目标为拥有者。',
      creature: '攻击目标改为拥有者。',
    },
    artId: 'card-art-6',
  },
  {
    id: 'pain-torment',
    name: '折磨X',
    type: '基础',
    cost: '15X',
    description: {
      spell: '选择一张随机或已知法术，摧毁其X张相同法术。',
      creature: '回合结束随机摧毁敌方X张法术牌。',
    },
    artId: 'card-art-5',
  },
  {
    id: 'pain-brand',
    name: '烙印X',
    type: '基础',
    cost: '15X',
    description: {
      spell: '往牌库中洗入X张本法术0消耗复制。',
      creature: '往牌库中洗入X张本造物0消耗复制。',
    },
    artId: 'card-art-1',
  },
  {
    id: 'pain-suffering',
    name: '受难X',
    type: '基础',
    cost: '4X', 
    description: {
      spell: '给予目标受难2X(受难X: 每打出一张牌受到X点伤害)。',
      creature: '给予攻击目标受难 X。',
    },
    artId: 'card-art-6',
  },

  // --- 无畏术式 (Fearless Art) ---
  {
    id: 'fearless-desperation',
    name: '绝境',
    type: '限定',
    cost: '/2',
    description: {
      spell: '生命值低于其上限的30%时[触发特定效果]。',
      creature: '自身生命值低于其上限的30%时[触发特定效果]。',
    },
    artId: 'card-art-6',
  },
  {
    id: 'fearless-unyielding',
    name: '不屈',
    type: '特殊',
    cost: 40,
    description: {
      spell: '本回合自身造成的伤害不会减少。',
      creature: '攻击力不会被减少。',
    },
    artId: 'card-art-2',
  },
  {
    id: 'fearless-legacy',
    name: '传承X',
    type: '基础',
    cost: '6X',
    description: {
      spell: '给予一个造物目标传承2X(传承X: 造物获得+X/+X，其死亡后将该增益给予其他随机存活的友方造物；若没有其他造物，则为施法者恢复X点生命值)。',
      creature: '回合结束给予随机一个友方造物传承 X。',
    },
    artId: 'card-art-4',
  },
  {
    id: 'fearless-steadfast',
    name: '屹立X',
    type: '基础',
    cost: '8X', 
    description: {
      spell: '选择一个己方造物获得屹立2（屹立X:造物获得+X/+X，若该造物在你的下个回合开始时仍存活，则再次获得+X/+X并重复此效果）。',
      creature: '获得屹立 X。',
    },
    artId: 'card-art-2',
  },
  {
    id: 'fearless-command',
    name: '号令X',
    type: '基础',
    cost: '25X', 
    description: {
      spell: '选择一个目标，所有己方造物对其发动X次攻击。',
      creature: '选择一个目标，对其发动2X次攻击。',
    },
    artId: 'card-art-5',
  },

  // --- 懦弱术式 (Cowardice Art) ---
  {
    id: 'cowardice-ambush',
    name: '埋伏',
    type: '限定',
    cost: '*2',
    description: {
      spell: '当敌方打出法术牌时[触发特定效果]并选择是否打出（每回合限一次）。',
      creature: '当敌方打出造物时[触发特定效果]并选择是否打出（每回合限一次）。',
    },
    artId: 'card-art-5',
  },
  {
    id: 'cowardice-powerless',
    name: '无力',
    type: '特殊',
    cost: -30,
    description: {
      spell: '本牌无法打出。',
      creature: '属性值无法增加。',
    },
    artId: 'card-art-1',
  },
  {
    id: 'cowardice-retreat',
    name: '退缩',
    type: '基础',
    cost: 10,
    description: {
      spell: '受到的伤害优先由己方造物承受。',
      creature: '受到的伤害由拥有者承受。',
    },
    artId: 'card-art-2',
  },
  {
    id: 'cowardice-disintegrate',
    name: '瓦解X',
    type: '基础',
    cost: '20X',
    description: {
      spell: '敌方下一次出牌消耗-40X。',
      creature: '攻击敌方玩家后使其下一次出牌消耗-20X。',
    },
    artId: 'card-art-6',
  },
  {
    id: 'cowardice-suppress',
    name: '压制X',
    type: '基础',
    cost: '18X',
    description: {
      spell: '敌方下2X张打出的牌所有数值减半。',
      creature: '攻击敌人玩家后使其下X张打出的牌所有数值减半。',
    },
    artId: 'card-art-3',
  },

  // --- 金属术式 (Metal Art) ---
  {
    id: 'metal-sharp',
    name: '锐利',
    type: '特殊',
    cost: 10,
    description: {
      spell: '造成的伤害无视护甲。',
      creature: '造成的伤害无视护甲。',
    },
    artId: 'card-art-5',
  },
  {
    id: 'metal-cleave',
    name: '切割X',
    type: '基础',
    cost: '2X', 
    description: {
      spell: '目标的生命值及上限同时减少2X。',
      creature: '攻击目标的生命值及上限同时减少X。',
    },
    artId: 'card-art-5',
  },
  {
    id: 'metal-forge',
    name: '铸形X',
    type: '基础',
    cost: '12X',
    description: {
      spell: '本局玩家每受到一次伤害后本牌消耗+6X。',
      creature: '每受到一次伤害后+3X/+3X。',
    },
    artId: 'card-art-2',
  },
  {
    id: 'metal-cage',
    name: '囚笼X',
    type: '基础',
    cost: '35X',
    description: {
      spell: '将战场变为铸铁囚笼（敌人战场格子-X，上限为6）。',
      creature: '将战场变为铸铁囚笼。',
    },
    artId: 'card-art-3',
  },

  // --- 苍木术式 (Wood Art) ---
  {
    id: 'wood-root',
    name: '扎根',
    type: '限定',
    cost: '/2',
    description: {
      spell: '本牌在手牌中一回合后[触发特定效果]。',
      creature: '回合结束时[触发特定效果]。',
    },
    artId: 'card-art-4',
  },
  {
    id: 'wood-leaf',
    name: '飞叶',
    type: '特殊',
    cost: 8,
    description: {
      spell: '造成的X点伤害变为X次1点伤害。',
      creature: '攻击后对所有敌方造物造成伤害。',
    },
    artId: 'card-art-1',
  },
  {
    id: 'wood-entangle',
    name: '缠绕X',
    type: '基础',
    cost: '8X',
    description: {
      spell: '2X回合内，目标造物在其回合结束时，失去其“攻击力与生命值差值”的生命值。',
      creature: '回合结束使目标造物失去其“攻击力与生命值差值”的生命值。',
    },
    artId: 'card-art-3',
  },
  {
    id: 'wood-blight',
    name: '枯萎X',
    type: '基础',
    cost: '12X',
    description: {
      spell: '2X回合内目标无法恢复生命值。',
      creature: '攻击目标后使其X回合无法恢复生命值。',
    },
    artId: 'card-art-1',
  },
  {
    id: 'wood-overgrowth',
    name: '蔓生X',
    type: '基础',
    cost: '30X',
    description: {
      spell: '将战场变为蔓生之地（每当敌方召唤一个造物或敌方造物属性值发生变化，该造物 X 回合无法攻击）。',
      creature: '将战场变为蔓生之地。',
    },
    artId: 'card-art-4',
  },

  // --- 净水术式 (Water Art) ---
  {
    id: 'water-dissipate',
    name: '化力',
    type: '限定',
    cost: '/2',
    description: {
      spell: '手牌比对手少时[触发特定效果]。',
      creature: '当一个造物被移回其拥有者手牌时[触发特定效果]。',
    },
    artId: 'card-art-4',
  },
  {
    id: 'water-dissolve',
    name: '溶解',
    type: '特殊',
    cost: 10,
    description: {
      spell: '对护甲造成的伤害翻倍。',
      creature: '对护甲造成的伤害翻倍。',
    },
    artId: 'card-art-1',
  },
  {
    id: 'water-purify',
    name: '净化X',
    type: '基础',
    cost: '6X',
    description: {
      spell: '移除目标身上的2X个buff。',
      creature: '回合结束将 X 个造物移回拥有者手牌。',
    },
    artId: 'card-art-4',
  },
  {
    id: 'water-dampen',
    name: '潮湿X',
    type: '基础',
    cost: '8X',
    description: {
      spell: '目标在本局造成的伤害永久减少2X。',
      creature: '攻击目标后使其本局造成的伤害永久减少X。',
    },
    artId: 'card-art-1',
  },
  {
    id: 'water-tide',
    name: '潮汐X',
    type: '基础',
    cost: '25X',
    description: {
      spell: '将战场变为无尽潮汐（每回合开始时，生命值小于或等于X的所有造物被移出游戏）。',
      creature: '将战场变为无尽潮汐。',
    },
    artId: 'card-art-4',
  },

  // --- 烈火术式 (Fire Art) ---
  {
    id: 'fire-explosion',
    name: '爆炸',
    type: '特殊',
    cost: 15,
    description: {
      spell: '所有造物死亡时对敌方玩家造成等同于其最大生命值的伤害。',
      creature: '死亡时对敌方玩家造成等同于自身最大生命值的伤害。',
    },
    artId: 'card-art-6',
  },
  {
    id: 'fire-ignite',
    name: '引燃X',
    type: '基础',
    cost: '12X',
    description: {
      spell: '选择一个目标，立即触发其身上全部的X次减益效果（debuff）。',
      creature: '选择一个目标，立即触发其身上全部的X次减益效果。',
    },
    artId: 'card-art-6',
  },
  {
    id: 'fire-scorch',
    name: '炽热2X',
    type: '基础',
    cost: '3X', 
    description: {
      spell: '给予目标X层炽热（每层在回合结束时造成1点伤害）。',
      creature: '攻击时给予目标X层炽热。',
    },
    artId: 'card-art-1',
  },
  {
    id: 'fire-scorched-earth',
    name: '焦土X',
    type: '基础',
    cost: '40X',
    description: {
      spell: '将战场变为燃烧焦土（所有敌方单位在回合结束时失去10X%点当前生命值，上限为9）。',
      creature: '将战场变为燃烧焦土。',
    },
    artId: 'card-art-6',
  },

  // --- 尘土术式 (Dust Art) ---
  {
    id: 'dust-toughness',
    name: '坚韧',
    type: '限定',
    cost: '/2',
    description: {
      spell: '拥有护甲时[触发特定效果]。',
      creature: '拥有者拥有护甲时[触发特定效果]。',
    },
    artId: 'card-art-2',
  },
  {
    id: 'dust-rockskin',
    name: '岩肤',
    type: '特殊',
    cost: 12,
    description: {
      spell: '获得的护甲值翻倍，在下回合开始时清除。',
      creature: '受到的伤害减半。',
    },
    artId: 'card-art-2',
  },
  {
    id: 'dust-blind',
    name: '蒙蔽',
    type: '基础',
    cost: 30,
    description: {
      spell: '目标下一张打出的法术，将无法触发其基础词条效果。',
      creature: '被攻击目标将无法触发其基础词条效果，若目标是玩家其下一张打出的法术，将无法触发其基础词条效果。',
    },
    artId: 'card-art-3',
  },
  {
    id: 'dust-petrify',
    name: '沙化X',
    type: '基础',
    cost: '8X',
    description: {
      spell: '目标造物的生命值变为8-X。',
      creature: '被攻击目标造物的生命值变为8-X。',
    },
    artId: 'card-art-3',
  },
  {
    id: 'dust-desert',
    name: '尘埃X',
    type: '基础',
    cost: '10X',
    description: {
      spell: '将战场变为尘埃沙漠（敌方造物获得属性加成时-X/-X）。',
      creature: '将战场变为尘埃沙漠。',
    },
    artId: 'card-art-3',
  },

  // --- 赤血术式 (Blood Art) ---
  {
    id: 'blood-thirst',
    name: '渴望',
    type: '限定',
    cost: '/2',
    description: {
      spell: '上回合有单位恢复过生命值，则[触发特定效果]。',
      creature: '恢复生命值后[触发特定效果]。',
    },
    artId: 'card-art-4',
  },
  {
    id: 'blood-vampirism',
    name: '吸血',
    type: '特殊',
    cost: 10,
    description: {
      spell: '造成的伤害会为施法者恢复等量生命值。',
      creature: '造成的伤害会为其拥有者恢复等量生命值。',
    },
    artId: 'card-art-1',
  },
  {
    id: 'blood-plague',
    name: '血疫X',
    type: '基础',
    cost: '22X',
    description: {
      spell: '给予目标X层血疫（目标每次将要恢复生命时，改为受到等量伤害，并消耗一层血疫）。',
      creature: '当该造物对一个目标造成伤害时，给予目标X层血疫。',
    },
    artId: 'card-art-1',
  },
  {
    id: 'blood-rebirth',
    name: '回生X',
    type: '基础',
    cost: '20X',
    description: {
      spell: 'X回合内，施法者获得除自身外所有单位失去生命值的总和。',
      creature: 'X回合内，获得除自身外所有单位失去生命值的总和。',
    },
    artId: 'card-art-4',
  },
  {
    id: 'blood-reversal',
    name: '逆命X',
    type: '基础',
    cost: '15X',
    description: {
      spell: '选择一个目标，赋予X层逆命（死亡时移除所有逆命层数，并以等同于移除层数的生命值复活）。',
      creature: '自身获得X层逆命。',
    },
    artId: 'card-art-3',
  },
];

    