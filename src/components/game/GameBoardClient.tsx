'use client';

import { useState } from 'react';
import { PlayerArea } from './PlayerArea';
import { Button } from '@/components/ui/button';
import { GameCard } from './Card';
import { Swords, Library } from 'lucide-react';
import type { GameState } from '@/lib/definitions';
import { cn } from '@/lib/utils';

interface GameBoardClientProps {
  matchId: string;
  initialState: GameState;
}

export function GameBoardClient({ matchId, initialState }: GameBoardClientProps) {
  const [gameState, setGameState] = useState(initialState);
  
  const player = gameState.players[0];
  const opponent = gameState.players[1];

  return (
    <div className="w-full h-full flex flex-col bg-transparent text-white p-2">
      {/* Opponent's Area */}
      <div className="flex-1">
        <PlayerArea player={opponent} isOpponent={true} />
      </div>

      {/* Center Action Bar */}
      <div className="flex items-center justify-between h-28 border-y-2 border-primary/20 my-1 px-4">
        <div className="flex flex-col items-center">
            <Button size="lg" className="w-40 h-16 text-lg font-headline">结束回合</Button>
        </div>
        
        {/* Settlement Zone */}
        <div className="flex-1 h-full flex items-center justify-center gap-2 px-4">
            <div className="w-full h-full border-x border-dashed border-border/50 rounded-lg flex justify-center items-center bg-black/30 p-2">
                 <p className="text-muted-foreground">结算区</p>
                 {/* TODO: Render settlement zone cards based on priority */}
            </div>
        </div>

        <div className="flex flex-col items-center">
            <Button variant="outline" className="w-40 h-16 flex flex-col gap-1 items-center justify-center text-lg font-headline">
                <div className="flex items-center gap-2">
                    <Library />
                    <span>牌库</span>
                </div>
                <span className="text-xl font-bold">{player.deck.length}</span>
            </Button>
        </div>
      </div>
      
      {/* Player's Area */}
      <div className="flex-1 -mt-8">
        <PlayerArea player={player} isOpponent={false} />
      </div>
      
       {/* Player's Hand */}
       <div className="absolute bottom-[-6rem] left-1/2 -translate-x-1/2 w-full max-w-5xl h-56 flex justify-center items-end gap-2 pb-4">
            {player.hand.map((card, i) => (
                <div 
                    key={card.id} 
                    className="w-40 h-56 transition-transform duration-300 hover:-translate-y-12 hover:scale-110 cursor-pointer relative"
                    style={{ 
                        transform: `translateX(${(i - player.hand.length/2) * 25}px) rotate(${(i - player.hand.length/2) * 3}deg)`,
                        transformOrigin: 'bottom center',
                    }}
                >
                    <GameCard card={card} inHand={true} />
                </div>
            ))}
        </div>
    </div>
  );
}
