import {useAnalytics} from '@shopify/hydrogen';
import {useEffect} from 'react';

import {useIsDev} from '~/hooks/useIsDev';

export function CustomAnalytics() {
  const {subscribe, register} = useAnalytics();
  const isDev = useIsDev();
  const {ready} = register('Google Tag Manager');

  useEffect(() => {
    if (isDev) return;

    const pushToDataLayer = (eventName: string, eventData: any) => {
      window?.dataLayer?.push({event: eventName, ...eventData});
    };

    // Page Viewed Event
    subscribe('page_viewed', (data) => {
      pushToDataLayer('page_viewed', {
        page: {
          title: document?.title,
          url: data?.url,
        },
      });
    });
    // Product Viewed Event
    subscribe('product_viewed', (data) => {
      const price = parseFloat(data?.products?.[0]?.price);

      pushToDataLayer('view_item', {
        ecommerce: {
          currency: 'USD',
          price: price,
          items: {
            item_id: data?.products?.[0].id,
            item_name: data?.products?.[0]?.title,
            price: price,
            currency: 'USD',
          },
        },
      });
    });

    // Collection Viewed Event
    subscribe('collection_viewed', (data) => {
      pushToDataLayer('collection_viewed', {
        collection: {
          id: data?.collection?.id,
          title: data?.collection?.handle,
        },
      });
    });

    // Cart Viewed Event
    subscribe('cart_viewed', (data) => {
      pushToDataLayer('cart_viewed', {
        cart: {
          total_price: data?.cart?.cost?.totalAmount?.amount,
          total_items: data?.cart?.lines?.nodes?.length,
          items: data?.cart?.lines?.nodes?.map((item) => ({
            id: item?.merchandise?.product?.id,
            name: item?.merchandise?.product?.title,
            price: item?.cost?.totalAmount?.amount,
            quantity: item?.quantity,
          })),
        },
      });
    });

    // Cart Updated Event
    subscribe('cart_updated', (data) => {
      pushToDataLayer('cart_updated', {
        cart: {
          total_price: data?.cart?.cost?.totalAmount?.amount,
          total_items: data?.cart?.lines?.nodes?.length,
          items: data?.cart?.lines?.nodes?.map((item) => ({
            id: item?.merchandise?.product?.id,
            name: item?.merchandise?.product?.title,
            price: item?.cost?.totalAmount?.amount,
            quantity: item?.quantity,
          })),
        },
      });
    });

    // Product Added to Cart Event
    subscribe('product_added_to_cart', (data) => {
      pushToDataLayer('add_to_cart', {
        ecommerce: {
          currency: 'USD',
          value: parseFloat(data?.currentLine?.cost?.totalAmount?.amount!),
          items: {
            item_id: data?.currentLine?.merchandise?.product.id,
            item_name: data?.currentLine?.merchandise?.product?.title,
            price: parseFloat(data?.currentLine?.merchandise?.price?.amount!),
            quantity: data?.currentLine?.quantity,
          },
        },
      });
    });

    // Product Removed from Cart Event
    subscribe('product_removed_from_cart', (data) => {
      pushToDataLayer('remove_from_cart', {
        ecommerce: {
          currency: 'USD',
          value: parseFloat(data?.prevLine?.cost?.totalAmount?.amount!),
          items: {
            item_id: data?.prevLine?.merchandise?.product.id,
            item_name: data?.prevLine?.merchandise?.product?.title,
            price: parseFloat(data?.prevLine?.merchandise?.price?.amount!),
            quantity: data?.prevLine?.quantity,
          },
        },
      });
    });

    ready();
  }, [subscribe, isDev]);

  return null;
}
