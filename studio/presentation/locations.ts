import {defineLocations} from 'sanity/presentation';
import {getAllLanguages} from '../../countries';

const languages = getAllLanguages();
const defaultLanguage = languages[0];

// Helper to build localized paths
const localizedPath = (id: string, path: string) =>
  id === defaultLanguage.id ? path : `/${id}${path}`;

// Helper to create locations for any document type
const createLocations = (doc: any, path: string) =>
  languages.map(({id, title}) => ({
    href: localizedPath(id, path),
    title: `${doc?.title || 'Untitled'} (${title})`,
  }));

export const locations = {
  home: defineLocations({
    select: {},
    resolve: () => ({
      locations: createLocations({title: 'Home'}, '/'),
    }),
  }),

  page: defineLocations({
    select: {
      title: 'title.0.value',
      slug: 'slug.current',
    },
    resolve: (doc) => {
      // Handle internationalized title field
      let titleValue = 'Untitled';
      if (doc?.title && Array.isArray(doc.title) && doc.title.length > 0) {
        titleValue = doc?.title[0]?.value || 'Untitled';
      } else if (typeof doc?.title === 'string') {
        titleValue = doc.title;
      }

      return {
        locations: createLocations(
          {
            title: titleValue,
          },
          `/${doc?.slug}`,
        ),
      };
    },
  }),

  product: defineLocations({
    select: {
      title: 'store.title',
      slug: 'store.slug.current',
    },
    resolve: (doc) => ({
      locations: createLocations(doc, `/products/${doc?.slug}`),
    }),
  }),

  collection: defineLocations({
    select: {
      title: 'store.title',
      slug: 'store.slug.current',
    },
    resolve: (doc) => ({
      locations: createLocations(doc, `/collections/${doc?.slug}`),
    }),
  }),
};
