import type { Selection } from 'groqd';

import { q, z } from 'groqd';

import {
  BANNER_RICHTEXT_BLOCKS,
  EXTERNAL_LINK_BLOCK_ANNOTATION_FRAGMENT,
  INTERNAL_LINK_BLOCK_ANNOTATION_FRAGMENT,
  PRODUCT_RICHTEXT_BLOCKS,
  RICHTEXT_BLOCKS,
} from './blocks';
import { BANNER_RICH_CONTENT_FRAGMENT } from './bannerFragments';
import { aspectRatioValues, contentAlignmentValues, contentPositionValues } from './constants';
import { COLOR_SCHEME_FRAGMENT, IMAGE_FRAGMENT } from './fragments';
import { INTERNAL_LINK_FRAGMENT, LINK_REFERENCE_FRAGMENT } from './links';
import { EVENT_COLLECTION_SECTION_FRAGMENT, EVENT_SECTION_FRAGMENT, RESTAURANT_COLLECTION_SECTION_FRAGMENT, RESTAURANT_SECTION_FRAGMENT } from './restaurantSections';
import { SECTION_SETTINGS_FRAGMENT } from './sectionSettings';
import { getIntValue } from './utils';

// Re-export for backward compatibility
export { aspectRatioValues, contentAlignmentValues, contentPositionValues };
export { SECTION_SETTINGS_FRAGMENT };

/*
|--------------------------------------------------------------------------
| Instagram Section
|--------------------------------------------------------------------------
 */
export const INSTAGRAM_SECTION_FRAGMENT = {
  _key: q.string().nullable(),
  _type: q.literal('instagramSection'),
  accessToken: q.string(),
  settings: SECTION_SETTINGS_FRAGMENT,
} satisfies Selection;

export const WHO_WE_ARE_SECTION_FRAGMENT = {
  _key: q.string().nullable(),
  _type: q.literal('whatWeOffer'),
  title: q.string().nullable(),
  richtextContents: q('richtextContents[]', { isArray: true }).select({
    '_type == "richtextContent"': {
      _type: q.literal('richtextContent'),
      _key: q.string().nullable(),
      content:BANNER_RICH_CONTENT_FRAGMENT,
      value: q.array(q.object({
        _key: q.string().nullable(),
        _type: q.string().nullable(),
        children: q.array(q.object({
          _key: q.string().nullable(),
          _type: q.string().nullable(),
          marks: q.array(q.string()).nullable(),
          text: q.string().nullable(),
        })).nullable(),
        markDefs: q.array(q.object({
          _key: q.string().nullable(),
          _type: q.string().nullable(),
          href: q.string().nullable(),
        })).nullable(),
      })).nullable(),
    }
  }),
  settings: SECTION_SETTINGS_FRAGMENT,
} satisfies Selection;

export const COLUMN_SECTION_FRAGMENT = {
  _key: q.string().nullable(),
  _type: q.literal('columnSection'),
  title: q.string().nullable(),
  richtextContents: q('richtextContents[]', { isArray: true }).select({
    '_type == "richtextContent"': {
      _type: q.literal('richtextContent'),
      _key: q.string().nullable(),
      content:BANNER_RICH_CONTENT_FRAGMENT,
      value: q.array(q.object({
        _key: q.string().nullable(),
        _type: q.string().nullable(),
        children: q.array(q.object({
          _key: q.string().nullable(),
          _type: q.string().nullable(),
          marks: q.array(q.string()).nullable(),
          text: q.string().nullable(),
        })).nullable(),
        markDefs: q.array(q.object({
          _key: q.string().nullable(),
          _type: q.string().nullable(),
          href: q.string().nullable(),
        })).nullable(),
      })).nullable(),
    }
  }),
  noOfColumns:q.number(),
  settings: SECTION_SETTINGS_FRAGMENT,
} satisfies Selection;
/*
|--------------------------------------------------------------------------
| Multi Image Carousel Collection Section
|--------------------------------------------------------------------------
 */

