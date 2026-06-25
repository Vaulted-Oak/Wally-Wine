import React, {useMemo} from 'react';
import {
  ExternalLinkAnnotation,
  ExternalLinkAnnotationProps,
} from '../sanity/richtext/components/ExternalLinkAnnotation';
import {
  InternalLinkAnnotation,
  InternalLinkAnnotationProps,
} from '../sanity/richtext/components/InternalLinkAnnotation';
import {ButtonBlockProps} from '../sanity/richtext/components/ButtonBlock';
import {
  ImageBlock,
  ImageBlockProps,
} from '../sanity/richtext/components/ImageBlock';
import {HtmlBlock} from '../sanity/richtext/components/HtmlBlock';
import {ArrayButtonBlock} from '../sanity/richtext/components/ArrayButtonBlock';
import {PortableText, PortableTextComponents} from '@portabletext/react';
import {SanityInternalLink} from '../sanity/link/SanityInternalLink';
import {Button} from '../ui/Button';
import {Link} from 'react-router';
import {PortableTextBlock} from '@portabletext/types';

interface ButtonBlockCustomProps extends ButtonBlockProps {
  setShowIframe?: (value: boolean) => void;
}

export function RestaurantBannerRichtext(props: {
  setShowIframe?: (value: boolean) => void;
  hideTitle?: boolean;
  dressCode?: boolean;
  value?: null | PortableTextBlock[];
  restaurant?: any;
}) {
  const components = useMemo(
    () => ({
      marks: {
        externalLink: (props: {
          children: React.ReactNode;
          value: ExternalLinkAnnotationProps;
        }) => {
          return (
            <ExternalLinkAnnotation {...props.value}>
              {props.children}
            </ExternalLinkAnnotation>
          );
        },
        internalLink: (props: {
          children: React.ReactNode;
          value: InternalLinkAnnotationProps;
        }) => {
          return (
            <InternalLinkAnnotation {...props.value}>
              {props.children}
            </InternalLinkAnnotation>
          );
        },
      },
      types: {
        button: (prop: {value: ButtonBlockProps}) => (
          <ButtonBlock {...prop.value} setShowIframe={props?.setShowIframe} />
        ),
        image: (props: {value: ImageBlockProps}) => (
          <ImageBlock {...props.value} />
        ),
        buttons: (prop: {value: ButtonBlockProps}) => (
          <ButtonBlock {...prop.value} setShowIframe={props?.setShowIframe} />
        ),
        code: (props: any) => {
          return <HtmlBlock {...props.value} />;
        },
        buttonBlock: (props: any) => {
          return <ArrayButtonBlock {...props.value} />;
        },
      },
    }),
    [],
  );

  return (
    <div className="location-details-text">
      <div className="location-desc">
        {props.value ? (
          <PortableText
            components={components as PortableTextComponents}
            value={props.value}
          />
        ) : null}
      </div>
    </div>
  );
}

export function ButtonBlock(props: ButtonBlockCustomProps) {
  const backgroundColorClass = `bg-[${props.background?.hex}]`;
  const textColorClass = `text-[${props.foreground?.hex}] border-[${props.foreground?.hex}]`;
  const foregroundColorClass = `text-[${props.foreground?.hex?.toLocaleUpperCase()}]`;
  return (
    <span className="location-buttons-arrey flex">
      <Button
        asChild
        className={`${props.background ? backgroundColorClass : ''} ${props.foreground ? textColorClass : ''} border-2 px-1`}
      >
        {props?.link ? (
          <SanityInternalLink
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
          </SanityInternalLink>
        ) : props?.label?.toLocaleLowerCase().includes('inquiry') ? (
          <Button
            onClick={() => {
              props?.setShowIframe && props?.setShowIframe(true),
                (document.body.style.overflow = 'hidden');
            }}
            className={`border border-primaryGreen bg-primaryGreen text-[13px] font-normal uppercase text-white notouch:hover:!bg-primary/90`}
          >
            {props.label}
          </Button>
        ) : (
          <Link
            className={`${props.foreground ? foregroundColorClass : ''}`}
            to={props?.externalLink || '#'}
            target={`${props?.openInNewTab ? '_blank' : '_self'}`}
          >
            {props.label}
          </Link>
        )}
      </Button>
    </span>
  );
}
