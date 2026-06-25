import type {TypeFromSelection} from 'groqd';
import type {ProductVariantFragmentFragment} from 'storefrontapi.generated';

import {flattenConnection, useProduct} from '@shopify/hydrogen-react';

import type {ADD_TO_CART_BUTTON_BLOCK_FRAGMENT} from '~/qroq/blocks';

import {useProductVariants} from '../sections/ProductInformationSection';
import {AddToCartForm} from './AddToCartForm';
import {VariantSelector} from './VariantSelector';
import {useSelectedVariant} from '~/hooks/useSelectedVariant';

export function ProductForm(
  props: TypeFromSelection<typeof ADD_TO_CART_BUTTON_BLOCK_FRAGMENT>,
) {
  const {product} = useProduct();
  const variantsContextData = useProductVariants();
  const showQuantitySelector = props.quantitySelector;

  if (!product) return null;

  if (variantsContextData?.variants) {
    const selectedVariant = useSelectedVariant({variants: variantsContextData.variants});
    const hasLimitedInventory = selectedVariant?.quantityAvailable !== null && 
                                  selectedVariant?.quantityAvailable !== undefined && 
                                  selectedVariant?.quantityAvailable > 0 && 
                                  selectedVariant?.quantityAvailable < 10;

    return (
      <>
        <div className="md:flex items-start gap-4 mb-8">
          <VariantSelector
            options={product.options}
            variants={variantsContextData?.variants}
          />
          <AddToCartForm
            showQuantitySelector={showQuantitySelector}
            showShopPay={props.shopPayButton}
            variants={variantsContextData?.variants}
          />
        </div>
        {hasLimitedInventory && (
          <div className="rounded border border-amber-500 bg-amber-50 p-3 text-sm text-amber-900">
            <p className="font-medium">Very limited quantity. Promotion not guaranteed, please call customer service (310) 475-0606.</p>
          </div>
        )}
      </>
    );
  }

  const variants = product?.variants?.nodes?.length
    ? (flattenConnection(product.variants) as ProductVariantFragmentFragment[])
    : [];

  const selectedVariant = useSelectedVariant({variants});
  const hasLimitedInventory = selectedVariant?.quantityAvailable !== null && 
                                selectedVariant?.quantityAvailable !== undefined && 
                                selectedVariant?.quantityAvailable > 0 && 
                                selectedVariant?.quantityAvailable < 10;

  return (
    <>
      <div className="grid gap-4">
        <VariantSelector options={product.options} variants={variants} />
        <AddToCartForm
          showQuantitySelector={showQuantitySelector}
          showShopPay={props.shopPayButton}
          variants={variants}
        />
      </div>
      {hasLimitedInventory && (
        <div className="rounded border border-amber-500 bg-amber-50 p-3 text-sm text-amber-900">
          <p className="font-medium">Very limited quantity. Promotion not guaranteed, please call customer service (310) 475-0606.</p>
        </div>
      )}
    </>
  );
}
