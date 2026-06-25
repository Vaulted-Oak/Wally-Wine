import {defineField} from 'sanity';
import {SliderInput} from '../../../components/Slider';

export default defineField({
  name: 'padding',
  title: 'Padding',
  type: 'object',
  options: {
    collapsible: false,
  },
  fields: [
    defineField({
      name: 'top',
      title: 'Top padding',
      type: 'number',
      initialValue: 0,
      validation: (Rule: any) => Rule.min(0).max(200),
      components: {
        input: SliderInput,
      },
    }),
    defineField({
      name: 'bottom',
      title: 'Bottom padding',
      type: 'number',
      initialValue: 0,
      validation: (Rule: any) => Rule.min(0).max(200),
      components: {
        input: SliderInput,
      },
    }),
  ],
  initialValue: {
    top: 80,
    bottom: 80,
  },
});
