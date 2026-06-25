import {cx} from 'class-variance-authority';
import {forwardRef} from 'react';

import {cn} from '~/lib/utils';

import type {ButtonProps} from './ui/Button';

import {IconButton} from './ui/Button';
export function QuantitySelector(props: {children: React.ReactNode}) {
  return (
    <div
      className={cn(
        'flex w-fit mb-0 items-center border !border-[#DCDCDC]',
        '',
        '[box-shadow:rgb(var(--shadow)_/_var(--input-shadow-opacity))_var(--input-shadow-horizontal-offset)_var(--input-shadow-vertical-offset)_var(--input-shadow-blur-radius)_0px]',
      )}
    >
      {props.children}
    </div>
  );
}

const QuantityButton = forwardRef<
  HTMLButtonElement,
  ButtonProps & {
    symbol: 'decrease' | 'increase';
  }
>(({className, symbol, variant, ...props}, ref) => {
  return (
    <IconButton
      aria-label={cx([
        symbol === 'decrease' && 'Decrease quantity',
        symbol === 'increase' && 'Increase quantity',
      ])}
      className={cn([
        'group disabled:opacity-100',
        'border-[#DCDCDC]',
        '[border-width-[1px]',
        symbol === 'decrease'
          ? 'rounded-none !border-r-0'
          : 'rounded-none !border-l-0',
        className,
      ])}
      name={cx([
        symbol === 'decrease' && 'decrease-quantity',
        symbol === 'increase' && 'increase-quantity',
      ])}
      ref={ref}
      {...props}
    >
      <span className="group-disabled:opacity-40">
        {
          {
            decrease: <>&#8722;</>,
            increase: <>&#43;</>,
          }[symbol]
        }
      </span>
      {props.children}
    </IconButton>
  );
});
QuantityButton.displayName = 'QuantityButton';

function Value(props: {children: React.ReactNode}) {
  return (
    <div
      className={cn(
        'flex h-full min-w-[2.5rem] select-none items-center justify-center px-2 text-center',
        '',
      )}
    >
      {props.children}
    </div>
  );
}

QuantitySelector.Button = QuantityButton;
QuantitySelector.Value = Value;
