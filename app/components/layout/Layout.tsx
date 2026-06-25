import { ShopifyProvider } from '@shopify/hydrogen-react';

import type { SerializeFrom } from '@shopify/remix-oxygen';
import type { loader } from '~/root';

import { useLocation } from 'react-router';
import { TogglePreviewMode } from '../sanity/TogglePreviewMode';
import { TailwindIndicator } from '../TailwindIndicator';
import { AnnouncementBar } from './AnnouncementBar';
import { Footer } from './Footer';
import { FramerMotion } from './FramerMotion';
import { Header } from './Header';
import { NavigationProgressBar } from './NavigationProgressBar';
import Breadcrumbs from '../Breadcrumbs';
import { Fragment } from 'react';
import { VisualEditing } from '../sanity/VisualEditing';

export type LayoutProps = {
  children?: React.ReactNode;
  env?: SerializeFrom<typeof loader>['env'];
  locale?: SerializeFrom<typeof loader>['locale'];
  sanityPreviewMode?: SerializeFrom<typeof loader>['sanityPreviewMode'];
};

export function Layout({ children = null, env, locale, sanityPreviewMode }: LayoutProps) {
  const location = useLocation();

  return (
    <ShopifyProvider
      countryIsoCode={locale?.country || 'US'}
      languageIsoCode={locale?.language || 'EN'}
      storeDomain={env?.PUBLIC_STORE_DOMAIN || 'cbbc83-3.myshopify.com'}
      storefrontApiVersion={env?.PUBLIC_STOREFRONT_API_VERSION || '2025-07'}
      storefrontToken={env?.PUBLIC_STOREFRONT_API_TOKEN || '4905c5e9fcfd592c4b39490091e7d2ff'}
    >
      <FramerMotion>
        <NavigationProgressBar />
        {location.pathname !== "/" ? (
          <Fragment>
            <AnnouncementBar />
            <Header />
          </Fragment>
        ) : null}
        <Breadcrumbs />
        <main className="flex lg:min-h-[50vh] min-h-screen grow flex-col gap-y-[calc(var(--space-between-template-sections)*.75)] sm:gap-y-[--space-between-template-sections]">
          {children}
        </main>
        <Footer />
        <TailwindIndicator />
          {sanityPreviewMode && <VisualEditing />}
        {!sanityPreviewMode && <TogglePreviewMode />}
      </FramerMotion>
    </ShopifyProvider>
  );
}
