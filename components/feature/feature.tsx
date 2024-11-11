import { cn, getAssetPath } from '@/lib/utils';
import { DatabaseIcon, SailosIcon, ObjectStorageIcon } from '../ui/icons';
import Image from 'next/image';
import { MagicCard } from '../ui/magic-card';
import { AnimateElement } from '../ui/animated-wrapper';

const features = [
  {
    title: '云操作系统',
    description: '原生 K8s 管理、一键创建容器集群、自动化容器应用部署。',
    icon: <SailosIcon />,
  },
  {
    title: '高可用性数据库',
    description:
      '自动部署高可用分布式数据库，无需搭建复杂的多节点架构，全面兼容mysql/redis/mongo/pgsql等生态系统',
    icon: <DatabaseIcon />,
  },
  {
    title: '对象存储',
    description:
      '轻松将数据迁移到云中，并实现强大的冗余和灾难恢复，与多种语言的 SDK 无缝集成。',
    icon: <ObjectStorageIcon />,
  },
];

const features2 = [
  {
    title: '环境安全隔离 ',
    description:
      'Devbox 提供安全、独立的开发环境，消除依赖冲突。动态云原生基础设施管理可确保一致、可重现的工作空间，使开发人员能够专注于核心工作，而无需担心基础设施的复杂性。',
    icon: '🛡️',
    image: '/images/foundation-2-1.svg',
  },
  {
    title: '极致的性能',
    description:
      '自研的轻量级负载均衡器可以处理数万个节点的大规模集群，提供无与伦比的性能。',
    icon: '🚀',
    image: '/images/foundation-2-2.svg',
  },
  {
    title: '从任何网络访问',
    description:
      'Devbox 提供内联网和互联网访问地址，并自动配置 SSL 证书，以增强安全性和灵活性。这使开发人员能够在网络间无缝工作，同时保持安全连接。',
    icon: '🌐',
    image: '/images/foundation-2-3.svg',
  },
];

const performanceStats = [
  {
    icon: '/images/efficient-1.svg',
    percentage: '90%',
    description: '降低成本',
  },
  {
    icon: '/images/efficient-2.svg',
    percentage: '500%',
    description: '性能提升',
  },
  {
    icon: '/images/efficient-3.svg',
    percentage: '99.99999%',
    description: '极其稳定',
  },
  {
    icon: '/images/efficient-4.svg',
    percentage: '100%',
    description: '安全防护',
  },
];

export default function Feature() {
  return (
    <div className="mt-52">
      <AnimateElement type="slideUp">
        <div className="text-center text-base font-bold text-black sm:text-4xl">
          数据底座
        </div>
      </AnimateElement>

      <AnimateElement type="slideUp">
        <div className="mt-16 flex flex-col justify-center gap-6 lg:flex-row">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative flex h-[424px] flex-1 flex-col justify-between rounded-lg bg-white"
              style={{
                boxShadow:
                  '0px 12px 40px -25px rgba(6, 26, 65, 0.20), 0px 0px 1px 0px rgba(19, 51, 107, 0.20)',
              }}
            >
              <AnimateElement type="slideUp">
                <div className="flex  gap-4 p-6 pb-0">
                  <div className="text-5xl">{feature.icon}</div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                    <p className="mb-4 text-xs text-custom-secondary-text">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </AnimateElement>
              <div className="relative z-10 flex-1 overflow-hidden rounded-lg">
                <AnimateElement
                  type="slideUp"
                  delay={0.4}
                  className="mt-auto h-full"
                >
                  <Image
                    src={getAssetPath(`/images/foundation-${index + 1}.svg`)}
                    alt={feature.title}
                    width={411}
                    height={285}
                    className="z-10 mt-auto h-full w-full object-cover"
                  />
                </AnimateElement>
              </div>
              {index === 1 && (
                <div className="absolute left-1/2 top-2/3 z-0 h-[75px] w-[250px] -translate-x-1/2 -translate-y-1/2 bg-[#3DA7FF66] blur-[100px]"></div>
              )}
            </div>
          ))}
        </div>
      </AnimateElement>

      <div className="mt-[140px] flex flex-col gap-16">
        {features2.map((feature, index) => (
          <AnimateElement
            key={index}
            className={cn(
              'flex flex-col-reverse gap-16 text-center lg:flex-row lg:text-right',
              index === 1 && 'lg:flex-row-reverse lg:text-left',
            )}
            type="slideUp"
            delay={[0.2, 0.3, 0.4][index]}
          >
            <MagicCard
              gradientColor="#9ADFFF66"
              gradientSize={300}
              className="relative basis-1/2 rounded border border-dashed border-[#9DCBE6] bg-transparent"
            >
              <Image
                src={getAssetPath(feature.image)}
                alt={feature.title}
                fill
              />
            </MagicCard>
            <div className="flex basis-1/2 flex-col justify-center">
              <h3 className="mb-5 text-base font-bold sm:text-[28px]">
                {feature.title}
              </h3>
              <p className="text-xs font-medium text-custom-secondary-text sm:text-base">
                {feature.description}
              </p>
            </div>
          </AnimateElement>
        ))}
      </div>

      <AnimateElement type="slideUp">
        <div className="mt-[200px] text-center text-base font-bold text-black sm:text-4xl">
          即时开发环境
        </div>
        <div className="mt-16 flex flex-wrap items-center gap-10 rounded border border-dashed border-[#9DCBE6] px-2 py-9 lg:px-20">
          {performanceStats.map((stat, index) => (
            <div key={index} className="flex flex-1 items-center gap-4">
              <div className="h-[37px] w-[37px] flex-shrink-0 lg:h-[80px] lg:w-[80px]">
                <Image
                  src={getAssetPath(stat.icon)}
                  alt={stat.description}
                  width={80}
                  height={80}
                />
              </div>
              <div className="flex flex-col">
                <div className="text-[12px] font-bold text-black lg:text-[28px]">
                  {stat.percentage}
                </div>
                <div className="text-nowrap text-[6px] font-medium text-custom-secondary-text lg:text-sm">
                  {stat.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </AnimateElement>
    </div>
  );
}
