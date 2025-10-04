'use client';

import { PlayerArea } from './PlayerArea';

interface GameBoardClientProps {
  matchId: string;
}

export function GameBoardClient({ matchId }: GameBoardClientProps) {
  // This is a placeholder for the full game state logic
  // In a real implementation, this would use `useReducer` or a state management library
  // to manage the entire GameState object.

  return (
    <div className="w-full h-full flex flex-col bg-background/70 backdrop-blur-sm">
      {/* Opponent's Area */}
      <div className="flex-1 border-b-4 border-primary/50">
        <PlayerArea isOpponent={true} />
      </div>

      {/* Center/Environment Area */}
      <div className="h-16 flex items-center justify-center border-b-2 border-dashed border-border">
        <p className="text-muted-foreground font-headline">环境：中立地带</p>
      </div>

      {/* Player's Area */}
      <div className="flex-1">
        <PlayerArea isOpponent={false} />
      </div>
    </div>
  );
}
