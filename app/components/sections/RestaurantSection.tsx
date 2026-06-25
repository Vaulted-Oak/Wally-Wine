import React, { Fragment, useCallback, useEffect, useState } from 'react';
import imageUrlBuilder from '@sanity/image-url';
import type { SectionDefaultProps } from '~/lib/type';
import { TypeFromSelection } from 'groqd';
import { RESTAURANT_SECTION_FRAGMENT } from '~/qroq/restaurantSections';
import { PortableTextBlock } from '@portabletext/types';
import { useRootLoaderData } from '~/root';
import { BannerRichtext, DressCode } from './RestaurantCollectionSection';
import { useDevice } from '~/hooks/useDevice';
import { Button } from '../ui/Button';
import { SanityInternalLink } from '../sanity/link/SanityInternalLink';
import { Link } from 'react-router';
import { Banner, BannerContent, BannerMedia, BannerMediaOverlay } from '../Banner';
import { useColorsCssVars } from '~/hooks/useColorsCssVars';
import Prism from 'prismjs';
import { MenuList } from '../assets/MenuList';
import { RestaurantBannerRichtext } from '../assets/RestaurantBannerRichtext';
import { InquiryIFrame } from '../assets/InquiryIFrame';
type RestaurantSectionProps = TypeFromSelection<
    typeof RESTAURANT_SECTION_FRAGMENT
>;

