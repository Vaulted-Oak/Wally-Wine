import type {LinkProps} from 'react-router';
import type {TypeFromSelection} from 'groqd';

import {Link} from 'react-router';
import {stegaClean} from '@sanity/client/stega';

import type {INTERNAL_LINK_FRAGMENT} from '~/qroq/links';

import {cn} from '~/lib/utils';
import {useRootLoaderData} from '~/root';

type SanityInternalLinkProps = TypeFromSelection<typeof INTERNAL_LINK_FRAGMENT>;

export function SanityInternalLink(props: {
  children?: React.ReactNode;
  className?: string;
  data?: SanityInternalLinkProps;
  backgroundColorClass?:string;
  textColorClass?:string
  onClick?: () => void;
}) {
  const rootData = useRootLoaderData();
  const {locale} = rootData || {};
  const {children, className,textColorClass,backgroundColorClass, data} = props;

  if (!data) return null;

  const {link, name} = data;

  const documentType = link?.documentType;
  const slug = link?.slug?.current;
  const anchor = data.anchor ? `#${data.anchor}` : '';

  const path: () => string = () => {
    switch (documentType) {
      case 'blogPost':
        return `${locale.pathPrefix}/blog/${slug}`;
      case 'collection':
        return `${locale.pathPrefix}/collections/${slug}`;
      case 'home':
        return locale.pathPrefix || '/';
      case 'page':
        return `${locale.pathPrefix}/${slug}`;
      case 'product':
        return `${locale.pathPrefix}/products/${slug}`;
      default:
        return '#';
    }
  };

  // Remove encode stega data from url
  const url = stegaClean(`${path()}${anchor}`);
  // Todo: add Navlink support
  return (
    <Link
    style={{
      background:backgroundColorClass,
      color:textColorClass
    }}
      className={cn([
        'focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className,
      ])}
      onClick={props.onClick}
      prefetch="intent"
      to={url}
    >
      {children ? children : name}
    </Link>
  );
}
