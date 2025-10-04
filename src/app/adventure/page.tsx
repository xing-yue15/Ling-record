'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const worlds = [
  { 
    id: 'magic-world', 
    name: '魔幻世界',
    description: '一个充满魔法与奇异生物的国度。',
    available: true,
  },
  {
    id: 'sci-fi-world',
    name: '银河废墟',
    description: '敬请期待...',
    available: false,
  },
  {
    id: 'wuxia-world',
    name: '武林江湖',
    description: '敬请期待...',
    available: false,
  },
  {
    id: 'cthulhu-world',
    name: '深渊梦境',
    description: '敬请期待...',
    available: false,
  },
];

const enemies = [
  { id: 'goblin-artificer', name: '哥布林工匠', description: '一个狡猾的哥布林，擅长制造爆炸装置。', difficulty: '简单', artId: 'enemy-goblin' },
  { id: 'stone-guardian', name: '石头守卫', description: '一个保护古代遗迹的巨大魔像。行动缓慢但异常坚固。', difficulty: '中等', artId: 'enemy-golem' },
  { id: 'shadow-specter', name: '暗影幽灵', description: '一个可怕的怨灵，能够吸取生命并散播恐惧。', difficulty: '困难', artId: 'enemy-specter' },
];

export default function AdventurePage() {
  const [selectedWorldId, setSelectedWorldId] = useState<string | null>(null);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="font-headline text-4xl font-bold text-primary">冒险在等待</h1>
        <p className="text-foreground/80 mt-2">下一个要探索的世界是？</p>
      </div>

      {/* Worlds scroller */}
      <div className="relative mb-12">
        <div className="overflow-x-auto pb-4 -mb-4">
            <div className="flex w-max mx-auto space-x-4 px-4">
                {worlds.map(world => (
                    <Card 
                        key={world.id}
                        onClick={() => setSelectedWorldId(world.id)}
                        className={cn(
                            "w-64 cursor-pointer transition-all duration-300 hover:shadow-primary/40 hover:-translate-y-1",
                            selectedWorldId === world.id ? 'border-primary shadow-primary/30' : 'border-border',
                            !world.available && 'bg-muted/50 cursor-not-allowed opacity-60 hover:shadow-none hover:translate-y-0'
                        )}
                    >
                        <CardHeader>
                            <CardTitle className="font-headline">{world.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{world.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
      </div>

      {/* Enemies List */}
      {selectedWorldId === 'magic-world' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in-50 duration-500">
          {enemies.map(enemy => {
            const enemyImage = PlaceHolderImages.find(p => p.id === enemy.artId);
            return (
              <Card key={enemy.id} className="flex flex-col bg-card/50">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">{enemy.name}</CardTitle>
                  <CardDescription>{enemy.difficulty}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  {enemyImage && (
                    <Image
                      src={enemyImage.imageUrl}
                      alt={enemyImage.description}
                      width={400}
                      height={300}
                      className="w-full h-64 object-cover rounded-md mb-4"
                      data-ai-hint={enemyImage.imageHint}
                    />
                  )}
                  <p className="text-muted-foreground">{enemy.description}</p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={`/deck-builder?enemyId=${enemy.id}`}>战斗</Link>
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}

      {selectedWorldId && selectedWorldId !== 'magic-world' && (
          <div className="text-center text-muted-foreground py-16 animate-in fade-in-50 duration-500">
              <h2 className="text-2xl font-headline">敬请期待</h2>
              <p>这个世界仍在迷雾之中，等待着未来的探险家。</p>
          </div>
      )}
    </div>
  );
}
