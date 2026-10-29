import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const modulePath = 'lib/acquisition-handoff.ts';
const source = await readFile(modulePath, 'utf8');
const code = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ES2022,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const api = await import(
  `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`
);
function browser() {
  const values = new Map();
  const cookies = [];
  const runtime = {
    storage: {
      getItem: (key) => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, value),
      removeItem: (key) => values.delete(key),
    },
    writeCookie: (value) => cookies.push(value),
    href: 'https://sealos.io/downloads?utm_source=campaign&utm_medium=cpc&utm_campaign=launch&token=secret#fragment',
    referrer: 'https://search.test/results?secret=private',
    cookie: '_ga=GA1.1.12345.67890',
    consentUpdates: [],
    now: () => new Date('2026-10-29T00:00:00Z'),
    randomId: () => 'c85cd505-fb10-4ff9-a8f4-4ba89fbe6643',
  };
  return { runtime, values, cookies };
}
const granted = (runtime) => api.setAcquisitionAnalyticsConsent(runtime, true);
const encode = (value) =>
  Buffer.from(JSON.stringify(value)).toString('base64url');

test('no identity or source before consent; declined consent deletes stored linkage', () => {
  const { runtime, values } = browser();
  assert.deepEqual(api.readAcquisitionContext(runtime), {
    version: 1,
    realm: 'global',
    consent: {
      analytics_storage: 'unspecified',
      ad_storage: 'unspecified',
      ad_user_data: 'unspecified',
      ad_personalization: 'unspecified',
    },
  });
  assert.equal(values.size, 0);
  granted(runtime);
  assert.equal(
    api.readAcquisitionContext(runtime).visitor_id,
    'c85cd505-fb10-4ff9-a8f4-4ba89fbe6643',
  );
  api.setAcquisitionAnalyticsConsent(runtime, false);
  const declined = api.readAcquisitionContext(runtime);
  assert.equal(declined.consent.analytics_storage, 'denied');
  assert.equal(declined.visitor_id, undefined);
  assert.equal(declined.source, undefined);
  assert.equal(declined.platform_ids, undefined);
  assert.equal(values.has('sealos_acquisition_visitor_v1'), false);
});

test('consented visit survives navigation and preserves the first source', () => {
  const { runtime } = browser();
  granted(runtime);
  runtime.consentUpdates.push([
    'consent',
    'update',
    {
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
    },
  ]);
  const first = api.readAcquisitionContext(runtime);
  assert.equal(first.source.landing_page, 'https://sealos.io/downloads');
  assert.equal(first.source.referrer, 'https://search.test/results');
  assert.equal(JSON.stringify(first).includes('secret'), false);
  runtime.href = 'https://sealos.io/downloads';
  const after = api.readAcquisitionContext(runtime);
  assert.equal(after.visitor_id, first.visitor_id);
  assert.deepEqual(after.source, first.source);
  assert.equal(after.consent.ad_user_data, 'granted');
});

test('real consent updates override stored choices; consent defaults do not invent permission', () => {
  const { runtime } = browser();
  runtime.consentUpdates.push({
    0: 'consent',
    1: 'default',
    2: { analytics_storage: 'denied' },
  });
  assert.equal(
    api.readAcquisitionConsent(runtime).analytics_storage,
    'unspecified',
  );
  granted(runtime);
  runtime.consentUpdates.push({
    0: 'consent',
    1: 'update',
    2: { analytics_storage: 'denied' },
  });
  assert.equal(api.readAcquisitionContext(runtime).visitor_id, undefined);
  assert.equal(api.readAcquisitionConsent(runtime).analytics_storage, 'denied');
});

test('cross-tab denial wins over stale grants even before the granting tab rereads its choice', () => {
  const { runtime: tabA, values } = browser();
  const { runtime: tabB } = browser();
  tabB.storage = tabA.storage;
  granted(tabA);
  api.setAcquisitionAnalyticsConsent(tabB, false);
  const after = api.readAcquisitionContext(tabA);
  assert.equal(after.consent.analytics_storage, 'denied');
  assert.equal(after.visitor_id, undefined);
  assert.equal(after.platform_ids, undefined);
  assert.equal(
    JSON.parse(values.get('sealos_acquisition_consent_v1')).analytics_storage,
    'denied',
  );
});

