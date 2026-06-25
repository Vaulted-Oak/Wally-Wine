import type { TypeFromSelection } from 'groqd';

import { useParams } from 'react-router';
import { useProduct } from '@shopify/hydrogen-react';

import type { SHOPIFY_TITLE_BLOCK_FRAGMENT } from '~/qroq/blocks';
import { Product } from '@shopify/hydrogen/storefront-api-types';
import { Fragment } from 'react/jsx-runtime';

export type ShopifyTitleBlockProps = TypeFromSelection<
  typeof SHOPIFY_TITLE_BLOCK_FRAGMENT
>;

export function ShopifyTitleBlock(props: ShopifyTitleBlockProps) {
  const { product } = useProduct();

  const params = useParams();

  if (!product) return null;

  return params.productHandle ? (
    <Fragment>
      <h1 className='text-xl md:text-2xl lg:text-4xl mb-6 leading-[normal]'>{product?.title}</h1>
      <span className='mb-6 block tracking-[1px]'>{product?.variants?.nodes?.[0]?.sku ? `SKU: ${product?.variants?.nodes?.[0]?.sku}` : null}</span>
    </Fragment>
  ) : (
    <Fragment>
      <h2 className='text-4xl mb-6 leading-[normal]'>{product?.title}</h2>
      <span className='mb-6 block tracking-[1px]'>{product?.variants?.nodes?.[0]?.sku ? `SKU: ${product?.variants?.nodes?.[0]?.sku}` : null}</span>
    </Fragment>
  );
}
