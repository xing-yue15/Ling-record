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
  inHand?: boolean; // Add a prop to indicate if the card is in the player's hand
}

function CardContentLayout({ card, isCreatureInstance, cardData, cardImage }: { card: CardData | Creature, isCreatureInstance: boolean, cardData: CardData, cardImage: any }) {
  return (
    <Card className={cn(
      "w-full h-full flex flex-col transition-transform duration-300 ease-in-out hover:shadow-primary/50 shadow-lg bg-card/80 backdrop-blur-sm",
      isCreatureInstance && 'w-28 h-40',
    )}>
      <CardHeader className="p-2 relative">
        <CardTitle className={cn("font-headline text-center truncate", isCreatureInstance ? "text-xs" : "text-base")}>{card.name}</CardTitle>
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
            alt={card.name}
            width={isCreatureInstance ? 100 : 400}
            height={isCreatureInstance ? 80 : 300}
            className={cn("w-full object-cover", isCreatureInstance ? "h-16" : "h-32")}
            data-ai-hint={cardImage.imageHint}
          />
        )}
        <div className={cn(
          "absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent",
          isCreatureInstance ? "text-[10px] h-10" : "text-xs h-16"
        )}>
          {/* Description is now in the tooltip for hand cards */}
        </div>
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
  const cardData = card as CardData;

  const artId = isCreatureInstance ? (card as Creature).cardId : cardData.artId;
  const cardImage = PlaceHolderImages.find(p => p.id === artId) ?? PlaceHolderImages.find(p => p.id === 'card-art-1');

  const cardElement = (
     <div className={cn("w-full h-full", className)}>
        <CardContentLayout
          card={card}
          isCreatureInstance={isCreatureInstance}
          cardData={cardData}
          cardImage={cardImage}
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
