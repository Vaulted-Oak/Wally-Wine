import {EyeOff} from 'lucide-react';
import {defineField, defineArrayMember} from 'sanity';
import {ImageIcon} from '@sanity/icons';
import {createSliderInput} from '../../../components/Slider';

export default defineField({
  name: 'imageBannerArraySection',
  title: 'Multi Image Banner Slider',
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
      name: 'showContentAs',
      title: 'Show content as',
      type: 'string',
      options: {
        list: [
          {
            title: 'Flex',
            value: 'flex',
          },
          {
            title: 'Grid',
            value: 'grid',
          },
        ],
      },
    }),
    defineField({
      name: 'showArrows',
      title: 'Show Arrows',
      type: 'string',
      options: {
        list: [
          {
            title: 'Inner',
            value: 'inner',
          },
          {
            title: 'Outer',
            value: 'outer',
          },
          {
            title: 'Sides',
            value: 'sides',
          },
        ],
      },
    }),
    defineField({
      name: 'noOfSlides',
      title: 'Number of Slides',
      type: 'number',
      validation: (Rule: any) => Rule.min(0).max(5),
      components: {
        input: createSliderInput({min: 0, max: 5, suffix: ''}),
      },
    }),
    defineField({
      type: 'sectionSettings',
      name: 'settings',
    }),
  ],
  initialValue: {
    showArrows: 'inner',
    showContentAs: 'flex',
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
      title: 'title',
    },
    prepare({media, settings, title}: any) {
      return {
        title: title ? title : 'Multi Image Banner',
        media: () => (settings?.hide ? <EyeOff /> : <ImageIcon />),
      };
    },
  },
});
