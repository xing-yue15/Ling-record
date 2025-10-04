import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart } from 'lucide-react';
import { GameCard } from './Card';
import type { Player } from '@/lib/definitions';
import { ManaIcon } from '@/components/icons/GameIcons';

interface PlayerAreaProps {
  player: Player;
  isOpponent: boolean;
  onBoardClick?: (index: number) => void;
  isPlacing?: boolean;
}

export function PlayerArea({ player, isOpponent, onBoardClick, isPlacing = false }: PlayerAreaProps) {
  return (
    <div className={cn("flex flex-col h-full w-full justify-center")}>
      <div className="flex-grow flex items-center justify-between px-8">
        {/* Player Info */}
        <div className="flex flex-col items-center gap-2 w-24">
            <Avatar className="w-20 h-20 border-4 border-primary/80 shadow-lg">
                <AvatarImage src={`https://picsum.photos/seed/${player.id}/100`} />
                <AvatarFallback>{isOpponent ? 'OP' : 'PL'}</AvatarFallback>
            </Avatar>
            <p className='font-bold text-lg truncate'>{player.name}</p>
            <Card className="p-2 flex items-center gap-2 bg-card/60 w-full justify-center">
                <Heart className="w-5 h-5 text-red-500"/>
                <span className="font-bold text-xl">{player.health}</span>
            </Card>
             <Card className="p-2 flex items-center gap-2 bg-card/60 w-full justify-center">
                <ManaIcon className="w-5 h-5 text-blue-400"/>
                <span className="font-bold text-xl">{player.currentMana}/{player.manaCap}</span>
            </Card>
        </div>

        {/* Creature Slots */}
        <div className="flex gap-4">
            {Array(6).fill(null).map((_, i) => (
                <div 
                    key={i} 
                    className={cn(
                        "w-28 h-40 rounded-lg border-2 border-dashed border-border/30 flex items-center justify-center bg-black/20 transition-colors",
                        !isOpponent && onBoardClick && "cursor-pointer",
                        isPlacing && !player.board[i] && "border-primary/80 bg-primary/20 animate-pulse",
                        player.board[i] && isPlacing && "cursor-not-allowed"
                    )}
                    onClick={() => !isOpponent && onBoardClick?.(i)}
                >
                    {player.board[i] ? <GameCard card={player.board[i]} className="w-full h-full"/> : (
                        isPlacing && <span className='text-primary text-sm'>放置</span>
                    )}
                </div>
            ))}
        </div>

        {/* Spacer */}
        <div className="w-24"></div>
      </div>
    </div>
  );
}