export const MULTI_IMAGE_CAROUSEL_COLLECTION_SECTION_FRAGMENT = {
  _key: q.string().nullable(),
  _type: q.literal('multiImageCarouselCollectionSection'),
  carouselItems: q('carouselItems[]', { isArray: true }).select({
    '_type == "carouselItem"': {
      _type: q.literal('carouselItem'),
      _key: q.string().nullable(),
      content: BANNER_RICH_CONTENT_FRAGMENT,
      carouselImages: q('carouselImages[]', { isArray: true }).select({
        '_type == "image"': IMAGE_FRAGMENT
      })
    }
  }),
  settings: SECTION_SETTINGS_FRAGMENT,
} satisfies Selection;
/*
|--------------------------------------------------------------------------
| Video Section
|--------------------------------------------------------------------------
*/
export const VIDEO_SECTION_FRAGMENT = {
  _key: q.string().nullable(),
  _type: q.literal('videoSection'),
  title: q.string(),
  videos: q.object({
    _type: q.literal('file'),
    asset: q.object({
      _ref: q.string(),
      _type: q.string(),
      _weak: q.boolean(),
    })
  }).nullable(),
  iframe: q.string().nullable(),
  placeholderImage: q('backgroundImage').grab(IMAGE_FRAGMENT).nullable(),
  videoType: q.string(),
  content: BANNER_RICH_CONTENT_FRAGMENT,
  settings: SECTION_SETTINGS_FRAGMENT,
  buttons: q.array(
    q.object({
      _key: q.string().nullable(),
      _type: q.literal('ctaButton'),
      label: q.string(),
      route: q.string(),
      isVisible: q.boolean().nullable(),
    })
  ).nullable(),
} satisfies Selection;

/*
|--------------------------------------------------------------------------
| Image Banner Section
|--------------------------------------------------------------------------
*/
export const IMAGE_BANNER_SECTION_FRAGMENT = {
  _key: q.string().nullable(),
  _type: q.literal('imageBannerSection'),
  backgroundImage: q('backgroundImage').grab(IMAGE_FRAGMENT).nullable(),
  bannerHeight: q.number().nullable(),
  contentType: q.string(),
  content: BANNER_RICH_CONTENT_FRAGMENT,
  contentAlignment: z.enum(contentAlignmentValues).nullable(),
  contentPosition: z.enum(contentPositionValues).nullable(),
  overlayOpacity: q.number().nullable(),
  backgroundColor: q.object({
    alpha: q.number(),
    hex: q.string(),
    hsl: q.object({
      h: q.number(),
      s: q.number(),
      l: q.number()
    }),
    rgb: q.object({
      r: q.number(),
      g: q.number(),
      b: q.number()
    }),
  }),
  customCss: q
    .object({
      code: q.string().optional(),
    })
    .nullable(),
  hide: q.boolean().nullable(),
  padding: q
    .object({
      bottom: q.number().nullable(),
      top: q.number().nullable(),
    })
    .nullable(),
  foregroundColor: q.object({
    alpha: q.number(),
    hex: q.string(),
    hsl: q.object({
      h: q.number(),
      s: q.number(),
      l: q.number()
    }),
    rgb: q.object({
      r: q.number(),
      g: q.number(),
      b: q.number()
    }),
  }),
  title: q.string().nullable(),
  settings: SECTION_SETTINGS_FRAGMENT,
} satisfies Selection;

