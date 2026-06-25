/**
 * Shared banner fragments to avoid circular dependencies
 */
import { q, z } from 'groqd';
import { ARRAY_BUTTON_BLOCK_FRAGMENT, CODE_BLOCK_FRAGMENT, EXTERNAL_LINK_BLOCK_ANNOTATION_FRAGMENT, IMAGE_BLOCK_FRAGMENT, INTERNAL_LINK_BLOCK_ANNOTATION_FRAGMENT } from './blocks';
import { INTERNAL_LINK_FRAGMENT } from './links';

export const BANNER_RICH_CONTENT_FRAGMENT = q('content[]', { isArray: true }).select({
    '_type == "button"': {
        _type: q.literal('button'),
        link: INTERNAL_LINK_FRAGMENT.link,
        anchor:q.string().nullable(),
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
        _type: q.literal('block'),
        children: q('coalesce(children[], [])', { isArray: true }).filter().grab$({
            _key: q.string(),
            _type: q.string(),
            marks: q.array(q.string()),
            text: q.string(),
        }),
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
});

