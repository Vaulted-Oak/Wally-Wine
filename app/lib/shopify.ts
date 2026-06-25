// ~/lib/shopify.ts
import {shopifyApi, LATEST_API_VERSION} from '@shopify/shopify-api';
import {restResources} from '@shopify/shopify-api/rest/admin/2023-01';
import '@shopify/shopify-api/adapters/cf-worker';

//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
//d6712985eaafaaa9471ed8bed74cd170
//04217d1dce4379d19c054f770385bafc
export const shopify = shopifyApi({
  apiKey: 'd6712985eaafaaa9471ed8bed74cd170',
  apiSecretKey: '04217d1dce4379d19c054f770385bafc',
  apiVersion: LATEST_API_VERSION,
  isCustomStoreApp: true,
  scopes: [],
  isEmbeddedApp: false,
  hostName: `https://cbbc83-3.myshopify.com`,
  restResources,
});