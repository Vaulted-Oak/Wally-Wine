import type { LoaderFunctionArgs, MetaFunction } from '@shopify/remix-oxygen';

import { Await, useLoaderData } from 'react-router';
import { mergeMeta } from '~/lib/meta';
import { getSeoMetaFromMatches } from '~/lib/seo';
import { seoPayload } from '~/lib/seo.server';
import { I18nLocale } from '~/lib/type';
import { resolveShopifyPromises } from '~/lib/resolveShopifyPromises';
import { DEFAULT_LOCALE } from 'countries';
import { HOMEPAGE_QUERY } from '~/qroq/queries';
import { CmsSection } from '~/components/CmsSection';
import { Fragment } from 'react/jsx-runtime';
import { Suspense, useEffect, useState } from 'react';
import Grid from '~/components/grid/grid';
import { CacheShort } from '@shopify/hydrogen';
import {data as defer} from '@shopify/remix-oxygen';

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
        groqdQuery: HOMEPAGE_QUERY,
        params: queryParams,
        cache: CacheShort()
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
    return defer({
        page,
        seo,
        collectionListPromise,
        featuredCollectionPromise,
        featuredProductPromise,
    });
}

export default function Homepage() {
    const [isLoading, setIsLoading] = useState(true);
    const {
        page: { data },
    } = useLoaderData<typeof loader>();
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
    };
    return (
        <Suspense fallback={
            <Grid>
                <Grid.Item className="animate-pulse bg-gray-100 dark:bg-gray-100" />
            </Grid>
        }>
            <Await resolve={data}>
                {(data) => data?.sections && data.sections.length > 0
                    ? data.sections.map((section: any, index: number) => (
                        <Fragment key={section._key}>
                            <CmsSection data={section} index={index} key={section._key} />
                        </Fragment>
                    ))
                    : null
                }
            </Await>
        </Suspense>
    )
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