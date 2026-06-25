import type { AppLoadContext } from '@shopify/remix-oxygen';

import { ServerRouter } from 'react-router';
import { createContentSecurityPolicy } from '@shopify/hydrogen';
import { isbot } from 'isbot';
import { renderToReadableStream } from 'react-dom/server';
import { EntryContext } from 'react-router/dist/entry';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
  context: AppLoadContext,
) {
  const { header, nonce, NonceProvider } = createContentSecurityPolicy({
    shop: {
      checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
      storeDomain: context.env.PUBLIC_STORE_DOMAIN,
    },
    ...createCspHeaders(),
  });

  const body = await renderToReadableStream(
    <NonceProvider>
      <ServerRouter
        context={reactRouterContext}
        nonce={nonce}
        url={request.url}
      />
    </NonceProvider>,
    {
      nonce,
      onError(error) {
        // eslint-disable-next-line no-console
        console.error(error);
        responseStatusCode = 500;
      },
      signal: request.signal,
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');

  // Set CSP headers only for non-preview environments
  // to allow vercel preview feedback/comments feature
  const VERCEL_ENV = getVercelEnv();
  if (!VERCEL_ENV || VERCEL_ENV !== 'preview') {
    responseHeaders.set('Content-Security-Policy', header);
  }

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}

export const createCspHeaders = () => {
  // Default CSP headers, will be used as a base for all environments
  const defaultsCSPHeaders = {
    connectSrc: ['*', "'self'",'https://*.userway.org','https://*.google-analytics.com','https://*.analytics.google.com','https://*.googletagmanager.com'],
    fontSrc: ['*.sanity.io','wallywine.formstack.com','https://*.userway.org','*.jotform.com', '*.klaviyo.com', "'self'", 'localhost:*','https://use.typekit.net','https://fonts.gstatic.com','https://*.googletagmanager.com'],
    frameAncestors: ['localhost:*','wallywine.formstack.com','*.sanity.io','https://*.userway.org','*.google.com','*.jotform.com','*.shopify.com', '*.sanity.studio','https://*.googletagmanager.com',],
    frameSrc: ["'self'",'*.facebook.net','*.bing.com','*.licdn.com','wallywine.formstack.com','*.sanity.io','https://*.userway.org','*.google.com','*.jotform.com','*.shopify.com','https://*.googletagmanager.com',],
    mediaSrc: ['*.sanity.io','*.facebook.com','wallywine.formstack.com','https://*.userway.org','*.google.com','https://*.googletagmanager.com','*.sanity.studio', '*.mux.com', 'localhost:*'],
    imgSrc: ['*.sanity.io','*.facebook.com','*.bing.com','*.linkedin.com','px.ads.linkedin.com','https://*.gorgias.io','wallywine.formstack.com','https://*.userway.org','https://*.googletagmanager.com','*.cloudfront.net' , '*.mux.com','*.sanity.studio', 'https://cdn.shopify.com', "'self'", 'localhost:*', '*.cdninstagram.com'],
    scriptSrc: ["'self'",'*.facebook.net','*.bing.com','*.licdn.com','https://*.gorgias.chat','*.hotjar.com','*.sanity.io','https://*.userway.org','*.google.com','*.jotform.com', 'https://*.google-analytics.com','https://*.googletagmanager.com','*.klaviyo.com','wallywine.formstack.com', '*.qstatic.com', 'localhost:*','*.sanity.studio', 'https://cdn.shopify.com', 'https://cdn.jsdelivr.net','https://*.googletagmanager.com'],
    styleSrc:["'self'",'*.sanity.io','https://*.userway.org','wallywine.formstack.com','https://*.googletagmanager.com','https://fonts.googleapis.com','https://use.typekit.net','https://p.typekit.net', '*.klaviyo.com', ]
  };

  // For Vercel production environment white-list vitals.vercel-insights
  const VERCEL_ENV = getVercelEnv();
  if (VERCEL_ENV === 'production') {
    defaultsCSPHeaders.connectSrc.push('https://vitals.vercel-insights.com');
    defaultsCSPHeaders.imgSrc.push('blob:', 'data:');
  }

  return defaultsCSPHeaders;
};

const getVercelEnv = () => {
  if (typeof process !== 'undefined') {
    return process.env.VERCEL_ENV;
  }
  return null;
};
