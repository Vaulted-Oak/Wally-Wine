import {Link} from 'react-router';

import {useRootLoaderData} from '~/root';

import type {Socials} from './icons/IconSocial';

import {IconSocial, socials} from './icons/IconSocial';
import {IconButton} from './ui/Button';

export function SocialMediaButtons() {
  return (
    <>
      {socials.map((social) => (
        <SocialButton key={social} media={social} />
      ))}
    </>
  );
}

export function SocialButton({media}: {media: Socials}) {
  const rootData = useRootLoaderData();
  const {sanityRoot} = rootData || {};
  const data = sanityRoot?.data;
  const settings = data?.settings;
  const mediaUrl = settings?.[media];

  if (!mediaUrl) return null;

  return (
    <IconButton asChild>
      <Link rel="noopener noreferrer" target="_blank" to={mediaUrl}>
        <span className="sr-only">{media}</span>
        <IconSocial media={media} />
      </Link>
    </IconButton>
  );
}
