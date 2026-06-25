import { EyeOff } from 'lucide-react';
import { defineField, defineArrayMember } from 'sanity';
import { ImageIcon } from '@sanity/icons';

export default defineField({
    name: 'multiImageCarouselCollectionSection',
    title: 'Multi Image Carousel Collections',
    type: 'object',
    fields: [
        defineField({
            name: 'carouselItems',
            title: 'Carousel Items',
            type: 'array',
            of: [
                defineArrayMember({
                    name: 'carouselItem',
                    title: 'Carousel Item',
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'content',
                            title: 'Content',
                            type: 'richtext',
                        }),
                        defineField({
                            name: 'carouselImages',
                            title: 'Carousel Images',
                            type: 'array',
                            of: [
                                defineArrayMember({
                                    name: 'image',
                                    title: 'Image',
                                    type: 'image',
                                    options: {
                                        hotspot: true,
                                    },
                                }),
                            ],
                            options: {
                                layout: 'grid',
                            },
                        }),
                    ],
                    preview: {
                        select: {
                            media: 'carouselImages.0', // Display the first image
                        },
                        prepare({ media }: any) {
                            return {
                                title: 'Carousel Item', // Shorten long text
                                media: media || <ImageIcon />, // Fallback icon if no image is available
                            };
                        },
                    },
                }),
            ],
        }),
        defineField({
            type: 'sectionSettings',
            name: 'settings',
        }),
    ],
    initialValue: {
        settings: {
            padding: {
                top: 0,
                bottom: 0,
            },
        },
    },
    preview: {
        select: {
            media: 'carouselItems.0.carouselImages.0',
            settings: 'settings',
            title: 'title',
        },
        prepare({ media, settings, title }: any) {
            return {
                title: title || 'Multi Image Carousel',
                media: settings?.hide ? <EyeOff /> : media || <ImageIcon />,
            };
        },
    },
});