export const BANNER_COLLECTION = q('bannerCollections[]', { isArray: true }).select({
  '_type == "collection"': {
    _type: q.literal('collection'),
    _key: q.string().nullable(),
    backgroundImage: q('backgroundImage').grab(IMAGE_FRAGMENT).nullable(),
    bannerType: q.string(),
    bannerWidth: q.number().nullable(),
    bannerHeight: q.number().nullable(),
    showContent: q.string(),
    overlayOpacity: q.number().nullable(),
    contentAlignment: q.string(),
    settings: SECTION_SETTINGS_FRAGMENT,
    content: BANNER_RICH_CONTENT_FRAGMENT,
    contentType: q.string(),
    backgroundColor: q.object({
      alpha: q.number(),
      hex: q.string(),
      hsl: q.object({
        h: q.number(),
        s: q.number(),
        l: q.number()
      }),
      rgb: q.object({
        r: q.number(),
        g: q.number(),
        b: q.number()
      }),
    }),
    foregroundColor: q.object({
      alpha: q.number(),
      hex: q.string(),
      hsl: q.object({
        h: q.number(),
        s: q.number(),
        l: q.number()
      }),
      rgb: q.object({
        r: q.number(),
        g: q.number(),
        b: q.number()
      }),
    }),
  }
});
//locationImagesSection

