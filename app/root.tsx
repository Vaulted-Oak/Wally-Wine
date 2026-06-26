import type {
  LoaderFunctionArgs,
  MetaFunction,
  SerializeFrom,
} from '@shopify/remix-oxygen';

import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  ShouldRevalidateFunction,
  useLoaderData,
  useMatches,
  useNavigate,
  useRouteError,
} from 'react-router';
import {Analytics, getShopAnalytics, useNonce} from '@shopify/hydrogen';
import {data as defer} from '@shopify/remix-oxygen';
import {DEFAULT_LOCALE} from 'countries';

import {Layout} from '~/components/layout/Layout';

import faviconAsset from '../public/favicon.ico';
import {CssVars} from './components/CssVars';
import {CustomAnalytics} from './components/CustomAnalytics';
import {Fonts} from './components/Fonts';
import {generateSanityImageUrl} from './components/sanity/SanityImage';
import {Button} from './components/ui/Button';
import {useLocalePath} from './hooks/useLocalePath';
import {useSanityThemeContent} from './hooks/useSanityThemeContent';
import {generateFontsPreloadLinks} from './lib/fonts';
import {resolveShopifyPromises} from './lib/resolveShopifyPromises';
import {seoPayload} from './lib/seo.server';
import {ROOT_QUERY} from './qroq/queries';
import tailwindCss from './styles/tailwind.css?url';
import customCss from './styles/custom.css?url';
import {Script} from '@shopify/hydrogen';
import CookieBanner from '~/components/ui/CookieBanner';
import React, {useState, useEffect, Suspense} from 'react';
import AccessibilityMenu from './components/AccessibilityMenu';

// This is important to avoid re-fetching root queries on sub-navigations
export const shouldRevalidate: ShouldRevalidateFunction = ({
  currentUrl,
  formMethod,
  nextUrl,
}) => {
  // revalidate when a mutation is performed e.g add to cart, login...
  if (formMethod && formMethod !== 'GET') {
    return true;
  }

  // revalidate when manually revalidating via useRevalidator
  if (currentUrl.toString() === nextUrl.toString()) {
    return true;
  }

  return false;
};

export function links() {
  return [
    {
      href: 'https://cdn.shopify.com',
      rel: 'preconnect',
      crossorigin: 'anonymous',
    },
    {
      href: 'https://connect.facebook.net',
      rel: 'preconnect',
      tagName: 'link',
    },
    {
      href: 'https://snap.licdn.com',
      rel: 'preconnect',
      tagName: 'link',
    },
    {
      href: 'https://static.hotjar.com',
      rel: 'preconnect',
      tagName: 'link',
    },
    {
      href: 'https://static.klaviyo.com',
      rel: 'preconnect',
      tagName: 'link',
    },
    {
      href: 'https://cdn.userway.org',
      rel: 'preconnect',
      tagName: 'link',
    },
    {
      href: 'https://config.gorgias.chat',
      rel: 'preconnect',
      tagName: 'link',
    },
    {href: tailwindCss, rel: 'stylesheet'},
    {href: customCss, rel: 'stylesheet'},
  ];
}

export const meta: MetaFunction<typeof loader> = (loaderData) => {
  const data = loaderData?.data;
  // Preload fonts files to avoid FOUT (flash of unstyled text)
  const fontsPreloadLinks = generateFontsPreloadLinks({
    fontsData: data?.sanityRoot?.data?.fonts,
  });

  return [
    {
      // Preconnect to the Sanity CDN before loading fonts
      href: 'https://cdn.sanity.io',
      rel: 'preconnect',
      tagName: 'link',
    },
    {
      rel: 'preload',
      fetchpriority: 'high',
      href: 'https://cdn.sanity.io/images/6n4fbwab/production/3ce48c82c14eac60b5fa0460eb993f9f7f6860ff-2376x1395.jpg?rect=0,30,2376,1337&w=1500&h=844&auto=format',
      as: 'image',
    },
    {
      rel: 'preload',
      fetchpriority: 'high',
      href: 'https://cdn.sanity.io/images/6n4fbwab/production/629efc46e2cbfb36956e87cbf3e531157ac9d66e-1663x976.jpg?rect=0,20,1663,936&w=1500&h=844&auto=format',
      as: 'image',
    },
    {
      rel: 'preload',
      fetchpriority: 'high',
      href: 'https://cdn.sanity.io/images/6n4fbwab/production/14750dd3a51eafa9a26c2368a536e643a754424a-2376x1395.png?rect=0,30,2376,1337&w=1500&h=844&auto=format',
      as: 'image',
    },
    {
      rel: 'preload',
      fetchpriority: 'high',
      href: 'http://cdn.sanity.io/images/6n4fbwab/production/45afbd3611fdd3625dd4f1fdac1f3a425c79b6c3-2376x1395.png?rect=0,30,2376,1337&w=1500&h=844&auto=format',
      as: 'image',
    },
    ...generateFaviconUrls(data as SerializeFrom<typeof loader>),
    ...fontsPreloadLinks,
  ];
};

