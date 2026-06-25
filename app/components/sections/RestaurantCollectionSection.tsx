import { Fragment, useCallback, useMemo, useState, useEffect } from 'react';
import imageUrlBuilder from '@sanity/image-url';
import type { SectionDefaultProps } from '~/lib/type';
import { TypeFromSelection } from 'groqd';
import { RESTAURANT_COLLECTION_SECTION_FRAGMENT, RESTAURANT_FRAGMENT } from '~/qroq/restaurantSections';
import { PortableTextBlock } from '@portabletext/types';
import { useRootLoaderData } from '~/root';
import { PortableText, PortableTextComponents } from '@portabletext/react';
import { BUTTON_BLOCK_FRAGMENT } from '~/qroq/blocks';
import { SanityInternalLink } from '../sanity/link/SanityInternalLink';
import { Button } from '../ui/Button';
import { Link } from 'react-router';
import { ExternalLinkAnnotation, ExternalLinkAnnotationProps } from '../sanity/richtext/components/ExternalLinkAnnotation';
import { InternalLinkAnnotation, InternalLinkAnnotationProps } from '../sanity/richtext/components/InternalLinkAnnotation';
import { ImageBlock, ImageBlockProps } from '../sanity/richtext/components/ImageBlock';
import { HtmlBlock } from '../sanity/richtext/components/HtmlBlock';
import { ArrayButtonBlock } from '../sanity/richtext/components/ArrayButtonBlock';

type RestaurantCollectionSectionProps = TypeFromSelection<
    typeof RESTAURANT_COLLECTION_SECTION_FRAGMENT
>;

type ButtonBlockProps = TypeFromSelection<typeof BUTTON_BLOCK_FRAGMENT> & {
    telephone?: string | null;
};

export function RestaurantCollectionSection(
    props: SectionDefaultProps & { data: RestaurantCollectionSectionProps },
) {
    const rootData = useRootLoaderData();
  const { env } = rootData || {};
    const { data } = props;
    const config = {
        dataset: env.SANITY_STUDIO_DATASET,
        projectId: env.SANITY_STUDIO_PROJECT_ID,
    };
    return (
        <div className='container mt-[40px] flex justify-between flex-wrap md:flex-nowrap mb-[20px] '>
            {data?.restaurants?.map((restaurant) => {
                const urlBuilder = restaurant?.backgroundImage?.asset?._ref ? imageUrlBuilder({
                    dataset: config.dataset,
                    projectId: config.projectId,
                })
                    .image({
                        _ref: restaurant?.backgroundImage?.asset?._ref,
                        crop: restaurant?.backgroundImage?.crop,
                        hotspot: restaurant?.backgroundImage.hotspot,
                    })
                    .auto('format').width(470).height(500) : null;
                let imageUrl = urlBuilder ? urlBuilder.url() : null;
                return (
                    <div key={restaurant._key} className='md:flex-[0_0_31%] flex-[0_0_100%] relative mb-[30px] lg:mb-0'>
                        <SanityInternalLink
                            key={restaurant._key}
                            data={{
                                _key: restaurant._key,
                                anchor: null,
                                _type: 'internalLink',
                                link: restaurant.link,
                                name: null,
                            }}
                        >
                            {imageUrl && <img
                                className="h-[520px]"
                                src={imageUrl}
                                alt={restaurant?.backgroundImage?.altText}
                                loading={"lazy"}
                                fetchpriority='low'
                                height={520}
                                width={380}
                            />}
                        </SanityInternalLink>
                        <BannerRichtext restaurant={restaurant} value={restaurant.content as PortableTextBlock[]} />
                    </div>
                )
            }
            )}
        </div>
    );
}

