import { EyeOff, ImageIcon } from 'lucide-react';
import { defineField } from 'sanity';
import { internalLinkField } from '../global/headerNavigation';
export default defineField({
  name: 'eventSection',
  title: 'Featured Event',
  type: 'object',
  fields: [
    defineField({
      name: 'event',
      type: 'object',
      title: 'Featured Event',
      fields: [
        defineField({
          name: 'title',
          type: 'string',
          title: 'Title',
        }),
        defineField({
          type: 'image',
          name: 'backgroundImage',
          title: 'Background Image',
          description:
            'Recommended: 940×860 px (aspect ratio ~1.09:1). Use the hotspot to choose the focal area if the image is cropped.',
          options: {
            hotspot: true,
          },
        }),
        defineField({
          name: 'cropImageToFit',
          type: 'boolean',
          title: 'Crop image to fit',
          description:
            'When on, the image fills the box (may be cropped). When off, the full image is shown with no cropping.',
          initialValue: true,
        }),
        defineField({
          name: 'content',
          type: 'bannerRichtext',
          title: 'Content',
        }),
        defineField({
          name: 'leftSide',
          type: 'text',
          title: 'Left Side Content',
        }),
        defineField({
          name: 'rightSide',
          type: 'text',
          title: 'Right Side Content',
        }),
        defineField({
          name: 'direction',
          type: 'string',
          title: 'Direction Link',
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
                  type: 'url',
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
        title: 'Featured Event',
        media: settings?.hide ? EyeOff : <ImageIcon />,
      };
    },
  },
});
