import type { PortableTextBlock } from '@portabletext/types';
import type { TypeFromSelection } from 'groqd';
import type { SectionDefaultProps } from '~/lib/type';
import type { IMAGE_BANNER_SECTION_FRAGMENT } from '~/qroq/sections';

import {
  Banner,
  BannerContent,
  BannerMedia,
  BannerMediaOverlay,
} from '../Banner';
import { useSection } from '../CmsSection';
import { SanityImage } from '../sanity/SanityImage';
import { Fragment } from 'react/jsx-runtime';
import BannerRichtext from '../sanity/richtext/BannerRichtext';

type ImageBannerSectionProps = TypeFromSelection<
  typeof IMAGE_BANNER_SECTION_FRAGMENT
>;

export function ImageBannerSection(
  props: SectionDefaultProps & { data: ImageBannerSectionProps },
) {
  const { data } = props;
  const { contentAlignment, contentPosition, overlayOpacity } = data;
  const section = useSection();
  // Todo: add encodeDataAttribute to SanityImage
  return data.contentType === 'outerContent' ? (
    <Fragment>
      {data.title ? <h3>{data.title}</h3> : null}
      <div className={`flex flex-wrap lg:flex-nowrap items-center who-we-are`}>
        <div className="imageSection lg:flex-[1] flex-[0_0_100%] lg:h-[600px]">
          <SanityImage
            //aspectRatio="16/9"
            data={data?.backgroundImage}
            decoding="sync"
            draggable={false}
            fetchpriority={'auto'}
            loading={'lazy'}
            showBorder={false}
            showShadow={false}
            sizes="100vw"
          />
        </div>
        {data.content ? <div
          className={`contentSection lg:flex-[2] flex-[0_0_100%] md:p-12 p-4 ${contentAlignment === 'right' ? 'text-right' : 'text-left'}`}
        >
          <BannerContent
            contentAlignment={data?.contentAlignment}
            contentPosition={data?.contentPosition}
          >
            <BannerRichtext value={data.content as PortableTextBlock[]} />
          </BannerContent>
        </div> : null}
      </div>
    </Fragment>
  ) : (
    <Fragment>
      {data.title ? <h3 className="recurring-events-title">{data.title}</h3> : null}
      <Banner className="recurring-events-banner" height={data.bannerHeight}>
        <BannerMedia>
          <SanityImage
            //aspectRatio="16/9"
            data={data.backgroundImage}
            decoding="sync"
            draggable={false}
            fetchpriority={'auto'}
            loading={'lazy'}
            showBorder={false}
            showShadow={false}
            sizes="100vw"
          />
        </BannerMedia>
        <BannerMediaOverlay opacity={overlayOpacity} />
        <BannerContent
          contentAlignment={contentAlignment}
          contentPosition={contentPosition}
        >
          <BannerRichtext value={data.content as PortableTextBlock[]} />
        </BannerContent>
      </Banner>
    </Fragment>
  );
}
