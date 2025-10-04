'use client';

import { useState, useEffect } from 'react';
import { produce } from 'immer';
import { PlayerArea } from './PlayerArea';
import { Button } from '@/components/ui/button';
import { GameCard } from './Card';
import { Library } from 'lucide-react';
import type { GameState, Card as CardData, Creature } from '@/lib/definitions';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface GameBoardClientProps {
  matchId: string;
  initialState: GameState;
}

export function GameBoardClient({ matchId, initialState }: GameBoardClientProps) {
  const [gameState, setGameState] = useState(initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (gameState.gamePhase === 'placement') {
      toast({ title: '选择一个位置', description: '在你的场上选择一个空的格子来放置该造物。' });
    }
  }, [gameState.gamePhase, toast]);


  const activePlayer = gameState.players[gameState.activePlayerIndex];
  const opponentPlayer = gameState.players[1 - gameState.activePlayerIndex];
  const isPlayerTurn = gameState.activePlayerIndex === 0;

  const handleCardPlay = (cardIndex: number) => {
    if (!isPlayerTurn || gameState.gamePhase !== 'main') return;

    const card = activePlayer.hand[cardIndex];
    
    // Placeholder for cost check
    // In the future, this will check for health cost, discard cost etc.
    const canPlay = true; 

    if (!canPlay) {
      toast({
        title: '无法出牌',
        description: `不满足此牌的打出条件。`,
        variant: 'destructive',
      });
      return;
    }
    
    setGameState(produce(draft => {
      const player = draft.players[draft.activePlayerIndex];
      
      if (card.type === '造物牌') {
        draft.selectedHandCardIndex = cardIndex;
        draft.gamePhase = 'placement';
      } else {
        // Spell card
        const [playedCard] = player.hand.splice(cardIndex, 1);
        draft.settlementZone.push({ card: playedCard, playerId: player.id });
      }
    }));
  };
  
  const handleBoardSlotClick = (slotIndex: number) => {
    if (gameState.gamePhase !== 'placement' || gameState.selectedHandCardIndex === null || !isPlayerTurn) return;
    
    setGameState(produce(draft => {
      const player = draft.players[draft.activePlayerIndex];
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
      draft.gamePhase = 'main';
      draft.selectedHandCardIndex = null;
    }));
  };

  const endTurn = () => {
    if (!isPlayerTurn || gameState.gamePhase === 'placement') return;

    setGameState(produce(draft => {
        
      // --- Simultaneous Resolution Phase (placeholder) ---
      // 1. Sort cards in settlementZone based on priority
      // 2. Resolve card effects sequentially
      draft.settlementZone = [];

      // --- Creature Combat Phase ---
      const attacker = draft.players[draft.activePlayerIndex];
      const defender = draft.players[1 - draft.activePlayerIndex];

      attacker.board.forEach((creature, i) => {
        if (creature && creature.canAttack) {
          // Simplified: attack player directly
          defender.health -= creature.attack;
        }
      });
       defender.board.forEach((creature, i) => {
        if (creature && creature.canAttack) {
          attacker.health -= creature.attack;
        }
      });
      
      // --- End of Turn Phase ---
      if (attacker.health <= 0 || defender.health <= 0) {
          draft.gamePhase = 'end';
          // Handle game over logic
          return;
      }
      
      draft.turnCount += 1;
      
      // Reset per-turn flags for both players
      draft.turnHasSwappedCard = false;

      // Wake up all creatures on the board for the next turn's combat
      draft.players.forEach(p => {
        p.board.forEach(c => {
          if(c) c.canAttack = true;
        });
      })
      
      // Fatigue damage if deck is empty
      draft.players.forEach(p => {
          if (p.deck.length === 0) {
              p.health -= Math.ceil(p.maxHealth * 0.2);
          }
      });
    }));
  };

  return (
    <div className="w-full h-screen flex flex-col bg-transparent text-white p-2 overflow-hidden fixed inset-0">
      {/* Opponent's Area */}
      <div className="flex-1">
        <PlayerArea player={opponentPlayer} isOpponent={true} />
      </div>

      {/* Center Action Bar */}
      <div className="flex items-center justify-between h-28 border-y-2 border-primary/20 my-1 px-4">
        <div className="flex flex-col items-center">
            <Button size="lg" className="w-40 h-16 text-lg font-headline" onClick={endTurn} disabled={!isPlayerTurn || gameState.gamePhase === 'placement'}>结束回合</Button>
        </div>
        
        {/* Settlement Zone */}
        <div className="flex-1 h-full flex items-center justify-center gap-2 px-4">
            <div className="w-full h-full border-x border-dashed border-border/50 rounded-lg flex justify-center items-center bg-black/30 p-2 gap-2">
                 {gameState.settlementZone.length === 0 ? (
                    <p className="text-muted-foreground">结算区</p>
                 ) : (
                    gameState.settlementZone.map(({card}, index) => <div key={index} className="w-24 h-full"><GameCard card={card} /></div>)
                 )}
            </div>
        </div>

        <div className="flex flex-col items-center">
            <Button variant="outline" className="w-40 h-16 flex flex-col gap-1 items-center justify-center text-lg font-headline">
                <div className="flex items-center gap-2">
                    <Library />
                    <span>牌库</span>
                </div>
                <span className="text-xl font-bold">{activePlayer.deck.length}</span>
            </Button>
        </div>
      </div>
      
      {/* Player's Area */}
      <div className="flex-1">
        <PlayerArea 
            player={activePlayer} 
            isOpponent={false} 
            onBoardClick={handleBoardSlotClick} 
            isPlacing={gameState.gamePhase === 'placement'}
        />
      </div>
      
       {/* Player's Hand */}
       <div className="absolute bottom-[-6rem] left-1/2 -translate-x-1/2 w-full max-w-5xl h-56 flex justify-center items-end gap-2 pb-4">
            {activePlayer.hand.map((card, i) => (
                <div 
                    key={card.id + i} 
                    className={cn("w-40 h-56 transition-all duration-300 hover:-translate-y-12 hover:scale-110 relative",
                        isPlayerTurn ? "cursor-pointer" : "cursor-not-allowed",
                        gameState.selectedHandCardIndex === i && "border-4 border-primary rounded-lg -translate-y-6 scale-105"
                    )}
                    style={{ 
                        transform: `translateX(${(i - activePlayer.hand.length/2) * 25}px) rotate(${(i - activePlayer.hand.length/2) * 3}deg)`,
                        transformOrigin: 'bottom center',
                    }}
                    onClick={() => handleCardPlay(i)}
                >
                    <GameCard card={card} inHand={true} />
                </div>
            ))}
        </div>
    </div>
  );
}