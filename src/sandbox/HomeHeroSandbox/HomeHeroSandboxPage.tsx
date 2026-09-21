import {
  HomeHeroSandbox,
  type HomeHeroSandboxProps,
} from './HomeHeroSandbox';

export interface HomeHeroSandboxPageProps extends HomeHeroSandboxProps {
  locale?: string;
}

/** Full-screen sandbox — hero only, no site header for now (matches Figma Main frame). */
export function HomeHeroSandboxPage({
  locale = 'EN',
  ...heroProps
}: HomeHeroSandboxPageProps) {
  return (
    <div className="flex min-h-[100svh] flex-col bg-brand-white">
      <HomeHeroSandbox locale={locale} {...heroProps} />
    </div>
  );
}

export default HomeHeroSandboxPage;
