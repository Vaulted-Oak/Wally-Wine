import { q, z } from 'groqd';
import type { Selection } from 'groqd';
import { ARRAY_BUTTON_BLOCK_FRAGMENT, CODE_BLOCK_FRAGMENT, EXTERNAL_LINK_BLOCK_ANNOTATION_FRAGMENT, IMAGE_BLOCK_FRAGMENT, INTERNAL_LINK_BLOCK_ANNOTATION_FRAGMENT } from './blocks';
import { BANNER_RICH_CONTENT_FRAGMENT } from './bannerFragments';
import { contentAlignmentValues, contentPositionValues } from './constants';
import { COLOR_SCHEME_FRAGMENT, IMAGE_FRAGMENT as IMAGE_FRAGMENT_SECTION } from './fragments';
import { INTERNAL_LINK_FRAGMENT, LINK_REFERENCE_FRAGMENT } from './links';
import { SECTION_SETTINGS_FRAGMENT } from './sectionSettings';

// Re-export for backward compatibility
export { BANNER_RICH_CONTENT_FRAGMENT };

/*
|--------------------------------------------------------------------------
| Restaurant collection Section
|--------------------------------------------------------------------------
 */

// Common reusable fragments
export const IMAGE_FRAGMENT = q.object({
    asset: q.object({
        _ref: q.string(),
        _type: q.string(),
    }),
    altText: q.string(),
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
});

export const COLOR_FRAGMENT = z.object({
    hex: z.string(),
    hsl: z.object({
        h: z.number(),
        l: z.number(),
        s: z.number(),
    }),
    rgb: z.object({
        r: z.number(),
        g: z.number(),
        b: z.number(),
    }),
}).nullable();

export const BUTTON_FRAGMENT = q('buttons[]', { isArray: true }).select({
    '_type == "button"': {
        _type: q.literal('button'),
        link: INTERNAL_LINK_FRAGMENT.link,
        anchor:q.string().nullable(),
        externalLink: q.string(),
        style: q.string().nullable(),
        label: q.string().nullable(),
        openInNewTab: q.boolean(),
        background: COLOR_FRAGMENT,
        foreground: COLOR_FRAGMENT,
        location: q.string().nullable(),
        direction: q.string().nullable(),
        telephone: q.string().nullable(),
        timings: q.string().nullable(),
    },
});

export const PRIVATE_BANNER_RICH_CONTENT_FRAGMENT = q('privateDiningContent[]', { isArray: true }).select({
    '_type == "button"': {
        _type: q.literal('button'),
        link: INTERNAL_LINK_FRAGMENT.link,
        externalLink: q.string(),
        style: q.string().nullable(),
        label: q.string().nullable(),
        openInNewTab: q.boolean(),
        background: z.object({
            hex: z.string(),
            url: z.string(),
        }).nullable(),
        foreground: z.object({
            hex: z.string(),
            hsl: z.object({
                h: z.number(),
                l: z.number(),
                s: z.number(),
            }),
            rgb: z.object({
                r: z.number(),
                g: z.number(),
                b: z.number(),
            }),
        }).nullable(),
    },
    '_type == "block"': {
        _key: q.string().nullable(),
        _type: q.literal('block'),
        children: q.array(
            q.object({
                _key: q.string(),
                _type: q.string(),
                marks: q.array(q.string()),
                text: q.string(),
            })
        ),
        level: q.number().optional(),
        listItem: q.string().optional(),
        markDefs: q('coalesce(markDefs[], [])', { isArray: true })
            .filter()
            .select({
                '_type == "externalLink"': EXTERNAL_LINK_BLOCK_ANNOTATION_FRAGMENT,
                '_type == "internalLink"': INTERNAL_LINK_BLOCK_ANNOTATION_FRAGMENT,
                default: ['{}', q.object({})],
            }),
        style: q.string().optional(),
    },
    '_type == "code"': CODE_BLOCK_FRAGMENT,
    '_type == "image"': IMAGE_BLOCK_FRAGMENT,
    '_type == "buttonBlock"': ARRAY_BUTTON_BLOCK_FRAGMENT
});

export const RESTAURANT_FRAGMENT = q('restaurants[]', { isArray: true }).select({
    '_type == "restaurant"': {
        _type: q.literal('restaurant'),
        _key: q.string().nullable(),
        title: q.string(),
        location: q.string().nullable(),
        link: INTERNAL_LINK_FRAGMENT.link,
        direction: q.string().nullable(),
        telephone: q.string().nullable(),
        timings: q.string().nullable(),
        backgroundImage: IMAGE_FRAGMENT,
        content: BANNER_RICH_CONTENT_FRAGMENT,
        buttons: BUTTON_FRAGMENT,
    },
});

// Main query fragment
export const RESTAURANT_COLLECTION_SECTION_FRAGMENT = {
    _key: q.string().nullable(),
    _type: q.literal('restaurantCollectionSection'),
    restaurants: RESTAURANT_FRAGMENT,
    settings: SECTION_SETTINGS_FRAGMENT,
} satisfies Selection;

