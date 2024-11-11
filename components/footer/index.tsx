import React from 'react';
import { siteConfig } from '@/config/site';
import Link from 'fumadocs-core/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { DiscordIcon, FrameIcon, GithubIcon } from '../ui/icons';

interface FooterLinkColumnProps {
  children: React.ReactNode;
}

const FooterLinkColumn: React.FC<FooterLinkColumnProps> = ({ children }) => (
  <div className="flex flex-col justify-center space-y-4">{children}</div>
);

interface FooterLinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
}

const FooterLink: React.FC<FooterLinkProps> = ({
  href,
  className,
  children,
}) => (
  <Link
    href={href}
    className={cn(
      'hover:underline-decoration-4 hover:underline-color-[#005B9C] text-sm font-medium text-custom-secondary-text hover:text-[#005B9C] hover:underline hover:underline-offset-4',
      className,
    )}
  >
    {children}
  </Link>
);

const Footer = async () => {
  return (
    <div className="custom-container relative pt-20">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between text-sm lg:flex-row">
        <div>
          <div className="mb-4 mr-4 md:flex">
            <Link
              href={'/'}
              aria-label={siteConfig.name}
              title={siteConfig.name}
              className="flex items-center gap-2 font-bold"
            >
              <Image
                alt={siteConfig.name}
                src="logo.svg"
                className="h-7 w-7"
                width={30}
                height={30}
              />
              <span className="text-xl font-bold">{siteConfig.name}</span>
            </Link>
          </div>
          <div className="mt-3 text-xs font-medium text-custom-secondary-text sm:text-sm">
            基于Kubernetes内核的云操作系统
          </div>
        </div>

        <div className="mt-10 grid grid-cols-3 items-start gap-10 lg:mt-0">
          <FooterLinkColumn>
            <div className="text-base font-semibold uppercase text-black hover:text-black hover:no-underline">
              快捷入口
            </div>
            <FooterLink
              className="mt-6"
              href="https://affim.baidu.com/unique_57159132/chat?siteId=21229559&userId=57159132&siteToken=6763f865f8d80f27bf8adf840a3041b6&cp=%E9%A6%96%E9%A1%B5-%E5%BA%95%E9%83%A8-%E5%94%AE%E5%89%8D%E5%92%A8%E8%AF%A2%E6%8C%89%E9%92%AE&cr=&cw="
            >
              售前咨询
            </FooterLink>
            <FooterLink href="https://affim.baidu.com/unique_57159132/chat?siteId=21229559&userId=57159132&siteToken=6763f865f8d80f27bf8adf840a3041b6&cp=%E9%A6%96%E9%A1%B5-%E5%BA%95%E9%83%A8-%E5%94%AE%E5%90%8E%E5%92%A8%E8%AF%A2%E6%8C%89%E9%92%AE&cr=&cw=">
              售后咨询
            </FooterLink>
            <FooterLink href="https://sealos.run/docs/5.0.0/Intro/">
              帮助中心
            </FooterLink>
          </FooterLinkColumn>
          <FooterLinkColumn>
            <div className="text-base font-semibold uppercase text-black hover:text-black hover:no-underline">
              开发者
            </div>
            <FooterLink
              href={
                'https://github.com/labring/sealos/blob/main/CONTRIBUTING.md'
              }
            >
              参与贡献
            </FooterLink>
            <FooterLink href="https://forum.laf.run/">开发者社区</FooterLink>
          </FooterLinkColumn>
          <FooterLinkColumn>
            <div className="text-base font-semibold uppercase text-black hover:text-black hover:no-underline">
              联系我们
            </div>

            <FooterLink href="https://github.com/labring/sealos/issues">
              问题反馈
            </FooterLink>
            <FooterLink href="https://sealos.run/company/">关于我们</FooterLink>
          </FooterLinkColumn>
        </div>
      </div>

      <div className="mt-16 h-[1px] w-full bg-[#DDE7F7]"></div>
      <div className="flex justify-between pb-6 pl-2 pt-4">
        <div className="flex items-center space-x-2 text-[10px] font-normal text-custom-secondary-text md:text-sm">
          <div>
            Sealos. all rights reserved. 粤ICP备2023048773号
            珠海环界云计算有限公司版权所有
          </div>
        </div>
        <div className="flex space-x-4">
          <Link
            className="flex size-8 items-center justify-center rounded-full bg-[#FAFCFF] object-center hover:bg-[#1118240D]"
            href="https://github.com"
            aria-label="GitHub"
          >
            <GithubIcon />
          </Link>

          <Link
            className="flex size-8 items-center justify-center rounded-full bg-[#FAFCFF] object-center hover:bg-[#1118240D]"
            href="https://discord.com"
            aria-label="Discord"
          >
            <DiscordIcon />
          </Link>
          <Link
            className="flex size-8 items-center justify-center rounded-full bg-[#FAFCFF] object-center hover:bg-[#1118240D]"
            href="https://twitter.com"
            aria-label="Twitter"
          >
            <FrameIcon />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
