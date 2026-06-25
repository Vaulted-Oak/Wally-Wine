import type {PortableTextComponents} from '@portabletext/react';
import type {PortableTextBlock} from '@portabletext/types';
import type {TypeFromSelection} from 'groqd';
import {PortableText} from '@portabletext/react';
import {useMemo, Fragment, Suspense} from 'react';

import type {SectionDefaultProps} from '~/lib/type';
import type {
  BANNER_COLLECTION_SECTION_FRAGMENT,
  IMAGE_BANNER_SECTION_FRAGMENT,
} from '~/qroq/sections';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNextAndPrevButtonWithDashes,
} from '../ui/Carousel';
import type {ButtonBlockProps} from '../sanity/richtext/components/ButtonBlock';

import {
  Banner,
  BannerContent,
  BannerMedia,
  BannerMediaOverlay,
} from '../Banner';
import {useSection} from '../CmsSection';
import {ButtonBlock} from '../sanity/richtext/components/ButtonBlock';
import {SanityImage} from '../sanity/SanityImage';

type ImageBannerSectionProps = TypeFromSelection<
  typeof BANNER_COLLECTION_SECTION_FRAGMENT
>;

type BannerSectionProps = TypeFromSelection<
  typeof IMAGE_BANNER_SECTION_FRAGMENT
>;
import React from 'react';
import {useColorsCssVars} from '~/hooks/useColorsCssVars';
import {useDevice} from '~/hooks/useDevice';
import BannerRichtext from '../sanity/richtext/BannerRichtext';

export function BannerCollectionSection(
  props: SectionDefaultProps & {data: ImageBannerSectionProps},
) {
  const {data} = props;
  const {contentAlignment, contentPosition, overlayOpacity} = data;
  const slidesPerViewDesktop = 1;
  const bannerType = data?.bannerType;
  const isActive =
    bannerType === 'slider' &&
    data?.bannerCollections?.length! > slidesPerViewDesktop;
  const section = useSection();
  const device = useDevice();
  const style = {
    '--maxWidth': data.bannerWidth ? `${data.bannerWidth}px` : 'auto',
    '--banner-height': data.bannerWidth ? `${data.bannerHeight}px` : 'auto',
    width: data.bannerWidth ? `${data.bannerWidth}px` : 'auto',
    height: data.bannerWidth ? `${data.bannerHeight}px` : 'auto',
  } as React.CSSProperties;
  return (
    <Carousel
      opts={{
        active: isActive,
        loop: false,
      }}
      style={
        {
          '--slides-per-view':
            device === 'mobile' ? 1 : data?.bannerCollections?.length,
        } as React.CSSProperties
      }
    >
      <div className="home-three-block container relative">
        {data?.title && <h2>{data?.title}</h2>}
        <CarouselContent>
          {data?.bannerCollections?.map((banner: BannerSectionProps, index) => {
            const colorsCssVars = useColorsCssVars({
              selector: `#${banner.contentType + index}`,
              settings: {
                colorScheme: null,
                customCss: banner.customCss,
                hide: banner.hide,
                padding: banner.padding,
              },
            });
            return (
              <CarouselItem className="[&>span]:h-full" key={index}>
                {banner.contentType === 'outerContent' ? (
                  <div
                    id={banner.contentType + index}
                    className={`${data.showContent} items-center bg-[${banner?.backgroundColor?.hex}] text-[${banner?.foregroundColor?.hex}]`}
                  >
                    {/* Left: SanityImage */}
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
                      <div className="flex-[2]">
                        <SanityImage
                          data={banner.backgroundImage}
                          decoding="sync"
                          style={style}
                          draggable={false}
                          fetchpriority={section?.index === 0 ? 'high' : 'auto'}
                          loading={section?.index === 0 ? 'eager' : 'lazy'}
                          showBorder={false}
                          showShadow={false}
                          sizes="100vw"
                        />
                      </div>
                      {banner.content ? (
                        <div
                          className={`flex-[1] ${contentAlignment === 'right' ? 'text-right' : 'text-left'}`}
                        >
                          <BannerContent
                            contentAlignment={banner?.contentAlignment}
                            contentPosition={banner?.contentPosition}
                          >
                            <BannerRichtext
                              value={banner.content as PortableTextBlock[]}
                            />
                          </BannerContent>
                        </div>
                      ) : null}
                    </Suspense>

                    <style dangerouslySetInnerHTML={{__html: colorsCssVars}} />
                  </div>
                ) : (
                  <Suspense fallback={
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
                  }>
                    <Banner
                      height={data.bannerHeight}
                      className={`bg-[${banner?.backgroundColor?.hex}]`}
                    >
                      <BannerMedia>
                        <SanityImage
                          data={banner.backgroundImage}
                          decoding="sync"
                          style={style}
                          draggable={false}
                          fetchpriority={section?.index === 0 ? 'high' : 'auto'}
                          loading={section?.index === 0 ? 'eager' : 'lazy'}
                          showBorder={false}
                          showShadow={false}
                          sizes="100vw"
                        />
                      </BannerMedia>
                      <div className="absolute bottom-0 left-0 h-full w-full bg-black opacity-50"></div>
                      <div className="absolute bottom-[20px] left-[20px]">
                        <BannerContent
                          contentAlignment={contentAlignment}
                          contentPosition={contentPosition}
                        >
                          <BannerRichtext
                            value={banner.content as PortableTextBlock[]}
                          />
                        </BannerContent>
                      </div>
                    </Banner>
                  </Suspense>
                )}
              </CarouselItem>
            );
          })}
        </CarouselContent>
        {bannerType === 'slider' ? (
          <CarouselNextAndPrevButtonWithDashes />
        ) : null}
      </div>
    </Carousel>
  );
}
