'use client';

import { DeckBuilderClient } from '@/components/deck-builder/DeckBuilderClient';
import { initialTerms } from '@/lib/initial-data';
import { useSearchParams } from 'next/navigation';


function DeckBuilderPageContent() {
  // In a real app, you'd fetch the player's owned terms from a database.
  const ownedTerms = initialTerms;

  return (
    <div className="container mx-auto py-8 px-4 h-screen flex flex-col">
      <div className="text-center mb-8 flex-shrink-0">
        <h1 className="font-headline text-4xl font-bold text-primary">构筑牌组</h1>
        <p className="text-foreground/80 mt-2">在这里自由练习并保存你的牌组。</p>
      </div>
      {/* This is the container that caused the issue. It has been removed. */}
      <DeckBuilderClient ownedTerms={ownedTerms} />
    </div>
  );
}


export default function DeckBuilderPage() {
  return (
      <DeckBuilderPageContent />
  );
}
