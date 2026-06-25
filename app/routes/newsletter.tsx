import invariant from 'tiny-invariant';
import { data as json, LoaderFunctionArgs, redirect } from 'react-router';

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
  const email = formData.get('email') as string;
  const listId = formData.get('list_id');
  const attributes: any = {
    email,
  };
  const profiles: any = {
    data: [
      {
        type: 'profile',
        attributes,
      },
    ],
  };
  const emailRegex = /^([a-zA-Z0-9^$%*\-'‘’^{}+?!_~/])+(\.([a-zA-Z0-9^$%*‘’\-?!+{}'^_~/])+)*@([a-zA-Z0-9\-]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-zA-Z0-9\-]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*\.(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]){2,})$/;
  if (!email) {
    return json({ error: 'Email is required.' });
  }else if(!emailRegex.test(email)){
    return json({ error: 'This is not a valid email address.' });
  }
  invariant(email, 'Email is required');
  try {
    const response = await fetch("https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs", {
      method: "POST",
      headers: {
        accept: 'application/vnd.api+json',
        'content-type': 'application/vnd.api+json',
        revision: '2024-10-15',
        Authorization: `Klaviyo-API-Key ${env.KLAVIYO_API_PRIVATE_KEY}`
      },
      body: JSON.stringify({
        data: {
          type: 'profile-subscription-bulk-create-job',
          attributes: {
            profiles,
          },
          relationships: {
            list: {
              data: {
                type: 'list',
                id: listId,
              },
            },
          },
        },
      }),
    });
    if (!response.ok) {
      return json({ error: 'Failed to submit to Klaviyo.' });
    } else {
      return json({ success: 'Successfully submitted to Klaviyo.' });
    }
  } catch (error) {
    console.error('Klaviyo API error:', error);
    if (error instanceof Error) {
      return returnError({ error });
    }
    return returnError({ error: { message: JSON.stringify(error) } });
  }
}

export function loader() {
  return redirect('/');
}

function returnError({ error }: { error: { message: string } }) {
  console.error(error.message);
  return json({ subscriber: null, error });
}
