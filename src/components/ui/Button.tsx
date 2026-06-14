import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl font-medium min-h-touch px-4 ' +
  'transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ' +
  'focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

const variants: Record<Variant, string> = {
  primary: 'bg-brand text-white hover:bg-brand-hover',
  secondary: 'bg-white text-ink border border-line hover:bg-brand-tint',
  ghost: 'bg-transparent text-ink hover:bg-brand-tint',
};

export function Button({ variant = 'primary', className = '', children, ...rest }: ButtonProps) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}
