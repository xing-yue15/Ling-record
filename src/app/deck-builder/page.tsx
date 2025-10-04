'use client';

import { DeckBuilderClient } from '@/components/deck-builder/DeckBuilderClient';
import { initialTerms } from '@/lib/initial-data';
import { useSearchParams } from 'next/navigation';

export default function DeckBuilderPage() {
  const searchParams = useSearchParams();
  const enemyId = searchParams.get('enemyId');

  // In a real app, you'd fetch the player's owned terms from a database.
  const ownedTerms = initialTerms;

  return (
    <div className="container mx-auto py-8 px-4 h-screen">
      <div className="text-center mb-8">
        <h1 className="font-headline text-4xl font-bold text-primary">构筑牌组</h1>
        <p className="text-foreground/80 mt-2">在这里自由练习并保存你的牌组。</p>
      </div>
      <DeckBuilderClient ownedTerms={ownedTerms} />
    </div>
  );
}
