import {useProduct} from '@shopify/hydrogen-react';
import React, {useState, useMemo, useCallback} from 'react';
import {Link} from 'react-router';

interface Metafield {
  key: string;
  id: string;
  value: string;
}

export function ProductDetailsBlock() {
  const {product} = useProduct();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleDetails = useCallback(() => {
    setIsOpen((prevState) => !prevState);
  }, []);

  if (!product) return null;

  const sortedMetafields: Metafield[] = useMemo(() => {
    return (product.metafields ?? [])
      .filter((metafield): metafield is Metafield => metafield !== null)
      .sort((a, b) => a.key.localeCompare(b.key));
  }, [product.metafields]);

  if (sortedMetafields.length === 0) return null;

  const getProductType = sortedMetafields.find(
    (field) => field.key === 'product',
  );

  return (
    <Layout>
      <div
        className={`border-t-[1px] border-[#E6EDE8] ${isOpen ? 'isOpen' : ''}`}
      >
        <h3
          className="relative cursor-pointer py-4 text-lg text-primaryBlack before:absolute before:right-0 before:top-[25px] before:h-[2px] before:w-[12px] before:bg-primaryBlack before:content-[''] after:absolute after:right-0 after:top-[25px] after:h-[2px] after:w-[12px] after:rotate-90 after:bg-primaryBlack after:content-['']"
          onClick={toggleDetails}
          aria-expanded={isOpen}
        >
          Product Details
        </h3>
      </div>
      {isOpen && (
        <ul className="border-b-[1px] border-[#E6EDE8] pb-4">
          {sortedMetafields.map((field) => (
            <MetafieldItem
              key={field.key}
              field={field}
              getProductType={getProductType}
            />
          ))}
        </ul>
      )}
    </Layout>
  );
}

function MetafieldItem({
  field,
  getProductType,
}: {
  field: Metafield;
  getProductType?: Metafield;
}) {
  let productCategory = null;

  if (getProductType?.value?.toLocaleLowerCase()?.includes('wine')) {
    productCategory = 'wines';
  } else if (getProductType?.value?.toLocaleLowerCase()?.includes('spirit')) {
    productCategory = 'spirits';
  } else if (getProductType?.value?.toLocaleLowerCase()?.includes('gift')) {
    productCategory = 'gifts';
  }

  const values = field.value
    .split(',')
    .map((value) => encodeURIComponent(value.trim()));
  const queryString = values
    .map((value) => `filter.${field.key}=${value}`)
    .join('&');

  const linkPath = productCategory
    ? `/collections/${productCategory}?${queryString}`
    : `/collections?${queryString}`;

  return (
    <li className="flex py-2">
      <strong className="w-1/2 font-medium capitalize tracking-[1px]">
        {field.key.replace(/_/g, ' ')}:
      </strong>
      <Link
        to={linkPath}
        className="tracking-[1px] text-primaryGreen hover:underline"
      >
        {field.value}
      </Link>
    </li>
  );
}

function Layout({children}: {children: React.ReactNode}) {
  return <div>{children}</div>;
}
