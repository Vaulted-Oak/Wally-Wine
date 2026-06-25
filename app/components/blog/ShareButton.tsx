import React, { useEffect, useRef, useState } from 'react';

interface ShareButtonProps {
  title: string;
}

export default function ShareButton({ title }: ShareButtonProps) {
  const [url, setUrl] = useState<string | null>(null);
  const [isFallbackVisible, setFallbackVisible] = useState(false);
  const fallbackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUrl(window.location.href);
    }
  }, []);

  const handleNativeShare = async () => {
    if (navigator.share && url) {
      try {
        await navigator.share({
          title,
          url,
        });
      } catch (err) {
        console.error('Error using native share:', err);
      }
    } else {
      setFallbackVisible(!isFallbackVisible);
    }
  };

  const handleCopyLink = () => {
    if (url) {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (fallbackRef.current && !fallbackRef.current.contains(event.target as Node)) {
        setFallbackVisible(false);
      }
    }

    if (isFallbackVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFallbackVisible]);

  return (
    <div className="share-button ml-8 relative">
      <button className="share-button__trigger flex gap-[5px]" onClick={handleNativeShare} disabled={!url}>
        <svg
          width="13"
          height="12"
          viewBox="0 0 13 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.625 8.125V10.2917C1.625 10.579 1.73914 10.8545 1.9423 11.0577C2.14547 11.2609 2.42102 11.375 2.70833 11.375H10.2917C10.579 11.375 10.8545 11.2609 11.0577 11.0577C11.2609 10.8545 11.375 10.579 11.375 10.2917V8.125"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6.14775 1.27137C6.34301 1.0761 6.65959 1.0761 6.85485 1.27137L9.56319 3.9797C9.75845 4.17496 9.75845 4.49154 9.56319 4.6868C9.36793 4.88207 9.05135 4.88207 8.85609 4.6868L6.5013 2.33203L4.14652 4.6868C3.95126 4.88207 3.63468 4.88207 3.43942 4.6868C3.24415 4.49154 3.24415 4.17496 3.43942 3.9797L6.14775 1.27137Z"
            fill="currentColor"
          />
        </svg>
        <span>Share</span>
      </button>
      {isFallbackVisible && url && (
        <div ref={fallbackRef} className="share-button__fallback absolute top-[100%] left-0 bg-white rounded-[6px] border-[1px] border-[#cccccc] min-w-[100px] py-[5px]">
          <button className="w-full text-left py-[5px] px-[10px] hover:bg-[#cccccc]" onClick={handleCopyLink}>Copy Link</button>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block py-[5px] px-[10px] hover:bg-[#cccccc]"
          >
            Facebook
          </a>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block py-[5px] px-[10px] hover:bg-[#cccccc]"
          >
            X
          </a>
        </div>
      )}
    </div>
  );
}
