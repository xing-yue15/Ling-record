import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';

const enemies = [
  { id: 'goblin-artificer', name: 'Goblin Artificer', description: 'A wily goblin with a knack for explosive contraptions.', difficulty: 'Easy', artId: 'enemy-goblin' },
  { id: 'stone-guardian', name: 'Stone Guardian', description: 'A massive golem that protects ancient ruins. Slow but incredibly durable.', difficulty: 'Medium', artId: 'enemy-golem' },
  { id: 'shadow-specter', name: 'Shadow Specter', description: 'A horrifying wraith that drains life and instills fear.', difficulty: 'Hard', artId: 'enemy-specter' },
];

export default function AdventurePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl font-bold text-primary">Adventure Awaits</h1>
        <p className="text-foreground/80 mt-2">Challenge formidable foes to unlock new terms and prove your worth.</p>
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
                  <Link href={`/battle/${enemy.id}`}>Fight</Link>
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  );
}
