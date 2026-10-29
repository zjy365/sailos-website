'use client';
import { useEffect, useState } from 'react';
import {
  createBrowserAcquisitionRuntime,
  readAcquisitionConsent,
  setAcquisitionAnalyticsConsent,
} from '@/lib/acquisition-handoff';

export function AcquisitionChoice() {
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    const sync = () =>
      setAllowed(
        readAcquisitionConsent(createBrowserAcquisitionRuntime())
          .analytics_storage === 'granted',
      );
    sync();
    window.addEventListener('sealos_consent_update', sync);
    return () => window.removeEventListener('sealos_consent_update', sync);
  }, []);
  return (
    <label className="block text-sm">
      <input
        type="checkbox"
        checked={allowed}
        onChange={(event) => {
          setAcquisitionAnalyticsConsent(
            createBrowserAcquisitionRuntime(),
            event.currentTarget.checked,
          );
          window.dispatchEvent(new Event('sealos_consent_update'));
        }}
      />{' '}
      Allow this visit to be linked to my App sign-in and usage. Advertising
      tracking stays off.
    </label>
  );
}
