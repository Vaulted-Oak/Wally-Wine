import React, { useState, useEffect } from "react";
import {useKlevu} from '~/hooks/useKlevu';
import { Link, useLocation, useNavigate } from "react-router";
import { SortFilter } from "../collection/SortFilterLayout";
import { AddToCartList } from "../product/AddToCartList";

import { useRootLoaderData } from "~/root";
import { DesktopSort } from "~/components/collection/Sort";
import Grid from "../grid/grid";
import { Analytics } from "@shopify/hydrogen";
import { ShopifyMoney } from "../ShopifyMoney";

const PAGE_SIZE = 12;

export default function SearchResultPage({ query }: { query: string }) {
  const rootData = useRootLoaderData();
  const { env } = rootData || {};
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [filters, setFilters] = useState([]);
  const params = new URLSearchParams(location.search);
  const [sorting, setSorting] = useState<any>(
    params.get('sort') || 'RELEVANCE',
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [filterManager, setFilterManager] = useState<any>(null);
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
      fetchSearchResults(0, true);
    }
  }, [location.search, location.pathname, sorting, isReady, filterManager]);

  const fetchSearchResults = async (page: number, replace: boolean = false) => {
    if (!isReady || !filterManager) return;

    try {
      if (page === 0) setIsLoading(true);
      else setIsLoadingMore(true);

      // Dynamic import to avoid SSR
      const {
        KlevuFetch,
        search,
        listFilters,
        applyFilterWithManager,
        sendSearchEvent,
        KlevuSearchSorting,
      } = await import('@klevu/core');

      const params = new URLSearchParams(location.search);
      const sortValue = params.get('sort') || KlevuSearchSorting.Relevance;
      const appliedFilterValues = Array.from(params.entries())
        .filter(([key]) => key.startsWith('filter.'))
        .map(([key, value]) => ({
          key: key.replace('filter.', ''),
          values: key.startsWith('filter.klevu_price')
            ? value.split(',').map(Number)
            : [value],
        }));

      filterManager.clear?.();
      appliedFilterValues.forEach((filter: any) => {
        filter.values.forEach((value: any) => {
          filterManager.selectOption(filter.key, value?.toString());
        });
      });
      setSorting(sortValue);

      const response = await KlevuFetch(
        search(
          query,
          {
            id: 'searchProducts',
            limit: PAGE_SIZE,
            ...(sortValue && {
              sort: sortValue,
            }),
            ...(page !== 0 && {offset: page * PAGE_SIZE}),
          },
          listFilters({
            limit: 100,
            rangeFilterSettings: [
              {
                key: 'klevu_price',
                minMax: true,
                rangeInterval: 1000,
              },
            ],
          }),
          applyFilterWithManager(filterManager),
          sendSearchEvent(),
        ),
      );

      const result = response.apiResponse?.queryResults?.[0];
      const newProducts = result?.records || [];
      const filters = result?.filters || [];
      const uniqueProducts = newProducts.filter(
        (newProduct: any) =>
          !products.some(
            (existingProduct) => existingProduct.id === newProduct.id,
          ),
      );
      setProducts((prevProducts) =>
        replace ? newProducts : [...prevProducts, ...uniqueProducts],
      );
      setFilters(filters);
      setTotalResults(result?.meta?.totalResultsFound || 0);
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchSearchResults(nextPage);
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
    //fetchSearchResults();
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center text-red-500">
          <p>Failed to load search functionality.</p>
          <p className="text-sm mt-2">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  if (!isReady || !filterManager) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-pulse">Loading search results...</div>
        </div>
      </div>
    );
  }

  return (
    <SortFilter
      appliedFilters={filterManager?.filters || []}
      filters={filters || []}
      onClearAllFilters={clearAllFilters}
      productsCount={products.length}
    >
      {isLoading ? (
        <Grid>
          <Grid.Item className="animate-pulse bg-gray-100 dark:bg-gray-100" />
        </Grid>
      ) : (
        <>
          <div className="hidden lg:flex items-center justify-between mt-[40px]">
            <span>{totalResults} Products</span>
            <DesktopSort type={'search'}/>
          </div>
          {products?.length === 0 && (
            <div>
              No Products Found
            </div>)
          }
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
            {products.map((product) => {
              const modifiedUrl = new URL(product.url).pathname;
              return (
                <div key={product.id} className="hover:shadow-cardShadow duration-500 md:p-[20px] p-[10px] relative group">
                  <Link to={modifiedUrl} key={product.id}>
                    {/* Labels */}
                    <div className="absolute grid top-[20px] left-[20px] space-y-1 z-10">
                      {product.expertRated === "1" && (
                        <span className="bg-[#E6EDE8] text-[#00461C] text-sm px-2 py-1 rounded-[2px] text-center expertRated min-w-max">
                          Expert Rated
                        </span>
                      )}
                      {product?.futures?.toUpperCase() === "FUTURES" && (
                        <span className="bg-[#00346B] text-white text-sm px-2 py-1 rounded-[2px] text-center futures min-w-max">
                          Futures
                        </span>
                      )}
                      {product?.topPick === "1" && (
                        <span className="bg-[#CC5C1B] text-white text-sm px-2 py-1 rounded-[2px] text-center topPick min-w-max">
                          Top Pick
                        </span>
                      )}
                      {product.salePrice &&
                        parseFloat(product.salePrice) < parseFloat(product.price) && (
                          <div className="bg-primaryRed text-white text-sm px-2 text-center py-1 rounded-[2px] min-w-max">
                            On Sale
                          </div>
                        )}
                    </div>

                    {/* Product Image */}
                    <div className="relative">
                      <img
                        src={product.imageUrl || env.DEFAULT_PRODUCT_IMAGE}
                        alt={product.name || "Product"}
                        draggable={false}
                        fetchpriority={'auto'}
                        loading={'lazy'}
                        className="max-h-[240px] w-full object-contain group-hover:scale-105 duration-500"
                      />

                      {/* Ratings on hover */}
                      {(product.ws_rating ||
                        product.we_rating ||
                        product.wa_rating ||
                        product.vinuos) && (
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <div className="flex justify-center gap-[10px] flex-wrap text-primaryGreen">
                              {product.wa_rating && (
                                <span className="border border-primaryGreen bg-white px-3 py-1 rounded-[4px] text-sm">
                                  WA | {product.wa_rating.split("|")[0]?.trim()}
                                </span>
                              )}
                              {product.we_rating && (
                                <span className="border border-primaryGreen bg-white px-3 py-1 rounded-[4px] text-sm">
                                  WE | {product.we_rating.split("|")[0]?.trim()}
                                </span>
                              )}
                              {product.ws_rating && (
                                <span className="border border-primaryGreen bg-white px-3 py-1 rounded-[4px] text-sm">
                                  WS | {product.ws_rating.split("|")[0]?.trim()}
                                </span>
                              )}
                              {product.vinuos && (
                                <span className="border border-primaryGreen bg-white px-3 py-1 rounded-[4px] text-sm">
                                  V | {product.vinuos.split("|")[0]?.trim()}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                    </div>

                    {/* Product Name */}
                    <h3 className="line-clamp-2 my-[20px] text-[16px] font-normal leading-[22px] min-h-[42px]">
                      {product.name || "Unnamed Product"}
                    </h3>

                    {/* Price Section */}
                    <div className="flex items-center gap-2 text-base font-normal mb-[20px]">
                      {product.salePrice &&
                        parseFloat(product.salePrice) < parseFloat(product.price) ? (
                        <>
                          <span className="line-through">
                            <ShopifyMoney data={{amount:product.price,currencyCode:'USD'}} />
                          </span>
                          <span className="text-primaryRed font-bold">
                            <ShopifyMoney data={{amount:product.salePrice,currencyCode:'USD'}} />
                          </span>
                        </>
                      ) : (
                        <span><ShopifyMoney data={{amount:product.price,currencyCode:'USD'}} /></span>
                      )}
                    </div>
                  </Link>
                  <AddToCartList
                    productId={`gid://shopify/Product/${product.itemGroupId}`}
                  />
                </div>
              )
            })}
          </div>
          <div className="flex justify-center mt-4">
            {products.length < totalResults && (
              <button
                onClick={handleLoadMore}
                className="px-4 py-2 bg-white w-[312px] h-[47px] uppercase text-primaryGreen text-[13px] border-[2px] border-primary hover:bg-primaryGreen hover:text-white"
                disabled={isLoadingMore}
              >
                {isLoadingMore ? "Loading..." : "Load More"}
              </button>
            )}
          </div>
          <Analytics.SearchView
            data={{
              searchTerm: query,
              searchResults: products
            }}
          />
        </>
      )}
    </SortFilter>
  );
}
