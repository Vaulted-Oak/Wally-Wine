import React, { Fragment } from 'react';
import imageUrlBuilder from '@sanity/image-url';
import type { SectionDefaultProps } from '~/lib/type';
import { TypeFromSelection } from 'groqd';
import { EVENT_SECTION_FRAGMENT } from '~/qroq/restaurantSections';
import { PortableTextBlock } from '@portabletext/types';
import { useRootLoaderData } from '~/root';
import { BannerRichtext } from './RestaurantCollectionSection';

type EventSectionProps = TypeFromSelection<
    typeof EVENT_SECTION_FRAGMENT
>;

export function EventSection(
    props: SectionDefaultProps & { data: EventSectionProps },
) {
    const rootData = useRootLoaderData();
  const { env } = rootData || {};
    const { data } = props;
    const config = {
        dataset: env.SANITY_STUDIO_DATASET,
        projectId: env.SANITY_STUDIO_PROJECT_ID,
    };
    const aspectWidth = 470;
    const aspectHeight = 430;
    const cropToFit = data.event?.cropImageToFit !== false;
    const urlBuilder = data.event?.backgroundImage?.asset?._ref
        ? (() => {
              const builder = imageUrlBuilder({
                  dataset: config.dataset,
                  projectId: config.projectId,
              })
                  .image({
                      _ref: data?.event?.backgroundImage?.asset?._ref,
                      crop: data?.event?.backgroundImage?.crop,
                      hotspot: data?.event?.backgroundImage?.hotspot,
                  })
                  .auto('format')
                  .width(aspectWidth * 2);
              return cropToFit ? builder.height(aspectHeight * 2) : builder;
          })()
        : null;
    const imageUrl = urlBuilder ? urlBuilder.url() : null;
    return (
        <Fragment>
            <div className="container feature-event mt-[40px] mb-[60px]">
                <h3 className='text-center mb-[40px] text-[32px] uppercase tracking-[2px]'>{data?.event?.title}</h3>
                <div className='flex lg:p-[50px] p-[20px] bg-lightGreen feature-event-container justify-between flex-wrap md:flex-nowrap items-start'>
                    <div className="md:flex-[0_0_42%] flex-[0_0_100%] mb-[20px] md:mb-0 min-h-0 w-full relative overflow-hidden [aspect-ratio:470/430] shrink-0">
                        {imageUrl && (
                            <img
                                src={imageUrl}
                                alt={data.event?.backgroundImage?.altText || 'Event'}
                                loading="lazy"
                                fetchPriority="low"
                                width={aspectWidth}
                                height={aspectHeight}
                                className={
                                    'absolute inset-0 size-full object-center ' +
                                    (cropToFit ? 'object-cover' : 'object-contain')
                                }
                            />
                        )}
                    </div>
                    <div className="md:flex-[0_0_54%] flex-[0_0_100%]">
                        <BannerRichtext hideTitle={true} dressCode={true} restaurant={data.event}
                                        value={data.event.content as PortableTextBlock[]}/>
                    </div>
                </div>
            </div>
        </Fragment>

    )
}
