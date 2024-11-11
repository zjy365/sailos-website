'use client';
import Image from 'next/image';
import { useMediaQuery } from 'react-responsive';
import { AnimateElement } from '../ui/animated-wrapper';
import StickyScroll from '../ui/sticky-scroll-reveal';
import { useState, useEffect } from 'react';
import { getAssetPath } from '@/lib/utils';

const content = [
  {
    title: '统一的云开发环境',
    description:
      '所有团队成员都可以访问同一个Devbox开发环境，共享代码存储库、配置文件和测试数据，开发过程无缝衔接。极大减少了对复杂环境协调的需求，加快开发过程，并提高团队生产力。',
    content: (
      <div className="relative aspect-[700/450] w-full overflow-hidden rounded-lg bg-[#FAFCFF] shadow-sticky-box">
        <Image
          fill
          src={getAssetPath('/images/sticky-box-1.svg')}
          alt="Version control"
          className="h-full w-full rounded-lg object-cover shadow-sticky-box"
        />
      </div>
    ),
    icon: (
      <Image
        src={getAssetPath('/images/sticky-icon-1.svg')}
        alt="icon"
        width={40}
        height={40}
      />
    ),
  },
  {
    title: '简化您的开发工作流程',
    description:
      '集成开发、测试和生产环境，自动化开发环境设置、与本地 IDE 无缝连接',
    content: (
      <div className="relative aspect-[700/450] w-full overflow-hidden rounded-lg bg-[#FAFCFF] shadow-sticky-box">
        <Image
          fill
          src={getAssetPath('/images/sticky-box-2.svg')}
          alt="Version control"
          className="h-full w-full rounded-lg object-cover shadow-sticky-box"
        />
      </div>
    ),
    icon: (
      <Image
        src={getAssetPath('/images/sticky-icon-2.svg')}
        alt="icon"
        width={40}
        height={40}
      />
    ),
  },
  {
    title: '使用 Devbox 进行持续交付',
    description:
      '只需输入版本号，Devbox 就会自动构建 Docker 镜像，100% 成功部署应用程序，并提供无缝的用户体验，无需任何 Docker 或 Kubernetes 知识。',
    content: (
      <div className="relative aspect-[700/450] max-h-[400px] w-full rounded-lg bg-[#FAFCFF] shadow-sticky-box">
        <Image
          fill
          src={getAssetPath('/images/sticky-box-3.svg')}
          alt="Version control"
          className="h-full w-full rounded-lg object-cover shadow-sticky-box"
        />
      </div>
    ),
    icon: (
      <Image
        src={getAssetPath('/images/sticky-icon-3.svg')}
        alt="icon"
        width={40}
        height={40}
      />
    ),
  },
];
export function StickyBox() {
  const isLargeScreen = useMediaQuery({ minWidth: 1024 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="relative mt-32">
      {isLargeScreen && isClient ? (
        <AnimateElement type="slideUp">
          <StickyScroll content={content} />
        </AnimateElement>
      ) : (
        <div className="space-y-16">
          {content.map((item, index) => (
            <AnimateElement
              key={index}
              type="slideUp"
              className="flex flex-col gap-8"
            >
              <div className="flex gap-8">
                <div className="flex size-8 flex-shrink-0 items-start rounded-lg bg-[#F4FCFF] p-[6px] sm:size-14">
                  {item.icon}
                </div>
                <div>
                  <h2 className="mb-4 text-sm font-bold sm:text-2xl">
                    {item.title}
                  </h2>
                  <div className="mb-4 text-xs text-[#4E6185] sm:text-[18px]">
                    {item.description}
                  </div>
                </div>
              </div>
              {item.content}
            </AnimateElement>
          ))}
        </div>
      )}
    </div>
  );
}
