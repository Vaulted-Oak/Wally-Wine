import {useEffect, useState} from 'react';
import type {Cart as CartType} from '@shopify/hydrogen/storefront-api-types';
import {CartForm} from '@shopify/hydrogen';
import {useCartFetchers} from '~/hooks/useCartFetchers';
import {useLocalePath} from '~/hooks/useLocalePath';
import {useSanityThemeContent} from '~/hooks/useSanityThemeContent';
import {cn} from '~/lib/utils';
import {IconRemove} from '../icons/IconRemove';
import {Button} from '../ui/Button';
import {Input} from '../ui/Input';
import {CartDiscountCode} from '@shopify/hydrogen-react/storefront-api-types';
import {IconLoader} from '../icons/IconLoader';
import {ShopifyMoney} from '../ShopifyMoney';

/**
 * Temporary discount UI
 * @param discountCodes the current discount codes applied to the cart
 * @todo rework when a design is ready
 */
export function CartDiscounts({
  discountCodes,
  discountAmount,
  cartHasFutures,
  layout,
}: {
  discountCodes: CartType['discountCodes'];
  cartHasFutures?: boolean;
  discountAmount?: CartType['discountAllocations'];
  layout: 'drawer' | 'page';
}) {
  const {themeContent} = useSanityThemeContent();
  const addToCartFetchers = useCartFetchers(
    CartForm.ACTIONS.DiscountCodesUpdate,
  );
  const cartIsLoading = Boolean(addToCartFetchers.length);
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [couponIsAdded, setCouponIsAdded] = useState<boolean>(false);
  const [discountCodeInput, setDiscountCodeInput] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const totalDiscountAmount = discountAmount?.reduce((total, discount) => {
    return total + parseFloat(discount.discountedAmount.amount);
  }, 0);

  const handleValidation = async () => {
    if (!discountCodeInput) {
      setErrorMessage('Discount code cannot be empty');
      return false;
    }

    if (codes.includes(discountCodeInput)) {
      setErrorMessage('Discount code already applied');
      return false;
    } else {
      setErrorMessage(null);
      return true;
    }
  };

  useEffect(() => {
    const handleValidation = async () => {
      setSuccessMessage(null);
      const isValid = await validateDiscountCode(discountCodes);
      if (!isValid && couponIsAdded) {
        setErrorMessage('Invalid discount code');
        setCouponIsAdded(false);
        setSuccessMessage(null);
        return;
      } else if (couponIsAdded && isValid && discountCodeInput) {
        if (codes.includes(discountCodeInput)) {
          setSuccessMessage('Discount code applied successfully');
        }
      }
    };
    handleValidation();
  }, [discountCodes]);

  useEffect(() => {
    if (errorMessage || successMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
        setSuccessMessage(null);
      }, 5000);
      if (successMessage) {
        setDiscountCodeInput('');
      }

      return () => clearTimeout(timer);
    }
  }, [errorMessage, successMessage]);

  return codes && codes.length > 0 ? (
    <dl className={'grid'}>
      {successMessage && (
        <div className="mt-2 text-[#00461C]">{successMessage}</div>
      )}
      <div className="flex items-center justify-between font-medium">
        <span className='font-bold'>{themeContent?.cart?.discounts}</span>
        <div className="flex items-center justify-between">
          {totalDiscountAmount && totalDiscountAmount > 0 ? (
            <span className="flex">
              -
              <ShopifyMoney
                data={{
                  amount: totalDiscountAmount?.toString(),
                  currencyCode: 'USD',
                }}
              />
            </span>
          ) : null}
          <UpdateDiscountForm discountCodeInput={discountCodeInput}>
            <button
              className="[&>*]:pointer-events-none"
              disabled={cartIsLoading}
            >
              {cartIsLoading && !errorMessage ? (
                <IconLoader className="size-5 animate-spin" />
              ) : (
                <IconRemove
                  aria-hidden="true"
                  style={{height: 18, marginRight: 4}}
                />
              )}
            </button>
          </UpdateDiscountForm>
          <span>{codes?.join(', ')}</span>
        </div>
      </div>
      {cartHasFutures ? (
        <p className="pt-2">
          Taxes and Shipping amount will be calculated when item is shipped and
          our CSR will contact you
        </p>
      ) : (
        <p className="pt-2">Taxes and shipping calculated at checkout</p>
      )}
    </dl>
  ) : (
    <>
      {cartHasFutures ? (
        <p className="pt-2">
          Taxes and Shipping amount will be calculated when item is shipped and
          our CSR will contact you
        </p>
      ) : (
        <p className="pt-2">Taxes and shipping calculated at checkout</p>
      )}
      {errorMessage && <div className="mt-2 text-red-500">{errorMessage}</div>}
      {/* Show an input to apply a discount */}
      <UpdateDiscountForm
        discountCodes={codes}
        discountCodeInput={discountCodeInput}
      >
        <div
          className={cn(
            'flex',
            layout === 'page' && 'flex-col flex-wrap lg:flex-row',
            'items-center justify-between gap-4',
          )}
        >
          <Input
            className="h-[48px] rounded-none !border !border-[#D0D0D0] ring-0"
            name="discountCode"
            placeholder={themeContent?.cart?.discountCode || ''}
            type="text"
            value={discountCodeInput}
            onChange={(e) => setDiscountCodeInput(e.target.value)}
          />
          <Button
            className={cn(
              'duration-3000 w-[210px] !border !border-primaryGreen bg-white text-[13px] font-normal uppercase text-primaryGreen hover:!bg-primaryGreen hover:!text-white',
              layout === 'page' && 'w-full',
            )}
            variant="outline"
            onClick={async () => {
              const isValid = await handleValidation();
              if (isValid) {
                setCouponIsAdded(true);
              } else {
                return;
              }
            }}
          >
            {cartIsLoading && !errorMessage ? (
              <IconLoader className="size-5 animate-spin" />
            ) : (
              <span>{themeContent?.cart?.applyDiscount}</span>
            )}
          </Button>
        </div>
      </UpdateDiscountForm>
    </>
  );
}

export function UpdateDiscountForm({
  children,
  discountCodes,
  discountCodeInput,
}: {
  children: React.ReactNode;
  discountCodes?: string[];
  discountCodeInput: string;
}) {
  const cartPath = useLocalePath({path: '/cart'});
  return (
    <CartForm
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
      route={cartPath}
    >
      {children}
    </CartForm>
  );
}

async function validateDiscountCode(
  discountCodes?: CartDiscountCode[],
): Promise<boolean> {
  // Simulate an API call to validate the discount code
  // Replace this with actual validation logic
  const invalidCodes = discountCodes?.filter(
    (code) => code.applicable === false,
  );
  return invalidCodes && invalidCodes?.length > 0 ? false : true;
}
