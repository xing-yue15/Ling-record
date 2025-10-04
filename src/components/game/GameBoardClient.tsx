'use client';

import { useState } from 'react';
import { PlayerArea } from './PlayerArea';
import { Button } from '@/components/ui/button';
import { GameCard } from './Card';
import { Swords, Zap, Skull } from 'lucide-react';
import type { GameState, Card } from '@/lib/definitions';

interface GameBoardClientProps {
  matchId: string;
  initialState: GameState;
}

export function GameBoardClient({ matchId, initialState }: GameBoardClientProps) {
  const [gameState, setGameState] = useState(initialState);
  
  const player = gameState.players[0];
  const opponent = gameState.players[1];

  return (
    <div className="w-full h-full flex flex-col bg-transparent text-white p-4">
      {/* Opponent's Area */}
      <PlayerArea player={opponent} isOpponent={true} />

      {/* Center Action Bar */}
      <div className="flex items-center justify-between h-24 border-y-2 border-primary/20 my-2 px-4">
        <div className="flex flex-col items-center gap-1 text-center">
            <div className="w-24 h-36 border-2 border-dashed border-border/50 rounded-lg flex flex-col justify-center items-center bg-black/30">
                <Skull className="w-8 h-8 text-muted-foreground/50"/>
                <p className="text-xs text-muted-foreground mt-1">结算区</p>
                <p className="font-bold text-lg">{player.graveyard.length}</p>
            </div>
        </div>
        <div className="text-center">
            <p className="font-headline text-2xl">第 {gameState.turnCount} 回合</p>
            <Button className="mt-2" size="lg">结束回合</Button>
        </div>
         <div className="flex flex-col items-center gap-1 text-center">
            <div className="w-24 h-36 border-2 border-primary/50 rounded-lg flex flex-col justify-center items-center bg-black/30 cursor-pointer hover:border-primary">
                <Zap className="w-8 h-8 text-primary/80"/>
                <p className="text-xs text-muted-foreground mt-1">牌库</p>
                <p className="font-bold text-lg">{player.deck.length}</p>
            </div>
        </div>
      </div>
      
      {/* Player's Area */}
      <PlayerArea player={player} isOpponent={false} />
      
       {/* Player's Hand */}
       <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-48 flex justify-center items-end gap-2 pb-4">
            {player.hand.map((card, i) => (
                <div key={card.id} className="w-36 h-52 transition-transform duration-300 hover:-translate-y-8 hover:scale-110 cursor-pointer">
                    <GameCard card={card} />
                </div>
            ))}
        </div>
    </div>
  );
}
