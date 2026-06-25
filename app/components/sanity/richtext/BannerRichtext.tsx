import React, { useMemo } from 'react';
import { PortableText } from '@portabletext/react';
import type { PortableTextComponents } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';
import { ExternalLinkAnnotation, ExternalLinkAnnotationProps } from './components/ExternalLinkAnnotation';
import { InternalLinkAnnotation, InternalLinkAnnotationProps } from './components/InternalLinkAnnotation';
import { ButtonBlock, ButtonBlockProps } from './components/ButtonBlock';
import { ImageBlock, ImageBlockProps } from './components/ImageBlock';
import { HtmlBlock } from './components/HtmlBlock';
import { ArrayButtonBlock } from './components/ArrayButtonBlock';

export function BannerRichtext(props: { value?: null | PortableTextBlock[] }) {
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
        button: (props: { value: ButtonBlockProps }) => (
          <ButtonBlock {...props.value} />
        ),
        image: (props: { value: ImageBlockProps }) => (
          <ImageBlock {...props.value} />
        ),
        buttons: (props: { value: ButtonBlockProps }) => (
          <ButtonBlock {...props.value} />
        ),
        code: (props: any) => {
          return <HtmlBlock {...props.value} />
        },
        buttonBlock: (props: any) => {
          return <ArrayButtonBlock {...props.value} />
        }
      },
    }),
    [],
  );

  if (!props.value) return null;

  return (
    <div className="space-y-4 text-balance [&_a:not(last-child)]:mr-4 hero-banner-content">
      <PortableText
        components={components as PortableTextComponents}
        value={props.value}
      />
    </div>
  );
}

export default React.memo(BannerRichtext);