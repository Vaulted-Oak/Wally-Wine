import type {
  Media_ExternalVideo_Fragment,
  Media_MediaImage_Fragment,
  Media_Model3d_Fragment,
  Media_Video_Fragment,
} from 'storefrontapi.generated';

import {useLoaderData} from 'react-router';
import {flattenConnection} from '@shopify/hydrogen';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Image} from '@shopify/hydrogen-react';
import type {loader} from '~/routes/products.$productHandle';

import {useDevice} from '~/hooks/useDevice';
import {type AspectRatioData, cn} from '~/lib/utils';

import type {CarouselApi} from '../ui/Carousel';

import {ShopifyImage} from '../ShopifyImage';
import {Badge} from '../ui/Badge';
import {
  Carousel,
  CarouselContent,
  CarouselCounter,
  CarouselItem,
} from '../ui/Carousel';
import {FeaturedProductSectionProps} from '../sections/FeaturedProductSection';
import {ProductInformationSectionProps} from '../sections/ProductInformationSection';
import {Product} from '@shopify/hydrogen/storefront-api-types';
import {ProductBadges} from '../blocks/PriceBlock';
import {useRootLoaderData} from '~/root';

type Media =
  | Media_ExternalVideo_Fragment
  | Media_MediaImage_Fragment
  | Media_Model3d_Fragment
  | Media_Video_Fragment;

interface Metafield {
  key: string;
  id: string;
  value: string;
}

interface ProductMetaFields extends Product {
  vinuos?: Metafield;
  wineAdvocate?: Metafield;
  wineEnthusiast?: Metafield;
  wineSpectator?: Metafield;
  expertRated?: Metafield;
  futures?: Metafield;
  topPick?: Metafield;
  vinuosNotes: Metafield[];
  wineSpectatorNotes: Metafield[];
  wineEnthusiastNotes: Metafield[];
  wineAdvocateNotes: Metafield[];
}
export function MediaGallery(props: {
  aspectRatio?: AspectRatioData;
  data: FeaturedProductSectionProps | ProductInformationSectionProps;
}) {
  const {product} = useLoaderData<typeof loader>();
  const rootData = useRootLoaderData();
  const {env} = rootData || {};
  const [selectedRating, setSelectedRating] = useState<string | null>(null);
  const medias = product?.media?.nodes.length
    ? flattenConnection(product.media)
    : [];
  const [activeMediaId, setActiveMediaId] = useState<null | string>(null);
  const selectedImage =
    medias.find((media) => media?.id === activeMediaId) || medias[0];

  //if (!selectedImage) return null;
  const productWithMetaFields = product as ProductMetaFields;
  const details = useMemo(() => {
    const metafields: {key: string; id: string; value: string}[] = [];
    const addField = (key: string, value?: {id: string; value: string}) => {
      if (value?.value) {
        metafields.push({
          key,
          id: value.id,
          value: value.value,
        });
      }
    };

    addField('wineAdvocate', productWithMetaFields.wineAdvocate);
    addField('wineEnthusiast', productWithMetaFields.wineEnthusiast);
    addField('wineSpectator', productWithMetaFields.wineSpectator);
    addField('vinuos', productWithMetaFields.vinuos);

    return metafields;
  }, [productWithMetaFields, product?.handle]);

  const formatButtonData = useMemo(
    () => (key: string, value: string) => {
      const [number] = value.split('|');
      const abbreviations: Record<string, string> = {
        vinuos: 'V',
        wineAdvocate: 'WA',
        wineEnthusiast: 'WE',
        wineSpectator: 'WS',
      };
      const headings: Record<string, string> = {
        vinuos: 'Vinous',
        wineAdvocate: 'Wine Advocate',
        wineEnthusiast: 'Wine Enthusiast',
        wineSpectator: 'Wine Spectator',
      };
      const textDetails = productWithMetaFields[`${key}Notes`];
      return {
        label: `${abbreviations[key]} | ${number}`,
        number: number,
        text1:
          textDetails.length > 0 && textDetails?.[0]?.value
            ? textDetails?.[0]?.value
            : null,
        text2:
          textDetails.length > 1 && textDetails?.[1]?.value
            ? textDetails?.[1]?.value
            : null,
        text3:
          textDetails.length > 2 && textDetails?.[2]?.value
            ? textDetails?.[2]?.value
            : null,
        heading: headings[key],
      };
    },
    [productWithMetaFields],
  );

  useEffect(() => {
    if (details.length > 0 && !selectedRating) {
      setSelectedRating(details[0].id);
    }
  }, [details, product?.handle, selectedRating]);

  return (
    <div className="relative">
      <div className="absolute left-[20px] z-40 grid space-y-1">
        {productWithMetaFields?.expertRated?.value === 'true' && (
          <span className="expertRated rounded-[2px] bg-[#E6EDE8] px-2 py-1 text-center text-sm text-[#00461C]">
            Expert Rated
          </span>
        )}
        {productWithMetaFields?.futures?.value?.toUpperCase() === 'FUTURES' && (
          <span className="futures rounded-[2px] bg-[#00346B] px-2 py-1 text-center text-sm text-white">
            Futures
          </span>
        )}
        {productWithMetaFields?.topPick?.value === 'true' && (
          <span className="topPick rounded-[2px] bg-[#CC5C1B] px-2 py-1 text-center text-sm text-white">
            Top Pick
          </span>
        )}
        <ProductBadges layout="card" variants={product?.variants.nodes} />
      </div>
      <div className="hidden lg:block">
        {selectedImage ? (
          <MainMedia aspectRatio={props.aspectRatio} media={selectedImage} />
        ) : (
          <Image
            aspectRatio={props.aspectRatio?.value}
            alt="placeholder image"
            src={env.DEFAULT_PRODUCT_IMAGE}
          />
        )}
      </div>
      <MobileCarousel
        selectedImage={selectedImage}
        aspectRatio={props.aspectRatio}
        medias={medias}
      />
      {selectedImage && (
        <ThumbnailCarousel
          medias={medias}
          selectedImage={selectedImage}
          setActiveMediaId={setActiveMediaId}
        />
      )}
      <CriticScoreSection
        details={details}
        selectedRating={selectedRating}
        setSelectedRating={setSelectedRating}
        formatButtonData={formatButtonData}
      />
    </div>
  );
}

