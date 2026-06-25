import {EyeOff, TextSelect} from 'lucide-react';
import {defineArrayMember, defineField} from 'sanity';

export default defineField({
  name: 'whatWeOffer',
  title: 'What We Offer',
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
        title: title ? title : 'What We Offer',
        media: settings?.hide ? EyeOff : <TextSelect />,
      };
    },
  },
});
