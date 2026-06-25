import type {CollectionsQuery} from 'storefrontapi.generated';

import {Link} from 'react-router';
import {stegaClean} from '@sanity/client/stega';
import {cx} from 'class-variance-authority';

import {useLocalePath} from '~/hooks/useLocalePath';
import {cn} from '~/lib/utils';
import {useRootLoaderData} from '~/root';

import {IconArrowRight} from './icons/IconArrowRight';
import {ShopifyImage} from './ShopifyImage';
import {Card, CardContent, CardMedia} from './ui/Card';
import { Suspense } from 'react';

export function CollectionCard(props: {
  className?: string;
  collection?: CollectionsQuery['collections']['nodes'][0];
  columns?: null | number;
  skeleton?: {
    cardsNumber?: number;
  };
}) {
  const {collection, skeleton} = props;
  const rootData = useRootLoaderData();
  const {sanityRoot} = rootData || {};
  const {data} = stegaClean(sanityRoot);
  const style = data?.settings?.collectionCards?.style;
  const textAlignment =
    data?.settings?.collectionCards?.textAlignment || 'left';
  const aspectRatio =
    data?.settings?.collectionCards?.imageAspectRatio || 'video';
  const sizes = cx([
    '(min-width: 1024px)',
    props.columns ? `${100 / props.columns}vw,` : '33vw,',
    '100vw',
  ]);

  const path = useLocalePath({path: `/collections/${collection?.handle}`});

  const cardClass = cn(
    style === 'card'
      ? 'overflow-hidden rounded-[--collection-card-border-corner-radius]'
      : 'rounded-t-[calc(var(--collection-card-border-corner-radius)*1.2)]',
    style === 'card'
      ? 'border-[rgb(var(--border)_/_var(--collection-card-border-opacity))] [border-width:--collection-card-border-thickness]'
      : 'border-0',
    style === 'card'
      ? '[box-shadow:rgb(var(--shadow)_/_var(--collection-card-shadow-opacity))_var(--collection-card-shadow-horizontal-offset)_var(--collection-card-shadow-vertical-offset)_var(--collection-card-shadow-blur-radius)_0px]'
      : 'shadow-none',
    style === 'standard' && 'bg-transparent',
    textAlignment === 'center'
      ? 'text-center'
      : textAlignment === 'right'
        ? 'text-right'
        : 'text-left',
  );

  const cardContentClass = cn(
    'flex flex-wrap items-center py-4',
    textAlignment === 'center'
      ? 'justify-center'
      : textAlignment === 'right'
        ? 'justify-end'
        : 'justify-start',
  );

  return !skeleton && collection ? (
    <Link prefetch="intent" to={path}>
      <Card className={cardClass}>
        {collection.image && (
          <CardMedia
            aspectRatio={aspectRatio}
            className={cn(
              style === 'standard' &&
                'rounded-[--collection-card-border-corner-radius]',
              style === 'standard' &&
                'border-[rgb(var(--border)_/_var(--collection-card-border-opacity))] [border-width:--collection-card-border-thickness]',
              style === 'standard' &&
                '[box-shadow:rgb(var(--shadow)_/_var(--collection-card-shadow-opacity))_var(--collection-card-shadow-horizontal-offset)_var(--collection-card-shadow-vertical-offset)_var(--collection-card-shadow-blur-radius)_0px]',
            )}
          >
            <Suspense
              fallback={
                <div className="placeholder-svg">
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
              <ShopifyImage
                className="h-[150px] w-[150px] rounded-full bg-lightGreen object-cover mix-blend-multiply lg:!h-[200px] lg:!w-[200px]"
                data={collection.image}
                showBorder={false}
                showShadow={false}
                sizes={sizes}
              />
            </Suspense>
          </CardMedia>
        )}
        <CardContent className="p-4 text-center">
          <div className="text-center">
            <span className="text-[16px] font-medium">{collection.title}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  ) : skeleton ? (
    <Card className={cn('animate-pulse', cardClass)}>
      <CardMedia>
        <div
          className={cn(
            'h-auto w-full bg-muted',
            aspectRatio === 'square' && 'aspect-square',
            aspectRatio === 'video' && 'aspect-video',
            aspectRatio === 'auto' && 'aspect-none',
          )}
        />
      </CardMedia>
      <CardContent className={cardContentClass}>
        <div className="flex items-center text-lg">
          <span className="rounded text-muted-foreground/0">
            Skeleton collection title
          </span>
        </div>
      </CardContent>
    </Card>
  ) : null;
}
