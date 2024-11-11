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
        <Image alt="Sailos" src="/logo.svg" width={24} height={24} />
        <span className="hidden text-base font-bold md:block">Sailos</span>
      </div>
    ),
  },
  githubUrl: 'https://github.com/zjy365/sailos-site',
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
    text: '首页',
    url: 'https://ads.sealos.run/',
  },
  {
    text: '定价',
    url: 'https://ads.sealos.run/Price',
  },
  {
    text: '文档',
    url: 'https://sealos.run/docs/Intro/',
  },
  {
    text: '商务咨询',
    url: 'https://fael3z0zfze.feishu.cn/share/base/form/shrcn5oHHTKCf3VREMKOhEy6fmf',
  },
  // {
  //   text: 'Pricing',
  //   url: '/pricing',
  // },
  // {
  //   text: 'Blog',
  //   url: '/blog',
  // },
  // {
  //   text: 'Contact',
  //   url: '/contact',
  // },
];
