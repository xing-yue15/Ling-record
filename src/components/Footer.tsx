'use client';

import { usePathname } from 'next/navigation';
import { Swords } from 'lucide-react';

export function Footer() {
  const pathname = usePathname();
  const inGame = pathname.startsWith('/battle') || pathname.startsWith('/adventure') || pathname.startsWith('/worlds');


  if (inGame) {
    return null;
  }
  
  return (
    <footer className="border-t border-border/40">
      <div className="container flex h-14 items-center justify-between text-sm text-foreground/60">
        <div className="flex items-center gap-2">
          <Swords className="h-4 w-4 text-primary" />
          <p className="font-bold font-headline">灵记</p>
        </div>
        <p>&copy; {new Date().getFullYear()} 灵记. 版权所有。</p>
      </div>
    </footer>
  );
}