test('a persisted denial survives initial queue history but a newly observed update can grant again', () => {
  const { runtime, values } = browser();
  values.set(
    'sealos_acquisition_consent_v1',
    JSON.stringify({ analytics_storage: 'denied' }),
  );
  runtime.consentUpdates.push({
    event: 'sealos_consent_update',
    analytics_storage: 'granted',
  });
  assert.equal(api.readAcquisitionContext(runtime).visitor_id, undefined);
  runtime.consentUpdates.push([
    'consent',
    'update',
    { analytics_storage: 'granted' },
  ]);
  assert.equal(
    api.readAcquisitionContext(runtime).visitor_id,
    'c85cd505-fb10-4ff9-a8f4-4ba89fbe6643',
  );
  assert.equal(
    api.readAcquisitionConsent(runtime).analytics_storage,
    'granted',
  );
});

test('cross-tab revocation also invalidates cached advertising permission', () => {
  const { runtime: tabA } = browser();
  const { runtime: tabB } = browser();
  tabB.storage = tabA.storage;
  granted(tabA);
  tabA.consentUpdates.push([
    'consent',
    'update',
    {
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
    },
  ]);
  assert.equal(api.readAcquisitionContext(tabA).consent.ad_storage, 'granted');
  api.setAcquisitionAnalyticsConsent(tabB, false);
  assert.equal(
    api.readAcquisitionContext(tabA).consent.ad_storage,
    'unspecified',
  );
  tabA.consentUpdates.push([
    'consent',
    'update',
    { analytics_storage: 'granted' },
  ]);
  const renewed = api.readAcquisitionContext(tabA);
  assert.equal(renewed.consent.analytics_storage, 'granted');
  assert.equal(renewed.consent.ad_user_data, 'unspecified');
  assert.equal(renewed.consent.ad_storage, 'unspecified');
  assert.equal(renewed.consent.ad_personalization, 'unspecified');
});

test('consent subscriptions ignore source and visitor storage writes and detach cleanly', () => {
  const previousWindow = globalThis.window;
  const target = new EventTarget();
  globalThis.window = target;
  try {
    let calls = 0;
    const unsubscribe = api.subscribeAcquisitionConsent(() => calls++);
    const storage = (key) =>
      target.dispatchEvent(Object.assign(new Event('storage'), { key }));
    storage('sealos_acquisition_source_v1');
    storage('sealos_acquisition_visitor_v1');
    assert.equal(calls, 0);
    storage('sealos_acquisition_consent_v1');
    storage(null);
    target.dispatchEvent(new Event('sealos_consent_update'));
    assert.equal(calls, 3);
    unsubscribe();
    storage('sealos_acquisition_consent_v1');
    assert.equal(calls, 3);
  } finally {
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
  }
});

test('an already queued CMP denial remains fail-closed on a new page with a stored grant', () => {
  const { runtime, values } = browser();
  values.set(
    'sealos_acquisition_consent_v1',
    JSON.stringify({ analytics_storage: 'granted' }),
  );
  runtime.consentUpdates.push([
    'consent',
    'update',
    { analytics_storage: 'denied' },
  ]);
  assert.equal(api.readAcquisitionContext(runtime).visitor_id, undefined);
  assert.equal(api.readAcquisitionConsent(runtime).analytics_storage, 'denied');
});

test('queue truncation cannot replay a grant that preceded a consumed denial', () => {
  const { runtime } = browser();
  granted(runtime);
  runtime.consentUpdates.push([
    'consent',
    'update',
    { analytics_storage: 'denied' },
  ]);
  assert.equal(api.readAcquisitionConsent(runtime).analytics_storage, 'denied');
  runtime.consentUpdates.splice(1);
  assert.equal(api.readAcquisitionContext(runtime).visitor_id, undefined);
  runtime.consentUpdates.push([
    'consent',
    'update',
    { analytics_storage: 'granted' },
  ]);
  assert.equal(
    api.readAcquisitionContext(runtime).visitor_id,
    'c85cd505-fb10-4ff9-a8f4-4ba89fbe6643',
  );
});

