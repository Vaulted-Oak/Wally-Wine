import type {ProductVariantFragmentFragment} from 'storefrontapi.generated';

import {useSelectedVariant} from '~/hooks/useSelectedVariant';

import {ShopifyMoney} from '../ShopifyMoney';

export function VariantPrice({
  variants,
}: {
  variants: ProductVariantFragmentFragment[];
}) {
  const selectedVariant = useSelectedVariant({variants});
  const price = selectedVariant?.price;
  const compareAtPrice = selectedVariant?.compareAtPrice;

  return (
    <div className="flex gap-[10px] items-center text-[20px]">
      {compareAtPrice?.amount && price?.amount && parseFloat(price.amount) < parseFloat(compareAtPrice?.amount) && (
        <ShopifyMoney
          className="line-through text-[#423F3F]"
          data={compareAtPrice}
        />
      )}
      {price && <ShopifyMoney className="text-primaryRed font-bold" data={price} />}
    </div>
  );
}

export function VariantPriceSkeleton() {
  return (
    <div aria-hidden className="text-lg">
      <span className="opacity-0">Skeleton</span>
    </div>
  );
}
