import type { Card as CardData, Creature } from '@/lib/definitions';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HeartIcon, SwordIcon, ManaIcon } from '@/components/icons/GameIcons';

interface CardProps {
  card: CardData | Creature;
  className?: string;
  inHand?: boolean; 
}

function CardContentLayout({ card, isCreatureInstance, cardData }: { card: CardData | Creature, isCreatureInstance: boolean, cardData: CardData }) {
  return (
    <Card className={cn(
      "w-full h-full flex flex-col transition-transform duration-300 ease-in-out hover:shadow-primary/50 shadow-lg bg-card/80 backdrop-blur-sm",
      isCreatureInstance && 'w-28 h-40',
    )}>
      <CardHeader className="p-2 relative">
        <CardTitle className={cn("font-headline text-center truncate", isCreatureInstance ? "text-xs" : "text-base")}>{card.name}</CardTitle>
        {!isCreatureInstance && (
          <div className="absolute top-1 right-1 flex items-center justify-center bg-primary/90 rounded-full w-8 h-8 border border-sky-300 shadow-lg">
            <ManaIcon className="w-4 h-4 text-white" />
            <span className="font-bold text-lg text-white ml-0.5">{cardData.finalCost}</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-2 flex-grow relative flex items-center justify-center text-center">
        <p className={cn(isCreatureInstance ? 'text-[10px]' : 'text-xs', 'text-muted-foreground')}>
          {cardData.description}
        </p>
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


export function GameCard({ card, className, inHand = false }: CardProps) {
  const isCreatureInstance = 'maxHealth' in card;
  const cardData = isCreatureInstance ? { ...card, finalCost: 0, description: '', terms: [] } as CardData : card as CardData;

  const cardElement = (
     <div className={cn("w-full h-full", className)}>
        <CardContentLayout
          card={card}
          isCreatureInstance={isCreatureInstance}
          cardData={cardData}
        />
     </div>
  )

  if (inHand && !isCreatureInstance) {
    return (
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            {cardElement}
          </TooltipTrigger>
          <TooltipContent side="top" align="center" className="max-w-xs z-50">
             <p className="font-bold text-base">{card.name}</p>
             <p>{cardData.description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return cardElement;
}
