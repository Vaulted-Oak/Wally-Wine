import type {Cart as CartType} from '@shopify/hydrogen/storefront-api-types';
import type {Variants} from '~/lib/motion';
import type {CartApiQueryFragment} from 'storefrontapi.generated';

import {CartForm} from '@shopify/hydrogen';
import {AnimatePresence} from '~/lib/motion';
import {useEffect, useMemo, useState} from 'react';

import {useCartFetchers} from '~/hooks/useCartFetchers';
import {useIsHydrated} from '~/hooks/useIsHydrated';
import {useSanityThemeContent} from '~/hooks/useSanityThemeContent';
import {cn} from '~/lib/utils';

import type {CartLayouts} from './Cart';

import {IconLoader} from '../icons/IconLoader';
import {ProgressiveMotionDiv} from '../ProgressiveMotionDiv';
import {ShopifyMoney} from '../ShopifyMoney';
import {Button} from '../ui/Button';
import {Card, CardContent} from '../ui/Card';
import {CartDiscounts} from './CartDiscounts';
import {CartLines} from './CartLines';
import {CartNotes} from './CartNotes';

export function CartDetails({
  checkoutUrl,
  cost,
  discountAmount,
  note,
  discountCodes,
  layout,
  lines,
  onClose,
  totalQuantity,
}: {
  checkoutUrl?: string;
  note?: CartType['note'];
  cost?: CartApiQueryFragment['cost'];
  discountCodes: CartType['discountCodes'];
  discountAmount: CartType['discountAllocations'];
  layout: CartLayouts;
  lines?: CartApiQueryFragment['lines'];
  onClose?: () => void;
  totalQuantity?: number;
}) {
  const isHydrated = useIsHydrated();
  // @todo: get optimistic cart cost
  const cartHasItems = totalQuantity && totalQuantity > 0;

  const drawerMotionVariants: Variants = {
    hide: {
      height: 0,
    },
    show: {
      height: 'auto',
    },
  };

  const pageMotionVariants: Variants = {
    hide: {
      opacity: 0,
      transition: {
        duration: 0,
      },
    },
    show: {
      opacity: 1,
    },
  };

  const cartHasFutures = lines?.nodes?.some(
    (line) =>
      line?.merchandise?.product?.futures?.key === 'special_designation' &&
      line?.merchandise?.product?.futures?.value === 'Futures',
  );

  return (
    <CartDetailsLayout layout={layout}>
      <CartLines layout={layout} lines={lines} onClose={onClose} />
      <div className="flex-[0_0_100%] lg:flex-[0_0_25%]">
        <AnimatePresence>
          {cartHasItems && (
            <ProgressiveMotionDiv
              animate="show"
              className={cn([
                layout === 'page' &&
                  'lg:sticky lg:top-[var(--desktopHeaderHeight)]',
              ])}
              exit="hide"
              forceMotion={isHydrated && layout === 'drawer'}
              initial="show"
              variants={
                layout === 'drawer' ? drawerMotionVariants : pageMotionVariants
              }
            >
              <CartSummary cost={cost} layout={layout} lines={lines} discountAmount={discountAmount}>
                <CartDiscounts cartHasFutures={cartHasFutures} discountCodes={discountCodes} layout={layout} discountAmount={discountAmount} />
                <CartNotes note={note} layout={layout} />
                <CartCheckoutActions checkoutUrl={checkoutUrl} />
              </CartSummary>
            </ProgressiveMotionDiv>
          )}
        </AnimatePresence>
      </div>
    </CartDetailsLayout>
  );
}

function CartDetailsLayout(props: {
  children: React.ReactNode;
  layout: CartLayouts;
}) {
  return props.layout === 'drawer' ? (
    <>{props.children}</>
  ) : (
    <div className="container flex w-full flex-wrap gap-8 pb-12 md:flex-nowrap">
      {props.children}
    </div>
  );
}

function CartCheckoutActions({checkoutUrl}: {checkoutUrl?: string}) {
  const {themeContent} = useSanityThemeContent();
  const addToCartFetchers = useCartFetchers(CartForm.ACTIONS.LinesAdd);
  const removeLineItems = useCartFetchers(CartForm.ACTIONS.LinesRemove);
  const updateLingeItems = useCartFetchers(CartForm.ACTIONS.LinesUpdate);
  const cartIsLoading =
    Boolean(addToCartFetchers.length) ||
    Boolean(removeLineItems.length) ||
    Boolean(updateLingeItems.length);

  return (
    <div className="mt-2 flex flex-col">
      <Button asChild>
        <a
          className={cn(
            (cartIsLoading || !checkoutUrl) &&
              'pointer-events-none cursor-pointer',
            '!font-normal uppercase',
          )}
          href={checkoutUrl}
          target="_self"
        >
          {cartIsLoading ? (
            <IconLoader className="size-5 animate-spin" />
          ) : (
            <span>Continue to Checkout</span>
          )}
        </a>
      </Button>
      {/* @todo: <CartShopPayButton cart={cart} /> */}
    </div>
  );
}

function CartSummary({
  children = null,
  cost,
  layout,
  discountAmount,
  lines,
}: {
  children?: React.ReactNode;
  discountAmount: CartType['discountAllocations'];
  cost?: CartApiQueryFragment['cost'];
  lines?: CartApiQueryFragment['lines'];
  layout: CartLayouts;
}) {
  const {themeContent} = useSanityThemeContent();

  const Content = useMemo(
    () => (
      <div
        aria-labelledby="summary-heading"
        className={cn([
          layout === 'drawer' && 'grid gap-4 border-t border-border p-6',
          layout === 'page' && 'grid gap-6',
        ])}
      >
        <h2 className="sr-only">{themeContent?.cart?.orderSummary}</h2>
        <dl className="grid">
          <div className="flex items-center justify-between text-[16px]">
            <span className="font-bold">{themeContent?.cart?.subtotal}</span>
            <span>
              {cost?.totalAmount?.amount && <ShopifyMoney data={cost?.totalAmount!} />}
            </span>
          </div>
        </dl>
        {children}
      </div>
    ),
    [children, cost?.subtotalAmount, layout, themeContent],
  );

  if (layout === 'drawer') {
    return Content;
  }

  return (
    <Card className="mt-5">
      <CardContent className="px-5 py-6 lg:p-8">{Content}</CardContent>
    </Card>
  );
}
