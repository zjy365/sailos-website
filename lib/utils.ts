import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getAssetPath = (path: string) => {
  const baseUrl =
    process.env.NODE_ENV === 'production'
      ? 'https://ads.sealos.run/app_store/tool/devbox'
      : '';
  const fullPath = `${baseUrl}${path}`;
  return fullPath;
};
