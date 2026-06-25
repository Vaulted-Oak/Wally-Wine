import type { Selection } from 'groqd';

import { q, z } from 'groqd';

import { contentAlignmentValues } from './constants';
import { IMAGE_FRAGMENT } from './fragments';
import { LINK_REFERENCE_FRAGMENT } from './links';

/*
|--------------------------------------------------------------------------
| Base Blocks
|--------------------------------------------------------------------------
*/
export const INTERNAL_LINK_BLOCK_ANNOTATION_FRAGMENT = {
  _key: q.string(),
  _type: q.literal('internalLink'),
  anchor: q.string().nullable(),
  link: LINK_REFERENCE_FRAGMENT,
} satisfies Selection;

export const EXTERNAL_LINK_BLOCK_ANNOTATION_FRAGMENT = {
  _key: q.string(),
  _type: q.literal('externalLink'),
  link: q.string().nullable(),
  openInNewTab: q.boolean().nullable(),
} satisfies Selection;

export const BASE_BLOCK_FRAGMENT = {
  _key: q.string().optional(),
  _type: q.string(),
  children: q.array(
    q.object({
      _key: q.string(),
      _type: q.string(),
      marks: q.array(q.string()),
      text: q.string(),
    }),
  ),
  level: q.number().optional(),
  listItem: q.string().optional(),
  markDefs: q('markDefs[]', { isArray: true })
    .filter()
    .select({
      '_type == "externalLink"': EXTERNAL_LINK_BLOCK_ANNOTATION_FRAGMENT,
      '_type == "internalLink"': INTERNAL_LINK_BLOCK_ANNOTATION_FRAGMENT,
      default: ['{...}', q.object({})],
    }),
  style: q.string().optional(),
} satisfies Selection;

/*
|--------------------------------------------------------------------------
| Product Custom Blocks
|--------------------------------------------------------------------------
*/
export const SHOPIFY_TITLE_BLOCK_FRAGMENT = {
  _key: q.string(),
  _type: q.literal('shopifyTitle'),
} satisfies Selection;

export const SHOPIFY_DESCRIPTION_BLOCK_FRAGMENT = {
  _key: q.string(),
  _type: q.literal('shopifyDescription'),
} satisfies Selection;

export const ADD_TO_CART_BUTTON_BLOCK_FRAGMENT = {
  _key: q.string(),
  _type: q.literal('addToCartButton'),
  quantitySelector: q.boolean().nullable(),
  shopPayButton: q.boolean().nullable(),
} satisfies Selection;

export const PRICE_BLOCK_FRAGMENT = {
  _key: q.string(),
  _type: q.literal('price'),
} satisfies Selection;

export const PAIRING_BLOCK_FRAGMENT = {
  _key: q.string(),
  _type: q.literal('pairing'),
} satisfies Selection;

export const PRODUCT_DETAILS_BLOCK_FRAGMENT = {
  _key: q.string(),
  _type: q.literal('productDetails'),
} satisfies Selection;

export const PRODUCT_RICHTEXT_BLOCKS = q.select({
  '_type == "addToCartButton"': ADD_TO_CART_BUTTON_BLOCK_FRAGMENT,
  '_type == "block"': BASE_BLOCK_FRAGMENT,
  '_type == "price"': PRICE_BLOCK_FRAGMENT,
  '_type == "shopifyDescription"': SHOPIFY_DESCRIPTION_BLOCK_FRAGMENT,
  '_type == "shopifyTitle"': SHOPIFY_TITLE_BLOCK_FRAGMENT,
  '_type == "pairing"': PAIRING_BLOCK_FRAGMENT,
  '_type == "productDetails"': PRODUCT_DETAILS_BLOCK_FRAGMENT
});

/*
|--------------------------------------------------------------------------
| Richtext Blocks
|--------------------------------------------------------------------------
*/
export const BUTTON_BLOCK_FRAGMENT = {
  _key: q.string(),
  _type: q.literal('button'),
  anchor: q.string().nullable(),
  label: q.string().nullable(),
  link: LINK_REFERENCE_FRAGMENT,
  background: q.object({
    hex: q.string(),
    url: q.string(),
  }).nullable(),
  externalLink:q.string().nullable(),
  openInNewTab:q.boolean(),
  foreground: q.object({
    hex: q.string(),
    hsl: q.object({
      h: q.number(),
      l: q.number(),
      s: q.number()
    }),
    rgb: q.object({
      r: q.number(),
      g: q.number(),
      b: q.number()
    })
  }).nullable(),
} satisfies Selection;

export const IMAGE_BLOCK_FRAGMENT = {
  _key: q.string(),
  ...IMAGE_FRAGMENT,
  alignment: z.enum(contentAlignmentValues).nullable(),
  maxWidth: q.number().nullable(),
} satisfies Selection;

export const CODE_BLOCK_FRAGMENT = {
  _key: q.string(),
  _type: q.literal('code'),
  label: q.string().nullable(),
  code: q.string().nullable(),
  language: q.string().nullable(),
  bannerRichtext: q.array(q.object({
    block: q.string().nullable(),
    _type: q.string()
  })).nullable()
} satisfies Selection;

export const ARRAY_BUTTON_BLOCK_FRAGMENT = {
  _key: q.string(),
  _type: q.literal('block'),
  label: q.string().nullable(),
  buttons: q("buttons[]",{isArray:true}).grab({
    _key: q.string(),
    link: LINK_REFERENCE_FRAGMENT,
    anchor:q.string().nullable(),
    label: q.string(),
    style: q.string(),
    url: q.string(),
    openInNewTab: q.boolean(),
  })
} satisfies Selection;

export const RICHTEXT_BLOCKS = q.select({
  '_type == "block"': BASE_BLOCK_FRAGMENT,
  '_type == "button"': BUTTON_BLOCK_FRAGMENT,
  '_type == "image"': IMAGE_BLOCK_FRAGMENT,
  '_type == "code"': CODE_BLOCK_FRAGMENT,
  '_type == "buttonBlock"': ARRAY_BUTTON_BLOCK_FRAGMENT,
});

/*
|--------------------------------------------------------------------------
| Banner Richtext Blocks
|--------------------------------------------------------------------------
*/
export const BANNER_RICHTEXT_BLOCKS = q.select({
  '_type == "block"': BASE_BLOCK_FRAGMENT,
  '_type == "button"': BUTTON_BLOCK_FRAGMENT,
  '_type == "code"': CODE_BLOCK_FRAGMENT,
  '_type == "image"': IMAGE_BLOCK_FRAGMENT,
});
