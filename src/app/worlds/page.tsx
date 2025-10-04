'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Link from 'next/link';

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

export default function WorldsPage() {
    return (
        <div className="container mx-auto py-8 px-4">
            <div className="text-center mb-12">
                <h1 className="font-headline text-4xl font-bold text-primary">选择世界</h1>
                <p className="text-foreground/80 mt-2">下一个要探索的世界是？</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {worlds.map(world => {
                    const WorldCard = (
                        <Card
                            className={cn(
                                "w-full cursor-pointer transition-all duration-300 hover:shadow-primary/40 hover:-translate-y-1",
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
                    );

                    if (world.available) {
                        return (
                            <Link key={world.id} href={`/adventure/${world.id}`} passHref>
                                {WorldCard}
                            </Link>
                        );
                    }

                    return (
                        <div key={world.id}>
                            {WorldCard}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
