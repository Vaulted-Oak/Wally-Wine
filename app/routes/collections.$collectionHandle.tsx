import React, {useState, useEffect, Fragment, useMemo} from 'react';
import type {LoaderFunctionArgs, MetaFunction} from '@shopify/remix-oxygen';
import {Link, useLoaderData, useLocation, useNavigate} from 'react-router';
import type {CollectionDetailsQuery} from 'storefrontapi.generated';
import {AppLoadContext} from '@shopify/remix-oxygen';
import {data as json} from '@shopify/remix-oxygen';
import invariant from 'tiny-invariant';
import {SortFilter} from '~/components/collection/SortFilterLayout';
import {AddToCartList} from '~/components/product/AddToCartList';
import {COLLECTION_QUERY as CMS_COLLECTION_QUERY} from '~/qroq/queries';
import {DEFAULT_LOCALE} from 'countries';
import {COLLECTION_QUERY} from '~/graphql/queries';
import {useRootLoaderData} from '~/root';
import {DesktopSort} from '~/components/collection/Sort';
import Grid from '~/components/grid/grid';
import {seoPayload} from '~/lib/seo.server';
import {getSeoMetaFromMatches} from '~/lib/seo';
import {mergeMeta} from '~/lib/meta';
import {Analytics} from '@shopify/hydrogen';
import {ShopifyMoney} from '~/components/ShopifyMoney';
import {useKlevu} from '~/hooks/useKlevu';

export const meta: MetaFunction<typeof loader> = mergeMeta(({matches}) =>
  getSeoMetaFromMatches(matches),
);

const PAGE_SIZE = 12;

export const handle = {
  breadcrumbType: 'collection',
};

export async function loader({
  context,
  params,
  request,
}: {
  request: {url: string};
  params: {collectionHandle: string};
  context: AppLoadContext;
}) {
  const {collectionHandle} = params;
  const {locale, sanity, storefront} = context;
  const language = locale?.language.toLowerCase();
  invariant(collectionHandle, 'Missing collectionHandle param');

  const queryParams = {
    collectionHandle,
    defaultLanguage: DEFAULT_LOCALE.language.toLowerCase(),
    language,
  };

  const collectionData = Promise.all([
    sanity.query({
      groqdQuery: CMS_COLLECTION_QUERY,
      params: queryParams,
    }),
    storefront?.query(COLLECTION_QUERY, {
      variables: {
        country: storefront.i18n.country,
        handle: collectionHandle,
        language: storefront.i18n.language,
      },
    }),
  ]);

  const [cmsCollection, {collection}] = await collectionData;

  const seo = seoPayload.collection({
    collection: collection!,
    url: request.url,
  });

  if (!collection?.id || !cmsCollection) {
    throw new Response('collection', {status: 404});
  }

  return json({collectionHandle, collection, seo});
}