export function BannerRichtext(props: { hideTitle?: boolean; dressCode?: boolean; value?: null | PortableTextBlock[]; restaurant?: any }) {
    const { restaurant } = props;
    const [isPopupVisible, setPopupVisible] = useState<boolean>(false);
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
                },
            },
        }),
        [],
    );
    const togglePopup = useCallback(() => {
        setPopupVisible(!isPopupVisible);
    }, [isPopupVisible]);

    useEffect(() => {
        if (isPopupVisible) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isPopupVisible]);

    return (
        <div className="location-details-text">
            <div className="flex flex-wrap items-center mb-[30px] location-desc">
                {props.value ? <PortableText
                    components={components as PortableTextComponents}
                    value={props.value}
                /> : null}
                {restaurant?.leftSide || restaurant?.rightSide ? <div className='flex feature-event-address'>
                    <p>
                        {restaurant?.leftSide?.split('\n').map((line: string, index: number) => (
                            <Fragment key={index}>
                                {line}
                                <br />
                            </Fragment>
                        ))}
                        <Link target="_blank" to={restaurant?.direction || '#'}>Get Directions</Link>
                    </p>
                    <p>
                        {restaurant?.rightSide?.split('\n').map((line: string, index: number) => (
                            <Fragment key={index}>
                                {line}
                                <br />
                            </Fragment>
                        ))}
                    </p>
                </div> : null}
                <div className="text-[16px] location-tel">{restaurant?.telephone}</div>
            </div>
            <div className='flex flex-wrap md:flex-nowrap gap-[20px] md:gap-0 location-time'>
                <p className='md:flex-[0_0_50%] flex-[0_0_100%] leading-[25px]'>
                    {restaurant?.timings?.split('\n').map((line: string, index: number) => (
                        <Fragment key={index}>
                            {line}
                            <br />
                        </Fragment>
                    ))}
                </p>
                {restaurant?.location && <p className='md:flex-[0_0_50%] flex-[0_0_100%]'>
                    <div className="text-[16px] hidden location-tel">{restaurant?.telephone}</div>
                    <h6 className="text-lg font-nromal mb-[20px]">Location</h6>

                    <div className="leading-[25px] mb-[20px]">
                        {restaurant?.location?.split('\n')?.map((line: string, index: number) => (
                            <Fragment key={index}>
                                {line}
                                <br />
                            </Fragment>
                        ))}
                    </div>
                    <Link target="_blank" className="text-primaryGreen underline" to={restaurant?.direction || '#'}>Get Directions</Link>
                    {props.dressCode && (
                        <>
                            <span
                                className="cursor-pointer text-primaryGreen underline block mt-[30px]"
                                onClick={togglePopup}
                            >
                                Dress Code
                            </span>
                            {isPopupVisible &&
                                <DressCode togglePopup={togglePopup} />
                            }
                        </>
                    )}
                </p>}
            </div>
            <div className='flex gap-[20px] mt-[30px] location-buttons'>
                {restaurant?.buttons?.map((button: {
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
                    openInNewTab?: boolean,
                    anchor: string | null
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
                            <Button className={`${button.style} border border-primaryGreen bg-primaryGreen notouch:hover:bg-primary/90 text-white uppercase !font-normal text-[13px]`}>
                                {button.label}
                            </Button>
                        </SanityInternalLink>
                        :
                        <Link key={index} target={`${button?.openInNewTab ? '_blank' : '_self'}`} to={button.externalLink}>
                            <Button className={`${button.style} border border-primaryGreen bg-primaryGreen notouch:hover:!bg-primary/90 text-white uppercase !font-normal text-[13px]`}>
                                {button.label}
                            </Button>
                        </Link>
                ))}
            </div>
            {restaurant?.menuList ? <MenuList menuList={restaurant?.menuList} /> : null}
            {restaurant?.privateDiningbuttons ? <PrivateDiningButtons privateDining={restaurant.privateDining} privateDiningbuttons={restaurant?.privateDiningbuttons} /> : null}
        </div>
    );
}

