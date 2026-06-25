import {EyeOff} from 'lucide-react';
import {defineField, defineArrayMember} from 'sanity';
import {Megaphone} from 'lucide-react';
import {ImageIcon} from '@sanity/icons';
import {createSliderInput} from '../../../components/Slider';

export default defineField({
  name: 'bannerCollectionSection',
  title: 'Banner Collections',
  type: 'object', // This is now an array
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
      name: 'bannerType',
      title: 'Banner Type',
      type: 'string',
      options: {
        list: [
          {
            title: 'Slider',
            value: 'slider',
          },
          {
            title: 'Normal',
            value: 'normal',
          },
        ],
      },
      validation: (Rule) => Rule.required(),
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
      title: 'Each Banner Height',
      name: 'bannerHeight',
      type: 'number',
      validation: (Rule: any) => Rule.min(0).max(2000),
      components: {
        input: createSliderInput({min: 0, max: 2000, suffix: 'px'}),
      },
    }),
    defineField({
      title: 'Each Banner Width',
      name: 'bannerWidth',
      type: 'number',
      validation: (Rule: any) => Rule.min(0).max(2000),
      components: {
        input: createSliderInput({min: 0, max: 2000, suffix: 'px'}),
      },
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
    },
    prepare({media, settings}: any) {
      return {
        title: 'Banner Collections',
        media: () => (settings?.hide ? <EyeOff /> : <ImageIcon />),
      };
    },
  },
});
