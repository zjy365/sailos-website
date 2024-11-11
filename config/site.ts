import { SiteConfig } from '@/types';

export const siteConfig: SiteConfig = {
  name: 'Sealos',
  author: 'zjy365',
  description: 'sealos',
  keywords: ['sealos', 'Next.js'],
  url: {
    base: process.env.NEXT_PUBLIC_APP_URL || '',
    author: '',
  },
  links: {
    github: process.env.NEXT_PUBLIC_OPEN_SOURCE_URL || '',
    twitter: '',
  },
  ogImage: `${process.env.NEXT_PUBLIC_APP_URL}/og.png?${new Date().getTime()}`,
};