test('a newer cross-tab grant is not vetoed by already consumed denial history', () => {
  const { runtime: tabA } = browser();
  const { runtime: tabB } = browser();
  tabB.storage = tabA.storage;
  api.setAcquisitionAnalyticsConsent(tabA, false);
  assert.equal(api.readAcquisitionConsent(tabB).analytics_storage, 'denied');
  granted(tabB);
  assert.equal(api.readAcquisitionConsent(tabA).analytics_storage, 'granted');
  assert.equal(api.readAcquisitionConsent(tabB).analytics_storage, 'granted');
});

test('a bounded queue rotation with unchanged length cannot hide a new denial', () => {
  const { runtime } = browser();
  granted(runtime);
  runtime.consentUpdates.splice(0, 1, [
    'consent',
    'update',
    { analytics_storage: 'denied' },
  ]);
  assert.equal(api.readAcquisitionContext(runtime).visitor_id, undefined);
  assert.equal(api.readAcquisitionConsent(runtime).analytics_storage, 'denied');
});

function payload(cookies) {
  const value = cookies.at(-1).split(';')[0].split('=')[1];
  return JSON.parse(Buffer.from(value, 'base64url').toString('utf8'));
}
test('official root/www Cookie shares a bounded UTF-8 visitor snapshot for console OAuth', () => {
  const { runtime, cookies } = browser();
  granted(runtime);
  runtime.href =
    'https://www.sealos.io/downloads?utm_source=搜索&utm_campaign=推广';
  const context = api.readAcquisitionContext(runtime);
  const cookie = cookies.at(-1);
  assert.match(cookie, /^sealos_acquisition_v1=[A-Za-z0-9_-]+;/);
  assert.match(
    cookie,
    /Domain=sealos.io; Path=\/; Secure; SameSite=Lax; Max-Age=2592000/,
  );
  const saved = payload(cookies);
  assert.equal(saved.realm, 'global');
  assert.equal(saved.visitor_id, context.visitor_id);
  assert.equal(saved.source.source, '搜索');
  assert.equal(saved.platform_ids, undefined);
  assert.equal(saved.sea_attr, undefined);
  assert.equal('user_id' in saved, false);
  const { runtime: other, cookies: more } = browser();
  granted(other);
  other.cookie = cookie.split(';')[0];
  other.href = 'https://sealos.io/';
  other.randomId = () => {
    throw new Error('must reuse existing shared visitor');
  };
  assert.equal(
    api.readAcquisitionContext(other).visitor_id,
    context.visitor_id,
  );
  assert.equal(payload(more).source.source, '搜索');
});
test('tenant, lookalike, insecure and development hosts cannot write shared Cookie', () => {
  for (const host of [
    'https://hzh.sealos.io',
    'https://tenant.sealos.io',
    'https://sealos.io.attacker.test',
    'http://sealos.io',
    'https://sealos.io:3000',
  ]) {
    const { runtime, cookies } = browser();
    runtime.href = host;
    granted(runtime);
    api.readAcquisitionContext(runtime);
    assert.equal(cookies.length, 0, host);
  }
});
test('withdrawal clears shared Cookie, new identity and source without retaining aliases', () => {
  const { runtime, cookies, values } = browser();
  granted(runtime);
  api.readAcquisitionContext(runtime);
  api.setAcquisitionAnalyticsConsent(runtime, false);
  assert.match(cookies.at(-1), /^sealos_acquisition_v1=;.*Max-Age=0$/);
  assert.equal(values.has('sealos_acquisition_visitor_v1'), false);
  assert.equal(values.has('sealos_acquisition_source_v1'), false);
});
test('campaign PII and URL secrets are omitted from the shared snapshot', () => {
  for (const campaign of [
    'someone@example.com',
    '13800138000',
    'https://attacker.test/token',
    'secret%0Avalue',
  ]) {
    const { runtime, cookies } = browser();
    granted(runtime);
    runtime.href = `https://sealos.io/downloads?utm_campaign=${campaign}&token=secret#private`;
    runtime.referrer = 'https://user:password@example.com/path?secret=true';
    api.readAcquisitionContext(runtime);
    const saved = payload(cookies);
    assert.equal(saved.source.campaign, undefined);
    assert.equal(saved.source.referrer, undefined);
    assert.equal(saved.source.landing_page, 'https://sealos.io/downloads');
  }
});
test('Cookie blocked storage cannot create an identity or affect downloads', () => {
  const { runtime, cookies } = browser();
  granted(runtime);
  runtime.storage.setItem = () => {
    throw new Error('blocked');
  };
  assert.equal(api.readAcquisitionContext(runtime).visitor_id, undefined);
  assert.equal(cookies.length, 0);
});

