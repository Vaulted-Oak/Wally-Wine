import { EyeOff, } from 'lucide-react';
import { defineField } from 'sanity';

export default defineField({
    name: 'videoSection',
    title: 'Video Section',
    type: 'object', // This is now an array
    fields: [
        defineField({
            title: 'Title',
            type: 'string',
            name: 'title'
        }),
        defineField({
            name: 'content',
            type: 'richtext',
        }),
        defineField({
            name: 'videos',
            title: 'Video File',
            type: 'file',
            options: {
                accept: 'video/*',
            },
        }),
        defineField({
            type: 'image',
            title: 'Placeholder Image',
            name: 'backgroundImage',
            options: {
                hotspot: true,
            },
            validation: (rule) => rule.required()
        }),
        defineField({
            name: 'buttons',
            title: 'Call to Action Buttons',
            type: 'array',
            of: [{ type: 'ctaButton' }],
            description: 'Add buttons that will appear over the video',
            validation: (rule) => rule.max(4),
        }),
        defineField({
            type: 'sectionSettings',
            name: 'settings',
        }),
    ],
    initialValue: {
        videoType: 'iFrame',
    },
    preview: {
        select: {
            settings: 'settings',
            media: 'backgroundImage',
            title: 'title'
        },
        prepare({ title, settings, media }: any) {
            return {
                title: title ? title : 'Video File',
                media: settings?.hide ? EyeOff : media,
            };
        },
    },
});
