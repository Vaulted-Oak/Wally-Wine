import type {PortableTextBlock} from '@portabletext/types';
import type {TypeFromSelection} from 'groqd';
import React, {Suspense, useState} from 'react';
import type {SectionDefaultProps} from '~/lib/type';
import type {IMAGE_BANNER_ARRAY_SECTION_FRAGMENT} from '~/qroq/sections';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselNextAndPrevButton,
  CarouselNextAndPrevButtonWithDashes,
  CarouselPrevious,
} from '../ui/Carousel';
import {
  Banner,
  BannerContent,
  BannerMedia,
  BannerMediaOverlay,
} from '../Banner';
import {useSection} from '../CmsSection';
import {SanityImage} from '../sanity/SanityImage';

type ImageBannerSectionProps = TypeFromSelection<
  typeof IMAGE_BANNER_ARRAY_SECTION_FRAGMENT
>;
import {useColorsCssVars} from '~/hooks/useColorsCssVars';
import BannerRichtext from '../sanity/richtext/BannerRichtext';

export function ImageBannerArraySection(
  props: SectionDefaultProps & {data: ImageBannerSectionProps},
) {
  const {data} = props;
  const {contentAlignment, contentPosition, overlayOpacity} = data;
  const slidesPerViewDesktop =
    data?.noOfSlides && data?.noOfSlides > 1 ? data?.noOfSlides : 1;
  const isActive = data?.bannerCollections?.length! > slidesPerViewDesktop;
  const section = useSection();

  return (
    <Carousel
      opts={{
        active: isActive,
        loop: false,
      }}
      style={
        {
          '--slides-per-view': slidesPerViewDesktop,
        } as React.CSSProperties
      }
    >
      <div className="relative min-h-[600px] p-0" id="imageBannerArraySection">
        <div className="mb-[30px] flex items-center justify-between">
          {data?.title ? (
            <h3 className="text-[32px] uppercase tracking-[2px]">
              {data.title}
            </h3>
          ) : null}
          {data.showArrows === 'outer' ? <CarouselNextAndPrevButton /> : null}
        </div>
        {data.showArrows === 'sides' && <CarouselNext />}
        <CarouselContent>
          {data?.bannerCollections?.map((banner: any, index) => {
            const [isImageLoaded, setIsImageLoaded] = useState(false);
            const colorsCssVars = useColorsCssVars({
              selector: `#${banner.contentType + index}`,
              settings: banner.settings,
              important: true,
            });
            const sectionSelector = `#imageBannerArraySection`;
            const customCss = banner.settings?.customCss?.code
              ? `${sectionSelector} ${banner.settings.customCss.code}`
              : '';
            return (
              <CarouselItem className="[&>span]:h-full" key={index}>
                <style dangerouslySetInnerHTML={{__html: colorsCssVars}} />
                {banner.settings?.customCss && (
                  <style dangerouslySetInnerHTML={{__html: customCss}} />
                )}
                {banner.contentType === 'outerContent' ? (
                  <div
                    id={banner.contentType + index}
                    className={`${
                      data.showContentAs === 'grid' ? 'grid' : 'flex flex-wrap'
                    } imageSection section-padding relative items-center bg-background text-foreground [content-visibility:auto] lg:flex-nowrap`}
                  >
                    {/* Left: SanityImage */}
                    <div
                      className={`${
                        data.showContentAs === 'grid'
                          ? ''
                          : 'flex-[0_0_100%] lg:flex-[2]'
                      } lg:h-[600px] min-h-[256px]`}
                    >
                      <SanityImage
                        aspectRatio="16/9"
                        data={banner?.backgroundImage}
                        decoding="async"
                        draggable={false}
                        fetchpriority={section?.index === 0 ? 'high' : 'auto'}
                        loading={section?.index === 0 ? 'eager' : 'lazy'}
                        showBorder={false}
                        showShadow={false}
                        sizes="100vw"
                        className={`h-full ${isImageLoaded ? '' : 'hidden'}`}
                        onLoad={() => setIsImageLoaded(true)}
                        onError={() => setIsImageLoaded(true)}
                        aria-placeholder="blur"
                      />
                    </div>
                    {banner.content ? (
                      <div
                        className={`bannerContent ${
                          data.showContentAs === 'grid'
                            ? ''
                            : 'flex-[0_0_100%] lg:flex-[1]'
                        } p-4 md:p-12 ${
                          contentAlignment === 'right'
                            ? 'text-right'
                            : 'text-left'
                        }`}
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
                  </div>
                ) : (
                  <div
                    id={banner.contentType + index}
                    className="imageSection section-padding relative bg-background text-foreground [content-visibility:auto]"
                  >
                    <style dangerouslySetInnerHTML={{__html: colorsCssVars}} />
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
                      <Banner height={banner.bannerHeight}>
                        <BannerMedia>
                          <SanityImage
                            aspectRatio="16/9"
                            data={banner.backgroundImage}
                            decoding="async"
                            draggable={false}
                            fetchpriority={
                              section?.index === 0 ? 'high' : 'auto'
                            }
                            loading={section?.index === 0 ? 'eager' : 'lazy'}
                            showBorder={false}
                            showShadow={false}
                            sizes="100vw"
                            className={isImageLoaded ? '' : 'hidden'}
                            onLoad={() => setIsImageLoaded(true)}
                            onError={() => setIsImageLoaded(true)}
                            aria-placeholder="blur"
                          />
                        </BannerMedia>
                        <BannerMediaOverlay opacity={overlayOpacity} />
                        <BannerContent
                          contentAlignment={contentAlignment}
                          contentPosition={contentPosition}
                        >
                          <BannerRichtext
                            value={banner.content as PortableTextBlock[]}
                          />
                        </BannerContent>
                      </Banner>
                    </Suspense>
                  </div>
                )}
              </CarouselItem>
            );
          })}
        </CarouselContent>
        {data.showArrows === 'sides' && <CarouselPrevious />}
        {data.showArrows === 'inner' ? (
          <CarouselNextAndPrevButtonWithDashes />
        ) : null}
      </div>
    </Carousel>
  );
}
