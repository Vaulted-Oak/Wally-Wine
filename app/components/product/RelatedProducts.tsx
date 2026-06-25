import type { ProductRecommendationsQuery } from 'storefrontapi.generated';

import { ProductCardGrid } from './ProductCardGrid';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNextAndPrevButton,
  CarouselNextAndPrevButtonWithDashes,
} from '../ui/Carousel';
import { ProductCard } from './ProductCard';
import { useDevice } from '~/hooks/useDevice';
export function RelatedProducts(props: {
  columns?: {
    desktop?: null | number;
    mobile?: null | number;
  };
  data: null | ProductRecommendationsQuery;
  heading?: null | string;
  maxProducts: number;
}) {
  const { data } = props;
  const products = data ? getRecommendedProducts(data, props.maxProducts) : [];
  //props.columns?.desktop
  const slidesPerViewDesktop = 4;
  if (products.length === 0) return null;
  const device = useDevice();
  return (
    <Carousel
      opts={{
        active: true,
        loop: false,
      }}
      style={
        {
          '--slides-per-view': device === 'mobile' ? 2 : slidesPerViewDesktop,
        } as React.CSSProperties
      }>
      <div className="flex items-center justify-between mb-[60px]">
        {props.heading && <h2>{props.heading}</h2>}
        <CarouselNextAndPrevButton />
      </div>
      <div className="mt-4">
        <CarouselContent className="p-[3px]">
          {products?.map((product, index) => (
            <CarouselItem className="[&>span]:h-full hover:shadow-cardShadow md:p-[20px] p-[10px] relative group" key={index}>
              <ProductCard
                columns={{
                  desktop: props.columns?.desktop,
                  mobile: 1,
                }}
                product={product}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </div>
    </Carousel>
  );
}

function getRecommendedProducts(
  data: ProductRecommendationsQuery,
  maxProducts: number,
) {
  const mergedProducts = (data.recommended ?? [])
    .concat(data.additional.nodes)
    .filter(
      (value, index, array) =>
        array.findIndex((value2) => value2.id === value.id) === index,
    );

  const originalProduct = mergedProducts.findIndex(
    (item) => item.id === data.mainProduct?.id,
  );

  mergedProducts.splice(originalProduct, 1);

  if (mergedProducts.length > maxProducts) {
    mergedProducts.splice(maxProducts);
  }

  return mergedProducts;
}
