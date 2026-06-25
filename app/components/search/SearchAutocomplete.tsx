import React, {FC, useState, useEffect} from 'react';
import {Link} from 'react-router';
import {ShopifyMoney} from '../ShopifyMoney';
import {useRootLoaderData} from '~/root';
import {useKlevu} from '~/hooks/useKlevu';

type autoCompleteType = {
  searchTerm: string;
  toggleSearch: () => void;
  setSearchTerm: (value: string) => void;
};

const SearchAutocomplete: FC<autoCompleteType> = ({
  searchTerm,
  toggleSearch,
  setSearchTerm,
}): JSX.Element | null => {
  const [products, setProducts] = useState<any>([]);
  const rootData = useRootLoaderData();
  const {env} = rootData || {};
  const [trending, setTrending] = useState<any>([]);
  const [suggestionsList, setSuggestionsList] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const {isReady, error} = useKlevu();

  const fetchSearchData = async (term: string) => {
    if (!term || !isReady) {
      setProducts([]);
      setSuggestionsList([]);
      return;
    }

    try {
      setIsLoading(true);
      // Dynamic import to avoid SSR issues
      const {KlevuFetch, search, suggestions} = await import('@klevu/core');

      const result = await KlevuFetch(
        search(term, {limit: 5}),
        suggestions(term),
      );
      setProducts(result.queriesById('search')?.records || []);
      setSuggestionsList(
        result
          .suggestionsById('suggestions')
          ?.suggestions.map((s) => s.suggest) || [],
      );
    } catch (error) {
      console.error('Error fetching search data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTrendingProducts = async () => {
    if (!isReady) return;

    try {
      // Dynamic import to avoid SSR issues
      const {KlevuFetch, trendingProducts} = await import('@klevu/core');

      const result = await KlevuFetch(trendingProducts({limit: 5}));
      setTrending(result.queriesById('trendingProducts')?.records || []);
    } catch (error) {
      console.error('Error fetching trending products:', error);
    }
  };

  useEffect(() => {
    if (!isReady) return;

    if (searchTerm && searchTerm.length > 2) {
      fetchSearchData(searchTerm);
    } else {
      fetchTrendingProducts();
    }
  }, [searchTerm, isReady]);

  if (error) {
    return (
      <div className="my-4 text-red-500">
        Failed to load search functionality.
      </div>
    );
  }

  if (!isReady) {
    return <div className="my-4">Initializing search...</div>;
  }

  if (isLoading) {
    return <div className="my-4">Loading...</div>;
  }

  if (searchTerm && searchTerm.length > 2 && products.length > 0) {
    return (
      <ul className="my-[30px]">
        {products.map((product: any) => {
          const modifiedUrl = new URL(product.url).pathname;
          return (
            <li key={product.id} className="mb-2 flex items-center space-x-4">
              <Link
                to={modifiedUrl}
                className="flex items-center space-x-4"
                onClick={() => {
                  toggleSearch();
                  setSearchTerm && setSearchTerm('');
                }}
              >
                {' '}
                <span className="w-16 flex justify-center">
                  <img
                    src={product.imageUrl || env.DEFAULT_PRODUCT_IMAGE}
                    alt={product.name}
                    className="h-16 rounded object-cotain"
                  />
                </span>
                <span>{product.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    );
  }

  if (trending.length > 0) {
    return (
      <div className="my-[30px]">
        <h6 className="mb-[30px] text-[24px]">Trending Products</h6>
        <ul className="flex flex-wrap justify-between md:flex-nowrap">
          {trending.map((product: any) => {
            const modifiedUrl = new URL(product.url).pathname;
            return (
              <li
                key={product.id}
                className="flex-[0_0_50%] p-[20px] hover:shadow-cardShadow md:flex-[0_0_20%]"
              >
                <Link to={modifiedUrl} className="" onClick={toggleSearch}>
                  <img
                    src={product.imageUrl || env.DEFAULT_PRODUCT_IMAGE}
                    alt={product.name}
                    className="mx-auto h-[150px] w-[150px]"
                  />
                  <span className="mt-[10px] block">{product.name}</span>
                  <div className="flex items-center gap-2 pt-3 text-base font-normal">
                    {product.salePrice &&
                    parseFloat(product.salePrice) <
                      parseFloat(product.price) ? (
                      <>
                        <span className="line-through">
                          <ShopifyMoney
                            data={{amount: product.price, currencyCode: 'USD'}}
                          />
                        </span>
                        <span className="font-bold text-primaryRed">
                          <ShopifyMoney
                            data={{
                              amount: product.salePrice,
                              currencyCode: 'USD',
                            }}
                          />
                        </span>
                      </>
                    ) : (
                      <span>
                        <ShopifyMoney
                          data={{amount: product.price, currencyCode: 'USD'}}
                        />
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  return <div className="my-4">No results found.</div>;
};

export default SearchAutocomplete;
