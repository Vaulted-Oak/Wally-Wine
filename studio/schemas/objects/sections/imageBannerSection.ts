import {EyeOff} from 'lucide-react';
import {defineField} from 'sanity';
import {createSliderInput} from '../../../components/Slider';

export default defineField({
  name: 'imageBannerSection',
  title: 'Image Banner',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      description:
        'Title will be displayed above the image section in storefront side',
    }),
    defineField({
      name: 'content',
      type: 'richtext',
    }),
    defineField({
      type: 'contentPosition',
      name: 'contentPosition',
    }),
    defineField({
      name: 'contentType',
      title: 'Content Type',
      type: 'string',
      options: {
        list: [
          {
            title: 'Inner Content',
            value: 'innerContent',
          },
          {
            title: 'Outer Content',
            value: 'outerContent',
          },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'contentAlignment',
      type: 'string',
      options: {
        list: [
          {
            title: 'Left',
            value: 'left',
          },
          {
            title: 'Center',
            value: 'center',
          },
          {
            title: 'Right',
            value: 'right',
          },
        ],
      },
    }),
    defineField({
      type: 'image',
      name: 'backgroundImage',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'bannerHeight',
      type: 'number',
      validation: (Rule: any) => Rule.min(0).max(2000),
      components: {
        input: createSliderInput({min: 0, max: 2000, suffix: 'px'}),
      },
    }),
    defineField({
      name: 'overlayOpacity',
      type: 'number',
      validation: (Rule: any) => Rule.min(0).max(100),
      components: {
        input: createSliderInput({min: 0, max: 100, suffix: '%'}),
      },
    }),
    defineField({
      type: 'sectionSettings',
      name: 'settings',
    }),
  ],
  initialValue: {
    overlayOpacity: 0,
    contentPosition: 'middle_center',
    contentType: 'outerContent',
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
      title: 'title',
    },
    prepare({media, title}: any) {
      return {
        title: title ? title : 'Image Banner',
        media: media,
      };
    },
  },
});
