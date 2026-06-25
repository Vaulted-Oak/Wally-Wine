import type {CartLineUpdateInput} from '@shopify/hydrogen-react/storefront-api-types';
import type {Variants} from '~/lib/motion';
import type {CartLineFragment} from 'storefrontapi.generated';
import {Image} from '@shopify/hydrogen-react';
import type * as StorefrontAPI from '@shopify/hydrogen/storefront-api-types';
import {Link} from 'react-router';
import {
  CartForm,
  OptimisticInput,
  parseGid,
  useOptimisticData,
} from '@shopify/hydrogen';

import {useCartFetchers} from '~/hooks/useCartFetchers';
import {useIsHydrated} from '~/hooks/useIsHydrated';
import {useLocalePath} from '~/hooks/useLocalePath';
import {useSanityThemeContent} from '~/hooks/useSanityThemeContent';
import {cn} from '~/lib/utils';

import type {CartLayouts} from './Cart';

import {IconRemove} from '../icons/IconRemove';
import {ProgressiveMotionDiv} from '../ProgressiveMotionDiv';
import {QuantitySelector} from '../QuantitySelector';
import {ShopifyImage} from '../ShopifyImage';
import {ShopifyMoney} from '../ShopifyMoney';
import {IconButton} from '../ui/Button';
import {useRootLoaderData} from '~/root';
import {useEffect, useState} from 'react';
import { ErrorMessageSection } from '../product/AddToCartForm';

type OptimisticData = {
  action?: string;
  lineId?: string;
  quantity?: number;
};

const base = 4;
const t = (n: number) => base * n;

interface UpdatedCartLineFragment extends CartLineFragment {
  cost: {
    totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    amountPerQuantity: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    subtotalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
  };
  discountAllocations: {
    code: string;
    discountedAmount: {
      amount: number;
      currencyCode: string;
    };
  }[];
}

