import { Fragment } from 'react';
import type { SectionDefaultProps } from '~/lib/type';
import type { MULTI_IMAGE_CAROUSEL_COLLECTION_SECTION_FRAGMENT } from '~/qroq/sections';
import { TypeFromSelection } from 'groqd';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNextAndPrevButton,
    CarouselPagination,
} from '../ui/Carousel';
import { BannerContent } from '../Banner';
import type { PortableTextBlock } from '@portabletext/types';
import { useRootLoaderData } from '~/root';
import imageUrlBuilder from '@sanity/image-url';
import BannerRichtext from '../sanity/richtext/BannerRichtext';

type MultiImageCarouselCollectionSection = TypeFromSelection<
    typeof MULTI_IMAGE_CAROUSEL_COLLECTION_SECTION_FRAGMENT
>;

export function MultiImageCarouselCollectionSection(
    props: SectionDefaultProps & { data: MultiImageCarouselCollectionSection },
) {
    const rootData = useRootLoaderData();
  const { env } = rootData || {};
    const { data } = props;

    const config = {
        dataset: env.SANITY_STUDIO_DATASET,
        projectId: env.SANITY_STUDIO_PROJECT_ID,
    };

    return (
        <div className="container">
            {data?.carouselItems?.map((carouselItem, index) => {
                return (
                    <div
                        key={index}
                        className={`grid grid-cols-1 lg:grid-cols-2 lg:gap-12 gap-6 items-center lg:my-12 my-6`}
                    >
                        {index % 2 === 0 ? (
                            <>
                                {/* Content First, Image Second */}
                                {carouselItem?.content && (
                                    <div className="order-1 lg:order-0">
                                        <BannerContent
                                            contentAlignment="left"
                                            contentPosition="middle_left"
                                        >
                                            <BannerRichtext value={carouselItem?.content as PortableTextBlock[]} />
                                        </BannerContent>
                                    </div>
                                )}
                                <Carousel
                                    opts={{
                                        active: true,
                                        loop: false,
                                    }}
                                    style={{ '--slides-per-view': 1 } as React.CSSProperties}
                                    className="max-w-[600px] mx-auto order-0 lg:order-1"
                                >
                                    <CarouselContent>
                                        {carouselItem?.carouselImages?.map((images, index) => {
                                            const urlBuilder = images?.asset?._ref
                                                ? imageUrlBuilder({
                                                    dataset: config.dataset,
                                                    projectId: config.projectId,
                                                })
                                                    .image({
                                                        _ref: images?.asset?._ref,
                                                        crop: images?.crop,
                                                        hotspot: images?.hotspot,
                                                    })
                                                    .auto('format')
                                                    .width(584)
                                                    .height(365)
                                                : null;
                                            let imageUrl = urlBuilder ? urlBuilder.url() : null;
                                            return (
                                                imageUrl && (
                                                    <CarouselItem className="[&>span]:h-full" key={index}>
                                                        <img
                                                            src={imageUrl}
                                                            alt="carousel"
                                                            loading="lazy"
                                                            fetchpriority="low"
                                                            height={365}
                                                            width={584}
                                                            className="w-full h-auto"
                                                        />
                                                    </CarouselItem>
                                                )
                                            );
                                        })}
                                    </CarouselContent>
                                    <CarouselPagination />
                                    <CarouselNextAndPrevButton className="hidden lg:flex" />
                                </Carousel>
                            </>
                        ) : (
                            <>
                                {/* Image First, Content Second */}
                                <Carousel
                                    opts={{
                                        active: true,
                                        loop: false,
                                    }}
                                    style={{ '--slides-per-view': 1 } as React.CSSProperties}
                                    className="max-w-[600px] mx-auto"
                                >
                                    <CarouselContent>
                                        {carouselItem?.carouselImages?.map((images, index) => {
                                            const urlBuilder = images?.asset?._ref
                                                ? imageUrlBuilder({
                                                    dataset: config.dataset,
                                                    projectId: config.projectId,
                                                })
                                                    .image({
                                                        _ref: images?.asset?._ref,
                                                        crop: images?.crop,
                                                        hotspot: images?.hotspot,
                                                    })
                                                    .auto('format')
                                                    .width(584)
                                                    .height(365)
                                                : null;
                                            let imageUrl = urlBuilder ? urlBuilder.url() : null;
                                            return (
                                                imageUrl && (
                                                    <CarouselItem className="[&>span]:h-full" key={index}>
                                                        <img
                                                            src={imageUrl}
                                                            alt="carousel"
                                                            loading="lazy"
                                                            fetchpriority="low"
                                                            height={365}
                                                            width={584}
                                                            className="w-full h-auto"
                                                        />
                                                    </CarouselItem>
                                                )
                                            );
                                        })}
                                    </CarouselContent>
                                    <CarouselPagination />
                                    <CarouselNextAndPrevButton className="hidden lg:flex" />
                                </Carousel>
                                {carouselItem?.content && (
                                    <div className="">
                                        <BannerContent
                                            contentAlignment="left"
                                            contentPosition="middle_right"
                                        >
                                            <BannerRichtext value={carouselItem?.content as PortableTextBlock[]} />
                                        </BannerContent>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
