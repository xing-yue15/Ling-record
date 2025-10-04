'use client';
import { GameBoardClient } from "@/components/game/GameBoardClient";
import { GameState } from "@/lib/definitions";

export default function BattlePage({ params }: { params: { matchId: string } }) {
  const { matchId } = params;
  // In a real app, this would be fetched from a server based on the matchId
  // For now, we use initial static data for demonstration
  const initialGameState: GameState = {
    players: [
      {
        id: 'player',
        name: '玩家',
        health: 100,
        maxHealth: 100,
        deck: Array(24).fill(null).map((_, i) => ({ id: `card-p-${i}`, name: `玩家卡 ${i+1}`, terms: [], finalCost: 2, type: '法术牌', description: '一张测试卡', artId: 'card-art-1' })),
        hand: [
          { id: 'card-hand-1', name: '火焰冲击', terms: [], finalCost: 2, type: '法术牌', description: '造成4点伤害。', artId: 'card-art-1' },
          { id: 'card-hand-2', name: '圣光护卫', terms: [], finalCost: 3, type: '造物牌', description: '一个具有0点攻击力和4点生命值的生物。', health: 4, attack: 0, artId: 'card-art-4' },
          { id: 'card-hand-3', name: '召唤元素', terms: [], finalCost: 3, type: '造物牌', description: '一个具有2点攻击力和2点生命值的生物。', health: 2, attack: 2, artId: 'card-art-3' },
          { id: 'card-hand-4', name: '影子刺客', terms: [], finalCost: 4, type: '造物牌', description: '一个具有3点攻击力和2点生命值的生物。', health: 2, attack: 3, artId: 'card-art-5' },
          { id: 'card-hand-5', name: '延迟火球', terms: [], finalCost: 1, type: '法术牌', description: '造成8点伤害。此效果将在2回合后生效。', artId: 'card-art-6' },
        ],
        graveyard: [],
        board: [null, null, null, null, null, null],
        playedCardThisTurn: false,
        turnHasSwappedCard: false,
      },
      {
        id: 'opponent',
        name: '哥布林工匠',
        health: 100,
        maxHealth: 100,
        deck: Array(25).fill(null).map((_, i) => ({ id: `card-o-${i}`, name: `敌方卡 ${i+1}`, terms: [], finalCost: 2, type: '法术牌', description: '一张测试卡', artId: 'card-art-1' })),
        hand: Array(5).fill(null).map((_, i) => ({ id: `card-oh-${i}`, name: '对手卡', terms: [], finalCost: i + 1, type: '法术牌', description: '', artId: ''})),
        graveyard: [],
        board: [null, null, null, null, null, null],
        playedCardThisTurn: false,
        turnHasSwappedCard: false,
      },
    ],
    turnCount: 1,
    pvpScore: [0, 0],
    currentEnvironment: null,
    activePlayerIndex: 0,
    settlementZone: [],
    gamePhase: 'main',
    selectedHandCardIndex: null,
    selectedDeckCardIndex: null,
    turnHasSwappedCard: false,
    winner: null,
  }

  return (
     <GameBoardClient matchId={matchId} initialState={initialGameState} />
  );
}