export const RESTAURANT_SECTION_FRAGMENT = {
    _key: q.string().nullable(),
    _type: q.literal('restaurantSection'),
    restaurant: q('restaurant').grab({
        telephone: q.string(),
        backgroundImage: q('backgroundImage').grab(IMAGE_FRAGMENT_SECTION).nullable(),
        privateDiningImage: q('privateDiningImage').grab(IMAGE_FRAGMENT_SECTION).nullable(),
        privateDiningContent: PRIVATE_BANNER_RICH_CONTENT_FRAGMENT,
        buttons: BUTTON_FRAGMENT,
        content: BANNER_RICH_CONTENT_FRAGMENT,
        menuList: q('menuList[]', { isArray: true }).select({
            '_type == "externalLink"': {
                link: q.string(),
                name: q.string(),
                _key: q.string(),
                openInNewTab: q.boolean(),
                _type: q.string()
            }
        }),
        location: q.string(),
        direction: q.string(),
        privateDining: q.string(),
        title: q.string(),
        timings: q.string(),
        code:q.string().nullable(),
        privateDiningbuttons: q("privateDiningbuttons[]", { isArray: true }).select({
            '_type == "button"': {
                _type: q.literal('button'),
                link: INTERNAL_LINK_FRAGMENT.link,
                externalLink: q.string(),
                style: q.string().nullable(),
                label: q.string().nullable(),
                openInNewTab: q.boolean(),
                background: COLOR_FRAGMENT,
                foreground: COLOR_FRAGMENT,
                location: q.string().nullable(),
                direction: q.string().nullable(),
                telephone: q.string().nullable(),
                timings: q.string().nullable(),
            }
        }),
        awards: q("awards[]", { isArray: true }).select({
            '_type == "collection"': {
                _type: q.literal('collection'),
                _key: q.string().nullable(),
                backgroundImage: q('backgroundImage').grab(IMAGE_FRAGMENT_SECTION).nullable(),
                bannerType: q.string(),
                bannerWidth: q.number().nullable(),
                bannerHeight: q.number().nullable(),
                showContent: q.string(),
                overlayOpacity: q.number().nullable(),
                settings: q('settings')
                    .grab({
                        colorScheme: q('colorScheme').deref().grab(COLOR_SCHEME_FRAGMENT),
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
                    })
                    .nullable(),
                content: BANNER_RICH_CONTENT_FRAGMENT,
                contentType: q.string()
            }
        }),
        thumbnail: q("thumbnail[]", { isArray: true }).select({
            '_type == "collection"': {
                _type: q.literal('collection'),
                _key: q.string().nullable(),
                backgroundImage: q('backgroundImage').grab(IMAGE_FRAGMENT_SECTION).nullable(),
                bannerType: q.string(),
                bannerWidth: q.number().nullable(),
                bannerHeight: q.number().nullable(),
                showContent: q.string(),
                overlayOpacity: q.number().nullable(),
                settings: q('settings')
                    .grab({
                        colorScheme: q('colorScheme').deref().grab(COLOR_SCHEME_FRAGMENT),
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
                    })
                    .nullable(),
                content: BANNER_RICH_CONTENT_FRAGMENT,
                contentType: q.string(),
                contentAlignment: z.enum(contentAlignmentValues).nullable(),
                contentPosition: z.enum(contentPositionValues).nullable(),
            }
        })
    }),
    settings: SECTION_SETTINGS_FRAGMENT,
} satisfies Selection;

export const EVENT_FRAGMENT = q('eventCollection[]', { isArray: true }).select({
    '_type == "event"': {
        _type: q.literal('event'),
        _key: q.string().nullable(),
        timings: q.string().nullable(),
        backgroundImage: IMAGE_FRAGMENT,
        cropImageToFit: q.boolean().nullable(),
        content: BANNER_RICH_CONTENT_FRAGMENT,
        buttons: BUTTON_FRAGMENT,
    },
});

export const EVENT_COLLECTION_SECTION_FRAGMENT = {
    _key: q.string().nullable(),
    _type: q.literal('eventCollectionSection'),
    eventCollection: EVENT_FRAGMENT,
    settings: SECTION_SETTINGS_FRAGMENT,
    numberOfEvents: q.number().nullable(),
} satisfies Selection;


export const EVENT_SECTION_FRAGMENT = {
    _key: q.string().nullable(),
    _type: q.literal('eventSection'),
    event: q('event').grab({
        telephone: q.string(),
        backgroundImage: q('backgroundImage').grab(IMAGE_FRAGMENT_SECTION).nullable(),
        cropImageToFit: q.boolean().nullable(),
        buttons: BUTTON_FRAGMENT,
        content: BANNER_RICH_CONTENT_FRAGMENT,
        rightSide: q.string(),
        direction: q.string(),
        leftSide: q.string(),
        title: q.string(),
    }),
    settings: q('settings').grab({
        colorScheme: q('colorScheme').deref().grab(COLOR_SCHEME_FRAGMENT),
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
    }).nullable(),
} satisfies Selection;
