'use client';

import { useState } from 'react';
import { produce } from 'immer';
import { PlayerArea } from './PlayerArea';
import { Button } from '@/components/ui/button';
import { GameCard } from './Card';
import { Swords, Library } from 'lucide-react';
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

  const activePlayer = gameState.players[gameState.activePlayerIndex];
  const opponentPlayer = gameState.players[1 - gameState.activePlayerIndex];
  const isPlayerTurn = gameState.activePlayerIndex === 0;

  const handleCardPlay = (cardIndex: number) => {
    if (!isPlayerTurn || gameState.gamePhase === 'placement') return;

    const card = activePlayer.hand[cardIndex];
    if (card.finalCost > activePlayer.currentMana) {
      toast({
        title: '法力不足',
        description: `你需要 ${card.finalCost} 法力, 但只有 ${activePlayer.currentMana}。`,
        variant: 'destructive',
      });
      return;
    }
    
    setGameState(produce(draft => {
      const player = draft.players[draft.activePlayerIndex];
      player.currentMana -= card.finalCost;
      
      if (card.type === '造物牌') {
        draft.selectedHandCardIndex = cardIndex;
        draft.gamePhase = 'placement';
        toast({ title: '选择一个位置', description: '在你的场上选择一个空的格子来放置该造物。' });
      } else {
        // Spell card
        const [playedCard] = player.hand.splice(cardIndex, 1);
        draft.settlementZone.push({ card: playedCard, playerId: player.id });
      }
    }));
  };
  
  const handleBoardSlotClick = (slotIndex: number) => {
    if (gameState.gamePhase !== 'placement' || gameState.selectedHandCardIndex === null) return;
    
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
    if (!isPlayerTurn) return;

    setGameState(produce(draft => {
      // 1. Combat Phase
      const attacker = draft.players[draft.activePlayerIndex];
      const defender = draft.players[1 - draft.activePlayerIndex];

      attacker.board.forEach((creature, i) => {
        if (creature && creature.canAttack) {
          const opposingCreature = defender.board[i];
          if (opposingCreature) {
            // Creature vs Creature
            opposingCreature.health -= creature.attack;
            creature.health -= opposingCreature.attack;
          } else {
            // Creature vs Player
            defender.health -= creature.attack;
          }
        }
      });
      
      // Remove dead creatures
      attacker.board.forEach((creature, i) => {
        if (creature && creature.health <= 0) {
            attacker.graveyard.push(creature as unknown as CardData);
            attacker.board[i] = null;
        }
      });
      defender.board.forEach((creature, i) => {
        if (creature && creature.health <= 0) {
            defender.graveyard.push(creature as unknown as CardData);
            defender.board[i] = null;
        }
      });


      // 2. Switch Active Player
      draft.activePlayerIndex = 1 - draft.activePlayerIndex;
      const newActivePlayer = draft.players[draft.activePlayerIndex];
      
      // 3. Start of new turn
      draft.turnCount = draft.activePlayerIndex === 0 ? draft.turnCount + 1 : draft.turnCount;
      newActivePlayer.manaCap = Math.min(10, newActivePlayer.manaCap + 1);
      newActivePlayer.currentMana = newActivePlayer.manaCap;
      
      // Wake up creatures
      newActivePlayer.board.forEach(c => {
        if(c) c.canAttack = true;
      });

      // Draw a card
      if (newActivePlayer.deck.length > 0) {
        const drawnCard = newActivePlayer.deck.pop()!;
        newActivePlayer.hand.push(drawnCard);
      } else {
        // Fatigue damage
        newActivePlayer.health -= 1; 
      }
    }));
  };


  return (
    <div className="w-full h-screen flex flex-col bg-transparent text-white p-2">
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
                    gameState.settlementZone.map(({card}, index) => <div className="w-24 h-full"><GameCard key={index} card={card} /></div>)
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
                    key={card.id} 
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
