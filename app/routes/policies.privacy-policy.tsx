import { data as json } from '@shopify/remix-oxygen';
import { useLoaderData } from 'react-router';
import { PRIVACY_POLICY_QUERY } from '~/graphql/queries';

export async function loader({ context }: { context: any }) {
  const { storefront } = context;

  const { shop } = await storefront.query(PRIVACY_POLICY_QUERY);

  if (!shop?.privacyPolicy) {
    throw new Response('Privacy Policy not found', { status: 404 });
  }

  return json({ privacyPolicy: shop.privacyPolicy });
}

export default function PrivacyPolicyPage() {
  const { privacyPolicy } = useLoaderData<typeof loader>();

  return (
    <div className="container mt-[60px]">
      <h1 className="text-3xl mb-4">{privacyPolicy.title}</h1>
      <div
        className="prose text-primaryBlack max-w-full"
        dangerouslySetInnerHTML={{ __html: privacyPolicy.body }}
      />
    </div>
  );
}
