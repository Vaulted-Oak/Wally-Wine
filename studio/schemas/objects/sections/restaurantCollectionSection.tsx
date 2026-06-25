import { EyeOff, ImageIcon } from 'lucide-react';
import { defineField } from 'sanity';
import { internalLinkField } from '../global/headerNavigation';
export default defineField({
  name: 'restaurantCollectionSection',
  title: 'Restaurant Collections',
  type: 'object',
  fields: [
    defineField({
      name: 'restaurants',
      type: 'array',
      title: 'Restaurants',
      of: [
        {
          type: 'object',
          name: 'restaurant',
          fields: [
            defineField({
              name: 'title',
              type: 'string',
              title: 'Title',
            }),
            defineField({
              type: 'image',
              name: 'backgroundImage',
              options: {
                hotspot: true,
              },
            }),
            internalLinkField,
            defineField({
              name: 'content',
              type: 'bannerRichtext',
              title: 'Content',
            }),
          ],
        },
      ],
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
        title: 'Restaurants Collection',
        media: settings?.hide ? EyeOff : <ImageIcon />,
      };
    },
  },
});
