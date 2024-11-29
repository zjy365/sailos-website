import Example from '@/components/feature/example';
import Feature from '@/components/feature/feature';
import { StickyBox } from '@/components/feature/sticky-box';
import TechGrid from '@/components/feature/techgrid';
import Footer from '@/components/footer';
import Header from '@/components/header';
import Hero from '@/components/header/hero';
import { TailwindIndicator } from '@/components/tailwind-indicator';
import { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Sealos DevBox - 云原生在线开发环境',
  description:
    '基于 Sealos 的在线开发环境，支持多种编程语言和框架，提供即开即用的云端开发体验',
  keywords: [
    'Sealos',
    'DevBox',
    'Cloud IDE',
    '云原生',
    '在线开发环境',
    '云端开发',
    'Kubernetes',
    '容器化开发',
  ],
};

export default function HomePage({ params }: { params: { lang: string } }) {
  return (
    <div className="h-full bg-[#EBF2FF]">
      <Script
        src={`${
          process.env.NEXT_PUBLIC_BASE_PATH || ''
        }/scripts/baidu-analytics.js`}
        id="baidu-analytics"
        strategy="afterInteractive"
      />
      <Script
        src={`${
          process.env.NEXT_PUBLIC_BASE_PATH || ''
        }/scripts/link-tracker.js`}
        id="link-tracker"
        strategy="afterInteractive"
      />

      <Header lang={params.lang} />
      <main className="custom-container pt-14">
        <Hero />
        <TechGrid />
        <StickyBox />
        <Feature />
        {/* <Example /> */}
      </main>
      <div className="mt-[140px] h-[1px] bg-[#DDE7F7]"></div>
      <Footer />
      <TailwindIndicator />
    </div>
  );
}
