import type {ProductCardFragment} from 'storefrontapi.generated';

import {Link} from 'react-router';
import {stegaClean} from '@sanity/client/stega';
import {flattenConnection} from '@shopify/hydrogen';

import {useLocalePath} from '~/hooks/useLocalePath';
import {cn} from '~/lib/utils';
import {useRootLoaderData} from '~/root';
import {Image} from '@shopify/hydrogen-react';
import {ProductBadges} from '../blocks/PriceBlock';
import {ShopifyImage} from '../ShopifyImage';
import {ShopifyMoney} from '../ShopifyMoney';
import {Card, CardContent, CardMedia} from '../ui/Card';
import {AddToCartList} from './AddToCartList';
import {Fragment} from 'react/jsx-runtime';
import {Suspense} from 'react';
import { useDevice } from '~/hooks/useDevice';

interface Metafield {
  key: string;
  id: string;
  value: string;
}

interface CustomProductCardFragment extends ProductCardFragment {
  expertRated?: Metafield;
  futures?: Metafield;
  topPick?: Metafield;
  wineSpectator?: Metafield;
  wineEnthusiast?: Metafield;
  wineAdvocate?: Metafield;
  vinuos?: Metafield;
}
export function ProductCard(props: {
  className?: string;
  columns?: {
    desktop?: null | number;
    mobile?: null | number;
  };
  product?: CustomProductCardFragment;
  skeleton?: {
    cardsNumber?: number;
  };
}) {
  const {columns, product, skeleton} = props;
  const rootData = useRootLoaderData();
  const {sanityRoot, env} = rootData || {};
  const {data} = stegaClean(sanityRoot);
  const style = data?.settings?.productCards?.style;
  const textAlignment = data?.settings?.productCards?.textAlignment || 'left';
  const aspectRatio = data?.settings?.productCards?.imageAspectRatio || 'video';
  const variants = product?.variants?.nodes.length
    ? flattenConnection(product?.variants)
    : null;
  const firstVariant = variants?.[0];
  const sizes = [
    '(min-width: 1024px)',
    columns?.desktop ? `${100 / columns.desktop}vw` : '33vw',
    columns?.mobile ? `${100 / columns.mobile}vw` : '100vw',
  ].join(', ');

  const device = useDevice();
  /**
 * Optional: Extended more granular image sizes
 *
  const sizes = [
    '(min-width: 1200px) and (max-width: 1599px)',
    columns?.desktop ? `${100 / columns.desktop}vw` : '25vw',
    '(min-width: 1024px) and (max-width: 1199px)',
    columns?.desktop ? `${100 / columns.desktop}vw` : '33vw',
    '(min-width: 768px) and (max-width: 1023px)',
    columns?.mobile ? `${100 / columns.mobile}vw` : '50vw',
    '100vw'
  ].join(', ');
 */

  const path = useLocalePath({path: `/products/${product?.handle}`});

  const cardClass = cn(
    style === 'card'
      ? 'overflow-hidden rounded-[--product-card-border-corner-radius]'
      : 'rounded-t-[calc(var(--product-card-border-corner-radius)*1.2)]',
    style === 'card'
      ? 'border-[rgb(var(--border)_/_var(--product-card-border-opacity))] [border-width:--product-card-border-thickness]'
      : 'border-0',
    style === 'card'
      ? '[box-shadow:rgb(var(--shadow)_/_var(--product-card-shadow-opacity))_var(--product-card-shadow-horizontal-offset)_var(--product-card-shadow-vertical-offset)_var(--product-card-shadow-blur-radius)_0px]'
      : 'shadow-none',
    style === 'standard' && 'bg-transparent',
    textAlignment === 'center'
      ? 'text-center'
      : textAlignment === 'right'
        ? 'text-right'
        : 'text-left',
  );

  const priceClass = cn(
    'mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 md:gap-3 [&>*]:overflow-hidden [&>*]:text-ellipsis [&>*]:whitespace-nowrap',
    textAlignment === 'center'
      ? 'justify-center'
      : textAlignment === 'right'
        ? 'justify-end'
        : 'justify-start',
  );

  return (
    <>
      {!skeleton && product && firstVariant ? (
        <Fragment>
          <Link prefetch="intent" to={path}>
            <Card className={cardClass}>
              <CardMedia
                aspectRatio={aspectRatio}
                className={cn(
                  'relative bg-white',
                  style === 'standard' &&
                    'rounded-[--product-card-border-corner-radius]',
                  style === 'standard' &&
                    'border-[rgb(var(--border)_/_var(--product-card-border-opacity))] [border-width:--product-card-border-thickness]',
                  style === 'standard' &&
                    '[box-shadow:rgb(var(--shadow)_/_var(--product-card-shadow-opacity))_var(--product-card-shadow-horizontal-offset)_var(--product-card-shadow-vertical-offset)_var(--product-card-shadow-blur-radius)_0px]',
                )}
              >
                <div className="absolute left-[15px] top-[15px] z-50 grid space-y-1">
                  {product.expertRated?.value === 'true' && (
                    <span className="expertRated rounded-[2px] bg-[#E6EDE8] px-2 py-1 text-center text-[8px] text-[#00461C] md:text-sm">
                      Expert Rated
                    </span>
                  )}
                  {product?.futures?.value?.toUpperCase() === 'FUTURES' && (
                    <span className="futures rounded-[2px] bg-[#00346B] px-2 py-1 text-center text-[8px] text-white md:text-sm">
                      Futures
                    </span>
                  )}
                  {product?.topPick?.value === 'true' && (
                    <span className="topPick rounded-[2px] bg-[#CC5C1B] px-2 py-1 text-center text-[8px] text-white md:text-sm">
                      Top Pick
                    </span>
                  )}
                  <ProductBadges
                    layout="card"
                    variants={product?.variants.nodes}
                  />
                </div>
                <Suspense
                  fallback={
                    <div className="placeholder-svg">
                      {/* Placeholder SVG */}
                      <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect width="24" height="24" fill="#E0E0E0" />
                        <path
                          d="M12 8C10.8954 8 10 8.89543 10 10C10 11.1046 10.8954 12 12 12C13.1046 12 14 11.1046 14 10C14 8.89543 13.1046 8 12 8ZM12 14C9.79086 14 8 15.7909 8 18H16C16 15.7909 14.2091 14 12 14Z"
                          fill="#BDBDBD"
                        />
                      </svg>
                    </div>
                  }
                >
                  {firstVariant?.image?.url ? device  === 'desktop' ? (
                    <img
                      src={firstVariant.image.url || env.DEFAULT_PRODUCT_IMAGE}
                      alt={firstVariant.image.altText || 'product image'}
                      style={{height:"250px",width:"250px",objectFit:"contain"}}
                      sizes={sizes}
                      loading="lazy"
                      fetchpriority="auto"
                      draggable={false}
                      aria-placeholder="blur"
                    />
                  ):(
                    <img
                      src={firstVariant.image.url || env.DEFAULT_PRODUCT_IMAGE}
                      alt={firstVariant.image.altText || 'product image'}
                      style={{height:"170px",width:"170px",objectFit:"contain"}}
                      sizes={sizes}
                      loading="lazy"
                      fetchpriority="auto"
                      draggable={false}
                      aria-placeholder="blur"
                    />
                  ) : (
                    <Image
                      sizes={sizes}
                      aria-placeholder="blur"
                      fetchpriority="auto"
                      draggable={false}
                      loading="lazy"
                      aspectRatio={cn(
                        aspectRatio === 'square' && '1/1',
                        aspectRatio === 'video' && '16/9',
                        aspectRatio === 'auto' && `${271}/${271}`,
                      )}
                      src={env.DEFAULT_PRODUCT_IMAGE}
                      alt="Placeholder Image"
                    />
                  )}
                </Suspense>
                {(product.wineSpectator ||
                  product.wineEnthusiast ||
                  product.wineAdvocate ||
                  product.vinuos) && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <div className="flex flex-wrap justify-center gap-[10px] text-primaryGreen">
                      {product.wineAdvocate && (
                        <span className="rounded-[4px] border border-primaryGreen bg-white px-3 py-1 text-sm">
                          {product.wineAdvocate?.value?.includes('|')
                            ? `WA | ${product.wineAdvocate?.value?.split('|')[0]?.trim()}`
                            : `WA | ${product.wineAdvocate?.value}`}
                        </span>
                      )}
                      {product.wineEnthusiast && (
                        <span className="rounded-[4px] border border-primaryGreen bg-white px-3 py-1 text-sm">
                          {product?.wineEnthusiast?.value?.includes('|')
                            ? `WE | ${product.wineEnthusiast?.value?.split('|')[0]?.trim()}`
                            : `WE | ${product.wineEnthusiast?.value}`}
                        </span>
                      )}
                      {product.wineSpectator && (
                        <span className="rounded-[4px] border border-primaryGreen bg-white px-3 py-1 text-sm">
                          {product.wineSpectator?.value?.includes('|')
                            ? `WS | ${product.wineSpectator?.value?.split('|')[0]?.trim()}`
                            : `WS | ${product.wineSpectator?.value}`}
                        </span>
                      )}
                      {product.vinuos && (
                        <span className="rounded-[4px] border border-primaryGreen bg-white px-3 py-1 text-sm">
                          {product.vinuos?.value?.includes('|')
                            ? `V | ${product.vinuos?.value.split('|')[0]?.trim()}`
                            : `V | ${product.vinuos?.value}`}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </CardMedia>
              <CardContent className="px-0 text-primaryBlack">
                <div className="my-[10px] line-clamp-2 min-h-[32px] text-[12px] leading-[16px] md:my-[20px] md:min-h-[42px] md:text-[16px] md:leading-[21px]">
                  {product.title}
                </div>
                <div className={priceClass}>
                  {firstVariant.compareAtPrice &&
                  parseFloat(firstVariant.price.amount) <
                    parseFloat(firstVariant.compareAtPrice.amount) ? (
                    <>
                      <ShopifyMoney
                        className="line-through"
                        data={firstVariant.compareAtPrice}
                      />
                      <span className="font-bold text-primaryRed">
                        <ShopifyMoney
                          className="text-[11px] md:text-base"
                          data={firstVariant.price}
                        />
                      </span>
                    </>
                  ) : (
                    <ShopifyMoney
                      className="text-[11px] md:text-base"
                      data={firstVariant.price}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
          <AddToCartList productId={product.id} />
        </Fragment>
      ) : skeleton ? (
        <Card className={cn('animate-pulse', cardClass)}>
          <CardMedia aspectRatio={aspectRatio}>
            <div
              className={cn(
                'w-full bg-muted',
                aspectRatio === 'square' && 'aspect-square',
                aspectRatio === 'video' && 'aspect-video',
                aspectRatio === 'auto' && 'aspect-none',
              )}
            />
          </CardMedia>
          <CardContent className="p-3 text-muted-foreground/0 md:px-6 md:py-4">
            <div className="text-lg">
              <span className="rounded">Skeleton product title</span>
            </div>
            <div className={priceClass}>
              <span className="rounded text-sm md:text-base">
                Skeleton price
              </span>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </>
  );
}
