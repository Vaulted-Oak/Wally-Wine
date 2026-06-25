import type { TypeFromSelection } from 'groqd';
import type {
  FeaturedCollectionQuery,
  ProductCardFragment,
} from 'storefrontapi.generated';

import { Await, Link, useLoaderData } from 'react-router';
import { flattenConnection } from '@shopify/hydrogen';
import { CSSProperties, Suspense } from 'react';

import type { SectionDefaultProps } from '~/lib/type';
import type { FEATURED_COLLECTION_SECTION_FRAGMENT } from '~/qroq/sections';

import { useLocalePath } from '~/hooks/useLocalePath';
import { useSanityThemeContent } from '~/hooks/useSanityThemeContent';

import type { loader as indexLoader } from '../../routes/_index';

import { ProductCardGrid } from '../product/ProductCardGrid';
import { Skeleton } from '../Skeleton';
import { Button } from '../ui/Button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNextAndPrevButton,
} from '../ui/Carousel';
import { cx } from 'class-variance-authority';
import { ProductCard } from '../product/ProductCard';
import { useDevice } from '~/hooks/useDevice';
import { EmptyObject } from 'type-fest';
type FeaturedCollectionSectionProps = TypeFromSelection<
  typeof FEATURED_COLLECTION_SECTION_FRAGMENT
>;

/**
 * `FeaturedCollectionSection` is a section that displays a collection of products.
 * The collection data is fetched from Shopify using the `featuredCollectionPromise`
 * returned by the loader. The data is streamed to the client so we need to use a `Suspense`
 * component and to display a `Skeleton` while waiting for the data to be available.
 */
export function FeaturedCollectionSection(
  props: SectionDefaultProps & { data: FeaturedCollectionSectionProps },
) {
  const collectionHandle = useLocalePath({
    path: `/collections/${props.data.collection?.store.slug?.current}`,
  });
  const { themeContent } = useSanityThemeContent();
  const slidesPerViewDesktop = props.data.desktopColumns || 3;
  const columnsVar = {
    '--columns': 2,
    '--mobileColumns': 2,
    'slideSize':3
  } as CSSProperties;
  const device = useDevice();
  const isActive =
    device === 'mobile'
      ? props.data.desktopColumns! > 1
      : props.data.desktopColumns! > slidesPerViewDesktop;
  return (
    <Carousel opts={{
      active: true,
      loop: false,
    }} style={
      {
        '--slides-per-view': device === 'mobile' ? 2 : slidesPerViewDesktop,
      } as React.CSSProperties
    }
      className="container space-y-4">
      <div className="relative flex items-center justify-end mb-[60px] location-featured">
        <h2 className="absolute w-full md:text-center md:text-[32px] text-[20px] font-normal uppercase tracking-[1px]">{props.data.heading || props.data.collection?.store.title}</h2>
        {props.data.viewAll && (
          <Button asChild className="inline-flex ml-auto relative z-1" variant="ghost">
            <span className="text-primaryGreen hover:!bg-transparent !font-normal uppercase gap-[8px] mr-auto ml-[10px] md:ml-auto md:mr-[30px]">
              <Link to={collectionHandle}>
                {themeContent?.collection?.viewAll}
              </Link>
              <span>
                <svg width="17" height="13" viewBox="0 0 17 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.5303 7.03033C16.8232 6.73744 16.8232 6.26256 16.5303 5.96967L11.7574 1.1967C11.4645 0.903806 10.9896 0.903806 10.6967 1.1967C10.4038 1.48959 10.4038 1.96447 10.6967 2.25736L14.9393 6.5L10.6967 10.7426C10.4038 11.0355 10.4038 11.5104 10.6967 11.8033C10.9896 12.0962 11.4645 12.0962 11.7574 11.8033L16.5303 7.03033ZM0 7.25H16V5.75H0V7.25Z" fill="#00461C" />
                </svg>
              </span>
            </span>
          </Button>
        )}
        <CarouselNextAndPrevButton />
      </div>
      <AwaitFeaturedCollection
        error={
          <Skeleton isError>
            <div aria-hidden className="animate-pulse">
              <ProductCardGrid
                columns={{
                  desktop: props.data.maxProducts || 3,
                }}
                skeleton={{
                  cardsNumber: props.data.desktopColumns || 3,
                }}
              />
            </div>
          </Skeleton>
        }
        fallback={
          <Skeleton>
            <div aria-hidden className="animate-pulse">
              <ProductCardGrid
                columns={{
                  desktop: props.data.maxProducts || 3,
                }}
                skeleton={{
                  cardsNumber: props.data.desktopColumns || 3,
                }}
              />
            </div>
          </Skeleton>
        }
        sanityData={props.data}
      >
        {(products) => (
          <ul
            style={columnsVar}
          >
            <CarouselContent>
              {products?.map((product, index) => (
                <CarouselItem className="[&>span]:h-full" key={index}>
                  <li className="hover:shadow-cardShadow md:p-[20px] p-[10px] relative duration-500 group"><ProductCard
                    columns={{
                      desktop: props.data.maxProducts,
                      mobile: 1,
                    }}
                    product={product}
                  /></li>
                </CarouselItem>
              ))}
            </CarouselContent>
          </ul>
        )}
      </AwaitFeaturedCollection>
      {props.data.viewAll && (
        <div className="flex justify-center hidden">
          <Button asChild variant="ghost">
            <Link to={collectionHandle}>
              {themeContent?.collection?.viewAll}
            </Link>
          </Button>
        </div>
      )}
    </Carousel>
  );
}


type EmptyObject = {}; // A simple empty object type, non-iterable

type FeaturedCollectionPromise = Promise<
  Array<
    | {
      status: 'fulfilled';
      value: FeaturedCollectionQuery['collection'];
    }
    | {
      status: 'rejected';
      reason: unknown;
    }
  >
>;

// type FeaturedCollectionSectionProps = {
//   collection: {
//     store: {
//       gid: string;
//     };
//   };
// };

type LoaderData = {
  featuredCollectionPromise: FeaturedCollectionPromise;
};

type AwaitFeaturedCollectionProps = {
  children: (products: ProductCardFragment[]) => React.ReactNode;
  error: React.ReactNode;
  fallback: React.ReactNode;
  sanityData: FeaturedCollectionSectionProps;
};

export function AwaitFeaturedCollection(props: AwaitFeaturedCollectionProps) {
  const loaderData = useLoaderData<LoaderData>(); // Fetching loader data

  const featuredCollectionPromise = loaderData?.featuredCollectionPromise;
  const sanityCollectionGid = props.sanityData?.collection?.store.gid;

  if (!featuredCollectionPromise) {
    console.warn(
      '[FeaturedCollectionSection] No featuredCollectionPromise found in loader data.',
    );
    return null;
  }

  return (
    <Suspense fallback={props.fallback}>
      <Await errorElement={props.error} resolve={featuredCollectionPromise}>
        {(data) => {
          let collection:
            | NonNullable<FeaturedCollectionQuery['collection']>
            | null
            | undefined;

          for (const result of data) {
            if (result.status === 'fulfilled') {
              const { collection: resultCollection } = result.value;
              if (sanityCollectionGid === resultCollection?.id) {
                collection = resultCollection;
                break;
              }
            } else if (result.status === 'rejected') {
              return props.error;
            }
          }

          const products =
            collection?.products?.nodes && collection?.products?.nodes.length
              ? flattenConnection(collection?.products)
              : [];

          return <>{products && props.children(products)}</>;
        }}
      </Await>
    </Suspense>
  );
}
