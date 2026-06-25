/*
 * Vercel doesn't inject all environment variables into the runtime
 * some are only available through the process.env object
 */

import type {AppLoadContext} from '@shopify/remix-oxygen';

export function envVariables(contextEnv: Env) {
  let env: Env | NodeJS.ProcessEnv = contextEnv;

  if (typeof process !== 'undefined') {
    // Process is accessible in Vercel environment
    env = process.env;
  }

  return {
    NODE_ENV: env.NODE_ENV as AppLoadContext['env']['NODE_ENV'],
    PRIVATE_STOREFRONT_API_TOKEN: checkRequiredEnv(
      env.PRIVATE_STOREFRONT_API_TOKEN,
      'PRIVATE_STOREFRONT_API_TOKEN',
    ),
    PUBLIC_CHECKOUT_DOMAIN: checkRequiredEnv(
      env.PUBLIC_CHECKOUT_DOMAIN,
      'PUBLIC_CHECKOUT_DOMAIN',
    ),
    PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID: checkRequiredEnv(
      env.PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID,
      'PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID',
    ),
    PUBLIC_CUSTOMER_ACCOUNT_API_URL: checkRequiredEnv(
      env.PUBLIC_CUSTOMER_ACCOUNT_API_URL,
      'PUBLIC_CUSTOMER_ACCOUNT_API_URL',
    ),
    PUBLIC_STORE_DOMAIN: checkRequiredEnv(
      env.PUBLIC_STORE_DOMAIN,
      'PUBLIC_STORE_DOMAIN',
    ),
    PUBLIC_STOREFRONT_API_TOKEN: checkRequiredEnv(
      env.PUBLIC_STOREFRONT_API_TOKEN,
      'PUBLIC_STOREFRONT_API_TOKEN',
    ),
    PUBLIC_STOREFRONT_API_VERSION:
      env.PUBLIC_STOREFRONT_API_VERSION || '2024-01',
    PUBLIC_STOREFRONT_ID: env.PUBLIC_STOREFRONT_ID || '',
    SANITY_STUDIO_API_VERSION: env.SANITY_STUDIO_API_VERSION || '2024-05-01',
    SANITY_STUDIO_DATASET: checkRequiredEnv(
      env.SANITY_STUDIO_DATASET,
      'SANITY_STUDIO_DATASET',
    ),
    SANITY_STUDIO_PROJECT_ID: checkRequiredEnv(
      env.SANITY_STUDIO_PROJECT_ID,
      'SANITY_STUDIO_PROJECT_ID',
    ),
    SANITY_STUDIO_TOKEN: checkRequiredEnv(
      env.SANITY_STUDIO_TOKEN,
      'SANITY_STUDIO_TOKEN',
    ),
    SANITY_STUDIO_URL: checkRequiredEnv(
      env.SANITY_STUDIO_URL,
      'SANITY_STUDIO_URL',
    ),
    SANITY_STUDIO_USE_PREVIEW_MODE:
      env.SANITY_STUDIO_USE_PREVIEW_MODE || 'false',
    SESSION_SECRET: env.SESSION_SECRET || '',
    SHOP_ID: checkRequiredEnv(env.SHOP_ID, 'SHOP_ID'),
    KLAVIYO_API_PRIVATE_KEY:env.KLAVIYO_API_PRIVATE_KEY,
    KLAVIYO_LIST_ID:env.KLAVIYO_LIST_ID,
    KLEVU_ID:env.KLEVU_ID,
    GTM_KEY:env.GTM_KEY,
    USERWAY_ACCOUNT_ID:env.USERWAY_ACCOUNT_ID,
    PLATF_APP_INSTALLED_SITE_ID:env.PLATF_APP_INSTALLED_SITE_ID,
    DEFAULT_PRODUCT_IMAGE:env.DEFAULT_PRODUCT_IMAGE,
    LINKEDIN_PARTNER_ID:env.LINKEDIN_PARTNER_ID,
    BING_TAG_ID:env.BING_TAG_ID,
    FB_PIXEL_ID:env.FB_PIXEL_ID,
    GOOGLE_SITE_VERIFICATION:env.GOOGLE_SITE_VERIFICATION,
    KLEVU_KEY:env.KLEVU_KEY,
    ADMIN_API:env.ADMIN_API,
    ADMIN_ACCESS_TOKEN:env.ADMIN_ACCESS_TOKEN
  };
}

function checkRequiredEnv(env: string | undefined, name: string) {
  if (typeof env !== 'string') {
    throw new Error(`Missing environment variable => ${name} is not set`);
  }

  return env;
}
