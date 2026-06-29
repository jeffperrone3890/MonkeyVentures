import { cn } from '@/lib/utils';

type Variant = 'primary' | 'dark' | 'outline' | 'ghost' | 'onDark';
type Size = 'sm' | 'md' | 'lg';

interface BaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

type ButtonAsButton = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & { href?: undefined };

type ButtonAsLink = BaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & { href: string };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 ease-out-expo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60';

const variants: Record<Variant, string> = {
  // The single boldest action on the page — golden-hour amber.
  primary:
    'bg-amber text-forest shadow-soft hover:bg-amber-soft hover:shadow-lift hover:-translate-y-0.5 focus-visible:ring-amber focus-visible:ring-offset-paper',
  dark:
    'bg-pine text-sage-50 shadow-soft hover:bg-forest hover:-translate-y-0.5 focus-visible:ring-pine focus-visible:ring-offset-paper',
  outline:
    'border border-pine/25 bg-transparent text-pine hover:border-pine/50 hover:bg-pine/5 focus-visible:ring-pine focus-visible:ring-offset-paper',
  ghost:
    'bg-transparent text-pine hover:bg-pine/5 focus-visible:ring-pine focus-visible:ring-offset-paper',
  onDark:
    'bg-sage-50 text-forest shadow-soft hover:bg-white hover:-translate-y-0.5 focus-visible:ring-amber focus-visible:ring-offset-forest',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-[15px]',
  lg: 'h-13 px-8 text-base py-3.5',
};

/** Renders an <a> when `href` is provided, otherwise a <button>. */
export function Button(props: ButtonProps) {
  const { variant = 'primary', size = 'md', className, children } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if (props.href !== undefined) {
    const { variant: _v, size: _s, className: _c, children: _ch, ...rest } = props;
    return (
      <a className={classes} {...rest}>
        {children}
      </a>
    );
  }

  const { variant: _v, size: _s, className: _c, children: _ch, href: _h, ...rest } = props;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
