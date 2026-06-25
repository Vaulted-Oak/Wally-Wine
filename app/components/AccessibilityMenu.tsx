import React, { useEffect } from 'react';

interface AccessibilityMenuProps {
  accountId: string;
  platformAppId: string;
  storeDomain: string;
  nonce?: string;
}

const AccessibilityMenu = ({accountId, platformAppId, storeDomain, nonce}: AccessibilityMenuProps) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://cdn.userway.org/widget.js?account=${accountId}&platfAppInstalledSiteId=${platformAppId}&shop=${storeDomain}`;
    script.setAttribute('preload', 'true');
    script.setAttribute('rel', 'preload');
    script.async = true;
    if (nonce) {
      script.setAttribute('nonce', nonce);
    }
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [accountId, platformAppId, storeDomain, nonce]);

  return null;
};

export default AccessibilityMenu;
