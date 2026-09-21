import { colorTokens, type ColorToken } from '@/tokens/colors';

function ColorSwatch({ token }: { token: ColorToken }) {
  return (
    <li className="flex w-full max-w-[319px] flex-col gap-4">
      <div
        className={`aspect-square w-full ${token.swatchClass} ${
          token.bordered ? 'border border-solid border-brand-black' : ''
        }`}
        role="img"
        aria-label={`${token.hex}, ${token.usage}`}
        data-node-id={token.nodeId}
      />
      <div className="flex flex-col gap-1">
        <p className="font-mono text-h3-desktop text-brand-black">{token.hex}</p>
        <p className="font-ukraine text-[18px] font-light leading-normal text-brand-muted">
          {token.usage}
        </p>
      </div>
    </li>
  );
}

/**
 * Brand color palette from Figma node 292:1481.
 */
export function Colors() {
  return (
    <div
      className="bg-brand-white p-8 text-brand-black md:p-12"
      data-node-id="292:1481"
      data-name="colors"
    >
      <ul className="m-0 flex list-none flex-col gap-10 p-0 sm:flex-row sm:flex-wrap sm:gap-8 lg:gap-10">
        {colorTokens.map((token) => (
          <ColorSwatch key={token.id} token={token} />
        ))}
      </ul>
    </div>
  );
}

export default Colors;
