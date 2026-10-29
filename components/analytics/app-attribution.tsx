'use client';

import { useEffect, useRef, useState } from 'react';
import {
  completeAcquisitionBridge,
  createBrowserAcquisitionRuntime,
  getAcquisitionBridgeTarget,
  readAcquisitionConsent,
  setAcquisitionAnalyticsConsent,
  subscribeAcquisitionConsent,
} from '@/lib/acquisition-handoff';

export function AppAttribution() {
  const [href, setHref] = useState<string>();
  const [consent, setConsent] = useState<'granted' | 'denied' | 'unspecified'>(
    'unspecified',
  );
  const [message, setMessage] = useState('Continuing sign-in…');
  const pending = useRef<Promise<string> | undefined>(undefined);
  const originalHref = useRef<string | undefined>(undefined);
  useEffect(() => {
    originalHref.current ??= window.location.href;
    setHref(originalHref.current);
    setConsent(
      readAcquisitionConsent(createBrowserAcquisitionRuntime())
        .analytics_storage,
    );
    // Remove the capability before any subsequent navigation can expose it in a referrer.
    window.history.replaceState(null, '', window.location.pathname);
    return subscribeAcquisitionConsent(() => {
      setConsent(
        readAcquisitionConsent(createBrowserAcquisitionRuntime())
          .analytics_storage,
      );
    });
  }, []);
  const bridge = href ? getAcquisitionBridgeTarget(href) : undefined;
  useEffect(() => {
    if (!href || !getAcquisitionBridgeTarget(href) || consent === 'unspecified')
      return;
    let active = true;
    const runtime = createBrowserAcquisitionRuntime();
    runtime.href = href;
    pending.current ??= completeAcquisitionBridge(href, runtime);
    pending.current
      .then((url) => {
        if (active) window.location.replace(url);
      })
      .catch(() => {
        if (active)
          setMessage(
            'This link is invalid or expired. Start sign-in again from the App.',
          );
      });
    return () => {
      active = false;
    };
  }, [href, consent]);
  const choose = (allowed: boolean) => {
    const next = setAcquisitionAnalyticsConsent(
      createBrowserAcquisitionRuntime(),
      allowed,
    );
    window.dispatchEvent(new Event('sealos_consent_update'));
    setConsent(next.analytics_storage);
  };
  return (
    <main className="mx-auto max-w-xl space-y-5 px-6 py-16">
      <h1 className="text-2xl font-semibold">Continue in Sealos</h1>
      <output aria-live="polite">
        {href && !bridge
          ? 'This link is invalid or expired. Start sign-in again from the App.'
          : message}
      </output>
      {bridge && consent === 'unspecified' && (
        <>
          <p>
            Allow this website visit to be linked to your App sign-in,
            deployment and payment activity? This does not enable advertising
            tracking.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => choose(true)}
              className="rounded border px-4 py-2"
            >
              Allow and continue
            </button>
            <button
              type="button"
              onClick={() => choose(false)}
              className="rounded border px-4 py-2"
            >
              Continue without linking
            </button>
          </div>
        </>
      )}
    </main>
  );
}
