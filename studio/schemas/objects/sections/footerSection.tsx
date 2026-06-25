import { EyeOff, TextSelect } from 'lucide-react';
import { defineField } from 'sanity';
import { internalLinkField } from '../global/headerNavigation';

export const link = [
  defineField({
    name: 'link',
    title: 'Link',
    type: 'object',
    fields: [
      { name: 'title', title: 'Title', type: 'string' },
      internalLinkField,
      defineField({
        name: 'externalLink',
        type: 'string',
        title: 'External Link',
        description: 'Where the button will link to when internal link is not selected.',
      }),
    ],
  })
]

export default defineField({
  name: 'footerSection',
  title: 'Footer Section',
  type: 'object',
  fields: [
    {
      name: 'about',
      title: 'About Section',
      type: 'array',
      of: [...link],
    },
    {
      name: 'help',
      title: 'Help Section',
      type: 'array',
      of: [...link],
    },
    {
      name: 'services',
      title: 'Services Section',
      type: 'array',
      of: [...link],
    },
    {
      name: 'newsletterText',
      title: 'Newsletter Text',
      type: 'string',
    },
    defineField({
      name: 'socialMedia',
      type: 'text',
      title: 'Code',
      description: 'Paste your social media svg code here.',
      rows: 10,
    }),
    defineField({
      name: 'copyright',
      type: 'string',
      title: 'Copyright text',
    }),
    {
      name: 'partners',
      title: 'Partners Logos',
      type: 'array',
      of: [{ type: 'image' }],
    },
  ],
  initialValue: {
    overlayOpacity: 0,
    contentPosition: 'middle_center',
    bannerHeight: 450,
    settings: {
      padding: {
        top: 0,
        bottom: 0,
      },
    },
  },
  preview: {
    select: {
      media: 'backgroundImage',
      settings: 'settings',
    },
    prepare({ media, settings }: any) {
      return {
        title: 'Footer Section',
        media: () => (<TextSelect />),
      };
    },
  },
});
