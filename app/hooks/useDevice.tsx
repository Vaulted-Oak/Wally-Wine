import {useMemo, useState, useEffect} from 'react';

export function useDevice() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const mobileQuery = window.matchMedia('(max-width: 640px)');
    const tabletQuery = window.matchMedia(
      '(min-width: 641px) and (max-width: 1024px)',
    );

    const updateDevice = () => {
      setIsMobile(mobileQuery.matches);
      setIsTablet(tabletQuery.matches);
    };

    // Set initial values
    updateDevice();

    // Listen for changes
    mobileQuery.addEventListener('change', updateDevice);
    tabletQuery.addEventListener('change', updateDevice);

    return () => {
      mobileQuery.removeEventListener('change', updateDevice);
      tabletQuery.removeEventListener('change', updateDevice);
    };
  }, []);

  const device = useMemo(() => {
    if (isMobile) {
      return 'mobile';
    } else if (isTablet) {
      return 'tablet';
    }
    return 'desktop';
  }, [isMobile, isTablet]);

  return device;
}
