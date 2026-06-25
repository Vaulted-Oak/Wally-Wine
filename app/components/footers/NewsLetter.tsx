import React, { useEffect, useRef, useState } from 'react';
import { useFetcher } from 'react-router';
import { useRootLoaderData } from '~/root';
import { useLocation } from 'react-router';

interface NewsletterResponse {
    success: boolean;
    error?: string;
}
export default function Newsletter({ newsletterText }: { newsletterText: string | null }) {
    const rootData = useRootLoaderData();
  const { env } = rootData || {};
    const { Form, ...fetcher } = useFetcher<NewsletterResponse>();
    const { data } = fetcher;
    const [subscribeSuccess, setSubscribeSuccess] = useState<boolean | null>(null);
    const subscribeError = data?.error;
    const location = useLocation();
    const $form = useRef<HTMLFormElement>(null)

    useEffect(() => {
        if (data?.success) {
            setSubscribeSuccess(data.success);
            $form.current?.reset();
        }
    }, [data]);
    useEffect(() => {
        setSubscribeSuccess(null);
    }, [location]);

    return (
        <div>
            <h3 className="text-lg text-primaryGreen mb-[20px]">NEWSLETTER</h3>
            <p className="mb-4 leading-[21px]">{newsletterText}</p>
            {subscribeSuccess ? (
                <p style={{ color: 'green' }}>
                    Thanks for subscribing! <br/>
                    Check your email for a confirmation message.
                </p>
            ) : null}
            <Form ref={$form} method="post" action="/newsletter" className="flex relative">
                <input
                    type="hidden"
                    id="list_id"
                    name="list_id"
                    value={env.KLAVIYO_LIST_ID}
                />
                <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter email"
                    required
                    onChange={() => setSubscribeSuccess(null)}
                    className="border-b border-primaryBlack outline-none focus:border-green-600 flex-1 px-2 py-1 h-[50px] placeholder:text-primaryBlack"
                />
                <button type="submit" className="text-green-600 hover:text-green-800 absolute right-0 top-[15px]">
                    <svg width="21" height="12" viewBox="0 0 21 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.5303 6.53033C20.8232 6.23744 20.8232 5.76256 20.5303 5.46967L15.7574 0.696699C15.4645 0.403806 14.9896 0.403806 14.6967 0.696699C14.4038 0.989593 14.4038 1.46447 14.6967 1.75736L18.9393 6L14.6967 10.2426C14.4038 10.5355 14.4038 11.0104 14.6967 11.3033C14.9896 11.5962 15.4645 11.5962 15.7574 11.3033L20.5303 6.53033ZM0 6.75H20V5.25H0V6.75Z" fill="#423F3F"/>
                    </svg>
                </button>
            </Form>
            {subscribeError && <p style={{ color: 'red' }}>{data?.error}</p>}
        </div>
    );
}
