import React, {useEffect, useState} from 'react';
import {useNavigation} from 'react-router';
import {CartForm, OptimisticInput, ShopPayButton} from '@shopify/hydrogen';
import {useLocalePath} from '~/hooks/useLocalePath';
import {useSanityThemeContent} from '~/hooks/useSanityThemeContent';
import {cn} from '~/lib/utils';
import {QuantitySelector} from '../QuantitySelector';
import CleanString from '../sanity/CleanString';
import {Button} from '../ui/Button';
import {useRootLoaderData} from '~/root';
import {ErrorMessageSection, CheckMetafieldConditions} from './AddToCartForm';

const fetchGraphQLData = async (productId) => {
  const query = JSON.stringify({
    query: `query getProductVariant($id: ID!) {
      product(id: $id) {
        title
        handle
        availableForSale
        futures:metafield(namespace: "custom", key: "special_designation") {
          key
          id
          value
        }
        variants(first: 1) {
          edges {
            node {
              id
              priceV2 {
                amount
              }
              image {
                originalSrc
              }
              selectedOptions {
                name
                value
              }
            }
          }
        }
      }
    }`,
    variables: {id: productId},
  });

  const response = await fetch('https://cbbc83-3.myshopify.com/api/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': 'f945b050c28655cc9b230fc30c0a6965',
    },
    body: query,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export function AddToCartList({productId}: {productId: string}) {
  const navigation = useNavigation();
  const {themeContent} = useSanityThemeContent();
  const [variant, setVariant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const cartPath = useLocalePath({path: '/cart'});
  const rootData = useRootLoaderData();
  const {cart} = rootData || {};
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showErrorMessage, SetShowErrorMessage] = useState<boolean>(false);
  const [product, setProduct] = useState(null);
  const [showWarningMessage, setShowWarningMessage] = useState<boolean>(false);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchGraphQLData(productId)
      .then((data) => {
        const firstVariant = data.data.product.variants.edges[0].node;
        setProduct(data.data.product);
        setVariant({
          id: firstVariant.id,
          priceV2: firstVariant.priceV2,
          image: firstVariant.image,
          product: {
            handle: data.data.product.handle,
            title: data.data.product.title,
          },
          selectedOptions: firstVariant.selectedOptions,
          availableForSale: data.data.product.availableForSale,
        });
        setLoading(false);
      })
      .catch((error: string) => {
        console.error('Fetching error:', error);
        setError(error);
        setLoading(false);
      });
  }, [productId]);

  useEffect(() => {
    product && CheckMetafieldConditions({cart, product, setErrorMessage});
  }, [cart, product]);

  if (loading) return <p>Loading...</p>;
  if (error) return null;
  if (!variant) return <p>Variant not found</p>;

  const isOutOfStock = !variant.availableForSale;

  return (
    <div>
      {showErrorMessage && errorMessage && (
        <ErrorMessageSection
          errorMessage={errorMessage}
          SetShowErrorMessage={SetShowErrorMessage}
        />
      )}
      {showWarningMessage && warningMessage && (
        <ErrorMessageSection
          errorMessage={warningMessage}
          SetShowErrorMessage={setShowWarningMessage}
        />
      )}
      <CartForm
        action={CartForm.ACTIONS.LinesAdd}
        inputs={{
          lines: [
            {
              merchandiseId: variant.id,
              quantity,
            },
          ],
        }}
        route={cartPath}
      >
        {(fetcher) => {
          const isLoading =
            fetcher.state !== 'idle' || navigation.state !== 'idle';
          let warning = fetcher?.data?.warnings?.[0]?.message;
          useEffect(() => {
            if (warning && fetcher.state === 'loading') {
              setShowWarningMessage(true);
              setWarningMessage(warning);
            }
          }, [warning, isLoading]);
          return (
            <div className="grid gap-3">
              <OptimisticInput
                data={{
                  action: 'add',
                  line: {
                    cost: {
                      amountPerQuantity: {
                        amount: variant.priceV2.amount,
                        currencyCode: 'USD',
                      },
                      totalAmount: {
                        amount: `${parseFloat(variant.priceV2.amount) * quantity}`,
                        currencyCode: 'USD',
                      },
                    },
                    id: variant.id,
                    merchandise: {
                      image: {
                        id: `gid://shopify/ProductImage/${variant.image?.originalSrc?.split('/').pop()}`,
                        altText: null,
                        width: 640,
                        height: 640,
                        url: variant?.image?.originalSrc,
                        thumbnail: `${variant.image?.originalSrc?.split('?')[0]}_30x.jpg`,
                      },
                      product: {
                        handle: variant.product.handle,
                        title: variant.product.title,
                      },
                      selectedOptions: variant.selectedOptions,
                    },
                    quantity,
                  },
                }}
                id="cart-line-item"
              />
              <Button
                className={cn([
                  isOutOfStock && 'opacity-50',
                  'data-[loading="true"]:disabled:opacity-100',
                  'w-[118px] text-[11px] font-normal uppercase',
                ])}
                data-loading={isLoading}
                disabled={isOutOfStock || isLoading}
                type={errorMessage ? 'button' : 'submit'}
                onClick={() => {
                  if (errorMessage) {
                    SetShowErrorMessage(true);
                  }
                }}
              >
                {isOutOfStock ? (
                  <CleanString value={themeContent?.product?.soldOut} />
                ) : (
                  <CleanString value={themeContent?.product?.addToCart} />
                )}
              </Button>
              {/*<QuantitySelector quantity={quantity} setQuantity={setQuantity} />*/}
            </div>
          );
        }}
      </CartForm>
    </div>
  );
}
