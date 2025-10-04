import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero');

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="relative isolate overflow-hidden min-h-[calc(100vh-15rem)] flex items-center justify-center">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col justify-center h-full">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-6xl">
              灵记
            </h1>
            <p className="mt-6 text-lg leading-8 text-foreground/80">
              用言语铸就你的命运。一款关于创造、策略和同步战斗的卡牌游戏。
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg">
                <Link href="/adventure">开始冒险</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/deck-builder">构筑牌组</Link>
              </Button>
            </div>
          </div>
        </div>
         {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="-z-10 h-full w-full object-cover opacity-20"
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-primary to-accent opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
