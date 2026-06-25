import {defineField} from 'sanity';
import {EyeOff, LayoutGrid} from 'lucide-react';
import {createSliderInput} from '../../../components/Slider';

export default defineField({
  name: 'collectionProductGridSection',
  title: 'Product Grid',
  type: 'object',
  fields: [
    defineField({
      name: 'productsPerPage',
      type: 'number',
      validation: (Rule: any) => Rule.min(1).max(50),
      components: {
        input: createSliderInput({min: 1, max: 50, suffix: ''}),
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
      name: 'mobileColumns',
      title: 'Number of columns on mobile',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(1).max(2),
      components: {
        input: createSliderInput({min: 1, max: 2, suffix: ''}),
      },
    }),
    defineField({
      name: 'enableFiltering',
      description: 'Customize filters with the Search & Discovery Shopify app.',
      type: 'boolean',
    }),
    defineField({
      name: 'enableSorting',
      type: 'boolean',
    }),
    defineField({
      type: 'sectionSettings',
      name: 'settings',
    }),
  ],
  initialValue: {
    productsPerPage: 8,
    desktopColumns: 4,
    mobileColumns: 2,
    enableFiltering: true,
    enableSorting: true,
  },
  preview: {
    select: {
      settings: 'settings',
    },
    prepare({settings}: any) {
      return {
        title: 'Collection Product Grid',
        media: () => (settings?.hide ? <EyeOff /> : <LayoutGrid />),
      };
    },
  },
});
