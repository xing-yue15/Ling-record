import type { Card as CardData, Creature } from '@/lib/definitions';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { HeartIcon, SwordIcon, ManaIcon } from '@/components/icons/GameIcons';

interface CardProps {
  card: CardData | Creature;
  className?: string;
}

export function GameCard({ card, className }: CardProps) {
  const isCreatureInstance = 'maxHealth' in card;
  const cardData = card as CardData;
  const creatureData = card as Creature;

  const artId = isCreatureInstance ? (PlaceHolderImages.find(p => p.id.includes('creature'))?.id ?? 'card-art-1') : cardData.artId;
  const cardImage = PlaceHolderImages.find(p => p.id === artId) ?? PlaceHolderImages.find(p => p.id === 'card-art-1');

  return (
    <Card className={cn(
      "w-full h-full flex flex-col transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-primary/50 shadow-lg bg-card/80 backdrop-blur-sm",
      isCreatureInstance && 'w-28 h-40',
      className
    )}>
      <CardHeader className="p-2 relative">
        <CardTitle className={cn("font-headline text-center truncate", isCreatureInstance ? "text-xs" : "text-lg")}>{card.name}</CardTitle>
        {!isCreatureInstance && (
          <div className="absolute top-1 right-1 flex items-center justify-center bg-background/80 rounded-full w-7 h-7 border border-primary">
            <ManaIcon className="w-3 h-3 text-primary" />
            <span className="font-bold text-base text-primary-foreground ml-0.5">{cardData.finalCost}</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-0 flex-grow relative">
        {cardImage && (
          <Image
            src={cardImage.imageUrl}
            alt={cardImage.description}
            width={isCreatureInstance ? 100 : 400}
            height={isCreatureInstance ? 80 : 300}
            className={cn("w-full object-cover", isCreatureInstance ? "h-16" : "h-40")}
            data-ai-hint={cardImage.imageHint}
          />
        )}
        {!isCreatureInstance && (
          <div className={cn("overflow-y-auto p-2", isCreatureInstance ? "h-12 text-[10px]" : "h-32 text-sm")}>
            <p className="text-foreground/80">{cardData.description}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-2 flex justify-between items-center border-t mt-auto">
        {!isCreatureInstance && <span className="font-bold text-sm text-secondary-foreground">{cardData.type}</span>}
        {(card.type === '造物牌' || isCreatureInstance) && (
          <div className={cn("flex w-full justify-around", isCreatureInstance ? "gap-1" : "gap-4")}>
            <div className="flex items-center gap-1">
              <SwordIcon className={cn("text-accent", isCreatureInstance ? "w-3 h-3" : "w-4 h-4")} />
              <span className={cn("font-bold", isCreatureInstance ? "text-sm" : "text-lg")}>{card.attack}</span>
            </div>
            <div className="flex items-center gap-1">
              <HeartIcon className={cn("text-green-500", isCreatureInstance ? "w-3 h-3" : "w-4 h-4")} />
              <span className={cn("font-bold", isCreatureInstance ? "text-sm" : "text-lg")}>{card.health}</span>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
