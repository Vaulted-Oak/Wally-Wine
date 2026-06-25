import {EyeOff, TextSelect} from 'lucide-react';
import {defineArrayMember, defineField} from 'sanity';
import {createSliderInput} from '../../../components/Slider';

export default defineField({
  name: 'columnSection',
  title: 'Columns',
  type: 'object',
  fields: [
    defineField({
      title: 'Title',
      type: 'string',
      name: 'title',
    }),
    defineField({
      name: 'richtextContents',
      type: 'array',
      of: [
        {
          name: 'richtextContent',
          title: 'Rich Text Content',
          type: 'object',
          fields: [
            defineField({
              name: 'content',
              type: 'richtext',
            }),
          ],
          preview: {
            select: {
              content: 'content',
            },
            prepare() {
              return {
                title: 'Rich Text Content',
                media: <TextSelect />,
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: 'noOfColumns',
      title: 'No of columns',
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
  preview: {
    select: {
      settings: 'settings',
      title: 'title',
    },
    prepare({title, settings}: any) {
      return {
        title: title ? title : 'Columns Section',
        media: settings?.hide ? EyeOff : <TextSelect />,
      };
    },
  },
});