function MainMedia({
  aspectRatio,
  media,
}: {
  aspectRatio?: AspectRatioData;
  media: Media;
}) {
  return (
    media?.__typename === 'MediaImage' &&
    media?.image && (
      <img
        className={cn(
          'h-[600px] w-[600px] object-contain', // Ensure the image scales properly
          aspectRatio?.className,
        )}
        src={media.image.url}
        alt={media.image.altText || 'product image'}
        decoding="sync"
        fetchpriority="high"
        loading="lazy"
        width={600}
        height={600}
        sizes="(min-width: 1024px) 50vw, 100vw" // Responsive sizes
      />
    )
  );
}

function MobileMainMedia({
  aspectRatio,
  media,
}: {
  aspectRatio?: AspectRatioData;
  media: Media;
}) {
  return (
    media?.__typename === 'MediaImage' &&
    media?.image && (
      <img
        className={cn(
          'h-[350px] w-[350px] object-contain', // Ensure the image scales properly
          aspectRatio?.className,
        )}
        src={media.image.url}
        alt={media.image.altText || 'product image'}
        decoding="sync"
        fetchpriority="high"
        loading="lazy"
        width={350}
        height={350}
        sizes="(min-width: 1024px) 50vw, 100vw" // Responsive sizes
      />
    )
  );
}

