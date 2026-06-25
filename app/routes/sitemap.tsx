import {LoaderFunction} from '@shopify/remix-oxygen';
import {Link, useLoaderData} from 'react-router';
import {collections} from '../../studio/structure/collectionStructure';

type SitemapEntry = {
  url: string;
  lastModified: string;
  title: string;
};

async function fetchAllResources(storefront: any, query: string, type?: string) {
  let page = 1;
  let hasNextPage = true;
  const allResources: any[] = [];

  while (hasNextPage) {
    const response = await storefront.query(query, {
      variables: {page},
      storefrontApiVersion: '2025-07',
    });
    const resources = response?.sitemap?.resources?.items || [];
    allResources.push(...resources);

    hasNextPage = response?.sitemap?.resources?.hasNextPage || false;
    page += 1;
  }

  return allResources.map((item: any) => ({
    url: type ? `/${type}/${item.handle}` :`/${item.handle}`,
    lastModified: item.updatedAt,
    title: item.title,
  }));
}

export const loader: LoaderFunction = async ({
  params,
  context: {storefront},
}) => {
  const locale = params.locale || 'en';

  const collections = await fetchAllResources(
    storefront,
    QUERIES.collections,
    `collections`,
  );
  const pages = await fetchAllResources(storefront, QUERIES.pages);
  const blogs = await fetchAllResources(storefront, QUERIES.blogs, `blogs`);

  return {collections, pages, blogs};
};

export default function Sitemap() {
  const {collections, pages, blogs} = useLoaderData<{
    collections: SitemapEntry[];
    pages: SitemapEntry[];
    blogs: SitemapEntry[];
  }>();
  console.log(pages)
  return (
    <div>
      <h1>Sitemap</h1>
      <div className="flex justify-around">
        <div>
          <h3>Collections</h3>
          <ul>
            {collections?.map((collection, index) => (
              <li key={index}>
                <Link to={collection.url}>{collection.title}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Pages</h3>
          <ul>
            {pages?.map((page, index) => (
              <li key={index}>
                <Link to={page.url}>{page.title}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Blogs</h3>
          <ul>
            {blogs?.map((blog, index) => (
              <li key={index}>
                <Link to={blog.url}>{blog.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

const COLLECTION_SITEMAP_QUERY = `#graphql
query SitemapCollections($page: Int!) {
  sitemap(type: COLLECTION) {
    resources(page: $page) {
      items {
        handle
        updatedAt
        ... on SitemapResource {
          title
        }
      }
      hasNextPage
    }
    pagesCount {
      count
      precision
    }
  }
}
` as const;

const PAGE_SITEMAP_QUERY = `#graphql
    query SitemapPages($page: Int!) {
      sitemap(type: PAGE) {
        resources(page: $page) {
          items {
            handle
            updatedAt
            ... on SitemapResource {
                title
            }
          }
        }
      }
    }
` as const;

const BLOG_SITEMAP_QUERY = `#graphql
    query SitemapBlogs($page: Int!) {
  sitemap(type: BLOG) {
    resources(page: $page) {
      items {
        handle
        updatedAt
        ... on SitemapResource {
          title
        }
        ... on SitemapResourceMetaobject {
          onlineStoreUrlHandle
        }
      }
    }
  }
}
` as const;

const QUERIES = {
  collections: COLLECTION_SITEMAP_QUERY,
  pages: PAGE_SITEMAP_QUERY,
  blogs: BLOG_SITEMAP_QUERY,
};
