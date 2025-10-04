import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero');

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="relative isolate overflow-hidden pt-24 pb-12 sm:pt-32 sm:pb-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-6xl">
              灵记
            </h1>
            <p className="mt-6 text-lg leading-8 text-foreground/80">
              一款自由diy卡牌对战，自主选牌的卡牌游戏
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg">
                <Link href="/worlds">开始冒险</Link>
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
      
      {/* Added content to make page scrollable */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-center text-lg font-semibold leading-8 text-foreground/80">
            游戏特色
          </h2>
          <div className="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
            <div className="col-span-2 max-h-12 w-full object-contain lg:col-span-1 text-center">
                <h3 className="text-2xl font-headline">自由构筑</h3>
                <p className="text-sm text-muted-foreground">组合词条，创造无限可能</p>
            </div>
            <div className="col-span-2 max-h-12 w-full object-contain lg:col-span-1 text-center">
                 <h3 className="text-2xl font-headline">策略对战</h3>
                <p className="text-sm text-muted-foreground">与不同敌人斗智斗勇</p>
            </div>
             <div className="col-span-2 max-h-12 w-full object-contain lg:col-span-1 text-center">
                 <h3 className="text-2xl font-headline">探索世界</h3>
                <p className="text-sm text-muted-foreground">解锁风格迥异的冒险</p>
            </div>
             <div className="col-span-2 max-h-12 w-full object-contain sm:col-start-2 lg:col-span-1 text-center">
                 <h3 className="text-2xl font-headline">持续成长</h3>
                <p className="text-sm text-muted-foreground">在战斗中获取新的力量</p>
            </div>
             <div className="col-span-2 col-start-2 max-h-12 w-full object-contain sm:col-start-auto lg:col-span-1 text-center">
                 <h3 className="text-2xl font-headline">AI 赋能</h3>
                <p className="text-sm text-muted-foreground">体验动态生成的挑战</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
