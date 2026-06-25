import {
  IMAGE_FRAGMENT,
  MEDIA_FRAGMENT,
  PRODUCT_CARD_FRAGMENT,
  PRODUCT_VARIANT_FRAGMENT,
} from './fragments';

/*
|-------------------------------------------------------------------------- 
| PRIVACY_POLICY Queries
|-------------------------------------------------------------------------- 
*/

export const PRIVACY_POLICY_QUERY = `
  query PrivacyPolicy {
    shop {
      privacyPolicy {
        title
        body
      }
    }
  }
`;

/*
|-------------------------------------------------------------------------- 
| Pages Queries
|-------------------------------------------------------------------------- 
*/

export const PAGE_QUERY = `
  query GetPage($handle: String!) {
    page(handle: $handle) {
      title
      body
    }
  }
`;

/*
|-------------------------------------------------------------------------- 
| Blogs Queries
|-------------------------------------------------------------------------- 
*/

export const BLOG_ARTICLES_QUERY = `#graphql
  query BlogArticles($handle: String!, $first: Int!) {
    blog(handle: $handle) {
      title
      handle
      articles(first: $first, sortKey: ID, reverse: true) {
        edges {
          node {
            id
            tags
            title
            handle
            excerpt
            publishedAt
            image {
              url
              altText
            }
            contentHtml
          }
        }
        pageInfo {
          endCursor
          hasNextPage
          hasPreviousPage
          startCursor
        }
      }
      seo {
        description
        title
      }
    }
  }
` as const;

/*
|-------------------------------------------------------------------------- 
| Blog Article Query
|-------------------------------------------------------------------------- 
*/

export const BLOG_ARTICLE_QUERY = `#graphql
  query BlogArticle($blogHandle: String!,$first:Int!, $articleHandle: String!) {
    blog(handle: $blogHandle) {
      id
      title
      articleByHandle(handle: $articleHandle) {
        id
        tags
        seo {
          description
          title
        }
        title
        contentHtml
        publishedAt
        image {
          url
          altText
        }
        comments(first: $first) {
          edges {
            node {
              author {
                name
              }
              content
            }
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
            endCursor
            startCursor
          }
        }
      }
    }
  }
` as const;

/*
|--------------------------------------------------------------------------
| Products Queries
|--------------------------------------------------------------------------
*/
export const PRODUCT_QUERY = `#graphql
query Product(
  $country: CountryCode
  $language: LanguageCode
  $handle: String!
) @inContext(country: $country, language: $language) {
  product(handle: $handle) {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    options {
      name
      values
    }
    media(first: 7) {
      nodes {
        ...Media
      }
    }
    variants(first: 1) {
      nodes {
        ...ProductVariantFragment
      }
    }
    seo {
      description
      title
    }
    collections(first: 1){
      nodes{
        title
        handle
      }
    }
    foodParings:metafield(namespace: "custom", key: "food_pairings") {
      key
      id
      value
    }
    wineType:metafield(namespace: "custom", key: "wine_type") {
      key
      id
      value
    }
    varietal:metafield(namespace: "custom", key: "varietal") {
      key
      id
      value
    }
    vinuos:metafield(namespace: "custom", key: "vinuos") {
      key
      id
      value
    }
    wineAdvocateNotes:metafields(identifiers: [
    {namespace: "custom", key: "wine_advocate"},
    {namespace: "custom", key: "wa_note_wine_advocate"},
    {namespace: "custom", key: "wa_note_wine_advocate_new"},
    ]) {
      id
      key
      value
      namespace
    }
    wineSpectatorNotes:metafields(identifiers: [
    {namespace: "custom", key: "wine_spectator"},
    {namespace: "custom", key: "ws_notes_wine_spectator_new"},
    {namespace: "custom", key: "ws_notes_wine_spectator"},
    ]) {
      id
      key
      value
      namespace
    }
    vinuosNotes:metafields(identifiers: [
    {namespace: "custom", key: "vinuos"},
    {namespace: "custom", key: "v_notes_vinuos_new"},
    {namespace: "custom", key: "v_notes_vinuos"},
    ]) {
      id
      key
      value
      namespace
    }
    wineEnthusiastNotes:metafields(identifiers: [
    {namespace: "custom", key: "wine_enthusiast"},
    {namespace: "custom", key: "we_notes_wine_enthusiast"},
    {namespace: "custom", key: "we_notes_wine_enthusiast_new"},
    ]) {
      id
      key
      value
      namespace
    }
    wineAdvocate:metafield(namespace: "custom", key: "wine_advocate") {
      key
      id
      value
    }
    wineSpectator:metafield(namespace: "custom", key: "wine_spectator") {
      key
      id
      value
    }
    wineEnthusiast:metafield(namespace: "custom", key: "wine_enthusiast") {
      key
      id
      value
    }
    expertRated:metafield(namespace: "custom", key: "expert_rated") {
      key
      id
      value
    }
    topPick:metafield(namespace: "custom", key: "top_pick") {
      key
      id
      value
    }
    futures:metafield(namespace: "custom", key: "special_designation") {
      key
      id
      value
    }
    metafields(identifiers: [
    {namespace: "custom", key: "abv"},
    {namespace: "custom", key: "gtin"},
    {namespace: "custom", key: "time_of_event"},
    {namespace: "custom", key: "start_time_of_event"},
    {namespace: "custom", key: "spirit_style"},
    {namespace: "custom", key: "spirit_type"},
    {namespace: "custom", key: "special_product"},
    {namespace: "custom", key: "species"},
    {namespace: "custom", key: "special_designation"},
    {namespace: "custom", key: "smoked"},
    {namespace: "custom", key: "service_type"},
    {namespace: "custom", key: "cheese_rennet"},
    {namespace: "custom", key: "profile"},
    {namespace: "custom", key: "perishable_product"},
    {namespace: "custom", key: "type_of_olive"},
    {namespace: "custom", key: "nuts"},
    {namespace: "custom", key: "non_alcohol_type"},
    {namespace: "custom", key: "milk_type"},
    {namespace: "custom", key: "label_origin"},
    {namespace: "custom", key: "ingredients"},
    {namespace: "custom", key: "industry"},
    {namespace: "custom", key: "host_of_event"},
    {namespace: "custom", key: "grains_used"},
    {namespace: "custom", key: "glass_type"},
    {namespace: "custom", key: "fruit"},
    {namespace: "custom", key: "flower"},
    {namespace: "custom", key: "flavor"},
    {namespace: "custom", key: "location_of_event"},
    {namespace: "custom", key: "event_type"},
    {namespace: "custom", key: "end_time_of_event"},
    {namespace: "custom", key: "density"},
    {namespace: "custom", key: "date_of_event"},
    {namespace: "custom", key: "cut"},
    {namespace: "custom", key: "cheese_style"},
    {namespace: "custom", key: "percent_cacao"},
    {namespace: "custom", key: "cacao_origin"},
    {namespace: "custom", key: "breed"},
    {namespace: "custom", key: "bottle_count"},
    {namespace: "custom", key: "book_type"},
    {namespace: "custom", key: "beer_style"},
    {namespace: "custom", key: "basket_type"},
    {namespace: "custom", key: "featured"},
    {namespace: "custom", key: "author"},
    {namespace: "custom", key: "animal"},
    {namespace: "custom", key: "aging"},
    {namespace: "custom", key: "acidity"},
    {namespace: "custom", key: "accessory_type"},
    {namespace: "custom", key: "appellation"},
    {namespace: "custom", key: "country"},
    {namespace: "custom", key: "producer"},
    {namespace: "custom", key: "product"},
    {namespace: "custom", key: "region"},
    {namespace: "custom", key: "size"},
    {namespace: "custom", key: "varietal"},
    {namespace: "custom", key: "us_states"},
    {namespace: "custom", key: "vintage"},
    {namespace: "custom", key: "wine_type"}
    ]) {
      id
      key
      value
      namespace
    }
    adjacentVariants {
      sku
      barcode
    }
    availableForSale
  }
}
${MEDIA_FRAGMENT}
${PRODUCT_VARIANT_FRAGMENT}
` as const;

