import {LoaderFunction} from '@shopify/remix-oxygen';

async function fetchAllResources(
  storefront: any,
  query: string,
  type?: string,
) {
  let page = null;
  let hasNextPage = true;
  const allResources: any[] = [];

  while (hasNextPage) {
    const response = await storefront.query(query, {
      variables: {after: page},
      storefrontApiVersion: '2025-07',
    });
    const resources = response?.products?.edges || [];
    allResources.push(...resources);

    hasNextPage = response?.products?.pageInfo?.hasNextPage || false;
    page = response?.products?.pageInfo?.endCursor;
  }

  return allResources;
}

export const loader: LoaderFunction = async ({
  params,
  context: {storefront,env},
}) => {
  const locale = params.locale || 'en';

  const collections = await fetchAllResources(
    storefront,
    QUERIES.products,
    `collections`,
  );
  const feedItems = collections?.map(({node}) => {
    const variant = node?.variants?.edges[0]?.node;
    const imageUrl = node?.images?.edges[0]?.node?.url || env.DEFAULT_PRODUCT_IMAGE;
    const category = node?.collections?.edges[0]?.node?.title;
    const wineType = node?.wineType?.value;

    // Convert weightUnit to its abbreviation
    const weightUnitMap: Record<string, string> = {
      KILOGRAMS: 'kg',
      OUNCES: 'oz',
      GRAMS: 'g',
      POUNDS: 'lb',
    };
    const weightUnit =
      weightUnitMap[variant?.weightUnit] || variant?.weightUnit || '';

    return `
      <item>
        <g:id>${node?.id}</g:id>
        <g:title><![CDATA[${node?.title}]]></g:title>
        <g:description><![CDATA[${node?.description}]]></g:description>
        <g:link>https://www.wallywine.com/products/${node?.handle}</g:link>
        <g:image_link>${imageUrl}</g:image_link>
        <g:price>${variant?.price?.amount} ${variant?.price?.currencyCode}</g:price>
        <g:availability>in_stock</g:availability>
        <g:condition>new</g:condition>
        <g:sku>${variant?.sku || ''}</g:sku>
        <g:google_product_category><![CDATA[${category}]]></g:google_product_category>
        <g:product_type><![CDATA[${wineType || ''}]]></g:product_type>
        <g:shipping_weight><![CDATA[${variant?.weight} ${weightUnit}]]></g:shipping_weight>
        <g:identifier_exists>no</g:identifier_exists>
      </item>
    `;
  });

  const xmlFeed = `
    <?xml version="1.0"?>
    <rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
      <channel>
        <title>Wally's Wine</title>
        <link>https://www.wallywine.com</link>
        <description>Shop fine wine, rare spirits, and gourmet foods at Wally's. Trusted by collectors and connoisseurs since 1968. Nationwide shipping available. Shop online or visit our iconic locations in Beverly Hills, Santa Monica, and Las Vegas.</description>
        ${feedItems?.join('\n')}
      </channel>
    </rss>
  `.trim();

  return new Response(xmlFeed, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};

const PRODUCTS_QUERY = `#graphql
  query GoogleFeedProducts ($after: String) {
    products(first: 250, after: $after,query: "available_for_sale:true") {
      edges {
        node {
          id
          title
          handle
          description
          variants(first: 1) {
            edges {
              node {
                price {
                  amount
                  currencyCode
                }
                sku
                weightUnit
                weight
              }
            }
          }
          images(first: 1) {
            edges {
              node {
                url
              }
            }
          }
          wineType:metafield(key: "wine_type", namespace: "custom") {
            id
            key
            value
          }
          collections(first: 1) {
            edges {
              node {
                handle
                title
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
` as const;

const QUERIES = {
  products: PRODUCTS_QUERY,
};
