import type { TypeFromSelection } from 'groqd';
import type { CollectionsQuery } from 'storefrontapi.generated';

import { Await, useLoaderData } from 'react-router';
import { CSSProperties, Suspense } from 'react';

import type { SectionDefaultProps } from '~/lib/type';
import type { COLLECTION_LIST_SECTION_FRAGMENT } from '~/qroq/sections';

import type { loader as indexLoader } from '../../routes/_index';

import { CollectionListGrid } from '../CollectionListGrid';
import { Skeleton } from '../Skeleton';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselNextAndPrevButton,
  CarouselPrevious,
} from '../ui/Carousel';
import { useDevice } from '~/hooks/useDevice';
import { flattenConnection } from '@shopify/hydrogen-react';
import { cx } from 'class-variance-authority';
import { CollectionCard } from '../CollectionCard';

type CollectionListSectionProps = TypeFromSelection<
  typeof COLLECTION_LIST_SECTION_FRAGMENT
>;

/**
 * `CollectionListSection` is a section that displays a list of collections.
 * The collections data is fetched from Shopify using the `collectionListPromise`
 * returned by the loader. The data is streamed to the client so we need to use a `Suspense`
 * component and to display a `Skeleton` while waiting for the data to be available.
 */
export function CollectionListSection(
  props: SectionDefaultProps & { data: CollectionListSectionProps },
) {
  const slidesPerViewDesktop = props.data.desktopColumns || 3;
  const columnsVar = {
    '--columns': props.data.desktopColumns ?? 3,
    '--mobileColumns': 1,
  } as CSSProperties;
  const device = useDevice();
  const isActive =
    device === 'mobile'
      ? props.data.desktopColumns! > 1
      : props?.data?.collections ? props?.data?.collections?.length > slidesPerViewDesktop : false;

  return (
    <Carousel opts={{
      active: isActive,
      loop: false,
    }} style={
      {
        '--slides-per-view': device === 'mobile' ? 2 : slidesPerViewDesktop,
      } as React.CSSProperties
    }>
      <AwaitCollectionList
        error={
          <Skeleton isError>
            <div className="container">
              <CollectionListGrid
                columns={props.data.collections?.length || 2}
                skeleton={{
                  cardsNumber: props.data.desktopColumns || 2,
                }}
              />
            </div>
          </Skeleton>
        }
        fallback={
          <Skeleton>
            <div className="container">
              <CollectionListGrid
                columns={props.data.collections?.length || 2}
                skeleton={{
                  cardsNumber: props.data.desktopColumns || 2,
                }}
              />
            </div>
          </Skeleton>
        }
        sanityData={props.data}
      >
        {(collections) => {
          const col = collections?.nodes?.length
            ? flattenConnection(collections)
            : [];
          const desktopColumns = props.data.desktopColumns ?? 3;
          const columnsVar = {
            '--columns': desktopColumns,
          } as CSSProperties;
          const showArrowsDesktop = col.length > desktopColumns;
          const showArrowsMobile = col.length > 2;
          return (
            <div className="container relative popularCategories">
              <div className="md:hidden flex items-center justify-between mb-[40px] gap-[20px]">
                <h2 className='md:text-[32px] text-[20px] font-normal uppercase tracking-[1px]'>{props?.data?.title}</h2>
                {showArrowsMobile && (
                  <div className="flex justify-end gap-[20px]">
                    <CarouselPrevious />
                    <CarouselNext />
                  </div>
                )}
              </div>
              <h2 className='hidden md:block text-[32px] mb-10 text-center uppercase'>{props?.data?.title}</h2>
              {showArrowsDesktop && <CarouselPrevious />}
              <ul
                className="md:px-[50px]"
                style={columnsVar}>
                <CarouselContent>
                  {col && col.length > 0 && col?.map((collection) => (
                    <CarouselItem className="[&>span]:h-full" key={collection.id}>
                      <li className="mx-2" key={collection.id}>
                        <CollectionCard collection={collection} columns={props.data.desktopColumns ?? 3} />
                      </li>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </ul>
              {showArrowsDesktop && <CarouselNext />}
            </div>
          )
        }}
      </AwaitCollectionList>
    </Carousel>
  );
}

function AwaitCollectionList(props: {
  children: (collections: CollectionsQuery['collections']) => React.ReactNode;
  error?: React.ReactNode;
  fallback: React.ReactNode;
  sanityData: CollectionListSectionProps;
}) {
  const loaderData = useLoaderData<typeof indexLoader>();
  const collectionListPromise = loaderData?.collectionListPromise;
  const sanityCollectionListGids = props.sanityData.collections
    ?.map((collection) => collection.store.gid)
    .sort()
    .join(',');

  if (!collectionListPromise) {
    console.warn(
      '[CollectionListSection] No collectionListPromise found in loader data.',
    );
    return null;
  }

  return (
    <Suspense fallback={props.fallback}>
      <Await errorElement={props.error} resolve={collectionListPromise}>
        {(data) => {
          // Resolve the collection list data from Shopify with the gids from Sanity
          let collections:
            | NonNullable<CollectionsQuery['collections']>
            | null
            | undefined;

          for (const result of data) {
            if (result.status === 'fulfilled') {
              const { collections: resultCollections } = result.value;
              const shopifyCollectionListGids = resultCollections.nodes
                .map((collection: { id: number }) => collection.id)
                .sort()
                .join(',');
              // Compare the Sanity gids with the Shopify gids
              if (sanityCollectionListGids === shopifyCollectionListGids) {
                collections = resultCollections;
                break;
              }
            } else if (result.status === 'rejected') {
              return props.error;
            }
          }

          return <>{collections && props.children(collections)}</>;
        }}
      </Await>
    </Suspense>
  );
}
