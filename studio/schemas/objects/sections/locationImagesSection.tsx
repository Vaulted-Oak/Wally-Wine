import {EyeOff} from 'lucide-react';
import {defineField, defineArrayMember} from 'sanity';
import {ImageIcon} from '@sanity/icons';

export default defineField({
  name: 'locationImagesSection',
  title: 'Location Gallery',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'bannerCollections',
      type: 'array',
      options: {
        layout: 'grid',
      },
      of: [
        defineArrayMember({
          name: 'collection',
          type: 'imageBannerSection',
        }),
      ],
    }),
    defineField({
      name: 'showContent',
      title: 'Show Content as',
      type: 'string',
      options: {
        list: [
          {
            title: 'Grid',
            value: 'grid',
          },
          {
            title: 'flex',
            value: 'flex',
          },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      type: 'sectionSettings',
      name: 'settings',
    }),
  ],
  preview: {
    select: {
      media: 'backgroundImage',
      settings: 'settings',
      title: 'title',
    },
    prepare({title, settings}: any) {
      return {
        title: title ? title : 'Location Images',
        media: () => (settings?.hide ? <EyeOff /> : <ImageIcon />),
      };
    },
  },
});