export const LOCATION_IMAGES_SECTION_FRAGMENT = {
  _key: q.string().nullable(),
  bannerWidth:q.number().nullable(),
  bannerHeight:q.number().nullable(),
  _type: q.literal('locationImagesSection'),
  backgroundImage: q('backgroundImage').grab(IMAGE_FRAGMENT).nullable(),
  bannerCollections: q('bannerCollections[]', { isArray: true }).select({
    '_type == "collection"': {
      _type: q.literal('collection'),
      _key: q.string().nullable(),
      backgroundImage: q('backgroundImage').grab(IMAGE_FRAGMENT).nullable(),
      contentPosition:q.string().nullable(),
      contentAlignment:q.string().nullable(),
      bannerType: q.string(),
      bannerWidth: q.number().nullable(),
      bannerHeight: q.number().nullable(),
      showContent: q.string(),
      overlayOpacity: q.number().nullable(),
      settings: SECTION_SETTINGS_FRAGMENT,
      content: BANNER_RICH_CONTENT_FRAGMENT,
      contentType: q.string(),
      backgroundColor: q.object({
        alpha: q.number(),
        hex: q.string(),
        hsl: q.object({
          h: q.number(),
          s: q.number(),
          l: q.number()
        }),
        rgb: q.object({
          r: q.number(),
          g: q.number(),
          b: q.number()
        }),
      }),
      foregroundColor: q.object({
        alpha: q.number(),
        hex: q.string(),
        hsl: q.object({
          h: q.number(),
          s: q.number(),
          l: q.number()
        }),
        rgb: q.object({
          r: q.number(),
          g: q.number(),
          b: q.number()
        }),
      }),
    }
  }),
  content: q(
    `coalesce(
        content[_key == $language][0].value[],
        content[_key == $defaultLanguage][0].value[],
      )[]`,
    { isArray: true },
  )
    .filter()
    .select(BANNER_RICHTEXT_BLOCKS)
    .nullable(),
  showContent: q.string(),
  title: q.string().nullable(),
  settings: SECTION_SETTINGS_FRAGMENT,
} satisfies Selection;
//banner collection
export const BANNER_COLLECTION_SECTION_FRAGMENT = {
  _key: q.string().nullable(),
  _type: q.literal('bannerCollectionSection'),
  title: q.string().nullable(),
  backgroundImage: q('backgroundImage').grab(IMAGE_FRAGMENT).nullable(),
  bannerCollections: q('bannerCollections[]', { isArray: true }).select({
    '_type == "collection"': {
      _type: q.literal('collection'),
      _key: q.string().nullable(),
      backgroundImage: q('backgroundImage').grab(IMAGE_FRAGMENT).nullable(),
      contentPosition:q.string().nullable(),
      contentAlignment:q.string().nullable(),
      bannerType: q.string(),
      bannerWidth: q.number().nullable(),
      bannerHeight: q.number().nullable(),
      showContent: q.string(),
      overlayOpacity: q.number().nullable(),
      settings: SECTION_SETTINGS_FRAGMENT,
      content: BANNER_RICH_CONTENT_FRAGMENT,
      contentType: q.string(),
      backgroundColor: q.object({
        alpha: q.number(),
        hex: q.string(),
        hsl: q.object({
          h: q.number(),
          s: q.number(),
          l: q.number()
        }),
        rgb: q.object({
          r: q.number(),
          g: q.number(),
          b: q.number()
        }),
      }),
      foregroundColor: q.object({
        alpha: q.number(),
        hex: q.string(),
        hsl: q.object({
          h: q.number(),
          s: q.number(),
          l: q.number()
        }),
        rgb: q.object({
          r: q.number(),
          g: q.number(),
          b: q.number()
        }),
      }),
    }
  }),
  content: q(
    `coalesce(
        content[_key == $language][0].value[],
        content[_key == $defaultLanguage][0].value[],
      )[]`,
    { isArray: true },
  )
    .filter()
    .select(BANNER_RICHTEXT_BLOCKS)
    .nullable(),
  contentAlignment: z.enum(contentAlignmentValues).nullable(),
  contentPosition: z.enum(contentPositionValues).nullable(),
  bannerType: q.string(),
  bannerWidth: q.number().nullable(),
  bannerHeight: q.number().nullable(),
  showContent: q.string(),
  overlayOpacity: q.number().nullable(),
  settings: SECTION_SETTINGS_FRAGMENT,
} satisfies Selection;
//bannerCollectionSection
//imageBannerArraySection
export const IMAGE_BANNER_ARRAY_SECTION_FRAGMENT = {
  _key: q.string().nullable(),
  _type: q.literal('imageBannerArraySection'),
  backgroundImage: q('backgroundImage').grab(IMAGE_FRAGMENT).nullable(),
  noOfSlides: q.number().nullable(),
  bannerHeight: q.number().nullable(),
  showContentAs: q.string().nullable(),
  showArrows: q.string().nullable(),
  title: q.string().nullable(),
  bannerCollections: q('bannerCollections[]', { isArray: true }).select({
    '_type == "collection"': {
      _type: q.literal('collection'),
      _key: q.string().nullable(),
      backgroundImage: q('backgroundImage').grab(IMAGE_FRAGMENT).nullable(),
      bannerType: q.string(),
      bannerWidth: q.number().nullable(),
      bannerHeight: q.number().nullable(),
      showContent: q.string(),
      overlayOpacity: q.number().nullable(),
      settings: SECTION_SETTINGS_FRAGMENT,
      content: BANNER_RICH_CONTENT_FRAGMENT,
      contentType: q.string()
    }
  }),
  content: q(
    `coalesce(
        content[_key == $language][0].value[],
        content[_key == $defaultLanguage][0].value[],
      )[]`,
    { isArray: true },
  )
    .filter()
    .select(BANNER_RICHTEXT_BLOCKS)
    .nullable(),
  contentAlignment: z.enum(contentAlignmentValues).nullable(),
  contentPosition: z.enum(contentPositionValues).nullable(),
  overlayOpacity: q.number().nullable(),
  settings: SECTION_SETTINGS_FRAGMENT,
} satisfies Selection;

/*
|--------------------------------------------------------------------------
| Footer Section
|--------------------------------------------------------------------------
*/

