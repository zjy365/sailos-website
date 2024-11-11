'use client';
import React, { useCallback, useState } from 'react';
import { AnimateElement } from '../ui/animated-wrapper';
import Image from 'next/image';
import { getAssetPath } from '@/lib/utils';

const mockData = {
  流行: [
    { name: 'Node.js', language: 'JavaScript', icon: '/icons/node.js.svg' },
    { name: 'Python', language: 'Python', icon: '/icons/python.svg' },
    { name: 'Ruby', language: 'Ruby', icon: '/icons/ruby.png' },
    { name: 'Java', language: 'Java', icon: '/icons/java.svg' },
    { name: 'Go', language: 'Go', icon: '/icons/go.svg' },
    { name: 'PHP', language: 'PHP', icon: '/icons/php.svg' },
  ],
  后端: [
    { name: 'Echo', language: 'JavaScript', icon: '/icons/echo.svg' },
    { name: 'Chi', language: 'JavaScript', icon: '/icons/chi.svg' },
    { name: 'Iris', language: 'TypeScript', icon: '/icons/iris.svg' },
    { name: 'Gin', language: 'Go', icon: '/icons/gin.svg' },
    { name: 'vert.x', language: 'Go', icon: '/icons/vert.x.svg' },
    { name: 'Spring Boot', language: 'Java', icon: '/icons/spring-boot.svg' },
    { name: 'Django', language: 'Python', icon: '/icons/django.svg' },
    { name: 'Flask', language: 'Python', icon: '/icons/flask.svg' },
    { name: 'Rocket', language: 'Rust', icon: '/icons/rocket.svg' },
    {
      name: 'Express.js',
      language: 'JavaScript',
      icon: '/icons/express.js.svg',
    },
  ],
  前端: [
    { name: 'Next.js', language: 'JavaScript', icon: '/icons/next.js.svg' },
    { name: 'React', language: 'JavaScript', icon: '/icons/react.svg' },
    { name: 'Vue', language: 'JavaScript', icon: '/icons/vue.svg' },
    { name: 'Angular', language: 'JavaScript', icon: '/icons/angular.svg' },
    { name: 'nuxt3', language: 'JavaScript', icon: '/icons/nuxt3.svg' },
    { name: 'Umi', language: 'JavaScript', icon: '/icons/umi.svg' },
    { name: 'SvelteKit', language: 'JavaScript', icon: '/icons/svelte.svg' },
  ],
  文档博客: [
    {
      name: 'Docusaurus',
      language: 'JavaScript',
      icon: '/icons/docusaurus.svg',
    },
    { name: 'VuePress', language: 'JavaScript', icon: '/icons/vuepress.svg' },
    { name: 'Gatsby', language: 'JavaScript', icon: '/icons/gatsby.svg' },
    { name: 'Hugo', language: 'Go', icon: '/icons/hugo.svg' },
    { name: 'Jekyll', language: 'Ruby', icon: '/icons/jekyll.png' },
    { name: 'Reveal.js', language: 'JavaScript', icon: '/icons/reveal.js.svg' },
  ],
  原生语言: [
    { name: 'C++', language: 'C++', icon: '/icons/c++.svg' },
    { name: 'Rust', language: 'Rust', icon: '/icons/rust.svg' },
    { name: 'Go', language: 'Go', icon: '/icons/go.svg' },
    { name: 'Java', language: 'Java', icon: '/icons/java.svg' },
    { name: 'C#', language: 'C#', icon: '/icons/csharp.svg' },
    { name: 'Kotlin', language: 'Kotlin', icon: '/icons/kotlin.svg' },
  ],
};

export default function TechGrid() {
  const [activeTab, setActiveTab] = useState('后端');

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  return (
    <div className="mt-0 lg:mt-52">
      <AnimateElement type="slideUp">
        <div className="mb-6 text-center text-base font-bold text-black sm:mb-16 sm:text-4xl">
          在几秒钟内启动可共享环境
        </div>

        {/* Tabs */}
        <div className="mb-9 flex flex-wrap justify-center gap-4 text-sm font-medium sm:text-base">
          {Object.keys(mockData).map((tab) => (
            <button
              key={tab}
              className={`rounded-md px-2 py-1 ${
                activeTab === tab
                  ? 'rounded-md bg-[#FAFCFF] text-black'
                  : 'text-custom-secondary-text hover:bg-[#FAFCFF]/80'
              }`}
              style={{
                boxShadow:
                  activeTab === tab
                    ? '0px 4px 4px 0px rgba(19, 51, 107, 0.05), 0px 0px 1px 0px rgba(19, 51, 107, 0.08)'
                    : '',
              }}
              onClick={() => handleTabChange(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {mockData[activeTab as keyof typeof mockData].map((tech) => (
            <div
              key={tech.name}
              className="flex gap-4 rounded-lg bg-white px-6 py-5"
              style={{
                boxShadow:
                  '0px 12px 40px -25px rgba(6, 26, 65, 0.20), 0px 0px 1px 0px rgba(19, 51, 107, 0.20)',
              }}
            >
              <div className="relative flex size-7 items-center justify-center text-4xl lg:size-10">
                <Image
                  src={getAssetPath(tech.icon)}
                  alt={tech.name}
                  fill
                  className="size-7 lg:size-10"
                />
              </div>
              <div className="flex items-center justify-center">
                <h3 className="text-xs font-medium text-black lg:text-lg">
                  {tech.name}
                </h3>
                {/* <p className="text-[8px] text-custom-secondary-text lg:text-xs">
                  {tech.language}
                </p> */}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-14 flex justify-center">
          <div
            className="max-w-[760px] rounded-[46px] border border-solid border-[#ABE1FF] px-4 py-3 text-center text-xs font-medium text-custom-secondary-text md:text-sm"
            style={{
              background:
                'linear-gradient(90deg, rgba(170, 229, 255, 0.30) 0%, rgba(170, 229, 255, 0.20) 100%)',
            }}
          >
            支持可以在 Linux
            平台上运行的所有编程语言和框架，并支持快速安装不常用的编程语言
          </div>
        </div>
      </AnimateElement>
    </div>
  );
}
