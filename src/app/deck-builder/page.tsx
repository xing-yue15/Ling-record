'use client';

import { DeckBuilderClient } from '@/components/deck-builder/DeckBuilderClient';
import { initialTerms } from '@/lib/initial-data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function DeckBuilderPage() {
  // In a real app, you'd fetch the player's owned terms from a database.
  const ownedTerms = initialTerms;

  return (
    <div className="h-screen flex flex-col">
      <header className="flex-shrink-0 text-center py-4 px-4">
        <h1 className="font-headline text-4xl font-bold text-primary">构筑牌组</h1>
        <p className="text-foreground/80 mt-2">在这里自由练习并保存你的牌组</p>
      </header>
      
      <main className="flex-grow min-h-0 px-4 pb-4">
          <DeckBuilderClient ownedTerms={ownedTerms} />
      </main>
    </div>
  );
}


export default DeckBuilderPage;
