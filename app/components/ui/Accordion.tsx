import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { forwardRef } from 'react';

import { cn } from '~/lib/utils';

import { IconChevron } from '../icons/IconChevron';

const Accordion = AccordionPrimitive.Root;

const AccordionItem = forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    className={cn('', className)}
    ref={ref}
    {...props}
  />
));
AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ children, className, ...props }, ref) => (
  <AccordionPrimitive.Header asChild className="flex border-b border-[#E1E1E1] "
  >
    <div>
      <AccordionPrimitive.Trigger
        className={cn(
          'group flex flex-1 items-center justify-between py-4 font-medium transition-all text-[16px] text-primaryGreen capitalize',
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
        <span className="pointer-events-none mr-[8px]" >
          <svg
            className="transition-transform duration-200 group-[[data-state='open']]:rotate-[180deg]"
            width="14"
            height="8"
            viewBox="0 0 14 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1L7 7L13 1"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        {/*<IconChevron
          className="size-3 shrink-0 transition-transform duration-200 group-[[data-state='open']]:rotate-[180deg]"
          direction="down"
        />*/}
      </AccordionPrimitive.Trigger>
    </div>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ children, className, ...props }, ref) => (
  <AccordionPrimitive.Content
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    ref={ref}
    {...props}
  >
    <div className={cn('pt-[15px]', className)}>{children}</div>
  </AccordionPrimitive.Content>
));

AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
