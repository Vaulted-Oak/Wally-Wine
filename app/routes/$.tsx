import type { LoaderFunctionArgs, MetaFunction } from '@shopify/remix-oxygen';

import { useLoaderData, useNavigate } from 'react-router';
import { DEFAULT_LOCALE } from 'countries';

import type { I18nLocale } from '~/lib/type';

import { CmsSection } from '~/components/CmsSection';
import { mergeMeta } from '~/lib/meta';
import { resolveShopifyPromises } from '~/lib/resolveShopifyPromises';
import { getSeoMetaFromMatches } from '~/lib/seo';
import { seoPayload } from '~/lib/seo.server';
import { PAGE_QUERY } from '~/qroq/queries';
import { Fragment, useCallback, useEffect, useState } from 'react';
import Grid from '~/components/grid/grid';

export const meta: MetaFunction<typeof loader> = mergeMeta(({ matches }) =>
  getSeoMetaFromMatches(matches),
);

export async function loader({ context, params, request }: LoaderFunctionArgs) {
  const { env, locale, sanity, storefront } = context;
  const pathname = new URL(request.url).pathname;
  const handle = getPageHandle({ locale, params, pathname });
  const language = locale?.language.toLowerCase();

  const queryParams = {
    defaultLanguage: DEFAULT_LOCALE.language.toLowerCase(),
    handle,
    language,
  };

  const page = await sanity.query({
    groqdQuery: PAGE_QUERY,
    params: queryParams,
    queryOptions: {
      perspective: context.sanityPreviewMode ? 'previewDrafts' : 'published',
    },
  });

  const {
    collectionListPromise,
    featuredCollectionPromise,
    featuredProductPromise,
  } = resolveShopifyPromises({
    document: page,
    request,
    storefront,
  });

  if (!page.data) {
    throw new Response(null, {
      status: 404,
      statusText: 'Not Found',
    });
  }

  const seo = seoPayload.home({
    page: page.data,
    sanity: {
      dataset: env.SANITY_STUDIO_DATASET,
      projectId: env.SANITY_STUDIO_PROJECT_ID,
    },
  });

  return {
    collectionListPromise,
    featuredCollectionPromise,
    featuredProductPromise,
    page,
    seo,
  };
}

export default function PageRoute() {
  const {
    page: { data },
  } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const handleViewHomepage = useCallback(() => {
    navigate('/homepage');
  }, []);
  const handleViewLocations = useCallback(()=>{
    navigate('/locations')
  },[]);
  useEffect(() => {
    if (data) {
      setIsLoading(false); // Data is loaded, stop showing spinner
    }
  }, [data]);
  if (isLoading) {
    return (
      <Grid>
        <Grid.Item className="animate-pulse bg-gray-100 dark:bg-gray-100" />
      </Grid>
    )
  }
  return data?.sections && data.sections.length > 0
    ? data.sections.map((section: any, index: number) => (
      <Fragment key={section._key}>
        <CmsSection data={section} index={index} key={section._key} />
        {section._type === "videoSection" ? (
          <div className='absolute bottom-0 left-0 right-0 mx-auto max-w-[570px]'>
            {/*<button className="w-[277px] h-[89px] text-[22px] bg-[#00461C] text-[#FFFFFF] uppercase p-3 mr-2" onClick={handleViewHomepage}>Shop Wally's</button>
            <button className="w-[277px] h-[89px] text-[22px] bg-[#FFFFFF] text-[#00461C] uppercase p-3 ml-2" onClick={handleViewLocations}>Dine with us</button>*/}
          </div>
        ) : null}
      </Fragment>
    ))
    : null;
}

function getPageHandle(args: {
  locale: I18nLocale;
  params: LoaderFunctionArgs['params'];
  pathname: string;
}) {
  const { locale, params, pathname } = args;
  const pathWithoutLocale = pathname.replace(`${locale?.pathPrefix}`, '');
  const pathWithoutSlash = pathWithoutLocale.replace(/^\/+/g, '');
  const isTranslatedHomePage =
    params.locale && locale.pathPrefix && !params['*'];
  // Return home as handle for a translated homepage ex: /fr/
  if (isTranslatedHomePage) return 'home';

  const handle =
    locale?.pathPrefix && params['*']
      ? params['*'] // Handle for a page with locale having pathPrefix ex: /fr/about-us/
      : params.locale && params['*']
        ? `${params.locale}/${params['*']}` // Handle for default locale page with multiple slugs ex: /about-us/another-slug
        : params.locale || pathWithoutSlash; // Handle for default locale page  ex: /about-us/

  return handle;
}