function MobileCarousel({
  aspectRatio,
  medias,
  selectedImage,
}: {
  aspectRatio?: AspectRatioData;
  medias: Media[];
  selectedImage: Media;
}) {
  const device = useDevice();
  const isActive = medias.length > 1;
  const rootData = useRootLoaderData();
  const {env} = rootData || {};

  if (!isActive) {
    return (
      <div className="container lg:hidden">
        {medias[0] ? (
          <MobileMainMedia aspectRatio={aspectRatio} media={medias[0]} />
        ) : (
          <Image
            aspectRatio={aspectRatio?.value}
            alt="placeholder image"
            src={env.DEFAULT_PRODUCT_IMAGE}
          />
        )}
      </div>
    );
  }

  return (
    <Carousel
      className="[--slide-size:100%] [--slide-spacing:1rem] lg:hidden"
      opts={{
        active: isActive && device !== 'desktop',
      }}
    >
      <div className="relative">
        <CarouselContent className="px-[--slide-spacing]">
          {medias.map((media, index) => {
            return (
              <CarouselItem
                className="last:pr-[--slide-spacing] [&>span]:h-full"
                key={media.id}
              >
                {media.__typename === 'MediaImage' && media.image && (
                  <img
                    className={cn(
                      'h-[350px] w-[350px] object-contain', // Ensure the image scales properly
                      aspectRatio?.className,
                    )}
                    src={media.image.url}
                    alt={media.image.altText || 'product image'}
                    width={350}
                    height={350}
                    decoding={index === 0 ? 'sync' : 'async'}
                    fetchpriority={index === 0 ? 'high' : 'low'}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    sizes="100vw"
                  />
                )}
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <div className="mt-3 flex items-center justify-center">
          <Badge variant="outline">
            <CarouselCounter>
              <span>{medias.length}</span>
            </CarouselCounter>
          </Badge>
        </div>
      </div>
    </Carousel>
  );
}

function ThumbnailCarousel({
  medias,
  selectedImage,
  setActiveMediaId,
}: {
  medias: Media[];
  selectedImage: Media;
  setActiveMediaId: React.Dispatch<React.SetStateAction<null | string>>;
}) {
  const device = useDevice();
  const slidesPerView = 6;
  const [api, setApi] = useState<CarouselApi>();

  const handleSelect = useCallback(
    (index: number, mediaId: string) => {
      api?.scrollTo(index);
      setActiveMediaId(mediaId);
    },
    [api, setActiveMediaId],
  );

  if (medias.length <= 1) return null;

  return (
    <div className="mt-3 hidden lg:block">
      <Carousel
        className="[--slide-spacing:.5rem]"
        opts={{
          active: device === 'desktop' && slidesPerView < medias.length,
          containScroll: 'keepSnaps',
          dragFree: true,
        }}
        setApi={setApi}
        style={
          {
            '--slides-per-view': slidesPerView,
          } as React.CSSProperties
        }
      >
        <div className="flex items-center gap-2">
          <CarouselContent className="ml-0 py-1">
            {medias.map((media, index) => {
              return (
                <CarouselItem
                  className="px-[calc(var(--slide-spacing)/2)]"
                  key={media.id}
                >
                  {media.__typename === 'MediaImage' && media.image && (
                    <button
                      className={cn(
                        'overflow-hidden rounded-[--media-border-corner-radius] border-2 border-primary border-opacity-0 transition-opacity notouch:hover:border-opacity-100',
                        'ring-offset-background transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                        media.id === selectedImage.id && 'border-opacity-100',
                      )}
                      key={media.id}
                      onClick={() => handleSelect(index, media.id)}
                    >
                      <span className="sr-only">{`Thumbnail ${index + 1}`}</span>
                      <ShopifyImage
                        aspectRatio="1/1"
                        className="size-full object-cover"
                        data={media.image}
                        draggable="false"
                        loading="eager"
                        showBorder={false}
                        showShadow={false}
                        sizes="96px"
                      />
                    </button>
                  )}
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </div>
      </Carousel>
    </div>
  );
}

function CriticScoreSection({
  details,
  selectedRating,
  setSelectedRating,
  formatButtonData,
}: {
  details: {key: string; id: string; value: string}[];
  selectedRating: string | null;
  setSelectedRating: (rating: string | null) => void;
  formatButtonData: (
    key: string,
    value: string,
  ) => {
    label: string;
    text1: string;
    text2: string;
    text3: string;
    heading: string;
    number: string;
  };
}) {
  const selectedDetail = details.find((item) => item.id === selectedRating);
  const selectedContent =
    selectedDetail &&
    formatButtonData(selectedDetail.key, selectedDetail.value);
  // Automatically select the first rating if no selectedRating exists
  useEffect(() => {
    if (!selectedContent && details.length > 0) {
      setSelectedRating(details[0].id);
    }
  }, [selectedRating, details, setSelectedRating]);
  return (
    details &&
    details.length > 0 && (
      <div className="mt-10 bg-lightGreen p-4 md:p-8">
        <h3 className="mb-6 text-2xl font-medium">Critics Scores</h3>
        <div className="mb-6 flex flex-wrap gap-2">
          {details.map((item) => {
            const {label, number} = formatButtonData(item?.key, item?.value);
            const isSelected = selectedRating === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setSelectedRating(isSelected ? null : item.id)}
                className={`${
                  isSelected ? 'bg-primaryGreen text-white' : 'bg-white'
                } cursor-pointer rounded-[4px] border border-primaryBlack px-3 py-2 text-xs text-primaryGreen md:px-4`}
              >
                {isSelected ? `${selectedContent?.heading} | ${number}` : label}
              </button>
            );
          })}
        </div>

        {/* Selected Content */}
        {selectedContent && (
          <div className="mt-2 text-sm">
            <h3 className="my-2 text-lg font-medium text-primaryGreen md:text-xl">
              {selectedContent.heading}
            </h3>
            <p className="text-base leading-[22px] text-primaryBlack">
              {selectedContent.text2 !== "0" ? selectedContent.text2 :null}
            </p>
            <p className="text-base leading-[22px] text-primaryBlack">
              {selectedContent.text3 !== "0" ? selectedContent.text3 : null}
            </p>
          </div>
        )}
      </div>
    )
  );
}
