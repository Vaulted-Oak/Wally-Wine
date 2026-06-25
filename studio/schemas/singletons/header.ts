import {defineField, defineType} from 'sanity';
import {createSliderInput} from '../../components/Slider';

const GROUPS = [
  {
    name: 'navigation',
    title: 'Navigation',
    default: true,
  },
  {
    name: 'announcementBar',
    title: 'Announcement Bar',
  },
  {
    name: 'settings',
    title: 'Settings',
  },
];

export default defineType({
  name: 'header',
  type: 'document',
  __experimental_formPreviewTitle: false,
  groups: GROUPS,
  fields: [
    defineField({
      name: 'announcementBar',
      description: 'Default',
      group: 'announcementBar',
      type: 'internationalizedArrayAnnouncementBar',
    }),
    defineField({
      name: 'cmsAnnouncementBar',
      description: 'For selected pages',
      group: 'announcementBar',
      type: 'internationalizedArrayAnnouncementBar',
    }),
    defineField({
      name: 'announcementBarColorScheme',
      type: 'reference',
      group: 'announcementBar',
      to: [{type: 'colorScheme'}],
    }),
    defineField({
      name: 'autoRotateAnnouncements',
      type: 'boolean',
      group: 'announcementBar',
      initialValue: false,
    }),
    defineField({
      name: 'menu',
      group: 'navigation',
      description: 'Default',
      type: 'internationalizedArrayHeaderNavigation',
    }),
    defineField({
      name: 'cmsMenu',
      group: 'navigation',
      description: 'For selected pages',
      type: 'internationalizedArrayHeaderNavigation',
    }),
    defineField({
      name: 'selectedPages',
      title: 'Select Pages for CMS Announcement Bar & Menu',
      type: 'array',
      group: 'settings',
      of: [{name: 'page', type: 'reference', to: [{type: 'page'}]}],
      description:
        'Select the pages where the CMS Announcement Bar and CMS Menu should be shown.',
    }),
    defineField({
      name: 'colorScheme',
      title: 'Color scheme',
      type: 'reference',
      group: 'settings',
      to: [{type: 'colorScheme'}],
    }),
    defineField({
      name: 'blur',
      title: 'Background blur',
      type: 'boolean',
      group: 'settings',
      initialValue: false,
    }),
    defineField({
      name: 'sticky',
      title: 'Sticky header',
      type: 'string',
      group: 'settings',
      options: {
        list: [
          {title: 'None', value: 'none'},
          {title: 'On scroll up', value: 'onScrollUp'},
          {title: 'Always', value: 'always'},
        ],
      },
      initialValue: 'none',
    }),
    defineField({
      name: 'showSeparatorLine',
      title: 'Show separator line',
      type: 'boolean',
      group: 'settings',
      initialValue: true,
    }),
    defineField({
      name: 'padding',
      title: 'Header padding',
      type: 'padding',
      group: 'settings',
    }),
    defineField({
      name: 'desktopLogoWidth',
      title: 'Desktop logo width',
      type: 'number',
      group: 'settings',
      initialValue: 100,
      validation: (Rule: any) => Rule.min(0).max(400),
      components: {
        input: createSliderInput({min: 0, max: 400, suffix: 'px'}),
      },
    }),
  ],
  preview: {
    prepare: () => ({title: 'Header'}),
  },
});