export const FOOTER_SECTION_FRAGMENT = {
  _key: q.string().nullable(),
  _type: q.literal('footerSection'),
  socialMedia: q.string().nullable(),
  copyright: q.string().nullable(),
  about: q('about[]', { isArray: true }).select({
    '_type == "link"': {
      _type: q.literal('link'),
      _key: q.string().nullable(),
      title: q.string(),
      link: LINK_REFERENCE_FRAGMENT,
      anchor:q.string().nullable(),
      externalLink: q.string().nullable()
    }
  }).nullable(),
  help: q('help[]', { isArray: true }).select({
    '_type == "link"': {
      _type: q.literal('link'),
      _key: q.string().nullable(),
      title: q.string(),
      link: LINK_REFERENCE_FRAGMENT,
      anchor:q.string().nullable(),
      externalLink: q.string().nullable()
    }
  }).nullable(),
  services: q('services[]', { isArray: true }).select({
    '_type == "link"': {
      _type: q.literal('link'),
      _key: q.string().nullable(),
      title: q.string(),
      link: LINK_REFERENCE_FRAGMENT,
      anchor:q.string().nullable(),
      externalLink: q.string().nullable()
    }
  }).nullable(),
  newsletterText: q.string().nullable(),
  partners: q.array(q.object({
    _type: q.literal('image'),
    asset: q.object({
      _ref: q.string(),
      _type: q.literal('reference'),
    }),
    crop: q
      .object({
        bottom: q.number(),
        left: q.number(),
        right: q.number(),
        top: q.number(),
      })
      .nullable(),
    hotspot: q.object({
      height: q.number(),
      width: q.number(),
      x: q.number(),
      y: q.number(),
    }),
    title: q.string(),
    url: q.string().nullable()
  })).nullable(),
} satisfies Selection;
/*
|--------------------------------------------------------------------------
| Featured Collection Section
|--------------------------------------------------------------------------
*/
export const FEATURED_COLLECTION_SECTION_FRAGMENT = {
  _key: q.string().nullable(),
  _type: q.literal('featuredCollectionSection'),
  collection: q('collection')
    .deref()
    .grab({
      store: q('store').grab({
        gid: q.string(),
        slug: q
          .object({
            _type: q.literal('slug'),
            current: q.string(),
          })
          .nullable(),
        title: q.string(),
      }),
    })
    .nullable(),
  desktopColumns: q.number().nullable(),
  heading: [getIntValue('heading'), q.string().nullable()],
  maxProducts: q.number().nullable(),
  settings: SECTION_SETTINGS_FRAGMENT,
  viewAll: q.boolean().nullable(),
} satisfies Selection;

/*
|--------------------------------------------------------------------------
| Featured Product Section
|--------------------------------------------------------------------------
*/
export const FEATURED_PRODUCT_SECTION_FRAGMENT = {
  _key: q.string().nullable(),
  _type: q.literal('featuredProductSection'),
  mediaAspectRatio: z.enum(aspectRatioValues).nullable(),
  product: q('product')
    .deref()
    .grab({
      store: q('store').grab({
        descriptionHtml: q.string(),
        firstVariant: q('variants[]', { isArray: true })
          .slice(0)
          .deref()
          .grab({
            store: q('store').grab({
              gid: q.string(),
              previewImageUrl: q.string().nullable(),
              price: q.number(),
            }),
          })
          .nullable(),
        gid: q.string(),
        options: q('options[]', { isArray: true })
          .grab({
            name: q.string(),
            values: q.array(q.string()),
          })
          .nullable(),
        previewImageUrl: q.string().nullable(),
        title: q.string(),
      }),
    })
    .nullable(),
  richtext: q(
    `coalesce(
        richtext[_key == $language][0].value[],
        richtext[_key == $defaultLanguage][0].value[],
      )[]`,
    { isArray: true },
  )
    .filter()
    .select(PRODUCT_RICHTEXT_BLOCKS)
    .nullable(),
  settings: SECTION_SETTINGS_FRAGMENT,
} satisfies Selection;

/*
|--------------------------------------------------------------------------
| Product Information Section
|--------------------------------------------------------------------------
*/
export const PRODUCT_INFORMATION_SECTION_FRAGMENT = {
  _key: q.string().nullable(),
  _type: q.literal('productInformationSection'),
  desktopMediaPosition: z.enum(['left', 'right']).nullable(),
  desktopMediaWidth: z.enum(['small', 'medium', 'large']).nullable(),
  mediaAspectRatio: z.enum(aspectRatioValues).nullable(),
  richtext: q(
    `coalesce(
      richtext[_key == $language][0].value[],
      richtext[_key == $defaultLanguage][0].value[],
    )[]`,
    { isArray: true },
  )
    .filter()
    .select(PRODUCT_RICHTEXT_BLOCKS)
    .nullable(),
  settings: SECTION_SETTINGS_FRAGMENT,
} satisfies Selection;

