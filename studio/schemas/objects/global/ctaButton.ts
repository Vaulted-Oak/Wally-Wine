import { defineField } from 'sanity';

export default defineField({
  name: 'ctaButton',
  title: 'CTA Button',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Button Label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'route',
      title: 'Button Route',
      type: 'string',
      description: 'Enter the route path (e.g., /catering, /homepage, /locations)',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'isVisible',
      title: 'Show Button',
      type: 'boolean',
      initialValue: true,
      description: 'Toggle to show or hide this button',
    }),
  ],
  preview: {
    select: {
      label: 'label',
      route: 'route',
      isVisible: 'isVisible',
    },
    prepare({ label, route, isVisible }) {
      return {
        title: label || 'Untitled Button',
        subtitle: `Route: ${route || 'Not set'} ${!isVisible ? '(Hidden)' : ''}`,
      };
    },
  },
});

