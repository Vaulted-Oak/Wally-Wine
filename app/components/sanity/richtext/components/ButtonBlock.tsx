import type { TypeFromSelection } from 'groqd';

import type { BUTTON_BLOCK_FRAGMENT } from '~/qroq/blocks';

import { Button } from '~/components/ui/Button';

import { SanityInternalLink } from '../../link/SanityInternalLink';
import { Link } from 'react-router';

export type ButtonBlockProps = TypeFromSelection<typeof BUTTON_BLOCK_FRAGMENT>;

export function ButtonBlock(props: ButtonBlockProps) {
  const backgroundColorClass = `bg-[${props.background?.hex}]`;
  const textColorClass = `text-[${props.foreground?.hex}]`;
  const foregroundColorClass = `text-[${props.foreground?.hex?.toLocaleUpperCase()}]`;
  return (
    <Button asChild
    >
      {props?.link ? <SanityInternalLink
        data={{
          _key: props._key,
          _type: 'internalLink',
          anchor: props.anchor,
          link: props.link,
          name: null,
        }}
        textColorClass={props.foreground?.hex}
        backgroundColorClass={props.background?.hex}
      >
        {props.label}
      </SanityInternalLink> :
        props?.externalLink?.link ?
          <Link className={`${props.foreground ? foregroundColorClass : ''}`} to={props?.externalLink?.link || "#"} target={`${props?.externalLink?.openInNewTab ? '_blank' : '_self'}`}>
            {props.label}
          </Link> :
          <Link className={`${props.foreground ? foregroundColorClass : ''}`} to={props?.externalLink || "#"} target={`${props?.openInNewTab ? '_blank' : '_self'}`}>
            {props.label}
          </Link>
      }
    </Button>
  );
}
