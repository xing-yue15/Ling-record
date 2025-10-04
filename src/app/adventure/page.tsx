import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';

const enemies = [
  { id: 'goblin-artificer', name: '哥布林工匠', description: '一个狡猾的哥布林，擅长制造爆炸装置。', difficulty: '简单', artId: 'enemy-goblin' },
  { id: 'stone-guardian', name: '石头守卫', description: '一个保护古代遗迹的巨大魔像。行动缓慢但异常坚固。', difficulty: '中等', artId: 'enemy-golem' },
  { id: 'shadow-specter', name: '暗影幽灵', description: '一个可怕的怨灵，能够吸取生命并散播恐惧。', difficulty: '困难', artId: 'enemy-specter' },
];

export default function AdventurePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl font-bold text-primary">冒险在等待</h1>
        <p className="text-foreground/80 mt-2">挑战强大的敌人，解锁新的词条，证明你的价值。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {enemies.map(enemy => {
          const enemyImage = PlaceHolderImages.find(p => p.id === enemy.artId);
          return (
            <Card key={enemy.id} className="flex flex-col">
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
                    height={500}
                    className="w-full h-64 object-cover rounded-md mb-4"
                    data-ai-hint={enemyImage.imageHint}
                  />
                )}
                <p className="text-muted-foreground">{enemy.description}</p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/battle/${enemy.id}`}>战斗</Link>
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  );
}
