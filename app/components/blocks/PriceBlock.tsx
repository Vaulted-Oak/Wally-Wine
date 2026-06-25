import type { TypeFromSelection } from 'groqd';
import type { ProductVariantFragmentFragment } from 'storefrontapi.generated';

import { stegaClean } from '@sanity/client/stega';
import { flattenConnection } from '@shopify/hydrogen';
import { useProduct } from '@shopify/hydrogen-react';

import type { PRICE_BLOCK_FRAGMENT } from '~/qroq/blocks';

import { useSanityThemeContent } from '~/hooks/useSanityThemeContent';
import { useSelectedVariant } from '~/hooks/useSelectedVariant';
import { cn } from '~/lib/utils';
import { useRootLoaderData } from '~/root';

import { VariantPrice } from '../product/VariantPrice';
import { useProductVariants } from '../sections/ProductInformationSection';
import { Badge } from '../ui/Badge';

export type PriceBlockProps = TypeFromSelection<typeof PRICE_BLOCK_FRAGMENT>;

export function PriceBlock(props: PriceBlockProps) {
  const { product } = useProduct();
  const variantsContextData = useProductVariants();

  if (!product) return null;

  if (variantsContextData?.variants) {
    return (
      <Layout>
        <span
          className={`${product?.availableForSale ? 'inStock pl-5 text-primaryGreen mb-4 block' : 'outStock text-red-500 mb-4 block'
            }`}
        >
          {product?.availableForSale ? 'In Stock' : 'Out of Stock'}
        </span>
        <VariantPrice variants={variantsContextData?.variants} />
      </Layout>
    );
  }

  const variants = product?.variants?.nodes?.length
    ? (flattenConnection(product.variants) as ProductVariantFragmentFragment[])
    : [];
  return (
    <Layout>
      <span
        className={`${product?.availableForSale ? 'inStock pl-5 text-primaryGreen mb-4 block' : 'outStock text-red-500 mb-4 block'
          }`}
      >
        {product?.availableForSale ? 'In Stock' : 'Out of Stock'}
      </span>
      <VariantPrice variants={variants} />
    </Layout>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return <div className="mb-8">{children}</div>;
}

export function ProductBadges({
  layout,
  variants,
}: {
  layout?: 'card';
  variants: ProductVariantFragmentFragment[];
}) {
  const rootData = useRootLoaderData();
  const { sanityRoot } = rootData || {};
  const data = sanityRoot?.data;
  const { themeContent } = useSanityThemeContent();
  const selectedVariant = useSelectedVariant({ variants });
  const isSoldOut = !selectedVariant?.availableForSale;
  const isOnSale =
    selectedVariant?.price?.amount &&
    selectedVariant?.compareAtPrice?.amount &&
    parseFloat(selectedVariant?.price?.amount) <
    parseFloat(selectedVariant?.compareAtPrice?.amount);
  const badgesPosition = stegaClean(data?.settings?.badgesPosition);

  const badgeClass = cn(
    'bg-background text-foreground hover:bg-background',
  );

  return (
    <div
      className={cn(
        '',
        layout === 'card' && '',
        layout === 'card' && badgesPosition === 'top_left' && '',
        layout === 'card' && badgesPosition === 'top_right' && '',
        layout === 'card' &&
        badgesPosition === 'bottom_left' &&
        'bottom-0 left-0',
        layout === 'card' &&
        badgesPosition === 'bottom_right' &&
        'bottom-0 right-0',
        layout === 'card' && !badgesPosition && 'bottom-0 left-0',
      )}
    >
      {isOnSale && !isSoldOut && (
        <Badge className={badgeClass} data-type="sale-badge">
          {themeContent?.product?.sale}
        </Badge>
      )}
      {isSoldOut && (
        <Badge
          className={badgeClass}
          data-type="sold-out-badge"
          variant="secondary"
        >
          {themeContent?.product?.soldOut}
        </Badge>
      )}
    </div>
  );
}
