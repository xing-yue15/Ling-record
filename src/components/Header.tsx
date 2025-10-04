'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Swords } from 'lucide-react';
import { cn } from '@/lib/utils';


export function Header() {
  const pathname = usePathname();
  const inBattle = pathname.startsWith('/battle');

  if (inBattle) {
    return null;
  }

  const navLinkClasses = (href: string) => cn(
    "transition-colors hover:text-foreground/80",
    pathname === href ? 'text-foreground' : 'text-foreground/60'
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Swords className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline sm:inline-block">
            灵记
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-sm lg:gap-6">
          <Button asChild variant="link" className={navLinkClasses("/deck-builder")}>
            <Link
              href="/deck-builder"
            >
              牌组构筑
            </Link>
          </Button>
          <Button asChild variant="link" className={navLinkClasses("/adventure")}>
            <Link
              href="/adventure"
            >
              冒险
            </Link>
          </Button>
        </nav>
        <div className="flex flex-1 items-center justify-end gap-2">
          <Button asChild variant="ghost">
            <Link href="/login">登录</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">注册</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