export async function loader({context, request}: LoaderFunctionArgs) {
  const {
    cart,
    customerAccount,
    env,
    locale,
    sanity,
    sanityPreviewMode,
    storefront,
  } = context;
  const language = locale?.language.toLowerCase();
  const isLoggedInPromise = customerAccount.isLoggedIn();

  const queryParams = {
    defaultLanguage: DEFAULT_LOCALE.language.toLowerCase(),
    language,
  };

  const rootData = Promise.all([
    sanity.query({
      groqdQuery: ROOT_QUERY,
      params: queryParams,
    }),
    storefront.query(`#graphql
      query layout {
        shop {
          id
        }
      }
    `),
    cart.get(),
  ]);

  const [sanityRoot, layout, cartPromise] = await rootData;

  const seo = seoPayload.root({
    root: sanityRoot.data,
    sanity: {
      dataset: env.SANITY_STUDIO_DATASET,
      projectId: env.SANITY_STUDIO_PROJECT_ID,
    },
    url: request.url,
  });

  const {
    collectionListPromise,
    featuredCollectionPromise,
    featuredProductPromise,
  } = resolveShopifyPromises({
    document: sanityRoot,
    request,
    storefront,
  });

  return defer({
    cart: cartPromise,
    collectionListPromise,
    consent: {
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
      storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      withPrivacyBanner: true,
      cookieConsent: {
        functional: true,
        performance: true,
        analytics: true,
      },
    },
    privacyPolicyUrl: env.PUBLIC_STORE_DOMAIN
      ? `/policies/privacy-policy`
      : null,
    env: {
      /*
       * Be careful not to expose any sensitive environment variables here.
       */
      NODE_ENV: env.NODE_ENV,
      PUBLIC_STORE_DOMAIN: env.PUBLIC_STORE_DOMAIN,
      PUBLIC_STOREFRONT_API_TOKEN: env.PUBLIC_STOREFRONT_API_TOKEN,
      PUBLIC_STOREFRONT_API_VERSION: env.PUBLIC_STOREFRONT_API_VERSION,
      SANITY_STUDIO_API_VERSION: env.SANITY_STUDIO_API_VERSION,
      SANITY_STUDIO_DATASET: env.SANITY_STUDIO_DATASET,
      SANITY_STUDIO_PROJECT_ID: env.SANITY_STUDIO_PROJECT_ID,
      SANITY_STUDIO_URL: env.SANITY_STUDIO_URL,
      SANITY_STUDIO_USE_PREVIEW_MODE: env.SANITY_STUDIO_USE_PREVIEW_MODE,
      KLAVIYO_LIST_ID: env.KLAVIYO_LIST_ID,
      KLEVU_KEY: env.KLEVU_KEY,
      KLEVU_ID: env.KLEVU_ID,
      GTM_KEY: env.GTM_KEY,
      USERWAY_ACCOUNT_ID: env.USERWAY_ACCOUNT_ID,
      PLATF_APP_INSTALLED_SITE_ID: env.PLATF_APP_INSTALLED_SITE_ID,
      DEFAULT_PRODUCT_IMAGE: env.DEFAULT_PRODUCT_IMAGE,
      ADMIN_API: env.ADMIN_API,
      ADMIN_ACCESS_TOKEN: env.ADMIN_ACCESS_TOKEN,
      LINKEDIN_PARTNER_ID: env.LINKEDIN_PARTNER_ID,
      BING_TAG_ID: env.BING_TAG_ID,
      FB_PIXEL_ID: env.FB_PIXEL_ID,
      GOOGLE_SITE_VERIFICATION: env.GOOGLE_SITE_VERIFICATION,
    },
    featuredCollectionPromise,
    featuredProductPromise,
    isLoggedIn: isLoggedInPromise,
    locale,
    sanityPreviewMode,
    sanityRoot,
    seo,
    shop: getShopAnalytics({
      publicStorefrontId: env.PUBLIC_STOREFRONT_ID,
      storefront: storefront,
    }),
  });
}

