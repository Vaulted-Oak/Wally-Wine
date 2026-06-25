import { data as json } from '@shopify/remix-oxygen';

export async function action({ request, context }: { request: Request; context: any }) {
  const formData = await request.formData();

  const blogHandle = formData.get('blogHandle');
  const articleHandle = formData.get('articleHandle');
  const author = formData.get('author');
  const email = formData.get('email');
  const body = formData.get('body');

  if (!blogHandle || !articleHandle || !author || !email || !body) {
    return json({ error: 'Missing required fields' }, { status: 400 });
  }

  const apiUrl = `https://${context.storefront.shopDomain}/admin/api/2023-01/blogs/${blogHandle}/articles/${articleHandle}/comments.json`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': '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',
      },
      body: JSON.stringify({
        comment: {
          author: String(author),
          email: String(email),
          body: String(body),
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Shopify API Error:', error);
      return json({ error }, { status: response.status });
    }

    return json({ success: true });
  } catch (err) {
    console.error('Server Error:', err);
    return json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
