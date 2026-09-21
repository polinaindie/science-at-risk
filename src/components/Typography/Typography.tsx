import {
  formatTypographySpec,
  typographyTokens,
  type TypographyBreakpoint,
  type TypographyToken,
} from '@/tokens/typography';

export interface TypographyProps {
  /** Sample string rendered for each style */
  sampleText?: string;
  /** Which columns to show */
  columns?: TypographyBreakpoint[] | 'both';
}

function SpecLabel({ token, breakpoint }: { token: TypographyToken; breakpoint: TypographyBreakpoint }) {
  return (
    <p className="mt-2 font-ukraine text-[18px] font-light leading-normal text-brand-muted">
      {formatTypographySpec(token, breakpoint)}
    </p>
  );
}

function TypographyColumn({
  title,
  breakpoint,
  sampleText,
}: {
  title: string;
  breakpoint: TypographyBreakpoint;
  sampleText: string;
}) {
  return (
    <section className="flex w-full max-w-[398px] flex-col gap-10" aria-labelledby={`typo-${breakpoint}`}>
      <h2
        id={`typo-${breakpoint}`}
        className="font-ukraine text-[18px] font-light leading-normal text-brand-muted"
      >
        {title}
      </h2>
      <ul className="flex list-none flex-col gap-10 p-0">
        {typographyTokens.map((token) => (
          <li key={`${breakpoint}-${token.id}`}>
            <p className={`text-brand-black ${token.className[breakpoint]}`}>
              {sampleText || token.label}
            </p>
            <SpecLabel token={token} breakpoint={breakpoint} />
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * Figma typography scale (node 292:1454) — Desktop and Mobile columns.
 */
export function Typography({
  sampleText = '',
  columns = 'both',
}: TypographyProps) {
  const showDesktop = columns === 'both' || columns.includes('desktop');
  const showMobile = columns === 'both' || columns.includes('mobile');

  return (
    <div
      className="flex flex-col gap-16 bg-brand-white p-8 text-brand-black md:flex-row md:gap-24"
      data-node-id="292:1454"
    >
      {showDesktop ? (
        <TypographyColumn title="Desktop" breakpoint="desktop" sampleText={sampleText} />
      ) : null}
      {showMobile ? (
        <TypographyColumn title="Mobile" breakpoint="mobile" sampleText={sampleText} />
      ) : null}
    </div>
  );
}

export default Typography;
