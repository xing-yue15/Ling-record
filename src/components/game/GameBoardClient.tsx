
'use client';

import { useState, useEffect } from 'react';
import { produce } from 'immer';
import { PlayerArea } from './PlayerArea';
import { Button } from '@/components/ui/button';
import { GameCard } from './Card';
import { Library } from 'lucide-react';
import type { GameState, Card as CardData, Creature, Player } from '@/lib/definitions';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from '@/components/ui/scroll-area';

interface GameBoardClientProps {
  matchId: string;
}

const createInitialDeck = (): CardData[] => {
    // For now, create a simple deck for testing
    const card1: CardData = { id: 'c1', name: '火球术', terms: [], finalCost: 2, type: '法术牌', description: '造成 5 点伤害。', artId: 'card-art-1' };
    const card2: CardData = { id: 'c2', name: '哥布林战士', terms: [], finalCost: 1, type: '造物牌', description: '一个基础的战士。', attack: 2, health: 2, artId: 'card-art-2' };
    const card3: CardData = { id: 'c3', name: '治疗之光', terms: [], finalCost: 3, type: '法术牌', description: '恢复 8 点生命值。', artId: 'card-art-3' };
    const card4: CardData = { id: 'c4', name: '石巨人', terms: [], finalCost: 5, type: '造物牌', description: '一个巨大的防御者。', attack: 4, health: 8, artId: 'card-art-4' };
    return [card1, card2, card3, card4, { ...card1, id: 'c5' }, { ...card2, id: 'c6' }, { ...card3, id: 'c7' }, { ...card4, id: 'c8' }, { ...card1, id: 'c9' }, { ...card2, id: 'c10' }];
};

