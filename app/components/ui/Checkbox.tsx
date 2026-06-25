import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import {cn} from 'app/lib/utils';
import * as React from 'react';

import {IconCheck} from '../icons/IconCheck';

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({className, ...props}, ref) => (
  <CheckboxPrimitive.Root
    className={cn(
      'peer h-[18px] w-[18px] shrink-0 border-[2px] border-[#DCDCDC] ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-0 data-[state=checked]:bg-primaryGreen data-[state=checked]:text-primary-foreground',
      className,
    )}
    ref={ref}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn('flex items-center justify-center text-current')}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {/*<IconCheck className="h-4 w-4" />*/}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export {Checkbox};
