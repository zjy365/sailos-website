import { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import Image from 'next/image';

/**
 * Shared layout configurations
 *
 * you can configure layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: BaseLayoutProps = {
  i18n: false,
  disableThemeSwitch: true,
  nav: {
    title: (
      <div className="flex items-center gap-1">
        <Image alt="Sealos" src="/logo.svg" width={24} height={24} />
        <span className="hidden text-base font-bold md:block">Sealos</span>
      </div>
    ),
  },
  githubUrl: 'https://github.com/labring/sealos',
  links: [
    {
      text: 'Documentation',
      url: '/docs',
      active: 'nested-url',
    },
  ],
};

export const HeaderLinks = [
  {
    text: 'App Store',
    url: 'https://template.usw.sailos.io',
  },
  {
    text: 'Docs',
    url: '/docs',
  },
  // {
  //   text: 'Pricing',
  //   url: '/pricing',
  // },
  {
    text: 'Blog',
    url: '/blog',
  },
  {
    text: 'Contact',
    url: '/contact',
  },
];