export const FEATURED_PRODUCT_QUERY = `#graphql
query FeaturedProduct(
  $country: CountryCode
  $language: LanguageCode
  $id: ID!
) @inContext(country: $country, language: $language) {
  product(id: $id) {
    id
    title
    vendor
    handle
    descriptionHtml
    options {
      name
      values
    }
    # There is a lot of variants to fetch but this query is deferred
    # so it won't block the main page from loading.
    variants(first: 250) {
      nodes {
        ...ProductVariantFragment
      }
    }
  }
}
${PRODUCT_VARIANT_FRAGMENT}
` as const;

export const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  query productRecommendations(
    $count: Int
    $country: CountryCode
    $language: LanguageCode
    $productId: ID!
  ) @inContext(country: $country, language: $language) {
    mainProduct: product(id: $productId) {
      id
    }
    recommended: productRecommendations(productId: $productId) {
      ...ProductCard
    }
    additional: products(first: $count, sortKey: BEST_SELLING) {
      nodes {
        ...ProductCard
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;

export const ALL_PRODUCTS_QUERY = `#graphql
  query AllProducts(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes {
        ...ProductCard
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;

/*
|--------------------------------------------------------------------------
| Variants Queries
|--------------------------------------------------------------------------
*/
export const VARIANTS_QUERY = `#graphql
  query variants(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      variants(first: 250) {
        nodes {
          ...ProductVariantFragment
        }
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

/*
|--------------------------------------------------------------------------
| Collections Queries
|--------------------------------------------------------------------------
*/
export const COLLECTIONS_QUERY = `#graphql
  query Collections(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $query: String
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(first: $first, last: $last, before: $startCursor, after: $endCursor, query: $query) {
      nodes {
        id
        title
        description
        handle
        seo {
          description
          title
        }
        image {
          ...ImageFragment
        }
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${IMAGE_FRAGMENT}
`;

export const COLLECTION_QUERY = `#graphql
  query CollectionDetails(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      image {
        ...ImageFragment
      }
      seo {
        description
        title
      }
      products(first: 10) {
        nodes {
          handle
        }
      }
    }
  }
  ${IMAGE_FRAGMENT}
` as const;

export const COLLECTION_PRODUCT_GRID_QUERY = `#graphql
  query CollectionProductGrid(
    $id: ID!
    $country: CountryCode
    $language: LanguageCode
    $filters: [ProductFilter!]
    $sortKey: ProductCollectionSortKeys!
    $reverse: Boolean
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(id: $id) {
      id
      handle
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor,
        filters: $filters,
        sortKey: $sortKey,
        reverse: $reverse
      ) {
        filters {
          id
          label
          type
          values {
            id
            label
            count
            input
          }
        }
        nodes {
          ...ProductCard
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;

export const FEATURED_COLLECTION_QUERY = `#graphql
  query FeaturedCollection(
    $id: ID!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
  ) @inContext(country: $country, language: $language) {
    collection(id: $id) {
      id
      handle
      title
      description
      image {
        ...ImageFragment
      }
      products(
        first: $first,
      ) {
        nodes {
          ...ProductCard
        }
      }
    }
  }
  ${IMAGE_FRAGMENT}
  ${PRODUCT_CARD_FRAGMENT}
` as const;
