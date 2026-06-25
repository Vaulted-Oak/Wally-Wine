import {StringRule, ValidationContext, defineField, defineType} from 'sanity';
import {IconPalette} from '../../components/icons/Palette';
import {ColorSchemeMedia} from '../../components/ColorScheme';
import {validateDefaultStatus} from '../../utils/setAsDefaultValidation';

export default defineType({
  name: 'colorScheme',
  title: 'Color schemes',
  type: 'document',
  __experimental_formPreviewTitle: false,
  icon: IconPalette,
  preview: {
    select: {
      title: 'name',
      subtitle: 'default',
      background: 'background',
      foreground: 'foreground',
    },
    prepare({title, subtitle, background, foreground}: any) {
      return {
        title,
        subtitle: subtitle ? 'Default template' : undefined,
        media: ColorSchemeMedia({background, foreground}),
      };
    },
  },
  fields: [
    defineField({
      name: 'name',
      title: 'Scheme name',
      type: 'string',
      validation: (Rule: StringRule) => Rule.required(),
    }),
    defineField({
      name: 'default',
      title: 'Set as default template',
      type: 'boolean',
      validation: (Rule) =>
        Rule.required().custom(async (value, context: ValidationContext) =>
          validateDefaultStatus(value, context),
        ),
      initialValue: false,
    }),
    defineField({
      name: 'background',
      type: 'color',
    }),
    defineField({
      name: 'foreground',
      type: 'color',
    }),
    defineField({
      name: 'primary',
      type: 'color',
    }),
    defineField({
      name: 'primaryForeground',
      type: 'color',
    }),
    defineField({
      name: 'border',
      title: 'Lines, borders and inputs',
      type: 'color',
    }),
    defineField({
      name: 'card',
      title: 'Card background',
      type: 'color',
    }),
    defineField({
      name: 'cardForeground',
      type: 'color',
    }),
  ],
});
