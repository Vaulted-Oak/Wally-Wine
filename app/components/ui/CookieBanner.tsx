import React, { useState, useEffect } from 'react';

const CookieBanner = () => {
  const [isBannerVisible, setIsBannerVisible] = useState(false);
  const [isPreferencesVisible, setIsPreferencesVisible] = useState(false);
  const [preferences, setPreferences] = useState({
    required: true,
    personalization: false,
    marketing: false,
    analytics: false,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPreferences = localStorage.getItem('cookiePreferences');
      if (!savedPreferences) {
        setIsBannerVisible(true); // Show banner only if no preferences are saved
      }
    }
  }, []);

  const handleAccept = () => {
    setPreferences({
      required: true,
      personalization: true,
      marketing: true,
      analytics: true,
    });
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    setIsBannerVisible(false);
  };

  const handleDecline = () => {
    setPreferences({
      required: true,
      personalization: false,
      marketing: false,
      analytics: false,
    });
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    setIsBannerVisible(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    setIsPreferencesVisible(false);
    setIsBannerVisible(false);
  };

  const handleManagePreferences = () => {
    setIsPreferencesVisible(true);
  };

  return (
    <>
      {/* Initial Banner */}
      {isBannerVisible && !isPreferencesVisible && (
        <div className="fixed bottom-0 left-0 w-full bg-[rgba(33,33,33,0.7)] p-4 z-50 text-white">
          <div className="flex lg:justify-between justify-center flex-wrap gap-[10px] items-center">
            <p className="lg:flex-1">
              We value your privacy. We use cookies and other technologies to personalize your experience, perform
              marketing, and collect analytics. Learn more in our{' '}
              <a href="/policies/privacy-policy" className="underline">
                Privacy Policy
              </a>
              .
            </p>
            <div className="flex space-x-2">
              <button
                onClick={handleManagePreferences}
                className="px-4 py-2 border border-gray-300"
              >
                Manage preferences
              </button>
              <button
                onClick={handleAccept}
                className="px-4 py-2 bg-primaryGreen text-white"
              >
                Accept
              </button>
              <button
                onClick={handleDecline}
                className="px-4 py-2 bg-white text-primaryGreen"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cookie Preferences Popup */}
      {isPreferencesVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[95%] max-w-md">
            <div className="flex justify-between items-center">
              <h2 className="text-xl">Cookie preferences</h2>
              <button
                onClick={() => setIsPreferencesVisible(false)}
                className="text-gray-500 hover:text-black"
              >
                &times;
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-600">You control your data.</p>
            <div className="mt-4">
              {[
                { key: 'required', label: 'Required', description: 'Necessary for the site to function properly.' },
                { key: 'personalization', label: 'Personalization', description: 'Stores details about your actions.' },
                { key: 'marketing', label: 'Marketing', description: 'Used to optimize marketing communications.' },
                { key: 'analytics', label: 'Analytics', description: 'Helps understand how you interact with the site.' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-2 border-b">
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences[item.key]}
                    disabled={item.key === 'required'}
                    onChange={(e) =>
                      setPreferences((prev) => ({ ...prev, [item.key]: e.target.checked }))
                    }
                  />
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={handleSavePreferences}
                className="px-4 py-2 bg-primaryGreen text-white"
              >
                Save my choices
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieBanner;
