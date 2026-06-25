import { useEffect, useState } from 'react';

let klevuInitialized = false;
let klevuInitializing = false;

export function useKlevu() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      return;
    }

    // If already initialized, mark as ready
    if (klevuInitialized) {
      setIsReady(true);
      return;
    }

    // If currently initializing, wait for it
    if (klevuInitializing) {
      const checkInterval = setInterval(() => {
        if (klevuInitialized) {
          setIsReady(true);
          clearInterval(checkInterval);
        }
      }, 100);
      return () => clearInterval(checkInterval);
    }

    // Initialize Klevu
    klevuInitializing = true;

    import('@klevu/core')
      .then(({ KlevuConfig }) => {
        const apiKey = 'klevu-173585035271317821';
        const url = 'https://uscs34v2.ksearchnet.com/cs/v2/search';

        KlevuConfig.init({ apiKey, url });
        klevuInitialized = true;
        klevuInitializing = false;
        setIsReady(true);
      })
      .catch((err) => {
        console.error('Failed to initialize Klevu:', err);
        klevuInitializing = false;
        setError(err instanceof Error ? err : new Error('Failed to initialize Klevu'));
      });
  }, []);

  return { isReady, error };
}

/**
 * Get Klevu modules dynamically - only use in client components
 * This ensures Klevu is never imported during SSR
 */
export async function getKlevuModules() {
  if (typeof window === 'undefined') {
    throw new Error('Klevu can only be used on the client side');
  }

  return await import('@klevu/core');
}
