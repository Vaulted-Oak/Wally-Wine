import type { TypeFromSelection } from 'groqd';

import type { ARRAY_BUTTON_BLOCK_FRAGMENT, BUTTON_BLOCK_FRAGMENT } from '~/qroq/blocks';

import { Button } from '~/components/ui/Button';

import { SanityInternalLink } from '../../link/SanityInternalLink';
import { Link } from 'react-router';

export type ButtonBlockProps = TypeFromSelection<typeof ARRAY_BUTTON_BLOCK_FRAGMENT>;

export function ArrayButtonBlock(props: ButtonBlockProps) {
    return (
        <div className='flex flex-wrap justify-between gap-y-[15px]'>
            {props?.buttons?.map((button) => button.link ? <Button key={button._key} asChild
            >
                <SanityInternalLink
                    data={{
                        _key: button._key,
                        _type: 'internalLink',
                        anchor: null,
                        link: button.link,
                        name: null,
                    }}
                    className={`${button.style} lg:flex-[0_0_24%] flex-[0_0_48%] duration-500 border-2 border-primaryGreen bg-white text-primaryGreen hover:text-white font-normal uppercase md:text-[16px] text-[12px] md:h-[80px] h-[50px] w-full`}
                >
                    {button.label}
                </SanityInternalLink>
            </Button> : (
                <Link className="lg:flex-[0_0_24%] flex-[0_0_48%]" key={button._key} to={button?.url || '#'} target={`${button?.openInNewTab ? '_blank' : '_self'}`}>
                    <Button className={`${button.style} duration-500 border-2 border-primaryGreen bg-white text-primaryGreen hover:text-white font-normal uppercase md:text-[16px] text-[12px] md:h-[80px] h-[50px] w-full`}>
                        {button.label}
                    </Button>
                </Link>
            ))}
        </div>
    )
}