export function GameBoardClient({ matchId }: GameBoardClientProps) {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [showDeckModal, setShowDeckModal] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // In a real app, this would be fetched from a server based on the matchId
    // For now, we use initial static data for demonstration
    const initialPlayerDeck = createInitialDeck();
    const initialOpponentDeck = createInitialDeck();

    const initialGameState: GameState = {
        players: [
            {
                id: 'player',
                name: '玩家',
                health: 30,
                maxHealth: 30,
                deck: initialPlayerDeck,
                hand: initialPlayerDeck.slice(0, 6),
                graveyard: [],
                board: Array(6).fill(null),
                playedCardThisTurn: false,
                turnHasSwappedCard: false,
            },
            {
                id: 'opponent',
                name: '哥布林工匠',
                health: 30,
                maxHealth: 30,
                deck: initialOpponentDeck,
                hand: initialOpponentDeck.slice(0, 6),
                graveyard: [],
                board: Array(6).fill(null),
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
        winner: null,
    };
    setGameState(initialGameState);
  }, [matchId]);

  // AI Logic
  useEffect(() => {
    if (!gameState || gameState.activePlayerIndex !== 1 || gameState.gamePhase !== 'main' || gameState.winner) {
      return;
    }

    const aiPlayer = gameState.players[1];
    if (aiPlayer.playedCardThisTurn) {
        // AI already played, end its turn
        setTimeout(endTurn, 1000);
        return;
    };

    // Simple AI: play the first possible card
    const cardToPlayIndex = aiPlayer.hand.findIndex(card => true); // In a real game, check cost
    
    if (cardToPlayIndex > -1) {
        // Simulate playing a card to the settlement zone
        setTimeout(() => {
            setGameState(produce(draft => {
              if (!draft) return;
              const [playedCard] = draft.players[1].hand.splice(cardToPlayIndex, 1);
              // AI dumbly targets opponent player
              draft.settlementZone.push({ card: playedCard, playerId: 'opponent', target: {type: 'player', playerIndex: 0} });
              draft.players[1].playedCardThisTurn = true;
            }));
        }, 1000);
    } else {
        // No card to play, end turn
        setTimeout(endTurn, 1000);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState?.activePlayerIndex, gameState?.gamePhase, gameState?.winner]);
  
  useEffect(() => {
    if (!gameState || gameState.activePlayerIndex !== 0) return;

    let toastMessage = '';
    switch (gameState.gamePhase) {
      case 'selectingBoardSlot':
        toastMessage = '选择一个位置来放置该造物。';
        break;
      case 'selectingTarget':
        toastMessage = '选择一个目标。';
        break;
      case 'selectingHandCard':
        toastMessage = '从你的牌库中选择一张卡牌，然后选择一张手牌进行交换。';
        break;
    }
    if (toastMessage) {
      toast({ title: toastMessage, duration: 2000 });
    }
  }, [gameState?.gamePhase, gameState?.activePlayerIndex, toast]);

  if (!gameState) {
    return <div className="flex items-center justify-center h-screen w-full">正在加载战场...</div>;
  }

  const humanPlayer = gameState.players[0];
  const aiPlayer = gameState.players[1];
  const isPlayerTurn = gameState.activePlayerIndex === 0;

  const handlePlayCard = (cardIndex: number) => {
    if (!isPlayerTurn || (gameState.gamePhase !== 'main' && gameState.gamePhase !== 'selectingTarget')) {
      return;
    }
    
    // Cancel selection if clicking the same card
    if (gameState.selectedHandCardIndex === cardIndex) {
      setGameState(produce(draft => {
        if (!draft) return;
        draft.selectedHandCardIndex = null;
        draft.gamePhase = 'main';
      }));
      return;
    }

    if (humanPlayer.playedCardThisTurn && gameState.gamePhase === 'main') {
        toast({title: "本回合已出过牌", description: "每回合只能出一张牌。", variant: 'destructive'});
        return;
    }

    const card = humanPlayer.hand[cardIndex];
    
    setGameState(produce(draft => {
      if (!draft) return;
      draft.selectedHandCardIndex = cardIndex;
      if (card.type === '造物牌') {
        draft.gamePhase = 'selectingBoardSlot';
      } else { // Spell card
        draft.gamePhase = 'selectingTarget';
      }
    }));
  };

  const handleBoardSlotClick = (slotIndex: number) => {
    if (gameState.gamePhase !== 'selectingBoardSlot' || gameState.selectedHandCardIndex === null || !isPlayerTurn) return;

    setGameState(produce(draft => {
      if (!draft) return;
      const player = draft.players[0];
      if (player.board[slotIndex]) {
        toast({ title: '位置已被占据', description: '请选择一个空的格子。', variant: 'destructive' });
        return;
      }

      const cardIndex = draft.selectedHandCardIndex!;
      const [card] = player.hand.splice(cardIndex, 1);

      const newCreature: Creature = {
        id: `creature-${Date.now()}`,
        cardId: card.id,
        name: card.name,
        attack: card.attack ?? 0,
        health: card.health ?? 1,
        maxHealth: card.health ?? 1,
        type: '造物牌',
        artId: card.artId,
        canAttack: false, // Summoning sickness
      };

      player.board[slotIndex] = newCreature;
      // Creature placement doesn't go to settlement zone, it's immediate
      
      player.playedCardThisTurn = true;
      draft.gamePhase = 'main';
      draft.selectedHandCardIndex = null;
    }));
  };

  const handleTargetClick = (target: {type: 'player' | 'creature', playerIndex: number, slotIndex?: number}) => {
     if (gameState.gamePhase !== 'selectingTarget' || gameState.selectedHandCardIndex === null || !isPlayerTurn) return;

     setGameState(produce(draft => {
        if (!draft) return;
        const player = draft.players[0];
        const cardIndex = draft.selectedHandCardIndex!;
        const [card] = player.hand.splice(cardIndex, 1);
        
        draft.settlementZone.push({ card, playerId: player.id, target });

        player.playedCardThisTurn = true;
        draft.gamePhase = 'main';
        draft.selectedHandCardIndex = null;
     }));
  }

  const endTurn = () => {
    if (!isPlayerTurn && gameState.activePlayerIndex !== 1) return;
    if (isPlayerTurn && gameState.gamePhase !== 'main') return;

    setGameState(produce(draft => {
      if (!draft) return;

      // --- Resolution Phase ---
      draft.settlementZone.forEach(action => {
        // Basic parser for description
        const damageMatch = action.card.description.match(/造成 (\d+) 点伤害/);
        const healMatch = action.card.description.match(/恢复 (\d+) 点生命值/);

        if (damageMatch && action.target) {
            const amount = parseInt(damageMatch[1], 10);
            const targetPlayer = draft.players[action.target.playerIndex];
            if (action.target.type === 'player') {
                targetPlayer.health -= amount;
            } else if (action.target.type === 'creature' && action.target.slotIndex !== undefined) {
                const targetCreature = targetPlayer.board[action.target.slotIndex];
                if (targetCreature) {
                    targetCreature.health -= amount;
                }
            }
        }
        
        if (healMatch && action.target) {
             const amount = parseInt(healMatch[1], 10);
            const targetPlayer = draft.players[action.target.playerIndex];
            if (action.target.type === 'player') {
                targetPlayer.health = Math.min(targetPlayer.maxHealth, targetPlayer.health + amount);
            } else if (action.target.type === 'creature' && action.target.slotIndex !== undefined) {
                const targetCreature = targetPlayer.board[action.target.slotIndex];
                if (targetCreature) {
                    targetCreature.health = Math.min(targetCreature.maxHealth, targetCreature.health + amount);
                }
            }
        }
      });
      draft.settlementZone = [];

      // --- Combat Phase ---
      for (let i = 0; i < 6; i++) {
        const p1Creature = draft.players[0].board[i];
        const p2Creature = draft.players[1].board[i];

        // Creatures attack each other first if opposite
        if (p1Creature && p1Creature.canAttack && p2Creature) {
            p2Creature.health -= p1Creature.attack;
        } else if (p1Creature && p1Creature.canAttack) {
            draft.players[1].health -= p1Creature.attack;
        }

        if (p2Creature && p2Creature.canAttack && p1Creature) {
            p1Creature.health -= p2Creature.attack;
        } else if (p2Creature && p2Creature.canAttack) {
            draft.players[0].health -= p2Creature.attack;
        }
      }
      
      let winnerFound = false;
      draft.players.forEach((player, pIndex) => {
        // Remove dead creatures
        for(let i=0; i < player.board.length; i++) {
            if(player.board[i] && player.board[i]!.health <= 0) {
                player.graveyard.push(player.board[i]! as unknown as CardData);
                player.board[i] = null;
            }
        }
        // Check for player death
        if (player.health <= 0) {
            draft.winner = draft.players[1 - pIndex];
            draft.gamePhase = 'end';
            winnerFound = true;
        }
      });

      if (winnerFound) return;


      // --- End of Turn Phase ---
      const previousPlayerIndex = draft.activePlayerIndex;
      draft.players[previousPlayerIndex].board.forEach(c => {
        if(c) c.canAttack = true; // Wake up creatures
      });
      draft.players[previousPlayerIndex].playedCardThisTurn = false;
      draft.players[previousPlayerIndex].turnHasSwappedCard = false;
      
      // Switch active player
      draft.activePlayerIndex = 1 - previousPlayerIndex;
      
      if (draft.activePlayerIndex === 0) {
        draft.turnCount += 1;
      }
    }));
  };

  const handleDeckCardSelect = (deckCardIndex: number) => {
    setShowDeckModal(false);

    setGameState(produce(draft => {
        if (!draft) return;
        const player = draft.players[0];
        if (player.turnHasSwappedCard) return;

        if (player.hand.length < 6) {
            // Add card to hand
            const [selectedCard] = player.deck.splice(deckCardIndex, 1);
            player.hand.push(selectedCard);
            player.turnHasSwappedCard = true;
        } else {
            // Prepare to swap
            draft.selectedDeckCardIndex = deckCardIndex;
            draft.gamePhase = 'selectingHandCard';
        }
    }));
  };

  const handleHandCardSwap = (handCardIndex: number) => {
    if (gameState.gamePhase !== 'selectingHandCard' || gameState.selectedDeckCardIndex === null || humanPlayer.turnHasSwappedCard) return;

    setGameState(produce(draft => {
        if (!draft) return;
        const player = draft.players[0];
        const deckIndex = draft.selectedDeckCardIndex!;

        const handCard = player.hand[handCardIndex];
        const deckCard = player.deck[deckIndex];
        player.hand[handCardIndex] = deckCard;
        player.deck[deckIndex] = handCard;
        
        player.turnHasSwappedCard = true;
        draft.gamePhase = 'main';
        draft.selectedDeckCardIndex = null;
    }));
  };

  if (gameState.winner) {
    return (
        <AlertDialog open={true}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{gameState.winner.id === 'player' ? "你胜利了！" : "你失败了"}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {gameState.winner.id === 'player' ? "你击败了 " + aiPlayer.name : "你被 " + gameState.winner.name + " 击败了。"}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={() => window.location.href = '/worlds'}>返回世界选择</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
  }

  return (
    <>
      <div className="w-full h-screen flex flex-col bg-transparent text-white p-2 overflow-hidden fixed inset-0">
        {/* Opponent's Area */}
        <div className="flex-1">
          <PlayerArea 
            player={aiPlayer} 
            isOpponent={true} 
            onBoardClick={slotIndex => handleTargetClick({ type: 'creature', playerIndex: 1, slotIndex })}
            onPlayerClick={() => handleTargetClick({ type: 'player', playerIndex: 1})}
            isTargeting={isPlayerTurn && gameState.gamePhase === 'selectingTarget'}
          />
        </div>

        {/* Center Action Bar */}
        <div className="flex items-center justify-between h-48 border-y-2 border-primary/20 my-1 px-4 gap-4">
          <div className="flex flex-col items-center w-40">
              <Button size="lg" className="w-full h-16 text-lg font-headline" onClick={endTurn} disabled={!isPlayerTurn || gameState.gamePhase !== 'main'}>结束回合</Button>
          </div>
          
          {/* Settlement Zone */}
          <div className="flex-1 h-full flex items-center justify-center gap-2 px-4">
              <div className="w-full h-full border-x border-dashed border-border/50 rounded-lg flex justify-center items-center bg-black/30 p-2 gap-4">
                  {gameState.settlementZone.length === 0 ? (
                      <p className="text-muted-foreground text-2xl font-headline">结算区</p>
                  ) : (
                      gameState.settlementZone.map(({card}, index) => <div key={index} className="w-32 h-full"><GameCard card={card} /></div>)
                  )}
              </div>
          </div>

          <div className="flex flex-col items-center w-40">
              <Button 
                variant="outline"
                className="w-full h-16 flex flex-col gap-1 items-center justify-center text-lg font-headline"
                onClick={() => !humanPlayer.turnHasSwappedCard && setShowDeckModal(true)}
                disabled={!isPlayerTurn || humanPlayer.turnHasSwappedCard}
              >
                  <div className="flex items-center gap-2">
                      <Library />
                      <span>牌库</span>
                  </div>
                  <span className="text-xl font-bold">{humanPlayer.deck.length}</span>
              </Button>
          </div>
        </div>
        
        {/* Player's Area */}
        <div className="flex-1">
          <PlayerArea 
              player={humanPlayer} 
              isOpponent={false} 
              onBoardClick={handleBoardSlotClick} 
              onPlayerClick={() => handleTargetClick({ type: 'player', playerIndex: 0 })}
              isPlacing={isPlayerTurn && gameState.gamePhase === 'selectingBoardSlot'}
              isTargeting={isPlayerTurn && gameState.gamePhase === 'selectingTarget'}
          />
        </div>
        
        {/* Player's Hand */}
        <div className="absolute bottom-[-6rem] left-1/2 -translate-x-1/2 w-full max-w-4xl h-56 flex justify-center items-end gap-0 pb-4">
          {humanPlayer.hand.map((card, i) => (
              <div 
                  key={card.id + i} 
                  className={cn("w-40 h-56 transition-all duration-300 hover:-translate-y-12 hover:scale-110 relative",
                      (isPlayerTurn && (gameState.gamePhase === 'main' || gameState.gamePhase === 'selectingHandCard' || gameState.gamePhase === 'selectingTarget')) ? "cursor-pointer" : "cursor-not-allowed",
                      gameState.selectedHandCardIndex === i && "border-4 border-primary rounded-lg -translate-y-6 scale-105"
                  )}
                  style={{ 
                      transform: `translateX(${(i - (humanPlayer.hand.length - 1) / 2) * 15}px) rotate(${(i - (humanPlayer.hand.length - 1) / 2) * 2}deg)`,
                      transformOrigin: 'bottom center',
                  }}
                  onClick={() => gameState.gamePhase === 'selectingHandCard' ? handleHandCardSwap(i) : handlePlayCard(i)}
              >
                  <GameCard card={card} inHand={true} />
              </div>
          ))}
        </div>
      </div>

      {/* Deck Modal */}
      <AlertDialog open={showDeckModal} onOpenChange={setShowDeckModal}>
        <AlertDialogContent className="max-w-4xl h-[80vh]">
          <AlertDialogHeader>
            <AlertDialogTitle>检视牌库</AlertDialogTitle>
            <AlertDialogDescription>
              {humanPlayer.hand.length < 6 ? "你的手牌未满，选择一张卡牌直接加入手牌。" : "选择一张卡牌与你的手牌交换。"}
              每回合只有一次机会。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <ScrollArea className="h-full">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
              {humanPlayer.deck.map((card, index) => (
                <div key={card.id + index} className="cursor-pointer" onClick={() => handleDeckCardSelect(index)}>
                  <GameCard card={card} />
                </div>
              ))}
            </div>
          </ScrollArea>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowDeckModal(false)}>关闭</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
