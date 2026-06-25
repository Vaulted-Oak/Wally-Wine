import {EyeOff, ImageIcon} from 'lucide-react';
import {defineArrayMember, defineField} from 'sanity';
import {internalLinkField} from '../global/headerNavigation';
import {createSliderInput} from '../../../components/Slider';
export default defineField({
  name: 'eventCollectionSection',
  title: 'Event Collection',
  type: 'object',
  fields: [
    defineField({
      name: 'eventCollection',
      type: 'array',
      title: 'Events',
      of: [
        {
          name: 'event',
          type: 'object',
          fields: [
            defineField({
              type: 'image',
              name: 'backgroundImage',
              title: 'Event Image',
              description:
                'Recommended: 680×380 px (16:9). Use the hotspot to set the focal area if the image is cropped.',
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
              name: 'timings',
              type: 'text',
              title: 'Timings',
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
                      description:
                        'Where the button will link to when internal link is not selected.',
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
                          {title: 'Primary', value: 'primary'},
                          {title: 'Secondary', value: 'secondary'},
                          {title: 'Tertiary', value: 'tertiary'},
                        ],
                      },
                    }),
                  ],
                },
              ],
            }),
          ],
          preview: {
            select: {
              media: 'backgroundImage',
            },
            prepare({media}: any) {
              return {
                title: 'Event',
                media: media,
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: 'numberOfEvents',
      type: 'number',
      title: 'No of events to display initially',
      validation: (Rule: any) => Rule.min(3).max(200),
      components: {
        input: createSliderInput({min: 3, max: 200, suffix: ''}),
      },
    }),
    defineField({
      type: 'sectionSettings',
      name: 'settings',
    }),
  ],
  initialValue: {
    numberOfEvents: 6,
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
    prepare({settings}: any) {
      return {
        title: 'Events Collection',
        media: settings?.hide ? EyeOff : <ImageIcon />,
      };
    },
  },
});
