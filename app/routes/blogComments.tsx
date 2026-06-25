import invariant from 'tiny-invariant';
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {data as json, redirect} from '@shopify/remix-oxygen';

type Subscriber = {
  id: string;
  email: string;
  emailMarketingConsent: {
    consentUpdatedAt: string;
    marketingOptInLevel: string;
    marketingState: string;
  };
};

export async function action({ context, request }: LoaderFunctionArgs) {
  const { env } = context;
  const formData = await request.formData();
  const blogId = formData.get('blogId');
  const articleId = formData.get('articleId');
  const author = formData.get('author');
  const email = String(formData.get('email'));
  const body = formData.get('body');
  const emailRegex = /^([a-zA-Z0-9^$%*\-'‘’^{}+?!_~/])+(\.([a-zA-Z0-9^$%*‘’\-?!+{}'^_~/])+)*@([a-zA-Z0-9\-]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-zA-Z0-9\-]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*\.(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]){2,})$/;

  const errors: { email?: string; author?: string; body?: string } = {};
  if (!email) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(email)) {
    errors.email = "Invalid email address";
  }
  if (!author) {
    errors.author = "Name is required";
  }
  if (!body) {
    errors.body = "Commet is required";
  }
  if (Object.keys(errors).length > 0) {
    return json({ errors });
  }
  if (!blogId || !articleId || !author || !email || !body) {
    return json({ error: `blogId:${blogId}, articleId:${articleId}, author:${author}, email:${email}, body:${body} } Missing required fields` }, { status: 400 });
  }

  const apiUrl = `https://${env.ADMIN_API}/admin/api/2025-01/comments.json`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': `${env.ADMIN_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        comment: {
          author: String(author),
          email: String(email),
          body: String(body),
          article_id: Number(articleId),
          blog_id: Number(blogId),
          publish: true
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
    return json({ error: `Internal Server Error ${JSON.stringify(env)} ${apiUrl}, ${JSON.stringify(err)}` }, { status: 500 });
  }
}

function returnError({ error }: { error: { message: string } }) {
  console.error(error.message);
  return json({ subscriber: null, error });
}