export function RestaurantSection(
    props: SectionDefaultProps & { data: RestaurantSectionProps },
) {
    const rootData = useRootLoaderData();
  const { env } = rootData || {};
    const { data } = props;
    const [showIframe, setShowIframe] = useState<boolean>(false);
    useEffect(() => {
        Prism.highlightAll();
    }, [data?.restaurant?.code]);

    const [isPopupVisible, setPopupVisible] = useState<boolean>(false);
    const config = {
        dataset: env?.SANITY_STUDIO_DATASET,
        projectId: env?.SANITY_STUDIO_PROJECT_ID,
    };
    const hasValidConfig = Boolean(config.dataset && config.projectId);
    const urlBuilder = hasValidConfig && data.restaurant?.backgroundImage?.asset?._ref ? imageUrlBuilder({
        dataset: config.dataset,
        projectId: config.projectId,
    })
        .image({
            _ref: data?.restaurant?.backgroundImage?.asset?._ref,
            crop: data?.restaurant?.backgroundImage?.crop,
            hotspot: data?.restaurant?.backgroundImage?.hotspot,
        })
        .auto('format') : null;
    let imageUrl = urlBuilder ? urlBuilder.url() : null;
    const device = useDevice();
    const privateDiningUrlBuilder = hasValidConfig && data.restaurant?.privateDiningImage?.asset?._ref ? imageUrlBuilder({
        dataset: config.dataset,
        projectId: config.projectId,
    })
        .image({
            _ref: data?.restaurant?.privateDiningImage?.asset?._ref,
            crop: data?.restaurant?.privateDiningImage?.crop,
            hotspot: data?.restaurant?.privateDiningImage?.hotspot,
        })
        .auto('format') : null;

    let privateDiningImageUrl = privateDiningUrlBuilder ? privateDiningUrlBuilder.url() : null;

    const togglePopup = useCallback(() => {
        setPopupVisible(!isPopupVisible);
    }, [isPopupVisible]);
    return (
        <div>
            <div className='location-details-row container justify-between flex mt-[40px] lg:mb-[100px] mb-[40px] flex-wrap lg:flex-nowrap items-center'>
                <div className="lg:flex-[0_0_60%] flex-[0_0_100%] col-left mb-[20px] lg:mb-0">
                    {imageUrl && <img
                        src={imageUrl}
                        className="lg:h-[490px]"
                        alt={data.restaurant?.backgroundImage?.altText || "restaurant"}
                        loading={"lazy"}

                        height={490}
                        width={748}
                    />}
                </div>
                <div className="lg:flex-[0_0_40%] flex-[0_0_100%] col-right lg:px-[40px]">
                    <RestaurantBannerRichtext dressCode={true} restaurant={data.restaurant} value={data.restaurant.content as PortableTextBlock[]} setShowIframe={setShowIframe} />
                </div>
            </div>
            <div className='container flex flex-wrap location-details-thumbnail justify-between md:gap-y-[40px] gap-y-[20px]' id="thumbnail">
                {data.restaurant?.thumbnail?.map((image, index) => {
                    const colorsCssVars = useColorsCssVars({
                        selector: `#${image.contentType + index}`,
                        settings: image.settings,
                        important: true
                    });
                    const sectionSelector = `#${image.contentType + index}`;
                    const customCss = image.settings?.customCss?.code
                        ? `${sectionSelector} ${image.settings.customCss.code}`
                        : '';
                    const urlBuilder = image?.backgroundImage?.asset?._ref ? imageUrlBuilder({
                        dataset: config.dataset,
                        projectId: config.projectId,
                    })
                        .image({
                            _ref: image?.backgroundImage?.asset?._ref,
                            crop: image?.backgroundImage?.crop,
                            hotspot: image?.backgroundImage.hotspot,
                        })
                        .auto('format') : null;
                    let imageUrl = urlBuilder ? urlBuilder.url() : null;
                    return imageUrl && !image.settings?.hide && (
                        <div id={image.contentType + index} key={index} style={{
                            paddingTop: `${image?.settings?.padding?.top || 0}px`,
                            paddingBottom: `${image?.settings?.padding?.bottom || 0}px`,
                            background: `${image?.settings?.colorScheme?.background?.hex}`,
                            color: `${image?.settings?.colorScheme?.foreground?.hex}`,
                        }}>
                            <style dangerouslySetInnerHTML={{ __html: colorsCssVars }} />
                            {image.settings?.customCss && (
                                <style dangerouslySetInnerHTML={{ __html: customCss }} />
                            )}
                            {image?.contentType === 'outerContent' ?
                                <Fragment>
                                    <img
                                        src={imageUrl}
                                        alt={image?.backgroundImage?.altText || "restaurant"}
                                        loading={"lazy"}
                                        fetchpriority='low'
                                    />
                                    {image.content ? <div
                                        className={`contentSection ${image?.contentAlignment === 'right' ? 'text-right' : 'text-left'}`}
                                    >
                                        <BannerContent
                                            contentAlignment={image?.contentAlignment}
                                            contentPosition={image?.contentPosition}
                                        >
                                            <BannerRichtext value={image.content as PortableTextBlock[]} />
                                        </BannerContent>
                                    </div> : null}
                                </Fragment> :
                                <Fragment>
                                    <Banner className="recurring-events-banner" height={image?.bannerHeight}>
                                        <BannerMedia>
                                            <img
                                                src={imageUrl}
                                                alt={image?.backgroundImage?.altText || "restaurant"}
                                                loading={"lazy"}
                                                fetchpriority='low'
                                                height={325}
                                                width={258}
                                            />
                                        </BannerMedia>
                                        <BannerMediaOverlay opacity={image?.overlayOpacity} />
                                        <BannerContent
                                            contentAlignment={image?.contentAlignment}
                                            contentPosition={image?.contentPosition}
                                        >
                                            <BannerRichtext value={image?.content as PortableTextBlock[]} />
                                        </BannerContent>
                                    </Banner>
                                </Fragment>
                            }
                        </div>
                    )
                })}
            </div>
            <div className='location-detail-pd bg-lightGreen lg:mt-[80px] mt-[20px] lg:mb-[100px] mb-[40px] py-[40px] lg:py-0'>
                <div className="container lg:relative lg:top-[60px] justify-between flex flex-wrap lg:flex-nowrap">
                    <div className="lg:flex-[0_0_49%] flex-[0_0_100%] col-left">
                        {privateDiningImageUrl && <img
                            src={privateDiningImageUrl}
                            alt={data.restaurant?.backgroundImage?.altText || "restaurant"}
                            loading={"lazy"}
                            fetchpriority='low'
                        />}
                    </div>
                    <div className="lg:flex-[0_0_51%] flex-[0_0_100%] col-right lg:px-[60px] pt-[20px]">
                        <RestaurantBannerRichtext dressCode={true} restaurant={data.restaurant}
                            value={data.restaurant.privateDiningContent as PortableTextBlock[]} setShowIframe={setShowIframe} />
                    </div>
                </div>
            </div>
            {showIframe && data?.restaurant?.code && <InquiryIFrame code={data?.restaurant?.code} setShowIframe={setShowIframe} />}
            <div className="container location-award-list flex-wrap lg:flex-nowrap lg:mt-[120px] flex justify-between gap-[30px] lg:gap-0 lg:mb-[80px] mb-[40px]">
                <div className="lg:flex-[0_0_55%] flex-[0_0_100%]">
                    <h3 className="text-[24px] leading-[43px] mb-[20px]">Hours & Location</h3>
                    <div className='flex flex-col md:flex-row justify-between mb-[40px]'>
                        <div>
                            <p>
                                {data?.restaurant?.timings?.split('\n').map((line: string, index: number) => (
                                    <Fragment key={index}>
                                        <p className='odd:leading-[33px] empty:mb-0 odd:text-[18px] even:leading-[25px] even:mb-[15px] odd:mb-[10px]'>
                                            {line}
                                        </p>
                                    </Fragment>
                                ))}
                            </p>
                        </div>
                        <div className="md:max-w-[175px]">
                            <div className="text-[16px] location-tel mb-[20px]">
                                <Link to={"tel:" + data?.restaurant?.telephone}>
                                    {data?.restaurant?.telephone}
                                </Link>
                            </div>
                            <h6 className="text-lg font-nromal mb-[20px]">Location</h6>
                            <div className="leading-[25px] mb-[20px]">
                                {data?.restaurant?.location?.split('\n')?.map((line: string, index: number) => (
                                    <Fragment key={index}>
                                        {line}
                                        <br />
                                    </Fragment>
                                ))}
                            </div>
                            <Link target="_blank" className="text-primaryGreen underline" to={data?.restaurant?.direction || '#'}>Get Directions</Link>
                            <span
                                className="cursor-pointer text-primaryGreen underline block mt-[30px]"
                                onClick={togglePopup}
                            >
                                Dress Code
                            </span>
                            {isPopupVisible &&
                                <DressCode togglePopup={togglePopup} />
                            }
                        </div>
                    </div>
                    <div className='flex gap-[20px] location-buttons'>
                        {data.restaurant?.buttons?.map((button, index) => (
                            button.link ?
                                <SanityInternalLink
                                    key={index}
                                    data={{
                                        _key: index?.toString(),
                                        anchor: button.anchor,
                                        _type: 'internalLink',
                                        link: button.link,
                                        name: null,
                                    }}
                                >
                                    <Button className={`${button.style} border border-primaryGreen bg-primaryGreen notouch:hover:bg-primary/90 text-white uppercase font-normal text-[13px]`}>
                                        {button.label}
                                    </Button>
                                </SanityInternalLink>
                                :
                                <Link key={index} target={`${button?.openInNewTab ? '_blank' : '_self'}`} to={button.externalLink}>
                                    <Button className={`${button.style} border border-primaryGreen bg-primaryGreen notouch:hover:!bg-primary/90 text-white uppercase font-normal text-[13px]`}>
                                        {button.label}
                                    </Button>
                                </Link>
                        ))}
                    </div>
                </div>
                <div className="lg:flex-[0_0_22%] flex-[0_0_100%]" id="menu-list">
                    {data?.restaurant?.menuList ? <MenuList menuList={data?.restaurant?.menuList} /> : null}
                </div>
                {data?.restaurant?.awards?.map((award, index) => {
                    const urlBuilder = award?.backgroundImage?.asset?._ref ? imageUrlBuilder({
                        dataset: config.dataset,
                        projectId: config.projectId,
                    })
                        .image({
                            _ref: award?.backgroundImage?.asset?._ref,
                            crop: award?.backgroundImage?.crop,
                            hotspot: award?.backgroundImage.hotspot,
                        })
                        .auto('format').width(204).height(376) : null;
                    let imageUrl = urlBuilder ? urlBuilder.url() : null;
                    const colorsCssVars = useColorsCssVars({
                        selector: `#award-${award._key}`,
                        settings: award.settings,
                        important: true
                    });
                    const sectionSelector = `#award-${award._key}`;
                    const customCss = award.settings?.customCss?.code
                        ? `${sectionSelector} ${award.settings.customCss.code}`
                        : '';
                    return !award.settings?.hide && (
                        <div key={index} id={`#award-${award._key}`}
                            style={{
                                paddingTop: `${award?.settings?.padding?.top || 0}px`,
                                paddingBottom: `${award?.settings?.padding?.bottom || 0}px`,
                                background: `${award?.settings?.colorScheme?.background?.hex}`,
                                color: `${award?.settings?.colorScheme?.foreground?.hex}`,
                            }}
                        >
                            {award.settings?.customCss && (
                                <style dangerouslySetInnerHTML={{ __html: customCss }} />
                            )}
                            {imageUrl && <div className="mb-[20px]">
                                <img
                                    src={imageUrl}
                                    alt={award?.backgroundImage?.altText || "awards"}
                                    loading={"lazy"}
                                    fetchpriority='low'
                                    height={376}
                                    width={204}
                                />
                            </div>}
                            <BannerRichtext value={award.content as PortableTextBlock[]} />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