test('unknown permission does not erase an existing root-domain journey before a www choice', () => {
  const { runtime, cookies } = browser();
  runtime.href = 'https://www.sealos.io/downloads';
  api.readAcquisitionContext(runtime);
  assert.equal(cookies.length, 0);
});

test('shared root/www visitor wins over an older origin-local visitor and source', () => {
  const first = browser();
  granted(first.runtime);
  first.runtime.href = 'https://sealos.io/?utm_source=original';
  const context = api.readAcquisitionContext(first.runtime);
  const other = browser();
  granted(other.runtime);
  other.runtime.href = 'https://www.sealos.io/?utm_source=later';
  other.values.set(
    'sealos_acquisition_visitor_v1',
    '11111111-1111-4111-8111-111111111111',
  );
  other.values.set(
    'sealos_acquisition_source_v1',
    JSON.stringify({
      first_touch: {
        source: 'stale',
        landing_page: 'https://www.sealos.io/',
        timestamp: '2026-10-28T00:00:00Z',
      },
    }),
  );
  other.runtime.cookie = first.cookies.at(-1).split(';')[0];
  const after = api.readAcquisitionContext(other.runtime);
  assert.equal(after.visitor_id, context.visitor_id);
  assert.equal(after.source.source, 'original');
});

test('Cookie carries only the minimal backend fields and is bounded after UTF-8 encoding', () => {
  const { runtime, cookies } = browser();
  granted(runtime);
  runtime.href =
    'https://sealos.io/' +
    'a'.repeat(400) +
    '?utm_source=' +
    '搜'.repeat(100) +
    '&utm_medium=' +
    '媒'.repeat(100) +
    '&utm_campaign=' +
    '广'.repeat(100);
  runtime.referrer = 'https://search.test/' + 'b'.repeat(400);
  runtime.rawAttribution = () => {
    throw new Error('must not read sea_attr');
  };
  runtime.rybbitUserId = () => {
    throw new Error('must not read SDK aliases');
  };
  api.readAcquisitionContext(runtime);
  const saved = payload(cookies);
  assert.deepEqual(Object.keys(saved).sort(), [
    'consent',
    'realm',
    'source',
    'version',
    'visitor_id',
  ]);
  assert.ok(
    Buffer.from(cookies.at(-1).split(';')[0].split('=')[1], 'base64url')
      .length <= 1800,
  );
  assert.ok(saved.source.landing_page.length <= 250);
  assert.ok(saved.source.referrer.length <= 250);
  assert.equal(saved.platform_ids, undefined);
  assert.equal(saved.sea_attr, undefined);
});

test('invalid shared identities and malformed source cannot become a new Cookie', () => {
  for (const data of [
    {
      version: 1,
      realm: 'china',
      visitor_id: '11111111-1111-4111-8111-111111111111',
    },
    { version: 1, realm: 'global', visitor_id: 'not-a-uuid' },
    {
      version: 1,
      realm: 'global',
      visitor_id: '11111111-1111-4111-8111-111111111111',
      consent: { analytics_storage: 'denied' },
    },
  ]) {
    const { runtime, cookies } = browser();
    granted(runtime);
    runtime.cookie = api.ACQUISITION_COOKIE + '=' + encode(data);
    assert.equal(
      api.readAcquisitionContext(runtime).visitor_id,
      runtime.randomId(),
    );
    assert.equal(payload(cookies).source.source, 'campaign');
  }
});

test('Cookie write failures do not interrupt consented observation or ordinary navigation', () => {
  const { runtime } = browser();
  granted(runtime);
  runtime.writeCookie = () => {
    throw new Error('Cookie blocked');
  };
  assert.equal(
    api.readAcquisitionContext(runtime).visitor_id,
    runtime.randomId(),
  );
  assert.doesNotThrow(() => api.setAcquisitionAnalyticsConsent(runtime, false));
});
