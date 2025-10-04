
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Swords, PlusCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Placeholder data for saved decks. In a real app, this would come from a user's data store.
const savedDecks = [
  { id: 'deck1', name: '火焰冲击流', cardCount: 20, description: '专注于直接伤害法术。' },
  { id: 'deck2', name: '生物铺场流', cardCount: 20, description: '快速召唤大量低成本生物压制对手。' },
  { id: 'deck3', name: '控制防守流', cardCount: 20, description: '通过治疗和防御性卡牌耗尽对手资源。' },
];

export default function DeckSelectionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const enemyId = searchParams.get('enemyId');
  const [selectedDeck, setSelectedDeck] = useState<string | null>(null);

  const handleStartBattle = () => {
    if (selectedDeck && enemyId) {
      // In a real app, you'd pass the deck ID or contents to the battle page.
      // For now, we just navigate.
      router.push(`/battle/${enemyId}?deckId=${selectedDeck}`);
    }
  };

  if (!enemyId) {
    return (
        <div className="container mx-auto py-8 px-4 text-center">
            <h1 className="text-2xl font-bold text-destructive">错误</h1>
            <p className="text-muted-foreground mt-2">没有指定战斗的敌人。</p>
            <Button asChild className="mt-4">
                <Link href="/worlds">返回世界选择</Link>
            </Button>
        </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 h-screen flex flex-col">
       <header className="flex items-center justify-start mb-12">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/adventure/magic-world`}>
            <ArrowLeft />
          </Link>
        </Button>
      </header>

      <main className="flex-grow">
        <div className="text-center mb-12">
            <h1 className="font-headline text-4xl font-bold text-primary">选择你的卡组</h1>
            <p className="text-foreground/80 mt-2">为对抗 <span className="font-bold text-primary">{enemyId}</span> 选择一套牌组。</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {savedDecks.map(deck => (
            <Card
                key={deck.id}
                className={cn(
                "cursor-pointer transition-all duration-200 border-2",
                selectedDeck === deck.id
                    ? 'border-primary shadow-lg shadow-primary/30'
                    : 'border-transparent hover:border-primary/50'
                )}
                onClick={() => setSelectedDeck(deck.id)}
            >
                <CardHeader>
                <CardTitle className="font-headline">{deck.name}</CardTitle>
                </CardHeader>
                <CardContent>
                <p className="text-sm text-muted-foreground">{deck.description}</p>
                <p className="text-sm font-bold mt-4">{deck.cardCount} 张卡牌</p>
                </CardContent>
            </Card>
            ))}
            <Link href="/deck-builder" passHref>
                <Card className="h-full flex flex-col items-center justify-center cursor-pointer transition-colors border-2 border-dashed hover:border-primary/80 hover:bg-primary/10">
                    <CardContent className="text-center p-6">
                        <PlusCircle className="mx-auto h-12 w-12 text-muted-foreground"/>
                        <p className="mt-4 font-semibold">创建新卡组</p>
                    </CardContent>
                </Card>
            </Link>
        </div>
      </main>

       <footer className="py-8 flex justify-center">
          <Button 
            size="lg" 
            className="font-headline text-lg" 
            onClick={handleStartBattle}
            disabled={!selectedDeck}
          >
            <Swords className="mr-2"/>
            开始战斗
          </Button>
        </footer>
    </div>
  );
}
