import React, {useEffect, useState} from 'react';
import Prism from 'prismjs';

export function InquiryIFrame(props: {
  code: string;
  setShowIframe: (value: boolean) => void;
}) {
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

  useEffect(() => {
    // Disable scrolling when the popup opens
    document.body.style.overflow = 'hidden';

    // Re-enable scrolling when the popup is closed
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div>
      <div className="fixed left-0 top-0 z-[1055] h-full w-full transform-none !overflow-hidden overflow-y-auto overflow-x-hidden outline-none">
        <div className="pointer-events-none pointer-events-auto relative h-[90vh] w-auto translate-y-0 overflow-auto opacity-100 transition-all duration-300 ease-in-out min-[576px]:mx-auto min-[576px]:mt-7 min-[576px]:max-w-[500px]">
          <div className="min-[576px]:shadow-[0_0.5rem_1rem_rgba(#000, 0.15)] pointer-events-auto relative flex w-full flex-col rounded-md border-none bg-white bg-clip-padding p-[10px] text-current shadow-lg outline-none dark:bg-neutral-600">
            {parsedHTML}
            <button
              onClick={() => {
                props?.setShowIframe(false),
                  (document.body.style.overflow = '');
              }}
              className="absolute right-[30px] top-[25px] h-[40px] bg-transparent px-4 py-2"
            >
              <svg
                width="22"
                height="20"
                viewBox="0 0 22 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line
                  x1="1"
                  y1="-1"
                  x2="26.3636"
                  y2="-1"
                  transform="matrix(0.730887 0.682499 -0.730887 0.682499 0 1.3241)"
                  stroke="black"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <line
                  x1="1"
                  y1="-1"
                  x2="26.3636"
                  y2="-1"
                  transform="matrix(-0.730887 0.682499 -0.730887 -0.682499 20 0)"
                  stroke="black"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="fixed left-0 top-0 z-[1040] block h-full w-full bg-black opacity-50 transition-all duration-300 ease-in-out"></div>
    </div>
  );
}
