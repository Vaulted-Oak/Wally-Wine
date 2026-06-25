import {TypeFromSelection} from 'groqd';
import {COLUMN_SECTION_FRAGMENT} from '~/qroq/sections';
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
import {useDevice} from '~/hooks/useDevice';

type ColumnSectionProps = TypeFromSelection<typeof COLUMN_SECTION_FRAGMENT>;

export function ColumnSection(
  props: SectionDefaultProps & {data: ColumnSectionProps},
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
  const device = useDevice();

  const gridTemplateColumns = `repeat(${device === "desktop" ? data.noOfColumns : 1}, 1fr)`;

  return (
    <div className="container">
      <h1 className="mb-8 text-center text-[24px]">{data.title}</h1>
      <div
        className="catering-card grid gap-[30px]"
        style={{gridTemplateColumns}}
      >
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
