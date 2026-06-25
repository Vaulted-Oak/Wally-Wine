import type {PortableTextComponents} from '@portabletext/react';
import type {PortableTextBlock} from '@portabletext/types';
import type {TypeFromSelection} from 'groqd';

import {PortableText} from '@portabletext/react';
import {useMemo} from 'react';

import type {SectionDefaultProps} from '~/lib/type';
import type {IMAGE_BANNER_SECTION_FRAGMENT} from '~/qroq/sections';

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
  typeof IMAGE_BANNER_SECTION_FRAGMENT
>;

import React from 'react';

export function ImageBannerWithContentSection(
  props: SectionDefaultProps & { data: ImageBannerSectionProps },
) {
  const { data } = props;
  const { contentAlignment, contentPosition, overlayOpacity } = data;
  const section = useSection();
  return (
    <div className="flex items-center">
      {/* Left: SanityImage */}
      <div className="flex-[2]">
        <SanityImage
          aspectRatio="16/9"
          data={data.backgroundImage}
          decoding="sync"
          draggable={false}
          fetchpriority={'auto'}
          loading={'lazy'}
          showBorder={false}
          showShadow={false}
          sizes="100vw"
        />
      </div>

      {/* Right: BannerContent */}
      <div
        className={`flex-[1] p-4 ${contentAlignment === 'right' ? 'text-right' : 'text-left'}`}
      >
        <BannerContent
          contentAlignment={contentAlignment}
          contentPosition={contentPosition}
        >
          <BannerRichtext value={data.content as PortableTextBlock[]} />
        </BannerContent>
      </div>
    </div>
  );
}

function BannerRichtext(props: {value?: null | PortableTextBlock[]}) {
  const components = useMemo(
    () => ({
      types: {
        button: (props: {value: ButtonBlockProps}) => (
          <ButtonBlock {...props.value} />
        ),
      },
    }),
    [],
  );

  if (!props.value) return null;

  return (
    <div className="space-y-4 text-balance [&_a:not(last-child)]:mr-4">
      <PortableText
        components={components as PortableTextComponents}
        value={props.value}
      />
    </div>
  );
}
