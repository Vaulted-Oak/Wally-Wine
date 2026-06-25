import {defineField} from 'sanity';
import {IconCollectionTag} from '../../../components/icons/CollectionTag';
import {EyeOff} from 'lucide-react';
import {createSliderInput} from '../../../components/Slider';

export default defineField({
  name: 'relatedProductsSection',
  title: 'Related Products',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'maxProducts',
      title: 'Maximum products to show',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(1).max(25),
      components: {
        input: createSliderInput({min: 1, max: 25, suffix: ''}),
      },
    }),
    defineField({
      name: 'desktopColumns',
      title: 'Number of columns on desktop',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(1).max(5),
      components: {
        input: createSliderInput({min: 1, max: 5, suffix: ''}),
      },
    }),
    defineField({
      type: 'sectionSettings',
      name: 'settings',
    }),
  ],
  initialValue: {
    maxProducts: 6,
    desktopColumns: 3,
  },
  preview: {
    select: {
      settings: 'settings',
    },
    prepare({settings}: any) {
      return {
        title: 'Related Products',
        media: () => (settings?.hide ? <EyeOff /> : <IconCollectionTag />),
      };
    },
  },
});
