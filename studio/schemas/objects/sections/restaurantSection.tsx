import { EyeOff, ImageIcon } from 'lucide-react';
import { defineArrayMember, defineField } from 'sanity';
import { externalLinkObject, internalLinkField } from '../global/headerNavigation';
export default defineField({
  name: 'restaurantSection',
  title: 'Restaurant Section',
  type: 'object',
  fields: [
    defineField({
      name: 'restaurant',
      type: 'object',
      title: 'Restaurants',
      fields: [
        defineField({
          type: 'image',
          name: 'backgroundImage',
          options: {
            hotspot: true,
          },
        }),
        defineField({
          name: 'content',
          type: 'bannerRichtext',
          title: 'Content',
        }),
        defineField({
          name: 'thumbnail',
          type: 'array',
          title: 'Thumbnail Images',
          options: {
            layout: 'grid',
          },
          of: [
            defineArrayMember({
              name: 'collection',
              type: 'imageBannerSection',
            }),
          ]
        }),
        defineField({
          type: 'image',
          name: 'privateDiningImage',
          title: 'Private Dining Image',
          options: {
            hotspot: true,
          },
        }),
        defineField({
          name: 'privateDiningContent',
          type: 'bannerRichtext',
          title: 'Private Dining Content',
        }),
        defineField({
          name: 'code', // Field for the actual code content
          type: 'text', // Use text field for multi-line code
          title: 'Submit your inquiry code',
          description: 'Paste your iframe code here.',
          rows: 10, // Specify rows for better UX in the editor
        }),
        defineField({
          name: 'timings',
          type: 'text',
          title: 'Timings',
        }),
        defineField({
          name: 'telephone',
          type: 'string',
          title: 'Telephone',
        }),
        defineField({
          name: 'location',
          type: 'text',
          title: 'Location',
        }),
        defineField({
          name: 'direction',
          type: 'string',
          title: 'Direction Link',
        }),
        defineField({
          name: 'menuList',
          type: 'array',
          title: 'Menu Lists',
          of: [
            defineArrayMember(externalLinkObject)
          ]
        }),
        defineField({
          name: 'awards',
          type: 'array',
          title: 'Awards List',
          options: {
            layout: 'grid',
          },
          of: [
            defineArrayMember({
              name: 'collection',
              type: 'imageBannerSection',
            }),
          ]
        }),
        defineField({
          name: 'buttons',
          type: 'array',
          title: 'Buttons',
          of: [
            {
              type: 'object',
              name: 'button',
              fields: [
                defineField({
                  name: 'label',
                  type: 'string',
                  title: 'Button Label',
                }),
                internalLinkField,
                defineField({
                  name: 'externalLink',
                  type: 'string',
                  title: 'External Link',
                  description: 'Where the button will link to when internal link is not selected.',
                }),
                defineField({
                  name: 'openInNewTab',
                  type: 'boolean',
                  title: 'Open in New Tab',
                  description: 'Should the link open in a new tab?',
                  initialValue: false,
                }),
                defineField({
                  name: 'style',
                  type: 'string',
                  title: 'Button Style',
                  options: {
                    list: [
                      { title: 'Primary', value: 'primary' },
                      { title: 'Secondary', value: 'secondary' },
                      { title: 'Tertiary', value: 'tertiary' },
                    ],
                  },
                }),
              ]
            }
          ]
        }),
      ]
    }),
    defineField({
      type: 'sectionSettings',
      name: 'settings',
    }),
  ],
  initialValue: {
    settings: {
      padding: {
        top: 0,
        bottom: 0,
      },
    },
  },
  preview: {
    select: {
      settings: 'settings',
    },
    prepare({ settings }: any) {
      return {
        title: 'Restaurant Section',
        media: settings?.hide ? EyeOff : <ImageIcon />,
      };
    },
  },
});
