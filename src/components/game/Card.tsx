import type { Card as CardData } from '@/lib/definitions';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { HeartIcon, SwordIcon, ManaIcon } from '@/components/icons/GameIcons';

interface CardProps {
  card: CardData;
  className?: string;
}

export function GameCard({ card, className }: CardProps) {
  const cardImage = PlaceHolderImages.find(p => p.id === card.artId) ?? PlaceHolderImages.find(p => p.id === 'card-art-1');

  return (
    <Card className={cn("w-64 h-96 flex flex-col transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-primary/50 shadow-lg", className)}>
      <CardHeader className="p-2 relative">
        <CardTitle className="font-headline text-lg text-center truncate">{card.name}</CardTitle>
        <div className="absolute top-2 right-2 flex items-center justify-center bg-background/80 rounded-full w-8 h-8 border border-primary">
          <ManaIcon className="w-4 h-4 text-primary" />
          <span className="font-bold text-lg text-primary-foreground ml-1">{card.finalCost}</span>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-grow relative">
        {cardImage && (
          <Image
            src={cardImage.imageUrl}
            alt={cardImage.description}
            width={400}
            height={300}
            className="w-full h-40 object-cover"
            data-ai-hint={cardImage.imageHint}
          />
        )}
        <div className="p-2 h-32 overflow-y-auto">
          <p className="text-sm text-foreground/80">{card.description}</p>
        </div>
      </CardContent>
      <CardFooter className="p-2 flex justify-between items-center border-t mt-auto">
        <span className="font-bold text-sm text-secondary-foreground">{card.type}</span>
        {card.type === '造物牌' && (
          <div className="flex gap-4">
            <div className="flex items-center gap-1">
              <SwordIcon className="w-4 h-4 text-accent" />
              <span className="font-bold text-lg">{card.attack}</span>
            </div>
            <div className="flex items-center gap-1">
              <HeartIcon className="w-4 h-4 text-green-500" />
              <span className="font-bold text-lg">{card.health}</span>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
