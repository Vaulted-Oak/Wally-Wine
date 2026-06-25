export const IMAGE_FRAGMENT = `#graphql
  fragment ImageFragment on Image {
    id
    altText
    width
    height
    url
    thumbnail: url(transform: { maxWidth: 30 })
  }
` as const;

export const PRODUCT_VARIANT_IMAGE_FRAGMENT = `#graphql
  fragment ProductVariantImageFragment on Image {
    id
    altText
    width
    height
    url
    thumbnail: url(transform: { maxWidth: 30 })
  }
`;

export const PRODUCT_CARD_IMAGE_FRAGMENT = `#graphql
  fragment ProductCardImageFragment on Image {
    id
    altText
    width
    height
    url
    thumbnail: url(transform: { maxWidth: 30 })
  }
`;

export const MEDIA_FRAGMENT = `#graphql
  fragment Media on Media {
    __typename
    mediaContentType
    alt
    previewImage {
      url
    }
    ... on MediaImage {
      id
      image {
        ...ImageFragment
      }
    }
    ... on Video {
      id
      sources {
        mimeType
        url
      }
    }
    ... on Model3d {
      id
      sources {
        mimeType
        url
      }
    }
    ... on ExternalVideo {
      id
      embedUrl
      host
    }
  }
  ${IMAGE_FRAGMENT}
`;

export const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariantFragment on ProductVariant {
    id
    availableForSale
    quantityAvailable
    selectedOptions {
      name
      value
    }
    image {
      ...ProductVariantImageFragment
    }
    price {
      amount
      currencyCode
    }
    compareAtPrice {
      amount
      currencyCode
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
  }
  ${PRODUCT_VARIANT_IMAGE_FRAGMENT}
`;

export const PRODUCT_CARD_FRAGMENT = `#graphql
  fragment ProductCard on Product {
    id
    title
    publishedAt
    handle
    vendor
    variants(first: 1) {
      nodes {
        id
        title
        availableForSale
        image {
          ...ProductCardImageFragment
        }
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
        selectedOptions {
          name
          value
        }
        product {
          handle
          title
        }
      }
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
    vinuos:metafield(namespace: "custom", key: "vinuos") {
      key
      id
      value
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
  }
  ${PRODUCT_CARD_IMAGE_FRAGMENT}
`;

export const CART_QUERY_FRAGMENT = `#graphql
  fragment Money on MoneyV2 {
    currencyCode
    amount
  }
  fragment CartLine on CartLine {
    id
    quantity
    attributes {
      key
      value
    }
    cost {
      totalAmount {
        ...Money
      }
      amountPerQuantity {
        ...Money
      }
      subtotalAmount {
        ...Money
      }
      compareAtAmountPerQuantity {
        ...Money
      }
    }
    discountAllocations {
      discountedAmount {
        amount
        currencyCode
      }
      targetType
      ... on CartAutomaticDiscountAllocation {
        __typename
        discountedAmount {
          amount
          currencyCode
        }
        targetType
        title
      }
      ... on CartCodeDiscountAllocation {
        __typename
        code
        discountedAmount {
          amount
          currencyCode
        }
        targetType
      }
      ... on CartCustomDiscountAllocation {
        __typename
        discountedAmount {
          amount
          currencyCode
        }
        targetType
        title
      }
    }
    merchandise {
      ... on ProductVariant {
        id
        availableForSale
        compareAtPrice {
          ...Money
        }
        price {
          ...Money
        }
        requiresShipping
        title
        image {
          ...ImageFragment
        }
        product {
          handle
          vendor
          title
          id
          futures:metafield(namespace: "custom", key: "special_designation") {
            key
            id
            value
          }
        }
        selectedOptions {
          name
          value
        }
      }
    }
  }
  fragment CartApiQuery on Cart {
    id
    updatedAt
    checkoutUrl
    totalQuantity
    buyerIdentity {
      countryCode
      customer {
        id
        email
        firstName
        lastName
        displayName
      }
      email
      phone
    }
    lines(first: $numCartLines) {
      nodes {
        ...CartLine
      }
    }
    cost {
      subtotalAmount {
        ...Money
      }
      totalAmount {
        ...Money
      }
      totalDutyAmount {
        ...Money
      }
      totalTaxAmount {
        ...Money
      }
    }
    note
    attributes {
      key
      value
    }
    discountCodes {
      code
      applicable
    }
    discountAllocations {
      discountedAmount {
        amount
        currencyCode
      }
    }
  }
  ${IMAGE_FRAGMENT}
` as const;

export const FEATURED_COLLECTION_FRAGMENT = `#graphql
  fragment FeaturedCollectionDetails on Collection {
    id
    title
    handle
    image {
      ...ImageFragment
    }
  }
  ${IMAGE_FRAGMENT}
`;
