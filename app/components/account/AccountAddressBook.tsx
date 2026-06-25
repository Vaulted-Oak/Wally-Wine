import type {CustomerAddress} from '@shopify/hydrogen/customer-account-api-types';
import type {CustomerDetailsFragment} from 'customer-accountapi.generated';

import {Form, Link} from 'react-router';

import {useSanityThemeContent} from '~/hooks/useSanityThemeContent';

import {Badge} from '../ui/Badge';
import {Button} from '../ui/Button';

export function AccountAddressBook({
  addresses,
  customer,
}: {
  addresses: CustomerAddress[];
  customer: CustomerDetailsFragment;
}) {
  const {themeContent} = useSanityThemeContent();
  return (
    <div className="mt-10 grid w-full gap-4">
      <div className="flex items-center justify-between">
          <h3 className="text-[32px]">{themeContent?.account.addressBook}</h3>
          <Link preventScrollReset to="address/add">
              {themeContent?.account.addAddress}
          </Link>
      </div>
      <div>
        {!addresses?.length && <p>{themeContent?.account.noAddress}</p>}
        {Boolean(addresses?.length) && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {customer.defaultAddress && (
              <Address address={customer.defaultAddress} defaultAddress />
            )}
            {addresses
              .filter((address) => address.id !== customer.defaultAddress?.id)
              .map((address) => (
                <Address address={address} key={address.id} />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Address({
  address,
  defaultAddress,
}: {
  address: CustomerAddress;
  defaultAddress?: boolean;
}) {
  const {themeContent} = useSanityThemeContent();
  return (
    <div className="flex flex-col rounded border border-gray-200 p-6 lg:p-8">
      {defaultAddress && (
        <div className="mb-3">
          <Badge>{themeContent?.account.default}</Badge>
        </div>
      )}
      <ul className="flex-1 flex-row space-x-2">
        {(address.firstName || address.lastName) && (
          <li>
            {'' +
              (address.firstName && address.firstName + ' ') +
              address?.lastName}
          </li>
        )}
        {address.formatted &&
          address.formatted.map((line: string) => <li key={line}>{line}</li>)}
      </ul>

      <div className="mt-6 flex flex-row items-baseline font-medium">
        <Link
          className="text-left underline"
          prefetch="intent"
          preventScrollReset
          to={`/account/address/${encodeURIComponent(address.id)}`}
        >
          {themeContent?.account.edit}
        </Link>
        <Form action="address/delete" method="delete" preventScrollReset>
          <input name="addressId" type="hidden" value={address.id} />
          <button className="ml-6 text-left text-primary hover:underline">
            {themeContent?.account.remove}
          </button>
        </Form>
      </div>
    </div>
  );
}
