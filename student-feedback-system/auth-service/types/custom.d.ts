import React from 'react';

declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default content;
}

declare namespace JSX {
  interface IntrinsicElements {
    'svg': React.DetailedHTMLProps<React.SVGAttributes<SVGElement>, SVGElement>;
    'path': React.DetailedHTMLProps<React.SVGPathElement, SVGPathElement>;
  }
}
