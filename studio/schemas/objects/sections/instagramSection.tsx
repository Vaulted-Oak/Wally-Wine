import { defineField } from 'sanity';
import { EyeOff, Image } from 'lucide-react';

export default defineField({
    name: 'instagramSection',
    title: 'Instagram Section',
    type: 'object',
    fields: [
        {
            name: 'accessToken',
            title: 'Access Token',
            type: 'string',
            description: 'The Instagram API access token to fetch images.',
            validation:(Rule)=>Rule.required()
        },
        defineField({
            type: 'sectionSettings',
            name: 'settings',
        }),
    ],
    preview: {
        select: {
            settings: 'settings',
        },
        prepare({ settings }: any) {
            return {
                title: 'Instagram Section',
                media: () => (settings?.hide ? <EyeOff /> : <Image />),
            };
        },
    },
});
