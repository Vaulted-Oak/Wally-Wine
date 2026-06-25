import React, { useEffect, useState } from 'react';
import { useKlevu } from '~/hooks/useKlevu';

// Lazy load the actual search component to avoid SSR issues
const SearchResultPageLazy = React.lazy(() =>
  import('./SearchResultPage').then(module => ({ default: module.default }))
);

export default function SearchResultPageWrapper({ query }: { query: string }) {
  const { isReady, error } = useKlevu();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-pulse">Loading search...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center text-red-500">
          <p>Failed to load search functionality.</p>
          <p className="text-sm mt-2">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-pulse">Initializing search...</div>
        </div>
      </div>
    );
  }

  return (
    <React.Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-pulse">Loading results...</div>
          </div>
        </div>
      }
    >
      <SearchResultPageLazy query={query} />
    </React.Suspense>
  );
}
