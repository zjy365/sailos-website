'use client';

import { useEffect, useRef, useState } from 'react';
import {
  createBrowserAcquisitionRuntime,
  readAcquisitionContext,
  subscribeAcquisitionConsent,
} from '@/lib/acquisition-handoff';

export function AcquisitionObserver() {
  const observations = useRef<{
    observedVisitor?: string;
  }>({});
  useEffect(() => {
    const state = observations.current;
    const runtimeWindow = window as Window & {
      dataLayer?: unknown[];
    };
    const emit = (name: string) => {
      const context = readAcquisitionContext(createBrowserAcquisitionRuntime());
      if (!context.visitor_id) return;
      const properties = {
        visitor_id: context.visitor_id,
        surface: 'website',
        source: context.source?.source || 'direct',
      };
      runtimeWindow.dataLayer = runtimeWindow.dataLayer || [];
      runtimeWindow.dataLayer.push({ event: name, ...properties });
    };
    const visit = () => {
      const context = readAcquisitionContext(createBrowserAcquisitionRuntime());
      if (!context.visitor_id) {
        state.observedVisitor = undefined;
        return;
      }
      if (state.observedVisitor !== context.visitor_id) {
        state.observedVisitor = context.visitor_id;
        emit('acquisition_visit');
      }
    };
    const click = (event: MouseEvent) => {
      const target =
        event.target instanceof Element
          ? event.target.closest('a[download], a[data-desktop-download]')
          : null;
      if (target) emit('download_click');
    };
    visit();
    const unsubscribeConsent = subscribeAcquisitionConsent(visit);
    document.addEventListener('click', click, true);
    return () => {
      unsubscribeConsent();
      document.removeEventListener('click', click, true);
    };
  }, []);
  return null;
}
