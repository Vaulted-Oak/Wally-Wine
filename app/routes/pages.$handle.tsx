import { useEffect } from 'react';
import { useLoaderData } from 'react-router';
import { PAGE_QUERY } from '~/graphql/queries';

export async function loader({ params, context }: { params: { handle: string }; context: any }) {
  const { handle } = params;
  const { storefront } = context;

  const { page } = await storefront.query(PAGE_QUERY, { variables: { handle } });

  if (!page) {
    throw new Response('Page not found', { status: 404 });
  }

  return { page };
}

export default function CMSPage() {
  const { page } = useLoaderData<typeof loader>();

  useEffect(() => {
    const loadScriptsAndShowForm = async () => {
      const optOutScript = document.createElement('script');
      optOutScript.src = 'https://cdn.shopify.com/shopifycloud/privacy-banner/data-sale-opt-out.js';
      optOutScript.defer = true;
      document.body.appendChild(optOutScript);

      const hCaptchaScript = document.createElement('script');
      hCaptchaScript.src = 'https://js.hcaptcha.com/1/api.js?onload=optOutOnLoad';
      hCaptchaScript.defer = true;
      document.body.appendChild(hCaptchaScript);

      optOutScript.onload = () => {
        console.log('Shopify opt-out script loaded');
        if (typeof window.optOutOnLoad === 'function') {
          console.log('Initializing Shopify opt-out form...');
          window.optOutOnLoad();
        }

        const notApplicableElement = document.getElementById('pc--opt-out-not-applicable');
        const formContainerElement = document.getElementById('pc--opt-out-form-container');

        if (notApplicableElement) {
          notApplicableElement.style.display = 'none';
        }

        if (formContainerElement) {
          formContainerElement.style.display = 'block';
        }
      };
    };

    loadScriptsAndShowForm();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{page.title}</h1>
      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: page.body }}
      />
    </div>
  );
}