export default function Collection() {
  const rootData = useRootLoaderData();
  const {env} = rootData || {};
  const {collectionHandle, collection} = useLoaderData<typeof loader>();
  const [products, setProducts] = useState<any[]>([]);
  const [filters, setFilters] = useState([]);
  const [totalCount, setTotalCount] = useState([]);
  const [sorting, setSorting] = useState<any>('RELEVANCE');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [filterManager, setFilterManager] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const {isReady, error} = useKlevu();

  // Initialize FilterManager only on client side
  useEffect(() => {
    if (typeof window !== 'undefined' && isReady) {
      import('@klevu/core').then(({FilterManager}) => {
        setFilterManager(new FilterManager());
      });
    }
  }, [isReady]);

  useEffect(() => {
    if (isReady && filterManager) {
      fetchCollectionProducts(0, true);
    }
  }, [location.search, location.pathname, sorting, isReady, filterManager]);

  const fetchCollectionProducts = async (
    page: number,
    replace: boolean = false,
  ) => {
    if (!isReady || !filterManager) return;

    if (page === 0) setIsLoading(true);
    else setIsLoadingMore(true);

    try {
      const params = new URLSearchParams(location.search);
      const sortValue = params.get('sort') || 'RELEVANCE';

      const appliedFilterValues = Array.from(params.entries())
        .filter(([key]) => key.startsWith('filter.'))
        .map(([key, value]) => ({
          key: key.replace('filter.', ''),
          values: key.startsWith('filter.klevu_price')
            ? value.split(',').map(Number)
            : [value],
        }));
      setSorting(sortValue);
      filterManager.clear?.();
      appliedFilterValues.forEach((filter) => {
        filter.values.forEach((value) => {
          filterManager.selectOption(filter.key, value?.toString());
        });
      });
      const appliedFilters = filterManager.toApplyFilters();
      const klevuPayload = {
        context: {
          apiKeys: [env.KLEVU_KEY],
        },
        recordQueries: [
          {
            id: env.KLEVU_ID,
            typeOfRequest: 'CATNAV',
            settings: {
              query: {
                categoryPath: collection?.title,
                term: '*',
              },
              typeOfRecords: ['KLEVU_PRODUCT'],
              limit: PAGE_SIZE,
              ...(sortValue && {
                sort: sortValue,
              }),
              ...(page !== 0 && {offset: page * PAGE_SIZE}),
            },
            filters: {
              ...(appliedFilters.length > 0 && {
                applyFilters: {filters: filterManager.toApplyFilters()},
              }),
              filtersToReturn: {
                enabled: true,
                options: {
                  order: 'INDEX',
                  limit: 100,
                },
                rangeFilterSettings: [
                  {
                    key: 'klevu_price',
                    minMax: true,
                  },
                ],
              },
            },
          },
        ],
      };

      const response = await fetch(
        'https://uscs34v2.ksearchnet.com/cs/v2/search',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(klevuPayload),
        },
      );

      if (!response.ok) {
        throw new Error(`Klevu API Error: ${response.statusText}`);
      }

      const data: any = await response.json();
      const queryResult = data?.queryResults?.find(
        (query: {id: string}) => query.id === env.KLEVU_ID,
      );

      const newProducts = queryResult?.records || [];
      const totalProducts = queryResult?.meta?.totalResultsFound || 0;
      const filters = queryResult?.filters || [];
      const totalResults = queryResult?.meta?.totalResultsFound || 0;

      setProducts((prevProducts) =>
        replace ? newProducts : [...prevProducts, ...newProducts],
      );
      setTotalCount(totalProducts);
      setFilters(filters);
      setTotalResults(totalResults);
    } catch (error) {
      console.error('Error fetching collection products:', error);
      setProducts([]); // Set empty products to avoid rendering errors
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchCollectionProducts(nextPage);
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams(location.search);
    Array.from(params.keys()).forEach((key) => {
      if (key.startsWith('filter.')) {
        params.delete(key);
      }
    });
    navigate(`${location.pathname}?${params.toString()}`);
    filterManager.clear?.();
  };

  const formatButtonData = useMemo(
    () => (value: string) => {
      const [number, text] = value.split('|');
      return number?.replace('[', '');
    },
    [],
  );

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center text-red-500">
          <p>Failed to load collection functionality.</p>
          <p className="text-sm mt-2">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  if (!isReady || !filterManager) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-pulse">Loading collection...</div>
        </div>
      </div>
    );
  }

  return (
    <SortFilter
      appliedFilters={filterManager?.filters || []}
      filters={filters}
      onClearAllFilters={clearAllFilters}
      productsCount={products.length}
    >
      {isLoading ? (
        <Grid>
          <Grid.Item className="animate-pulse bg-gray-100 dark:bg-gray-100" />
        </Grid>
      ) : (
        <>
          <div>
            <h1 className="text-[32px] uppercase font-normal tracking-[2px] md:mb-[30px] mb-[20px]">
              {collection.title}
            </h1>
            <div className="mb-[20px] md:mb-0 leading-[21px]">
              {collection.description}
            </div>
            <div className="hidden lg:flex items-center justify-between mt-[40px]">
              <span>{totalCount} Products</span>
              <DesktopSort />
            </div>
          </div>
          {products?.length === 0 && <div>No Products Found</div>}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
            {products.map((product) => {
              const modifiedUrl = new URL(product.url).pathname;
              return (
                <div
                  key={product.id}
                  className="hover:shadow-cardShadow duration-500 md:p-[20px] p-[10px] relative group"
                >
                  <Link to={modifiedUrl} key={product.id}>
                    {/* Labels */}
                    <div className="absolute grid top-[20px] left-[20px] space-y-1 z-10">
                      {product.expertRated === '1' && (
                        <span className="bg-[#E6EDE8] text-[#00461C] text-sm px-2 py-1 rounded-[2px] text-center expertRated min-w-max">
                          Expert Rated
                        </span>
                      )}
                      {product?.futures?.toUpperCase() === 'FUTURES' && (
                        <span className="bg-[#00346B] text-white text-sm px-2 py-1 rounded-[2px] text-center futures min-w-max">
                          Futures
                        </span>
                      )}
                      {product?.topPick === '1' && (
                        <span className="bg-[#CC5C1B] text-white text-sm px-2 py-1 rounded-[2px] text-center topPick min-w-max">
                          Top Pick
                        </span>
                      )}
                      {product.salePrice &&
                        parseFloat(product.salePrice) <
                          parseFloat(product.price) && (
                          <div className="bg-primaryRed text-white text-sm px-2 text-center py-1 rounded-[2px] min-w-max">
                            On Sale
                          </div>
                        )}
                    </div>

                    {/* Product Image */}
                    <div className="relative">
                      <img
                        src={product.imageUrl || env.DEFAULT_PRODUCT_IMAGE}
                        alt={product.name || 'Product'}
                        decoding="sync"
                        draggable={false}
                        fetchpriority={'auto'}
                        loading={'lazy'}
                        className="max-h-[240px] w-full object-contain group-hover:scale-105 duration-500"
                      />
                      {(product.ws_rating ||
                        product.we_rating ||
                        product.wa_rating ||
                        product.vinuos) && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div className="flex justify-center gap-[10px] flex-wrap text-primaryGreen">
                            {product.wa_rating && (
                              <span className="border border-primaryGreen bg-white px-3 py-1 rounded-[4px] text-sm">
                                {product.wa_rating.includes('|')
                                  ? `WA | ${formatButtonData(product.wa_rating)}`
                                  : `WA | ${product.wa_rating}`}
                              </span>
                            )}
                            {product.we_rating && (
                              <span className="border border-primaryGreen bg-white px-3 py-1 rounded-[4px] text-sm">
                                {product.we_rating.includes('|')
                                  ? `WE | ${formatButtonData(product.we_rating)}`
                                  : `WE | ${product.we_rating}`}
                              </span>
                            )}
                            {product.ws_rating && (
                              <span className="border border-primaryGreen bg-white px-3 py-1 rounded-[4px] text-sm">
                                {product.ws_rating.includes('|')
                                  ? `WS | ${formatButtonData(product.ws_rating)}`
                                  : `WS | ${product.ws_rating}`}
                              </span>
                            )}
                            {product.vinuos && (
                              <span className="border border-primaryGreen bg-white px-3 py-1 rounded-[4px] text-sm">
                                {product.vinuos.includes('|')
                                  ? `V | ${formatButtonData(product.vinuos)}`
                                  : `V | ${product.vinuos}`}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Product Name */}
                    <h3 className="line-clamp-2 my-[20px] text-[16px] font-normal leading-[22px] min-h-[42px]">
                      {product.name || 'Unnamed Product'}
                    </h3>

                    {/* Price Section */}
                    <div className="flex items-center gap-2 text-base font-normal mb-[20px]">
                      {product.salePrice &&
                      parseFloat(product.salePrice) <
                        parseFloat(product.price) ? (
                        <>
                          <span className="line-through">
                            <ShopifyMoney
                              data={{
                                amount: product.price,
                                currencyCode: 'USD',
                              }}
                            />
                          </span>
                          <span className="text-primaryRed font-bold">
                            <ShopifyMoney
                              data={{
                                amount: product.salePrice,
                                currencyCode: 'USD',
                              }}
                            />
                          </span>
                        </>
                      ) : (
                        <span className="">
                          <ShopifyMoney
                            data={{amount: product.price, currencyCode: 'USD'}}
                          />
                        </span>
                      )}
                    </div>
                  </Link>
                  <AddToCartList
                    productId={`gid://shopify/Product/${product.itemGroupId}`}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex justify-center mt-4">
            {products.length < totalResults && (
              <button
                onClick={handleLoadMore}
                className="px-4 py-2 bg-white w-[312px] h-[47px] uppercase text-primaryGreen text-[13px] border-[2px] border-primary hover:bg-primaryGreen hover:text-white"
                disabled={isLoadingMore}
              >
                {isLoadingMore ? 'Loading...' : 'Load More'}
              </button>
            )}
          </div>
          <Analytics.CollectionView
            data={{
              collection: {
                id: collection.id,
                handle: collection.handle,
              },
            }}
          />
        </>
      )}
    </SortFilter>
  );
}
