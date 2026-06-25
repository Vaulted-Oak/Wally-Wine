import type {
  CartApiQueryFragment,
  CartLineFragment,
} from 'storefrontapi.generated';

import {useOptimisticData} from '@shopify/hydrogen';
import type {Cart as CartType} from '@shopify/hydrogen/storefront-api-types';

import {CartDetails} from './CartDetails';
import {CartEmpty} from './CartEmpty';

export type CartLayouts = 'drawer' | 'page';

interface UpdatedCartApiQueryFragment extends CartApiQueryFragment {
  discountAllocations: CartType['discountAllocations'];
}
export function Cart({
  cart,
  layout,
  loading,
  onClose,
}: {
  cart?: UpdatedCartApiQueryFragment;
  layout: CartLayouts;
  loading?: boolean;
  onClose?: () => void;
}) {
  let totalQuantity = cart?.totalQuantity;
  const optimisticData = useOptimisticData<{
    action?: string;
    line?: CartLineFragment;
    lineId?: string;
  }>('cart-line-item');

  if (optimisticData?.action === 'remove' && optimisticData?.lineId) {
    const nextCartLines = cart?.lines?.nodes.filter(
      (line) => line.id !== optimisticData.lineId,
    );
    if (nextCartLines?.length === 0) {
      totalQuantity = 0;
    }
  } else if (optimisticData?.action === 'add') {
    totalQuantity = optimisticData?.line?.quantity;
  }

  const empty = !cart || Boolean(totalQuantity === 0);

  return (
    <>
      <CartEmpty layout={layout} onClose={onClose} show={!loading && empty} />
      <CartDetails
        checkoutUrl={cart?.checkoutUrl}
        cost={cart?.cost}
        discountCodes={cart?.discountCodes || []}
        discountAmount={cart?.discountAllocations || []}
        layout={layout}
        lines={cart?.lines}
        note={cart?.note}
        onClose={onClose}
        totalQuantity={totalQuantity}
      />
    </>
  );
}
