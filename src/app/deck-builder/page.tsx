'use client';

import { DeckBuilderClient } from '@/components/deck-builder/DeckBuilderClient';
import { initialTerms } from '@/lib/initial-data';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function DeckBuilderPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const enemyId = searchParams.get('enemyId');

  // In a real app, you'd fetch the player's owned terms.
  const ownedTerms = initialTerms;

  const handleStartBattle = (deck: any[]) => {
    // In a real app, you would save the deck and then navigate.
    // For now, we'll just navigate to the battle page.
    if (enemyId) {
      // Here you might want to pass the deck to the battle page,
      // e.g., by storing it in localStorage or a state management library.
      console.log("Deck for battle:", deck);
      router.push(`/battle/${enemyId}`);
    } else {
        // Handle case where there is no enemyId, maybe show a toast
        console.error("No enemy specified for battle.");
    }
  };


  return (
    <div className="container mx-auto py-8 px-4 h-[calc(100vh-10rem)]">
      <div className="text-center mb-8">
        <h1 className="font-headline text-4xl font-bold text-primary">构筑你的牌组</h1>
        {enemyId ? (
            <p className="text-foreground/80 mt-2">准备好对抗 <span className='font-bold text-primary'>{enemyId}</span>。构筑完成后，点击下方的“开始战斗”按钮！</p>
        ) : (
            <p className="text-foreground/80 mt-2">在这里自由练习你的构筑技巧。</p>
        )}
      </div>
      <DeckBuilderClient ownedTerms={ownedTerms} onDeckComplete={handleStartBattle} isBattlePrep={!!enemyId} />
    </div>
  );
}