/*
|--------------------------------------------------------------------------
| Related Products Section
|--------------------------------------------------------------------------
*/
export const RELATED_PRODUCTS_SECTION_FRAGMENT = {
  _key: q.string().nullable(),
  _type: q.literal('relatedProductsSection'),
  desktopColumns: q.number().nullable(),
  heading: [getIntValue('heading'), q.string().nullable()],
  maxProducts: q.number().nullable(),
  settings: SECTION_SETTINGS_FRAGMENT,
} satisfies Selection;

/*
|--------------------------------------------------------------------------
| Collection List Section
|--------------------------------------------------------------------------
*/
export const COLLECTION_LIST_SECTION_FRAGMENT = {
  _key: q.string().nullable(),
  _type: q.literal('collectionListSection'),
  title: q.string().nullable(),
  collections: q('collections[]', { isArray: true })
    .deref()
    .grab({
      store: q('store').grab({
        gid: q.string(),
      }),
    })
    .nullable(),
  desktopColumns: q.number().nullable(),
  settings: SECTION_SETTINGS_FRAGMENT,
} satisfies Selection;

/*
|--------------------------------------------------------------------------
| Carousel Section
|--------------------------------------------------------------------------
*/
export const CAROUSEL_SECTION_FRAGMENT = {
  _key: q.string().nullable(),
  _type: q.literal('carouselSection'),
  arrows: q.boolean().nullable(),
  autoplay: q.boolean().nullable(),
  loop: q.boolean().nullable(),
  pagination: q.boolean().nullable(),
  settings: SECTION_SETTINGS_FRAGMENT,
  slides: q('slides[]', { isArray: true })
    .grab({
      _key: q.string(),
      image: q('image').grab(IMAGE_FRAGMENT).nullable(),
    })
    .nullable(),
  slidesPerViewDesktop: q.number().nullable(),
  title: [getIntValue('title'), q.string()],
} satisfies Selection;

/*
|--------------------------------------------------------------------------
| Richtext Section
|--------------------------------------------------------------------------
*/
export const RICHTEXT_SECTION_FRAGMENT = {
  _key: q.string().nullable(),
  _type: q.literal('richtextSection'),
  contentAlignment: z.enum(contentAlignmentValues).nullable(),
  desktopContentPosition: z.enum(contentAlignmentValues).nullable(),
  maxWidth: q.number().nullable(),
  richtext: q(
    `coalesce(
      richtext[_key == $language][0].value[],
      richtext[_key == $defaultLanguage][0].value[],
    )[]`,
    { isArray: true },
  )
    .filter()
    .select(RICHTEXT_BLOCKS)
    .nullable(),
  settings: SECTION_SETTINGS_FRAGMENT,
} satisfies Selection;

/*
|--------------------------------------------------------------------------
| Collection Banner Section
|--------------------------------------------------------------------------
*/
export const COLLECTION_BANNER_SECTION_FRAGMENT = {
  _key: q.string().nullable(),
  _type: q.literal('collectionBannerSection'),
  bannerHeight: q.number().nullable(),
  contentAlignment: z.enum(contentAlignmentValues).nullable(),
  contentPosition: z.enum(contentPositionValues).nullable(),
  overlayOpacity: q.number().nullable(),
  settings: SECTION_SETTINGS_FRAGMENT,
  showDescription: q.boolean().nullable(),
  showImage: q.boolean().nullable(),
} satisfies Selection;

