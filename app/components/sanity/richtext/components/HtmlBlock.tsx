import type { TypeFromSelection } from 'groqd';

import type { CODE_BLOCK_FRAGMENT } from '~/qroq/blocks';
import React, { Fragment, useEffect, useState } from 'react';
import Prism from 'prismjs';

export type CodeBlockProps = TypeFromSelection<typeof CODE_BLOCK_FRAGMENT>;

export function HtmlBlock(props: CodeBlockProps) {
  const [parsedHTML, setParsedHTML] = useState<React.ReactNode>(null);
  
  useEffect(() => {
    // Dynamically import html-react-parser only on client side
    if (props.code) {
      import('html-react-parser').then((module) => {
        const parse = module.default;
        setParsedHTML(parse(props.code));
        Prism.highlightAll();
      });
    }
  }, [props?.code]);

  return props.code && (
    <Fragment>
      {parsedHTML}
    </Fragment>
  );
}
