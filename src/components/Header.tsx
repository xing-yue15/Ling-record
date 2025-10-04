import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Scroll, Swords } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Swords className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline sm:inline-block">
            LexicArcana
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-sm lg:gap-6">
          <Link
            href="/deck-builder"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            牌组构筑
          </Link>
          <Link
            href="/adventure"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            冒险
          </Link>
        </nav>
        <div className="flex flex-1 items-center justify-end gap-2">
            <Button variant="ghost">登录</Button>
            <Button>注册</Button>
        </div>
      </div>
    </header>
  );
}
