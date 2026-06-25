
import type { TypeFromSelection } from 'groqd';
import type { SectionDefaultProps } from '~/lib/type';
import type { FOOTER_SECTION_FRAGMENT } from '~/qroq/sections';

type ImageBannerSectionProps = TypeFromSelection<
    typeof FOOTER_SECTION_FRAGMENT
>;

import React, { useState, useEffect } from 'react';
import { ImageBlock } from '../sanity/richtext/components/ImageBlock';
import Newsletter from '../footers/NewsLetter';
import { SanityInternalLink } from '../sanity/link/SanityInternalLink';
import { Link } from 'react-router';

export function FooterSection(
    props: SectionDefaultProps & { data: ImageBannerSectionProps },
) {
    const { data } = props;
    const [parsedSocialMedia, setParsedSocialMedia] = useState<React.ReactNode>(null);

    useEffect(() => {
        // Dynamically import html-react-parser only on client side
        if (data.socialMedia) {
            import('html-react-parser').then((module) => {
                const parse = module.default;
                setParsedSocialMedia(parse(data.socialMedia));
            });
        }
    }, [data.socialMedia]);

    return (
        <footer className="bg-white md:mt-[60px] mt-[40px] pt-[60px] border-t border-primaryGreen text-center md:text-left">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
                <div>
                    <h3 className="text-lg text-primaryGreen mb-[20px]">ABOUT US</h3>
                    <ul className="space-y-4">
                        {data.about?.map((item) => (
                            <li key={item.title} className="list-none">
                                {
                                    item.link ? (
                                        <SanityInternalLink
                                            key={item.title}
                                            data={{
                                                _key: item._key,
                                                anchor: item.anchor,
                                                _type: 'internalLink',
                                                link: item.link,
                                                name: null,
                                            }}
                                            className="hover:underline uppercase"
                                        >
                                            {item.title}
                                        </SanityInternalLink>
                                    ) : (
                                        <Link to={item.externalLink || "#"} className="hover:underline uppercase">
                                            {item.title}
                                        </Link>
                                    )
                                }
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg text-primaryGreen mb-[20px]">HELP</h3>
                    <ul className="space-y-4">
                        {data?.help?.map((item) => (
                            <li key={item.title} className="list-none">
                                {
                                    item.link ? (
                                        <SanityInternalLink
                                            key={item.title}
                                            data={{
                                                _key: item._key,
                                                anchor: item.anchor,
                                                _type: 'internalLink',
                                                link: item.link,
                                                name: null,
                                            }}
                                            className="hover:underline uppercase"
                                        >
                                            {item.title}
                                        </SanityInternalLink>
                                    ) : (
                                        <Link to={item.externalLink || "#"} className="hover:underline uppercase">
                                            {item.title}
                                        </Link>
                                    )
                                }
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h3 className="text-lg text-primaryGreen mb-[20px]">SERVICES</h3>
                    <ul className="space-y-4">
                        {data.services?.map((item) => (
                            <li key={item.title} className="list-none">
                                {
                                    item.link ? (
                                        <SanityInternalLink
                                            key={item.title}
                                            data={{
                                                _key: item._key,
                                                anchor: item.anchor,
                                                _type: 'internalLink',
                                                link: item.link,
                                                name: null,
                                            }}
                                            className="hover:underline uppercase"
                                        >
                                            {item.title}
                                        </SanityInternalLink>
                                    ) : (
                                        <Link to={item.externalLink || "#"} className="hover:underline uppercase">
                                            {item.title}
                                        </Link>
                                    )
                                }
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <Newsletter newsletterText={data.newsletterText} />
                    {parsedSocialMedia}
                </div>
            </div>
            <div className="container border-t border-primaryGreen md:mt-[100px] mt-[50px] py-[40px] flex md:justify-between justify-center items-center text-sm">
                <p>{data.copyright}</p>
                {/*<div className="flex space-x-4">
                    <p className='text-lg font-semibold text-green-700'>PARTNERS</p>
                    {data.partners?.map((logo, index) => (
                        <div key={index} style={{ height: '13px', width: '80px' }}>
                            <ImageBlock maxWidth={null} alignment={'center'} {...logo} _type='image' altText={'image'} asset={logo.asset} _key={index.toString()} _ref='image' />
                        </div>
                    ))}
                </div>*/}
            </div>
        </footer>
    );
}
