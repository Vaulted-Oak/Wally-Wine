import {defineArrayMember, defineField} from 'sanity';
import {externalLinkObject, internalLinkField} from './headerNavigation';
import {ExternalLink, Link, SquareMousePointer, Code} from 'lucide-react';
import {createSliderInput} from '../../../components/Slider';

export const internalLinkFields = [
  internalLinkField,
  defineField({
    name: 'anchor',
    description: 'The ID of the element to scroll to, without the #.',
    type: 'string',
  }),
];

export default defineField({
  name: 'richtext',
  type: 'array',
  of: [
    // Regular text block
    defineArrayMember({
      type: 'block',
      marks: {
        decorators: [
          {title: 'Strong', value: 'strong'},
          {title: 'Emphasis', value: 'em'},
          {title: 'Underline', value: 'underline'},
          {title: 'Strike-through', value: 'strike-through'},
        ],
        annotations: [
          {
            name: 'internalLink',
            type: 'object',
            title: 'Internal link',
            icon: () => <Link size="1em" strokeWidth={1} />,
            fields: [...internalLinkFields],
          },
          {
            name: 'externalLink',
            type: 'object',
            title: 'External link',
            icon: () => <ExternalLink size="1em" strokeWidth={1} />,
            fields: [
              defineField({
                name: 'link',
                type: 'string',
              }),
              defineField({
                name: 'openInNewTab',
                type: 'boolean',
              }),
            ],
          },
        ],
      },
    }),

    // Code Block
    defineArrayMember({
      type: 'object', // Using object to define the code block
      name: 'code', // Unique name for this block type
      title: 'Code Block',
      icon: () => <Code size="1em" />,
      fields: [
        defineField({
          name: 'language', // Optional language field for syntax highlighting
          type: 'string',
          title: 'Language',
          options: {
            list: [
              {title: 'JavaScript', value: 'javascript'},
              {title: 'Python', value: 'python'},
              {title: 'HTML', value: 'html'},
              {title: 'CSS', value: 'css'},
              {title: 'Other', value: 'other'},
            ],
          },
        }),
        defineField({
          name: 'code', // Field for the actual code content
          type: 'text', // Use text field for multi-line code
          title: 'Code',
          description: 'Paste your code here.',
          rows: 10, // Specify rows for better UX in the editor
        }),
      ],
      preview: {
        select: {
          title: 'language', // Show language name in preview
          subtitle: 'code',
        },
        prepare({title, subtitle}) {
          return {
            title: title || 'Code Block',
            subtitle: subtitle
              ? subtitle.substring(0, 60) + '...'
              : 'No code provided',
          };
        },
      },
    }),

    // Other array members (e.g., image, button, etc.)
    defineArrayMember({
      type: 'image',
      fields: [
        {
          name: 'maxWidth',
          type: 'number',
          validation: (Rule: any) => Rule.min(200).max(1600),
          components: {
            input: createSliderInput({min: 200, max: 1600, suffix: 'px'}),
          },
        },
        {
          name: 'alignment',
          type: 'string',
          options: {
            list: [
              {title: 'Left', value: 'left'},
              {title: 'Center', value: 'center'},
              {title: 'Right', value: 'right'},
            ],
          },
        },
      ],
      options: {
        hotspot: true,
      },
      initialValue: {
        maxWidth: 900,
        alignment: 'center',
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
        ...internalLinkFields,
        externalLinkObject,
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
    defineArrayMember({
      type: 'object', // Type is 'object' since we're defining multiple buttons within a block
      name: 'buttonBlock', // Unique name for the block
      title: 'Button Block',
      icon: () => <SquareMousePointer size="1em" />,
      fields: [
        defineField({
          name: 'buttons', // Array of buttons within the block
          type: 'array',
          title: 'Buttons',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'eachbuttons',
              title: 'Button',
              fields: [
                defineField({
                  name: 'label',
                  type: 'string',
                  title: 'Button Label',
                }),
                internalLinkField,
                defineField({
                  name: 'url',
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
                defineField({
                  name: 'style',
                  type: 'string',
                  title: 'Button Style',
                  options: {
                    list: [
                      {title: 'Primary', value: 'primary'},
                      {title: 'Secondary', value: 'secondary'},
                      {title: 'Tertiary', value: 'tertiary'},
                    ],
                  },
                }),
              ],
            }),
          ],
        }),
      ],
      preview: {
        select: {
          title: 'buttons.0.label', // Preview the first button's label
          subtitle: 'buttons.length', // Display the number of buttons in the block
        },
        prepare({title, subtitle}) {
          return {
            title: title || 'Button Block',
            subtitle: subtitle ? `${subtitle} buttons` : 'No buttons added',
          };
        },
      },
    }),
  ],
});
