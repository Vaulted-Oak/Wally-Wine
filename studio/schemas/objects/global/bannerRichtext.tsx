import {defineArrayMember, defineField} from 'sanity';
import {internalLinkField} from './headerNavigation';
import {SquareMousePointer} from 'lucide-react';

export const internalLinkFields = [
  internalLinkField,
  defineField({
    name: 'anchor',
    description: 'The ID of the element to scroll to, without the #.',
    type: 'string',
  }),
];

export default defineField({
  name: 'bannerRichtext',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'H1', value: 'h1'},
        {title: 'H2', value: 'h2'},
        {title: 'H3', value: 'h3'},
        {title: 'H4', value: 'h4'},
        {title: 'H5', value: 'h5'},
        {title: 'H6', value: 'h6'},
      ],
      lists: [],
      marks: {
        annotations: [],
        decorators: [
          {title: 'Strong', value: 'strong'},
          {title: 'Emphasis', value: 'em'},
          {title: 'Underline', value: 'underline'},
          {title: 'Strike-through', value: 'strike-through'},
        ],
      },
    }),
    defineArrayMember({
      name: 'button',
      type: 'object',
      fields: [
        defineField({
          name: 'label',
          type: 'string',
        }),
        defineField({
          name: 'background',
          type: 'color',
        }),
        defineField({
          name: 'foreground',
          type: 'color',
        }),
        ...internalLinkFields,
        defineField({
          name: 'externalLink',
          type: 'string',
          title: 'External Link',
          description:
            'Where the button will link to when internal link is not selected.',
        }),
        defineField({
          name: 'openInNewTab',
          type: 'boolean',
          title: 'Open in New Tab',
          description: 'Should the link open in a new tab?',
          initialValue: false,
        }),
      ],
      icon: () => <SquareMousePointer size="1em" />,
      preview: {
        select: {
          title: 'label',
        },
        prepare: ({title}) => {
          return {
            title: title ? title : 'Button',
          };
        },
      },
    }),
  ],
});
