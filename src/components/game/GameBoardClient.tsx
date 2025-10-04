'use client';

import { useState, useEffect } from 'react';
import { produce } from 'immer';
import { PlayerArea } from './PlayerArea';
import { Button } from '@/components/ui/button';
import { GameCard } from './Card';
import { Library, Swords } from 'lucide-react';
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
  initialState: GameState;
}

export function GameBoardClient({ matchId, initialState }: GameBoardClientProps) {
  const [gameState, setGameState] = useState(initialState);
  const [showDeckModal, setShowDeckModal] = useState(false);
  const { toast } = useToast();

  const activePlayer = gameState.players[gameState.activePlayerIndex];
  const opponentPlayer = gameState.players[1 - gameState.activePlayerIndex];
  const isPlayerTurn = gameState.activePlayerIndex === 0;

  useEffect(() => {
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
      toast({ title: toastMessage });
    }
  }, [gameState.gamePhase, toast]);

  const handlePlayCard = (cardIndex: number) => {
    if (!isPlayerTurn || gameState.gamePhase !== 'main' || activePlayer.playedCardThisTurn) {
        if(activePlayer.playedCardThisTurn) {
            toast({title: "本回合已出过牌", description: "每回合只能出一张牌。", variant: 'destructive'});
        }
      return;
    }

    const card = activePlayer.hand[cardIndex];
    
    // In a real implementation, you'd check costs like discard, health etc.
    const canPlay = true;

    if (!canPlay) {
      toast({ title: '无法出牌', description: `不满足此牌的打出条件。`, variant: 'destructive' });
      return;
    }
    
    setGameState(produce(draft => {
      draft.selectedHandCardIndex = cardIndex;
      if (card.type === '造物牌') {
        draft.gamePhase = 'selectingBoardSlot';
      } else { // Spell card
        // For simplicity, spell auto-targets opponent player.
        // A full implementation would set phase to 'selectingTarget'
        const player = draft.players[draft.activePlayerIndex];
        const [playedCard] = player.hand.splice(cardIndex, 1);
        draft.settlementZone.push({ card: playedCard, playerId: player.id });
        player.playedCardThisTurn = true;
        draft.selectedHandCardIndex = null;
      }
    }));
  };

  const handleBoardSlotClick = (slotIndex: number) => {
    if (gameState.gamePhase !== 'selectingBoardSlot' || gameState.selectedHandCardIndex === null || !isPlayerTurn) return;

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
      draft.settlementZone.push({ card, playerId: player.id });
      
      player.playedCardThisTurn = true;
      draft.gamePhase = 'main';
      draft.selectedHandCardIndex = null;
    }));
  };

  const endTurn = () => {
    if (!isPlayerTurn || (gameState.gamePhase !== 'main' && gameState.gamePhase !== 'resolution' && gameState.gamePhase !== 'combat' )) return;

    setGameState(produce(draft => {
      // --- Resolution Phase ---
      // For now, just clear the zone. A real implementation would sort and resolve effects.
      draft.settlementZone = [];

      // --- Combat Phase ---
      for (let i = 0; i < 6; i++) {
        const p1Creature = draft.players[0].board[i];
        const p2Creature = draft.players[1].board[i];

        if (p1Creature && p1Creature.canAttack) {
          if (p2Creature) {
            p2Creature.health -= p1Creature.attack;
          } else {
            draft.players[1].health -= p1Creature.attack;
          }
        }
        if (p2Creature && p2Creature.canAttack) {
          if (p1Creature) {
            p1Creature.health -= p2Creature.attack;
          } else {
            draft.players[0].health -= p2Creature.attack;
          }
        }
      }
      
      // Remove dead creatures
      draft.players.forEach(player => {
        for(let i=0; i < player.board.length; i++) {
            if(player.board[i] && player.board[i]!.health <= 0) {
                player.graveyard.push(player.board[i]! as unknown as CardData); // A bit of a type cheat
                player.board[i] = null;
            }
        }
      });


      // --- End of Turn Phase ---
      // Check for game over
      if (draft.players[0].health <= 0) {
        draft.winner = draft.players[1];
        draft.gamePhase = 'end';
        return;
      }
      if (draft.players[1].health <= 0) {
        draft.winner = draft.players[0];
        draft.gamePhase = 'end';
        return;
      }
      
      draft.turnCount += 1;
      
      // Reset per-turn flags and wake up creatures for both players
      draft.players.forEach(p => {
        p.playedCardThisTurn = false;
        p.turnHasSwappedCard = false;
        p.board.forEach(c => {
          if(c) c.canAttack = true;
        });
      });
      
      // Fatigue damage
      draft.players.forEach(p => {
          if (p.deck.length === 0) {
              p.health -= Math.ceil(p.maxHealth * 0.2);
          }
      });
    }));
  };

  const handleDeckCardSelect = (deckCardIndex: number) => {
    setGameState(produce(draft => {
      draft.selectedDeckCardIndex = deckCardIndex;
      draft.gamePhase = 'selectingHandCard';
    }));
    setShowDeckModal(false);
    toast({title: "选择一张手牌", description: "选择一张手牌与牌库中的卡牌交换。"});
  };

  const handleHandCardSwap = (handCardIndex: number) => {
    if (gameState.gamePhase !== 'selectingHandCard' || gameState.selectedDeckCardIndex === null || activePlayer.turnHasSwappedCard) return;

    setGameState(produce(draft => {
        const player = draft.players[draft.activePlayerIndex];
        const deckIndex = draft.selectedDeckCardIndex!;

        // Swap
        const handCard = player.hand[handCardIndex];
        const deckCard = player.deck[deckIndex];
        player.hand[handCardIndex] = deckCard;
        player.deck[deckIndex] = handCard;
        
        // Reset state
        player.turnHasSwappedCard = true;
        draft.gamePhase = 'main';
        draft.selectedDeckCardIndex = null;
        draft.selectedHandCardIndex = null;
    }));
  };

  if (gameState.winner) {
    return (
        <AlertDialog open={true}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{gameState.winner.id === 'player' ? "你胜利了！" : "你失败了"}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {gameState.winner.id === 'player' ? "你击败了 " + opponentPlayer.name : "你被 " + gameState.winner.name + " 击败了。"}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={() => window.location.href = '/adventure'}>返回冒险</AlertDialogAction>
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
          <PlayerArea player={opponentPlayer} isOpponent={true} />
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
                onClick={() => !activePlayer.turnHasSwappedCard && setShowDeckModal(true)}
                disabled={!isPlayerTurn || activePlayer.turnHasSwappedCard}
              >
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
              isPlacing={gameState.gamePhase === 'selectingBoardSlot'}
          />
        </div>
        
        {/* Player's Hand */}
        <div className="absolute bottom-[-6rem] left-1/2 -translate-x-1/2 w-full max-w-5xl h-56 flex justify-center items-end gap-2 pb-4">
          {activePlayer.hand.map((card, i) => (
              <div 
                  key={card.id + i} 
                  className={cn("w-40 h-56 transition-all duration-300 hover:-translate-y-12 hover:scale-110 relative",
                      (isPlayerTurn && (gameState.gamePhase === 'main' || gameState.gamePhase === 'selectingHandCard')) ? "cursor-pointer" : "cursor-not-allowed",
                      gameState.selectedHandCardIndex === i && "border-4 border-primary rounded-lg -translate-y-6 scale-105"
                  )}
                  style={{ 
                      transform: `translateX(${(i - activePlayer.hand.length/2) * 25}px) rotate(${(i - activePlayer.hand.length/2) * 3}deg)`,
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
            <AlertDialogTitle>选择卡牌</AlertDialogTitle>
            <AlertDialogDescription>
              选择一张卡牌加入你的手牌或与手牌交换。每回合只有一次机会。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <ScrollArea className="h-full">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
              {activePlayer.deck.map((card, index) => (
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