function ButtonBlock(props: ButtonBlockProps) {
    const backgroundColorClass = `bg-[${props.background?.hex}]`;
    const textColorClass = `text-[${props.foreground?.hex}] border-[${props.foreground?.hex}]`;
    const foregroundColorClass = `text-[${props.foreground?.hex?.toLocaleUpperCase()}]`;
    return (
        <div className='flex'>
            <Button asChild className={`${props.background ? backgroundColorClass : ''} ${props.foreground ? textColorClass : ''} border-2 px-1`}
            >
                {props?.link ?
                    <SanityInternalLink
                        data={{
                            _key: props._key,
                            _type: 'internalLink',
                            anchor: props.anchor,
                            link: props.link,
                            name: null,
                        }}
                        textColorClass={props.foreground?.hex}
                        backgroundColorClass={props.background?.hex}
                    >
                        {props.label}
                    </SanityInternalLink> :
                    <Link className={`${props.foreground ? foregroundColorClass : ''}`} to={props?.externalLink || '#'} target={`${props?.openInNewTab ? '_blank' : '_self'}`}>
                        {props.label}
                    </Link>
                }
            </Button>
        </div>
    );
}

function MenuList(props: any) {

    if (props?.menuList?.length === 0) {
        return;
    };

    return (
        <div className="border-t border-[#E5E5E5] mt-[40px] pt-[40px]">
            <h3 className="text-[24px] mb-[30px]">Menus</h3>
            <div className="flex gap-[30px] max-w-[400px] flex-wrap">
                {props?.menuList?.map((menu: { link: string, name: string, openInNewTab: string }, index: number) => (
                    <Link className="text-[16px] text-primaryGreen underline" to={menu.link} key={index} target={menu.openInNewTab ? "_blank" : undefined}>
                        {menu.name}
                    </Link>
                ))}
            </div>
        </div>
    )
}

function PrivateDiningButtons(props: any) {
    return (
        <div className="border-t border-[#E5E5E5] mt-[40px] pt-[40px]">
            <h3 className="text-[24px] mb-[30px]">Private Dining</h3>
            <p className="leading-[25px]">{props?.privateDining}</p>
            <div className="flex gap-[20px] mt-[30px] border-b border-[#E5E5E5] pb-[40px] location-buttons">
                {props?.privateDiningbuttons?.map((button: {
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
                    openInNewTab?: boolean,
                    anchor: string | null,
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
                        <Link key={index} to={button.externalLink} target={`${button?.openInNewTab ? '_blank' : '_self'}`}>
                            <Button className={`${button.style} border border-green bg-white text-[#00461C]`}>
                                {button.label}
                            </Button>
                        </Link>
                ))}
            </div>
        </div>
    )
}

export function DressCode(props: any) {
    return (
        <div>
            <div className="fixed left-0 top-0 z-[1055] h-full w-full overflow-y-auto overflow-x-hidden outline-none top-[5%] !overflow-hidden md:top-[10%] transform-none">
                <div className="pointer-events-none transition-all duration-300 ease-in-out min-[576px]:mx-auto min-[576px]:mt-7 translate-y-0 opacity-100 relative w-auto min-[576px]:max-w-[500px] pointer-events-auto h-[90vh] overflow-auto">
                    <div className="min-[576px]:shadow-[0_0.5rem_1rem_rgba(#000, 0.15)] pointer-events-auto relative flex w-full flex-col rounded-md border-none bg-white bg-clip-padding text-current shadow-lg outline-none dark:bg-neutral-600 p-[20px]">
                        <h3 className="text-xl mb-[20px]">Dress Code</h3>
                        <p className="leading-[21px]">
                            At Wally's Wine & Spirits, we maintain a polished dress code to complement our sophisticated ambiance. We kindly encourage our guests to select attire that is both elegant and appropriate for our refined setting, avoiding any outfits that may be deemed unsuitable or that could potentially detract from the experiences of others.
                            Entrance to Wally's is under the thoughtful discretion of our management, who reserve the right to kindly refuse service to individuals whose attire does not align with our dress code, regardless of reservation status. In the event that our dress code is not observed, we respectfully invite you to join us at another time or to enjoy our exquisite takeout option.
                        </p>
                        <button
                            onClick={props?.togglePopup}
                            className="mt-4 px-4 py-2 bg-primaryGreen text-white"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
            <div className="h-full transition-all duration-300 ease-in-out fixed top-0 left-0 z-[1040] bg-black w-full block opacity-50"></div>
        </div>
    )
}
