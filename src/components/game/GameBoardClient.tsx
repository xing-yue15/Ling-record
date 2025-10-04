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

  // AI Logic
  useEffect(() => {
    if (!isPlayerTurn && gameState.gamePhase === 'main' && !gameState.winner) {
      const aiPlayer = gameState.players[1];
      if (aiPlayer.playedCardThisTurn) {
        // AI already played, end its turn
        setTimeout(endTurn, 1000);
        return;
      };

      // Simple AI: play the first possible card
      const cardToPlayIndex = aiPlayer.hand.findIndex(card => true); // In a real game, check cost
      
      if (cardToPlayIndex > -1) {
        const card = aiPlayer.hand[cardToPlayIndex];
        // Simulate playing a card to the settlement zone
        setTimeout(() => {
           setGameState(produce(draft => {
            const [playedCard] = draft.players[1].hand.splice(cardToPlayIndex, 1);
            draft.settlementZone.push({ card: playedCard, playerId: 'opponent' });
            draft.players[1].playedCardThisTurn = true;
          }));
        }, 1000);
      } else {
         // No card to play, end turn
        setTimeout(endTurn, 1000);
      }
    }
  }, [gameState.activePlayerIndex, gameState.gamePhase, gameState.winner, isPlayerTurn]);
  
  useEffect(() => {
    let toastMessage = '';
    if (!isPlayerTurn) return;

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
  }, [gameState.gamePhase, toast, isPlayerTurn]);

  const handlePlayCard = (cardIndex: number) => {
    if (!isPlayerTurn || (gameState.gamePhase !== 'main' && gameState.gamePhase !== 'selectingTarget')) {
      return;
    }
    
    // Cancel selection if clicking the same card
    if (gameState.selectedHandCardIndex === cardIndex) {
      setGameState(produce(draft => {
        draft.selectedHandCardIndex = null;
        draft.gamePhase = 'main';
      }));
      return;
    }

    if (activePlayer.playedCardThisTurn && gameState.gamePhase === 'main') {
        toast({title: "本回合已出过牌", description: "每回合只能出一张牌。", variant: 'destructive'});
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
        draft.gamePhase = 'selectingTarget';
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

  const handleTargetClick = (target: {type: 'player' | 'creature', playerIndex: number, slotIndex?: number}) => {
     if (gameState.gamePhase !== 'selectingTarget' || gameState.selectedHandCardIndex === null || !isPlayerTurn) return;

     setGameState(produce(draft => {
        const player = draft.players[draft.activePlayerIndex];
        const cardIndex = draft.selectedHandCardIndex!;
        const [card] = player.hand.splice(cardIndex, 1);
        
        draft.settlementZone.push({ card, playerId: player.id, target });

        player.playedCardThisTurn = true;
        draft.gamePhase = 'main';
        draft.selectedHandCardIndex = null;
     }));
  }

  const endTurn = () => {
    if (!isPlayerTurn && gameState.activePlayerIndex !== 1) return; // Prevent multiple calls
    if (isPlayerTurn && gameState.gamePhase !== 'main') return;

    setGameState(produce(draft => {
      // --- Resolution Phase ---
      // For now, just clear the zone. A real implementation would sort and resolve effects.
      draft.settlementZone = [];

      // --- Combat Phase ---
      for (let i = 0; i < 6; i++) {
        const p1Creature = draft.players[0].board[i];
        const p2Creature = draft.players[1].board[i];

        if (p1Creature && p1Creature.canAttack) {
          const target = p2Creature ? p2Creature : draft.players[1];
          target.health -= p1Creature.attack;
        }
        if (p2Creature && p2Creature.canAttack) {
          const target = p1Creature ? p1Creature : draft.players[0];
          target.health -= p2Creature.attack;
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
      const previousPlayer = draft.players[draft.activePlayerIndex];
      previousPlayer.board.forEach(c => {
        if(c) c.canAttack = true; // Wake up creatures
      });

      // Switch active player
      draft.activePlayerIndex = 1 - draft.activePlayerIndex;
      const newActivePlayer = draft.players[draft.activePlayerIndex];
      
      // New turn preparations for the new active player
      newActivePlayer.playedCardThisTurn = false;
      newActivePlayer.turnHasSwappedCard = false;
      
      // Fatigue damage
      if (newActivePlayer.deck.length === 0) {
          newActivePlayer.health -= Math.ceil(newActivePlayer.maxHealth * 0.2);
          if (newActivePlayer.health <= 0) {
            draft.winner = draft.players[1 - draft.activePlayerIndex];
            draft.gamePhase = 'end';
            return;
          }
      } else {
        // Draw a card
        const [drawnCard] = newActivePlayer.deck.splice(0,1);
        if (drawnCard) {
            newActivePlayer.hand.push(drawnCard);
        }
      }

      if (draft.activePlayerIndex === 0) {
        draft.turnCount += 1;
      }
    }));
  };

  const handleDeckCardSelect = (deckCardIndex: number) => {
    setShowDeckModal(false);

    setGameState(produce(draft => {
        const player = draft.players[draft.activePlayerIndex];
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
    if (gameState.gamePhase !== 'selectingHandCard' || gameState.selectedDeckCardIndex === null || activePlayer.turnHasSwappedCard) return;

    setGameState(produce(draft => {
        const player = draft.players[draft.activePlayerIndex];
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
          <PlayerArea 
            player={opponentPlayer} 
            isOpponent={true} 
            onBoardClick={slotIndex => handleTargetClick({ type: 'creature', playerIndex: 1, slotIndex })}
            onPlayerClick={() => handleTargetClick({ type: 'player', playerIndex: 1})}
            isTargeting={gameState.gamePhase === 'selectingTarget'}
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
              onPlayerClick={() => handleTargetClick({ type: 'player', playerIndex: 0 })}
              isPlacing={gameState.gamePhase === 'selectingBoardSlot'}
              isTargeting={gameState.gamePhase === 'selectingTarget'}
          />
        </div>
        
        {/* Player's Hand */}
        <div className="absolute bottom-[-6rem] left-1/2 -translate-x-1/2 w-full max-w-5xl h-56 flex justify-center items-end gap-2 pb-4">
          {activePlayer.hand.map((card, i) => (
              <div 
                  key={card.id + i} 
                  className={cn("w-40 h-56 transition-all duration-300 hover:-translate-y-12 hover:scale-110 relative",
                      (isPlayerTurn && (gameState.gamePhase === 'main' || gameState.gamePhase === 'selectingHandCard' || gameState.gamePhase === 'selectingTarget')) ? "cursor-pointer" : "cursor-not-allowed",
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
            <AlertDialogTitle>检视牌库</AlertDialogTitle>
            <AlertDialogDescription>
              {activePlayer.hand.length < 6 ? "你的手牌未满，选择一张卡牌直接加入手牌。" : "选择一张卡牌与你的手牌交换。"}
              每回合只有一次机会。
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

    