export function CartLineItem({
  layout,
  line,
  itemsCount,
  onClose,
}: {
  layout: CartLayouts;
  itemsCount:number;
  line: UpdatedCartLineFragment;
  onClose?: () => void;
}) {
  const isHydrated = useIsHydrated();
  const optimisticData = useOptimisticData<OptimisticData>('cart-line-item');
  const rootData = useRootLoaderData();
  const {env} = rootData || {};
  const {id, merchandise} = line;
  const variantId = parseGid(merchandise?.id)?.id;
  const productPath = useLocalePath({
    path: `/products/${merchandise.product.handle}?variant=${variantId}`,
  });
  const addToCartFetchers = useCartFetchers(CartForm.ACTIONS.LinesAdd);
  const cartIsLoading = Boolean(addToCartFetchers.length);

  const remove =
    optimisticData?.action === 'remove' && optimisticData?.lineId === id;

  const variants: Variants = {
    hidden: {
      height: 0,
      opacity: 0,
      transition: {
        bounce: 0,
        duration: t(0.15),
        opacity: {
          delay: t(0.03),
        },
        type: 'spring',
      },
    },
    visible: {
      opacity: 1,
    },
  };

  // Animated list implementation inspired by the fantastic Build UI recipes
  // (Check out the original at: https://buildui.com/recipes/animated-list)
  // Credit to the Build UI team for the awesome List animation.
  return (
    <ProgressiveMotionDiv
      animate={
        // Hide the line item if the optimistic data action is remove
        // Do not remove the form from the DOM
        remove && 'hidden'
      }
      className="overflow-hidden px-2 md:px-6"
      forceMotion={isHydrated && layout === 'drawer'}
      initial="visible"
      key={id}
      variants={variants}
    >
      <div className="flex gap-4 py-5">
        <div className="w-[85px] md:w-[102px]">
          {merchandise.image ? (
            <ShopifyImage
              alt={merchandise.title}
              aspectRatio="1/1"
              className="h-auto w-full object-cover object-center"
              data={merchandise.image}
              draggable={false}
              loading="eager"
              sizes="56px"
            />
          ) : (
            <Image
              loading="eager"
              sizes="56px"
              draggable={false}
              className="h-auto w-full object-cover object-center"
              aspectRatio="1/1"
              alt={merchandise.title}
              src={env.DEFAULT_PRODUCT_IMAGE}
            />
          )}
        </div>

        <div className="flex flex-1 justify-between pr-4 lg:pr-0">
          <div className="grid gap-1">
            <h3 className="mb-[20px] max-w-[200px] text-[16px] font-normal leading-[21px]">
              {merchandise?.product?.handle ? (
                <Link onClick={onClose} to={productPath}>
                  {merchandise?.product?.title || ''}
                </Link>
              ) : (
                <p>{merchandise?.product?.title || ''}</p>
              )}
            </h3>
            {line?.discountAllocations?.length > 0 && (
              <div className="mb-[10px] text-sm text-red-500">
                {line?.discountAllocations?.map((discount, index) => (
                  <div key={index} className="flex">
                    <span className="uppercase">{discount.code}</span>{' '}
                    <span className="flex">
                      (-
                      <ShopifyMoney
                        data={{
                          amount: discount.discountedAmount.amount?.toString(),
                          currencyCode: 'USD',
                        }}
                      />
                      )
                    </span>
                  </div>
                ))}
              </div>
            )}
            {merchandise?.selectedOptions.find(
              (option) => option.value !== 'Default Title',
            ) && (
              <div className="grid pb-2">
                {(merchandise?.selectedOptions || []).map((option) => (
                  <small className="text-sm opacity-80" key={option.name}>
                    {option.name}: {option.value}
                  </small>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2">
              <div className="flex justify-start">
                <CartLineQuantityAdjust line={line} loading={cartIsLoading} />
              </div>
              <ItemRemoveButton itemsCount={itemsCount} lineId={id} loading={cartIsLoading} />
            </div>
          </div>
          <span className="leading-[21px]">
            <CartLinePrice as="span" line={line} />
          </span>
        </div>
      </div>
    </ProgressiveMotionDiv>
  );
}

function ItemRemoveButton({
  lineId,
  loading,
  itemsCount,
}: {
  lineId: CartLineFragment['id'];
  loading: boolean;
  itemsCount: number;
}) {
  const cartPath = useLocalePath({path: '/cart'});
  const {themeContent} = useSanityThemeContent();

  return (
    <CartForm
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{
        lineIds: [lineId],
        itemsCount: itemsCount
      }}
      route={cartPath}
    >
      <IconButton
        className={cn(
          'overflow-hidden rounded-[--input-border-corner-radius]',
          'rounded-[--input-border-corner-radius]',
          'border-[rgb(var(--input)_/_var(--input-border-opacity))] [border-width:--input-border-thickness]',
          '[box-shadow:rgb(var(--shadow)_/_var(--input-shadow-opacity))_var(--input-shadow-horizontal-offset)_var(--input-shadow-vertical-offset)_var(--input-shadow-blur-radius)_0px]',
        )}
        disabled={loading}
        type="submit"
      >
        <span className="sr-only">{themeContent?.cart?.remove}</span>
        <IconRemove aria-hidden="true" />
      </IconButton>
      <OptimisticInput data={{action: 'remove', lineId}} id="cart-line-item" />
    </CartForm>
  );
}

function CartLinePrice({
  line,
  priceType = 'regular',
  ...passthroughProps
}: {
  [key: string]: any;
  line: UpdatedCartLineFragment;
  priceType?: 'compareAt' | 'regular';
}) {
  if (!line?.cost?.amountPerQuantity || !line?.cost?.totalAmount) return null;

  const totalAmount = line.cost.totalAmount;
  const subtotalAmount = line.cost.subtotalAmount;

  if (totalAmount == null || subtotalAmount == null) {
    return null;
  }

  return (
    <div {...passthroughProps}>
      {subtotalAmount.amount !== totalAmount.amount && (
        <div>
          <span className="line-through">
            <ShopifyMoney data={subtotalAmount} />
          </span>
          <span className="ml-2">
            <ShopifyMoney data={totalAmount} />
          </span>
        </div>
      )}
      {subtotalAmount.amount === totalAmount.amount && (
        <ShopifyMoney data={totalAmount} />
      )}
    </div>
  );
}

function UpdateCartForm({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  const cartPath = useLocalePath({path: '/cart'});
  const [showWarningMessage, setShowWarningMessage] = useState<boolean>(false);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  return (
    <CartForm
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{
        lines,
      }}
      route={cartPath}
    >
      {(fetcher) => {
        let warning = fetcher?.data?.warnings?.[0]?.message;
        useEffect(() => {
          if (warning && fetcher.state === 'loading') {
            setShowWarningMessage(true);
            setWarningMessage(warning);
          }
        }, [warning, fetcher.state]);

        return (
          <>
            {showWarningMessage && warningMessage && (
              <ErrorMessageSection
                errorMessage={warningMessage}
                SetShowErrorMessage={setShowWarningMessage}
              />
            )}
            {children}
          </>
        );
      }}
    </CartForm>
  );
}

function CartLineQuantityAdjust({
  line,
  loading,
}: {
  line: CartLineFragment;
  loading: boolean;
}) {
  const optimisticId = line?.id;
  const optimisticData = useOptimisticData<OptimisticData>(optimisticId);
  const {themeContent} = useSanityThemeContent();

  if (!line || typeof line?.quantity === 'undefined') return null;

  const optimisticQuantity = optimisticData?.quantity || line.quantity;

  const {id: lineId} = line;
  const prevQuantity = Number(Math.max(0, optimisticQuantity - 1).toFixed(0));
  const nextQuantity = Number((optimisticQuantity + 1).toFixed(0));

  return (
    <>
      <label className="sr-only" htmlFor={`quantity-${lineId}`}>
        {themeContent?.cart?.quantity}, {optimisticQuantity}
      </label>
      <QuantitySelector>
        <UpdateCartForm lines={[{id: lineId, quantity: prevQuantity}]}>
          <QuantitySelector.Button
            disabled={optimisticQuantity <= 1 || loading}
            symbol="decrease"
            value={prevQuantity}
          >
            <OptimisticInput
              data={{quantity: prevQuantity}}
              id={optimisticId}
            />
          </QuantitySelector.Button>
        </UpdateCartForm>
        <QuantitySelector.Value>{optimisticQuantity}</QuantitySelector.Value>
        <UpdateCartForm lines={[{id: lineId, quantity: nextQuantity}]}>
          <QuantitySelector.Button
            disabled={loading}
            symbol="increase"
            value={nextQuantity}
          >
            <OptimisticInput
              data={{quantity: nextQuantity}}
              id={optimisticId}
            />
          </QuantitySelector.Button>
        </UpdateCartForm>
      </QuantitySelector>
    </>
  );
}
