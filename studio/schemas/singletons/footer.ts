import {defineField, defineType} from 'sanity';

export default defineType({
  name: 'footer',
  type: 'document',
  __experimental_formPreviewTitle: false,
  fields: [
    defineField({
      name: 'sections',
      type: 'sections',
      description:
        'Sections you add here will be displayed above the footer and will appear on all pages. Useful if you need to display a Newsletter signup form or a CTA.',
    }),
  ],
  preview: {
    prepare: () => ({title: 'Footer'}),
  },
});
