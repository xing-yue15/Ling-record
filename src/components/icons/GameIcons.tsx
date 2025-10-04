import { cn } from '@/lib/utils';
import type { SVGProps } from 'react';

export const SwordIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
    className={cn('w-6 h-6', props.className)}
  >
    <path d="M14.5 17.5l-8-8L2 14l5 5 7.5-1.5z" />
    <path d="M13 9.5l7-7" />
    <path d="M14.5 2.5l5 5" />
    <path d="M5.5 12.5l-3 3" />
  </svg>
);

export const HeartIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
    className={cn('w-6 h-6', props.className)}
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

export const ManaIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
    className={cn('w-6 h-6', props.className)}
  >
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.32 0L12 2.69z" />
    <path d="M12 12l-2.83-2.83" />
    <path d="M12 12l2.83 2.83" />
  </svg>
);
