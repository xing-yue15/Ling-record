import { GameBoardClient } from "@/components/game/GameBoardClient";
import { initialTerms } from "@/lib/initial-data";
import { GameState } from "@/lib/definitions";

export default function BattlePage({ params }: { params: { matchId: string } }) {
  // In a real app, this would be fetched from a server based on the matchId
  const initialGameState: GameState = {
    players: [
      {
        id: 'player',
        name: '玩家',
        health: 30,
        maxHealth: 30,
        deck: Array(24).fill({ id: 'card-1', name: '测试卡', terms: [initialTerms[0]], finalCost: 2, type: '法术牌', description: '一张测试卡', artId: 'card-art-1' }),
        hand: [
          { id: 'card-hand-1', name: '火焰冲击', terms: [initialTerms[0]], finalCost: 2, type: '法术牌', description: '造成4点伤害。', artId: 'card-art-1' },
          { id: 'card-hand-2', name: '圣光护卫', terms: [initialTerms[1]], finalCost: 3, type: '造物牌', description: '一个具有0点攻击力和4点生命值的生物。', health: 4, attack: 0, artId: 'card-art-4' },
          { id: 'card-hand-3', name: '召唤元素', terms: [initialTerms[4]], finalCost: 3, type: '造物牌', description: '一个具有2点攻击力和2点生命值的生物。', health: 2, attack: 2, artId: 'card-art-3' },
          { id: 'card-hand-4', name: '影子刺客', terms: [initialTerms[0]], finalCost: 4, type: '造物牌', description: '一个具有3点攻击力和2点生命值的生物。', health: 2, attack: 3, artId: 'card-art-5' },
          { id: 'card-hand-5', name: '延迟火球', terms: [initialTerms[0], initialTerms[6]], finalCost: 1, type: '法术牌', description: '造成8点伤害。此效果将在2回合后生效。', artId: 'card-art-6' },
        ],
        graveyard: [],
        board: [null, { id: 'creature-1', cardId: 'c1', name: '石拳食人魔', attack: 4, health: 5, maxHealth: 5, artId: 'creature-ogre', canAttack: true }, null, { id: 'creature-2', cardId: 'c2', name: '精灵斥候', attack: 1, health: 1, maxHealth: 1, artId: 'creature-elf', canAttack: true }, null, null],
        manaCap: 3,
        currentMana: 3,
      },
      {
        id: 'opponent',
        name: '哥布林工匠',
        health: 30,
        maxHealth: 30,
        deck: Array(25).fill({ id: 'card-1', name: '测试卡', terms: [initialTerms[0]], finalCost: 2, type: '法术牌', description: '一张测试卡', artId: 'card-art-1' }),
        hand: Array(5).fill(null).map((_, i) => ({ id: `card-ob-${i}`, name: '对手卡', terms: [], finalCost: 0, type: '法术牌', description: '', artId: ''})),
        graveyard: [],
        board: [null, { id: 'creature-3', cardId: 'c3', name: '爆炸稻草人', attack: 1, health: 3, maxHealth: 3, artId: 'creature-scarecrow', canAttack: true }, null, { id: 'creature-4', cardId: 'c4', name: '机械蜘蛛', attack: 2, health: 1, maxHealth: 1, artId: 'creature-spider', canAttack: true }, null, null],
        manaCap: 3,
        currentMana: 3,
      },
    ],
    turnCount: 1,
    pvpScore: [0, 0],
    currentEnvironment: null,
    activePlayerIndex: 0,
    settlementZone: [],
    gamePhase: 'main',
    selectedHandCardIndex: null,
  }

  return (
     <GameBoardClient matchId={params.matchId} initialState={initialGameState} />
  );
}
