import React, { Fragment, useCallback, useMemo, useState } from 'react';
import imageUrlBuilder from '@sanity/image-url';
import type { SectionDefaultProps } from '~/lib/type';
import { TypeFromSelection } from 'groqd';
import { EVENT_COLLECTION_SECTION_FRAGMENT } from '~/qroq/restaurantSections';
import { PortableTextBlock } from '@portabletext/types';
import { useRootLoaderData } from '~/root';
import { ExternalLinkAnnotation, ExternalLinkAnnotationProps } from '../sanity/richtext/components/ExternalLinkAnnotation';
import { InternalLinkAnnotation, InternalLinkAnnotationProps } from '../sanity/richtext/components/InternalLinkAnnotation';
import { ButtonBlock, ButtonBlockProps } from '../sanity/richtext/components/ButtonBlock';
import { ImageBlock, ImageBlockProps } from '../sanity/richtext/components/ImageBlock';
import { HtmlBlock } from '../sanity/richtext/components/HtmlBlock';
import { ArrayButtonBlock } from '../sanity/richtext/components/ArrayButtonBlock';
import { PortableText, PortableTextComponents } from '@portabletext/react';
import { SanityInternalLink } from '../sanity/link/SanityInternalLink';
import { Button } from '../ui/Button';
import { Link } from 'react-router';

type EventSectionProps = TypeFromSelection<
    typeof EVENT_COLLECTION_SECTION_FRAGMENT
>;

export function EventCollectionSection(
    props: SectionDefaultProps & { data: EventSectionProps },
) {
    const rootData = useRootLoaderData();
  const { env } = rootData || {};
    const { data } = props;
    const config = {
        dataset: env.SANITY_STUDIO_DATASET,
        projectId: env.SANITY_STUDIO_PROJECT_ID,
    };
    const [visibleEvents, setVisibleEvents] = useState(data?.eventCollection?.slice(0, data.numberOfEvents || 6));
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const handleLoadMore = useCallback(() => {
        setIsLoadingMore(true);
        const newVisibleEvents = data.eventCollection;
        setVisibleEvents(newVisibleEvents);
        setIsLoadingMore(false);
    }, [data]);

    return (
        <div className="container">
            <div
                className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-[20px] mt-[40px]'>{
                    visibleEvents?.map((event: any) => {
                        const cropToFit = event?.cropImageToFit !== false;
                        const urlBuilder = event?.backgroundImage?.asset?._ref
                            ? (() => {
                                  const b = imageUrlBuilder({
                                      dataset: config.dataset,
                                      projectId: config.projectId,
                                  })
                                      .image({
                                          _ref: event?.backgroundImage?.asset?._ref,
                                          crop: event?.backgroundImage?.crop,
                                          hotspot: event?.backgroundImage?.hotspot,
                                      })
                                      .auto('format')
                                      .width(680);
                                  return cropToFit ? b.height(380) : b;
                              })()
                            : null;
                        const imageUrl = urlBuilder ? urlBuilder.url() : null;
                        return (
                            <div key={event.key} className='p-[30px] bg-lightGreen space-y-4'>
                                {imageUrl && (
                                    <div className="w-full relative overflow-hidden rounded-[2px] [aspect-ratio:340/190]">
                                        <img
                                            src={imageUrl}
                                            alt={event?.backgroundImage?.altText ?? 'Event'}
                                            loading="lazy"
                                            fetchPriority="low"
                                            width={340}
                                            height={190}
                                            className={
                                                'absolute inset-0 size-full object-center ' +
                                                (cropToFit ? 'object-cover' : 'object-contain')
                                            }
                                        />
                                    </div>
                                )}
                                <BannerRichtext eventData={event} value={event.content as PortableTextBlock[]} />
                            </div>
                        )
                    })}
            </div>
            {visibleEvents?.length < data?.eventCollection?.length && (
                <div className="w-full text-center mx-auto mt-[60px]">
                    <button
                        onClick={handleLoadMore}
                        className="bg-white text-primaryGreen hover:bg-primaryGreen hover:text-white duration-500 text-[13px] uppercase border-[2px] border-primaryGreen h-[47px] w-[312px] px-4 py-2"
                        disabled={isLoadingMore}
                    >
                        {isLoadingMore ? "Loading..." : "Load More"}
                    </button>
                </div>
            )}
        </div>
    )
}

export function BannerRichtext(props: { eventData?: any; value?: null | PortableTextBlock[] }) {
    const components = useMemo(
        () => ({
            marks: {
                externalLink: (props: {
                    children: React.ReactNode;
                    value: ExternalLinkAnnotationProps;
                }) => {
                    return (
                        <ExternalLinkAnnotation {...props.value}>
                            {props.children}
                        </ExternalLinkAnnotation>
                    );
                },
                internalLink: (props: {
                    children: React.ReactNode;
                    value: InternalLinkAnnotationProps;
                }) => {
                    return (
                        <InternalLinkAnnotation {...props.value}>
                            {props.children}
                        </InternalLinkAnnotation>
                    );
                },
            },
            types: {
                button: (props: { value: ButtonBlockProps }) => (
                    <ButtonBlock {...props.value} />
                ),
                image: (props: { value: ImageBlockProps }) => (
                    <ImageBlock {...props.value} />
                ),
                buttons: (props: { value: ButtonBlockProps }) => (
                    <ButtonBlock {...props.value} />
                ),
                code: (props: any) => {
                    return <HtmlBlock {...props.value} />
                },
                buttonBlock: (props: any) => {
                    return <ArrayButtonBlock {...props.value} />
                }
            },
        }),
        [],
    );

    if (!props.value) return null;

    return (
        <div className="space-y-4 event-collection-text">
            <PortableText
                components={components as PortableTextComponents}
                value={props.value}
            />
            <p className='md:flex-[0_0_50%] flex-[0_0_100%] leading-[29px] text-[16px]'>
                {props.eventData?.timings?.split('\n').map((line: string, index: number) => (
                    <Fragment key={index}>
                        {line}
                        <br />
                    </Fragment>
                ))}
            </p>
            <div className='flex gap-[20px] mt-[30px] location-buttons'>
                {props?.eventData?.buttons?.map((button: {
                    _key: string, link: {
                        documentType: string;
                        slug: {
                            _type: string;
                            current: string;
                        };
                    } | null,
                    style: string,
                    label: string,
                    externalLink: string,
                    anchor: string | null,
                    openInNewTab?: boolean,
                }, index: number) => (
                    button.link ?
                        <SanityInternalLink
                            key={index}
                            data={{
                                _key: button._key,
                                anchor: button.anchor,
                                _type: 'internalLink',
                                link: button.link,
                                name: null,
                            }}
                        >
                            <Button className={`${button.style} border border-primaryGreen bg-primaryGreen text-white uppercase font-normal text-[13px]`}>
                                {button.label}
                            </Button>
                        </SanityInternalLink>
                        :
                        <Link key={index} to={button.externalLink} target={`${button.openInNewTab ? '_blank' : '_self'}`}>
                            <Button className={`${button.style} border border-green bg-white text-[#00461C]`}>
                                {button.label}
                            </Button>
                        </Link>
                ))}
            </div>
        </div>
    );
}
