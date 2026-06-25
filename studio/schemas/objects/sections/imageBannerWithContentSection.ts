import {EyeOff} from 'lucide-react';
import {defineField} from 'sanity';
import {createSliderInput} from '../../../components/Slider';

export default defineField({
  name: 'imageBannerWithContentSection',
  title: 'Single Image Banner With Outside Content',
  type: 'object',
  fields: [
    defineField({
      name: 'content',
      type: 'internationalizedArrayBannerRichtext',
    }),
    defineField({
      type: 'contentPosition',
      name: 'contentPosition',
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
    prepare({media, settings}: any) {
      return {
        title: 'Image Banner With Outside Content',
        media: settings.hide ? EyeOff : media,
      };
    },
  },
});
