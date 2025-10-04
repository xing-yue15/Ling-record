import { DeckBuilderClient } from '@/components/deck-builder/DeckBuilderClient';
import { initialTerms } from '@/lib/initial-data';

export default function DeckBuilderPage() {
  // In a real app, you'd fetch the player's owned terms.
  const ownedTerms = initialTerms;

  return (
    <div className="container mx-auto py-8 px-4">
      <DeckBuilderClient ownedTerms={ownedTerms} />
    </div>
  );
}
