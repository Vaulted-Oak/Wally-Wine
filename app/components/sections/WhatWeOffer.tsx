import {TypeFromSelection} from 'groqd';
import {WHO_WE_ARE_SECTION_FRAGMENT} from '~/qroq/sections';
import type {SectionDefaultProps} from '~/lib/type';
import {useMemo} from 'react';
import type {ButtonBlockProps} from '../sanity/richtext/components/ButtonBlock';
import type {ExternalLinkAnnotationProps} from '../sanity/richtext/components/ExternalLinkAnnotation';
import type {ImageBlockProps} from '../sanity/richtext/components/ImageBlock';
import type {InternalLinkAnnotationProps} from '../sanity/richtext/components/InternalLinkAnnotation';
import {ButtonBlock} from '../sanity/richtext/components/ButtonBlock';
import {HtmlBlock} from '../sanity/richtext/components/HtmlBlock';
import {ExternalLinkAnnotation} from '../sanity/richtext/components/ExternalLinkAnnotation';
import {ImageBlock} from '../sanity/richtext/components/ImageBlock';
import {InternalLinkAnnotation} from '../sanity/richtext/components/InternalLinkAnnotation';
import {RichtextLayout} from '../sanity/richtext/RichTextLayout';
import {ArrayButtonBlock} from '../sanity/richtext/components/ArrayButtonBlock';
import {PortableText} from '@portabletext/react';
import type {PortableTextComponents} from '@portabletext/react';
import type {PortableTextBlock} from '@portabletext/types';

type WhoWeAreSectionProps = TypeFromSelection<
  typeof WHO_WE_ARE_SECTION_FRAGMENT
>;

export function WhatWeOffer(
  props: SectionDefaultProps & {data: WhoWeAreSectionProps},
) {
  const {data} = props;

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
        button: (props: {value: ButtonBlockProps}) => (
          <ButtonBlock {...props.value} />
        ),
        image: (props: {value: ImageBlockProps}) => (
          <ImageBlock {...props.value} />
        ),
        buttons: (props: {value: ButtonBlockProps}) => (
          <ButtonBlock {...props.value} />
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
    <div className="container">
        <h1 className="text-[24px] text-center mb-8">
            {data.title} </h1>
      <div className="flex gap-[30px] flex-wrap md:flex-nowrap catering-card">
        {data.richtextContents.map((content, index) => (
          <RichtextLayout key={index}>
            {content.content && (
              <PortableText
                components={components as PortableTextComponents}
                value={content.content as PortableTextBlock[]}
              />
            )}
          </RichtextLayout>
        ))}
      </div>
    </div>
  );
}
