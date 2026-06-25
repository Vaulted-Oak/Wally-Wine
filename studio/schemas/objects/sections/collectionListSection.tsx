import {EyeOff, LayoutGrid} from 'lucide-react';
import {defineArrayMember, defineField} from 'sanity';
import {createSliderInput} from '../../../components/Slider';

export default defineField({
  name: 'collectionListSection',
  title: 'Collection List',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
    }),
    defineField({
      name: 'collections',
      type: 'array',
      options: {
        layout: 'grid',
      },
      of: [
        defineArrayMember({
          name: 'collection',
          type: 'reference',
          to: [{type: 'collection'}],
        }),
      ],
      validation: (Rule: any) =>
        Rule.custom((array: any) => {
          return checkForDuplicates(array);
        }),
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
  preview: {
    select: {
      settings: 'settings',
      title: 'title',
    },
    prepare({settings, title}: any) {
      return {
        title: title ? title : 'Collection List',
        media: () => (settings?.hide ? <EyeOff /> : <LayoutGrid />),
      };
    },
  },
});

function checkForDuplicates<T>(array?: T[]): string | true {
  const uniqueSet = new Set<T>();

  if (!array || array.length === 0) {
    return 'Please add at least one collection.';
  }

  for (const item of array as any) {
    if (uniqueSet.has(item._ref)) {
      return 'Duplicate collection found. Please remove it from the list.';
    }

    uniqueSet.add(item._ref);
  }

  return true;
}