/*
|--------------------------------------------------------------------------
| Collection Banner Section
|--------------------------------------------------------------------------
*/
export const COLLECTION_PRODUCT_GRID_SECTION_FRAGMENT = {
  _key: q.string().nullable(),
  _type: q.literal('collectionProductGridSection'),
  desktopColumns: q.number().nullable(),
  enableFiltering: q.boolean().nullable(),
  enableSorting: q.boolean().nullable(),
  mobileColumns: q.number().nullable(),
  productsPerPage: q.number().nullable(),
  settings: SECTION_SETTINGS_FRAGMENT,
} satisfies Selection;

/*
|--------------------------------------------------------------------------
| List of sections
|--------------------------------------------------------------------------
*/
export const SECTIONS_LIST_SELECTION = {
  "_type == 'carouselSection'": CAROUSEL_SECTION_FRAGMENT,
  "_type == 'collectionListSection'": COLLECTION_LIST_SECTION_FRAGMENT,
  "_type == 'featuredCollectionSection'": FEATURED_COLLECTION_SECTION_FRAGMENT,
  "_type == 'featuredProductSection'": FEATURED_PRODUCT_SECTION_FRAGMENT,
  "_type == 'imageBannerSection'": IMAGE_BANNER_SECTION_FRAGMENT,
  "_type == 'footerSection'": FOOTER_SECTION_FRAGMENT,
  "_type == 'richtextSection'": RICHTEXT_SECTION_FRAGMENT,
  "_type == 'bannerCollectionSection'": BANNER_COLLECTION_SECTION_FRAGMENT,
  "_type == 'locationImagesSection'": LOCATION_IMAGES_SECTION_FRAGMENT,
  "_type == 'imageBannerArraySection'": IMAGE_BANNER_ARRAY_SECTION_FRAGMENT,
  "_type == 'instagramSection'": INSTAGRAM_SECTION_FRAGMENT,
  "_type == 'whatWeOffer'": WHO_WE_ARE_SECTION_FRAGMENT,
  "_type == 'columnSection'": COLUMN_SECTION_FRAGMENT,
  "_type == 'videoSection'": VIDEO_SECTION_FRAGMENT,
  "_type == 'restaurantCollectionSection'": RESTAURANT_COLLECTION_SECTION_FRAGMENT,
  "_type == 'restaurantSection'": RESTAURANT_SECTION_FRAGMENT,
  "_type == 'eventSection'": EVENT_SECTION_FRAGMENT,
  "_type == 'eventCollectionSection'": EVENT_COLLECTION_SECTION_FRAGMENT,
  "_type == 'multiImageCarouselCollectionSection'": MULTI_IMAGE_CAROUSEL_COLLECTION_SECTION_FRAGMENT
};

export const SECTIONS_FRAGMENT = q('sections[]', { isArray: true })
  .select(SECTIONS_LIST_SELECTION)
  .nullable();

/*
|--------------------------------------------------------------------------
| Product Sections Fragment
|--------------------------------------------------------------------------
*/
export const PRODUCT_SECTIONS_FRAGMENT = q('sections[]', { isArray: true })
  .select({
    "_type == 'productInformationSection'":
      PRODUCT_INFORMATION_SECTION_FRAGMENT,
    "_type == 'relatedProductsSection'": RELATED_PRODUCTS_SECTION_FRAGMENT,
    ...SECTIONS_LIST_SELECTION,
  })
  .nullable();

/*
|--------------------------------------------------------------------------
| Collection Sections Fragment
|--------------------------------------------------------------------------
*/
export const COLLECTION_SECTIONS_FRAGMENT = q('sections[]', { isArray: true })
  .select({
    "_type == 'collectionBannerSection'": COLLECTION_BANNER_SECTION_FRAGMENT,
    "_type == 'collectionProductGridSection'":
      COLLECTION_PRODUCT_GRID_SECTION_FRAGMENT,
    ...SECTIONS_LIST_SELECTION,
  })
  .nullable();
