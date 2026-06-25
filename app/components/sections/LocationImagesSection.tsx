import type {SectionDefaultProps} from '~/lib/type';
import {
  IMAGE_BANNER_SECTION_FRAGMENT,
  LOCATION_IMAGES_SECTION_FRAGMENT,
} from '~/qroq/sections';
import type {TypeFromSelection} from 'groqd';
import {
  Banner,
  BannerContent,
  BannerMedia,
  BannerMediaOverlay,
} from '../Banner';
import {useColorsCssVars} from '~/hooks/useColorsCssVars';
import {SanityImage} from '../sanity/SanityImage';
import {useSection} from '../CmsSection';
import BannerRichtext from '../sanity/richtext/BannerRichtext';
import type {PortableTextBlock} from '@portabletext/types';

type LocationImagesSectionProps = TypeFromSelection<
  typeof LOCATION_IMAGES_SECTION_FRAGMENT
>;

type BannerSectionProps = TypeFromSelection<
  typeof IMAGE_BANNER_SECTION_FRAGMENT
>;

export function LocationImagesSection(
  props: SectionDefaultProps & {data: LocationImagesSectionProps},
) {
  const {data} = props;
  const section = useSection();
  const style = {
    '--maxWidth': data.bannerWidth ? `${data.bannerWidth}px` : 'auto',
    '--banner-height': data.bannerWidth ? `${data.bannerHeight}px` : 'auto',
    width: data.bannerWidth ? `${data.bannerWidth}px` : 'auto',
    height: data.bannerWidth ? `${data.bannerHeight}px` : 'auto',
  } as React.CSSProperties;
  return (
    <div className="home-three-block container relative">
      <h3 className="mb-[30px]">{data?.title}</h3>
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
          <div className="private-dining-locations" key={index}>
            {banner.contentType === 'outerContent' ? (
              <div
                id={banner.contentType + index}
                className={`${data.showContent} items-center bg-[${banner?.backgroundColor?.hex}] text-[${banner?.foregroundColor?.hex}]`}
              >
                {/* Left: SanityImage */}
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
                <style dangerouslySetInnerHTML={{__html: colorsCssVars}} />
                {banner.content ? (
                  <div className={`flex-[1]`}>
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
              <Banner
                height={data.bannerHeight}
                className={`bg-[${banner?.backgroundColor?.hex}]`}
              >
                <style dangerouslySetInnerHTML={{__html: colorsCssVars}} />
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
                    aspectRatio="16/9"
                  />
                </BannerMedia>
                <BannerMediaOverlay opacity={banner?.overlayOpacity} />
                <BannerContent
                  contentAlignment={banner?.contentAlignment}
                  contentPosition={banner?.contentPosition}
                >
                  <BannerRichtext
                    value={banner.content as PortableTextBlock[]}
                  />
                </BannerContent>
              </Banner>
            )}
          </div>
        );
      })}
    </div>
  );
}