export default function App() {
  const nonce = useNonce();
  const data = useLoaderData<typeof loader>();
  const [consent, setConsent] = useState<any>({
    functional: true,
    performance: false,
    analytics: false,
  });
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedConsent = localStorage.getItem('userConsent');
      if (savedConsent) {
        setConsent(JSON.parse(savedConsent));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedConsent = localStorage.getItem('userConsent');
      if (savedConsent) {
        setConsent(JSON.parse(savedConsent));
      }

      // Dynamically append the Gorgias script after the app is fully loaded
      const script = document.createElement('script');
      script.id = 'gorgias-chat-widget-install-v2';
      script.src =
        'https://config.gorgias.chat/gorgias-chat-bundle-loader.js?applicationId=5238';
      script.async = true;
      document.body.appendChild(script);

      return () => {
        // Cleanup the script if needed
        const existingScript = document.getElementById(
          'gorgias-chat-widget-install-v2',
        );
        if (existingScript) {
          existingScript.remove();
        }
      };
    }
  }, []);

  return (
    <html lang={data?.locale?.language?.toLowerCase() || 'en'}>
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width,initial-scale=1" name="viewport" />
        <Meta />
        <Fonts />
        <Links />
        <CssVars />
        {data?.env?.GTM_KEY && (
          <Script
            rel="preload"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${data.env.GTM_KEY}');`,
            }}
            async
          ></Script>
        )}
        {data?.env?.GOOGLE_SITE_VERIFICATION && (
          <meta
            name="google-site-verification"
            content={data.env.GOOGLE_SITE_VERIFICATION}
          />
        )}
      </head>
      <body className="flex min-h-screen flex-col overflow-x-hidden bg-background text-foreground">
        <Suspense
          fallback={
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="24" height="24" fill="#E0E0E0" />
              <path d="M12 8C10.8954 8 10 8.89543 10 10C10 11.1046 10.8954 12 12 12C13.1046 12 14 11.1046 14 10C14 8.89543 13.1046 8 12 8ZM12 14C9.79086 14 8 15.7909 8 18H16C16 15.7909 14.2091 14 12 14Z" />
            </svg>
          }
        >
          <Analytics.Provider
            cart={data?.cart}
            consent={{
              checkoutDomain: data?.env?.PUBLIC_STORE_DOMAIN || '',
              storefrontAccessToken: data?.env?.PUBLIC_STOREFRONT_API_TOKEN || '',
              cookieConsent: consent, // Pass persisted consent state
            }}
            shop={data?.shop}
          >
            <Layout env={data?.env} locale={data?.locale} sanityPreviewMode={data?.sanityPreviewMode}>
              <CookieBanner
                privacyPolicyUrl={data?.privacyPolicyUrl}
                onConsentChange={setConsent} // Update consent state
              />
              <Outlet />
            </Layout>
            <CustomAnalytics />
          </Analytics.Provider>
        </Suspense>
        <ScrollRestoration nonce={nonce} />
        <Suspense
          fallback={
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="24" height="24" fill="#E0E0E0" />
              <path
                d="M12 8C10.8954 8 10 8.89543 10 10C10 11.1046 10.8954 12 12 12C13.1046 12 14 11.1046 14 10C14 8.89543 13.1046 8 12 8ZM12 14C9.79086 14 8 15.7909 8 18H16C16 15.7909 14.2091 14 12 14Z"
                fill="#BDBDBD"
              />
            </svg>
          }
        >
          <Scripts nonce={nonce} />
          <Scripts rel="preload" nonce={nonce} />
          <Script
            rel="preload"
            dangerouslySetInnerHTML={{
              __html: `(function(h,o,t,j,a,r){
                      h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                      h._hjSettings={hjid:3902686,hjsv:6};
                      a=o.getElementsByTagName('head')[0];
                      r=o.createElement('script');r.async=1;
                      r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                      a.appendChild(r);
                  })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`,
            }}
            defer
          ></Script>
          <Script
            rel="preload"
            async
            type="text/javascript"
            src="//static.klaviyo.com/onsite/js/VdEP7L/klaviyo.js"
          />
          {data?.env && (
            <AccessibilityMenu
              accountId={data.env.USERWAY_ACCOUNT_ID}
              platformAppId={data.env.PLATF_APP_INSTALLED_SITE_ID}
              storeDomain={data.env.PUBLIC_STORE_DOMAIN}
            />
          )}
        </Suspense>
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const nonce = useNonce();
  const routeError = useRouteError();
  const rootLoaderData = useRootLoaderData();
  const locale = rootLoaderData?.locale || {country: 'US', language: 'EN'};
  const isRouteError = isRouteErrorResponse(routeError);
  const {themeContent} = useSanityThemeContent();
  const errorStatus = isRouteError ? routeError.status : 500;
  const collectionsPath = useLocalePath({path: '/collections'});
  const navigate = useNavigate();

  let title = themeContent?.error?.serverError;
  let pageType = 'page';

  if (isRouteError) {
    title = themeContent?.error?.pageNotFound;
    if (errorStatus === 404) pageType = routeError.data || pageType;
  }

  return (
    <html lang={locale.language.toLowerCase()}>
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width,initial-scale=1" name="viewport" />
        <meta name="robots" content="noindex,nofollow" />
        <Meta />
        <Fonts />
        <Links />
        <CssVars />
      </head>
      <body className="flex min-h-screen flex-col overflow-x-hidden bg-background text-foreground">
        <Layout>
          <section>
            <div className="container flex flex-col items-center justify-center py-20 text-center">
              <span>{errorStatus}</span>
              <h1 className="mt-5">{title}</h1>
              {errorStatus === 404 ? (
                <Button asChild className="mt-6" variant="secondary">
                  <Link to={collectionsPath}>
                    {themeContent?.cart?.continueShopping}
                  </Link>
                </Button>
              ) : (
                <Button
                  className="mt-6"
                  onClick={() => navigate(0)}
                  variant="secondary"
                >
                  {themeContent?.error?.reloadPage}
                </Button>
              )}
            </div>
          </section>
        </Layout>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export const useRootLoaderData = () => {
  const [root] = useMatches();
  return root?.data as SerializeFrom<typeof loader>;
};

function generateFaviconUrls(loaderData: SerializeFrom<typeof loader>) {
  const env = loaderData?.env;
  const favicon = loaderData?.sanityRoot?.data?.settings?.favicon;

  if (!favicon || !env) {
    return [
      {
        href: faviconAsset,
        rel: 'icon',
        tagName: 'link',
        type: 'image/x-icon',
      },
    ];
  }

  const faviconUrl = generateSanityImageUrl({
    dataset: env.SANITY_STUDIO_DATASET,
    height: 32,
    projectId: env.SANITY_STUDIO_PROJECT_ID,
    ref: favicon?._ref,
    width: 32,
  });

  const appleTouchIconUrl = generateSanityImageUrl({
    dataset: env.SANITY_STUDIO_DATASET,
    height: 180,
    projectId: env.SANITY_STUDIO_PROJECT_ID,
    ref: favicon?._ref,
    width: 180,
  });

  return [
    {
      href: faviconUrl,
      rel: 'icon',
      tagName: 'link',
      type: 'image/x-icon',
    },
    {
      href: appleTouchIconUrl,
      rel: 'apple-touch-icon',
      tagName: 'link',
    },
    {
      href: appleTouchIconUrl,
      rel: 'apple-touch-icon-precomposed',
      tagName: 'link',
    },
  ];
}
