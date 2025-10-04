import { DeckBuilderClient } from '@/components/deck-builder/DeckBuilderClient';
import { initialTerms } from '@/lib/initial-data';

export default function DeckBuilderPage() {
  // In a real app, you'd fetch the player's owned terms.
  const ownedTerms = initialTerms;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="font-headline text-4xl font-bold text-primary">卡牌创造者</h1>
        <p className="text-foreground/80 mt-2">组合词条，为你的牌组锻造强大的新卡牌。</p>
      </div>
      <DeckBuilderClient ownedTerms={ownedTerms} />
    </div>
  );
}
