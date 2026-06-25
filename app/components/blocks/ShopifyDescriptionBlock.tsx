import type { TypeFromSelection } from 'groqd';

import { useProduct } from '@shopify/hydrogen-react';

import type { SHOPIFY_DESCRIPTION_BLOCK_FRAGMENT } from '~/qroq/blocks';
import { useState } from 'react';

export type ShopifyDescriptionBlockProps = TypeFromSelection<
  typeof SHOPIFY_DESCRIPTION_BLOCK_FRAGMENT
>;

export function ShopifyDescriptionBlock(props: ShopifyDescriptionBlockProps) {
  const { product } = useProduct();
  const [isOpen, setIsOpen] = useState<boolean>(false); // State to track if the accordion is open or closed
  const toggleDescription = () => setIsOpen(!isOpen);

  if (!product || !product.descriptionHtml) return null;

  return (
    <div>
      <div className={`border-y-[1px] border-[#E6EDE8] ${isOpen ? 'isOpen' : ''}`}
      >
        <h3
          className="text-lg text-primaryBlack py-4 cursor-pointer relative before:content-[''] after:content-[''] before:absolute after:absolute before:w-[12px] before:h-[2px] after:w-[12px] after:h-[2px] before:bg-primaryBlack after:bg-primaryBlack before:top-[25px] before:right-0 after:top-[25px] after:right-0 after:rotate-90"
          onClick={toggleDescription}
          aria-expanded={isOpen}
        >  
          Description
        </h3>
      </div>
      {isOpen ? <div
        className="mt-[-1px] bg-white pb-4 border-b-[1px] border-[#E6EDE8] leading-[22px]"
        dangerouslySetInnerHTML={{
          __html: product.descriptionHtml,
        }}
      ></div> : null}
    </div>
  );
}
