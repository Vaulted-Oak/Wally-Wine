import {FooterSocialLinksOnly} from '~/components/footers/FooterSocialLinksOnly';
import { BannerCollectionSection } from '~/components/sections/BannerCollectionSection';
import {CarouselSection} from '~/components/sections/CarouselSection';
import {CollectionBannerSection} from '~/components/sections/CollectionBannerSection';
import {CollectionListSection} from '~/components/sections/CollectionListSection';
import {CollectionProductGridSection} from '~/components/sections/CollectionProductGridSection';
import { ColumnSection } from '~/components/sections/ColumnSection';
import { EventCollectionSection } from '~/components/sections/EventCollectionSection';
import { EventSection } from '~/components/sections/EventSection';
import {FeaturedCollectionSection} from '~/components/sections/FeaturedCollectionSection';
import {FeaturedProductSection} from '~/components/sections/FeaturedProductSection';
import { FooterSection } from '~/components/sections/footerSection';
import { ImageBannerArraySection } from '~/components/sections/imageBannerArraySection';
import { ImageBannerSection } from '~/components/sections/ImageBannerSection';
import { InstagramSection } from '~/components/sections/InstagramSection';
import { LocationImagesSection } from '~/components/sections/LocationImagesSection';
import { MultiImageCarouselCollectionSection } from '~/components/sections/MultiImageCarouselCollectionSection';
import {ProductInformationSection} from '~/components/sections/ProductInformationSection';
import {RelatedProductsSection} from '~/components/sections/RelatedProductsSection';
import { RestaurantCollectionSection } from '~/components/sections/RestaurantCollectionSection';
import { RestaurantSection } from '~/components/sections/RestaurantSection';
import {RichtextSection} from '~/components/sections/RichtextSection';
import { VideoSection } from '~/components/sections/VideoSection';
import { WhatWeOffer } from '~/components/sections/WhatWeOffer';

export const sections: {
  [key: string]: React.FC<any>;
} = {
  carouselSection: CarouselSection,
  collectionBannerSection: CollectionBannerSection,
  collectionListSection: CollectionListSection,
  collectionProductGridSection: CollectionProductGridSection,
  featuredCollectionSection: FeaturedCollectionSection,
  featuredProductSection: FeaturedProductSection,
  imageBannerSection: ImageBannerSection,
  bannerCollectionSection:BannerCollectionSection,
  locationImagesSection:LocationImagesSection,
  videoSection:VideoSection,
  whatWeOffer:WhatWeOffer,
  columnSection:ColumnSection,
  instagramSection:InstagramSection,
  multiImageCarouselCollectionSection:MultiImageCarouselCollectionSection,
  restaurantCollectionSection:RestaurantCollectionSection,
  restaurantSection:RestaurantSection,
  eventSection:EventSection,
  eventCollectionSection:EventCollectionSection,
  imageBannerArraySection:ImageBannerArraySection,
  footerSection:FooterSection,
  productInformationSection: ProductInformationSection,
  relatedProductsSection: RelatedProductsSection,
  richtextSection: RichtextSection,
  socialLinksOnly: FooterSocialLinksOnly,
};
