import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { HeartIcon, Swords } from 'lucide-react';
import { GameCard } from './Card';
import { initialTerms } from '@/lib/initial-data';
import type { Card as CardData} from '@/lib/definitions';

interface PlayerAreaProps {
  isOpponent: boolean;
}

const placeholderCard: CardData = {
    id: "placeholder",
    name: "Ancient Tome",
    terms: [initialTerms[0]],
    finalCost: 3,
    type: "法术牌",
    description: "A placeholder card from a forgotten era.",
    artId: 'card-art-1'
};

const placeholderCreature: CardData = {
    ...placeholderCard,
    id: 'placeholder-creature',
    type: '造物牌',
    attack: 2,
    health: 3
}


export function PlayerArea({ isOpponent }: PlayerAreaProps) {
  const hand = isOpponent ? Array(5).fill(placeholderCard) : Array(6).fill(placeholderCard);
  const board = isOpponent ? Array(2).fill(placeholderCreature) : Array(3).fill(placeholderCreature);

  return (
    <div className={cn("flex flex-col h-full w-full", isOpponent ? 'flex-col-reverse' : 'flex-col')}>
      {/* Hand */}
      <div className="flex justify-center items-center h-48 px-4">
        <div className="flex gap-2">
            {hand.map((card, i) => (
                <div key={i} className={cn("transition-transform duration-300 hover:-translate-y-4", { "bg-secondary rounded-lg": isOpponent })}>
                    {isOpponent ?
                        <Card className="w-24 h-36 flex items-center justify-center bg-card/80 border-primary">
                            <Swords className="w-8 h-8 text-primary/50"/>
                        </Card>
                        :
                        <GameCard card={card} className="w-28 h-40"/>
                    }
                </div>
            ))}
        </div>
      </div>
      
      {/* Board */}
      <div className="flex-grow flex items-center justify-between px-8">
        {/* Player Info */}
        <div className="flex flex-col items-center gap-2">
            <Avatar className="w-16 h-16 border-2 border-primary">
                <AvatarImage src={`https://picsum.photos/seed/${isOpponent ? 'opponent' : 'player'}/100`} />
                <AvatarFallback>{isOpponent ? 'OP' : 'PL'}</AvatarFallback>
            </Avatar>
            <Card className="p-2 flex items-center gap-2 bg-card/80">
                <HeartIcon className="w-5 h-5 text-red-500"/>
                <span className="font-bold text-xl">30</span>
            </Card>
        </div>

        {/* Creature Slots */}
        <div className="flex gap-4">
            {Array(6).fill(null).map((_, i) => (
                <div key={i} className="w-28 h-40 rounded-lg border-2 border-dashed border-border/50 flex items-center justify-center bg-black/20">
                    {board[i] && <GameCard card={board[i]} className="w-full h-full"/>}
                </div>
            ))}
        </div>

        {/* Deck/Graveyard Info */}
        <div className="flex flex-col gap-4">
            <Card className="w-24 h-36 flex flex-col items-center justify-center p-2 bg-card/80">
                <Swords className="w-8 h-8 text-primary"/>
                <p className="font-bold mt-1">Deck</p>
                <p className="text-xl font-bold">24</p>
            </Card>
        </div>
      </div>
    </div>
  );
}
