'use client';

import { useEffect, useRef, useState } from 'react';
import {
  completeAcquisitionBridge,
  createBrowserAcquisitionRuntime,
  getAcquisitionBridgeTarget,
  issueAcquisitionAppLink,
  readAcquisitionConsent,
  setAcquisitionAnalyticsConsent,
} from '@/lib/acquisition-handoff';

export function AppAttribution() {
  const [href, setHref] = useState<string>();
  const [consent, setConsent] = useState<'granted' | 'denied' | 'unspecified'>(
    'unspecified',
  );
  const [message, setMessage] = useState('Continue in the Sealos desktop App.');
  const [busy, setBusy] = useState(false);
  const pending = useRef<Promise<string> | undefined>(undefined);
  const originalHref = useRef<string | undefined>(undefined);
  useEffect(() => {
    originalHref.current ??= window.location.href;
    setHref(originalHref.current);
    setConsent(
      readAcquisitionConsent(createBrowserAcquisitionRuntime())
        .analytics_storage,
    );
    // The page contains no trackers. Remove the short capability from the
    // address bar before any subsequent link can carry it as a referrer.
    window.history.replaceState(null, '', window.location.pathname);
  }, []);
  const bridge = href ? getAcquisitionBridgeTarget(href) : undefined;
  const invalidBridge = href
    ? new URL(href).searchParams.has('handoff') && !bridge
    : false;
  useEffect(() => {
    if (!href || !getAcquisitionBridgeTarget(href) || consent === 'unspecified')
      return;
    let active = true;
    const runtime = createBrowserAcquisitionRuntime();
    runtime.href = href || runtime.href;
    pending.current ??= completeAcquisitionBridge(href || '', runtime);
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
    return next;
  };
  const open = async (allowed: boolean) => {
    choose(allowed);
    if (!allowed) {
      window.location.assign('zcode://sealos/open');
      return;
    }
    setBusy(true);
    setMessage('Opening Sealos…');
    try {
      const runtime = createBrowserAcquisitionRuntime();
      if (href) runtime.href = href;
      const link = await issueAcquisitionAppLink(runtime);
      window.location.assign(link);
      setMessage(
        'If Sealos did not open, check that it is installed, then try again.',
      );
    } catch {
      setMessage(
        'Source handoff is unavailable. You can still open Sealos below.',
      );
    } finally {
      setBusy(false);
    }
  };
  const act = (allowed: boolean) => {
    if (bridge) choose(allowed);
    else void open(allowed);
  };
  return (
    <main className="mx-auto max-w-xl space-y-5 px-6 py-16">
      <h1 className="text-2xl font-semibold">Continue in Sealos</h1>
      <output aria-live="polite">
        {invalidBridge
          ? 'This link is invalid or expired. Start sign-in again from the App.'
          : message}
      </output>
      {!invalidBridge && (!bridge || consent === 'unspecified') && (
        <>
          <p>
            Allow this website visit to be linked to your App sign-in,
            deployment and payment activity? This does not enable advertising
            tracking.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={busy}
              onClick={() => act(true)}
              className="rounded border px-4 py-2"
            >
              Allow and continue
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => act(false)}
              className="rounded border px-4 py-2"
            >
              Continue without linking
            </button>
          </div>
        </>
      )}
      <p>
        <a href="zcode://sealos/open" className="underline">
          Open Sealos without source handoff
        </a>
      </p>
      <p className="text-sm">
        This website uses the Global account service. Your selection inside the
        App still determines the account region.
      </p>
    </main>
  );
}
