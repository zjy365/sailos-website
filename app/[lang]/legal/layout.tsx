import Footer from '@/components/footer';
import Header from '@/components/header';
import { ReactNode } from 'react';
import styles from './index.module.css';

export default function BlogLayout({
  params,
  children,
}: {
  params: { lang: string };
  children: ReactNode;
}) {
  return (
    <div className={`h-full ${styles.blog_layout}`}>
      <Header lang={params.lang} />
      <div className="custom-container min-h-screen pt-36 prose dark:prose-invert">{children}</div>
      <Footer />
    </div>
  );
}
