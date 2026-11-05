import { authCopy, type AuthLocale } from './authCopy';

export interface InvitationEmailProps {
  locale?: AuthLocale;
  /** `invite` is the first letter; `newLink` is the one sent after "Forgot password". */
  kind?: 'invite' | 'newLink';
  otp?: string;
  loginUrl?: string;
}

/**
 * The letter, built the way mail clients need it: tables, inline styles,
 * system fallbacks for the site's faces (Noto Serif → Georgia, IBM Plex Mono →
 * Courier New), 600px wide, black on white with the site's blue and yellow.
 * It carries no images, so nothing is blocked and nothing needs hosting.
 */
const INK = '#000000';
const MUTED = '#4d4d4d';
const SERIF = "'Noto Serif', Georgia, 'Times New Roman', serif";
const MONO = "'IBM Plex Mono', 'Courier New', Courier, monospace";

export function InvitationEmail({
  locale = 'en',
  kind = 'newLink',
  otp = 'K7R2-91QX-M4TD',
  loginUrl = 'https://scienceatrisk.org/first-login',
}: InvitationEmailProps) {
  const e = authCopy[locale].email;
  const invite = kind === 'invite';
  const lead = invite ? e.inviteLead : e.newLinkLead;
  const preheader = invite ? e.preheaderInvite : e.preheaderNewLink;

  return (
    <table
      role="presentation"
      width="100%"
      cellPadding={0}
      cellSpacing={0}
      border={0}
      style={{ background: '#ffffff', margin: 0, padding: 0 }}
    >
      <tbody>
        <tr>
          <td align="center" style={{ padding: '24px 12px' }}>
            {/* Preheader: the line the inbox shows beside the subject. */}
            <div
              style={{
                display: 'none',
                maxHeight: 0,
                overflow: 'hidden',
                opacity: 0,
                fontSize: 1,
                lineHeight: '1px',
                color: '#ffffff',
              }}
            >
              {preheader}
            </div>
            <table
              role="presentation"
              width="600"
              cellPadding={0}
              cellSpacing={0}
              border={0}
              style={{ width: '100%', maxWidth: 600, background: '#ffffff' }}
            >
              <tbody>
                <tr>
                  <td style={{ padding: '8px 0 24px', borderBottom: `2px solid ${INK}` }}>
                    <span
                      style={{
                        fontFamily: SERIF,
                        fontSize: 24,
                        lineHeight: '28px',
                        letterSpacing: '-0.36px',
                        color: INK,
                      }}
                    >
                      SC!ENCE AT R!SK!
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '32px 0 8px', fontFamily: MONO, fontSize: 16, lineHeight: '26px', color: INK }}>
                    <p style={{ margin: '0 0 16px', fontFamily: SERIF, fontSize: 28, lineHeight: '34px', color: INK }}>
                      {e.greeting}
                    </p>
                    <p style={{ margin: '0 0 24px' }}>{lead}</p>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '0 0 24px' }}>
                    <table
                      role="presentation"
                      width="100%"
                      cellPadding={0}
                      cellSpacing={0}
                      border={0}
                      style={{ background: '#b5c6cd' }}
                    >
                      <tbody>
                        <tr>
                          <td style={{ padding: '20px 24px', fontFamily: MONO, color: INK }}>
                            <div style={{ fontSize: 14, lineHeight: '20px', color: INK }}>{e.otpLabel}</div>
                            <div
                              style={{
                                marginTop: 6,
                                fontSize: 28,
                                lineHeight: '36px',
                                letterSpacing: '1px',
                                fontWeight: 700,
                                color: INK,
                              }}
                            >
                              {otp}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '0 0 24px', fontFamily: MONO, fontSize: 16, lineHeight: '26px', color: INK }}>
                    <ol style={{ margin: 0, padding: '0 0 0 22px' }}>
                      {e.steps.map((step) => (
                        <li key={step} style={{ margin: '0 0 4px' }}>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '0 0 16px' }}>
                    {/* A bulletproof button: a padded cell, not an image. */}
                    <table role="presentation" cellPadding={0} cellSpacing={0} border={0}>
                      <tbody>
                        <tr>
                          <td style={{ background: INK, borderRadius: 15 }}>
                            <a
                              href={loginUrl}
                              style={{
                                display: 'inline-block',
                                padding: '14px 32px',
                                fontFamily: MONO,
                                fontSize: 18,
                                lineHeight: '24px',
                                letterSpacing: '-0.5px',
                                color: '#ffffff',
                                textDecoration: 'none',
                              }}
                            >
                              {e.cta}
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '0 0 32px', fontFamily: MONO, fontSize: 14, lineHeight: '22px', color: MUTED }}>
                    <p style={{ margin: '0 0 12px' }}>{e.expiry}</p>
                    <p style={{ margin: 0 }}>
                      {e.linkFallback}
                      <br />
                      <a href={loginUrl} style={{ color: INK, wordBreak: 'break-all' }}>
                        {loginUrl}
                      </a>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: '24px 0 0',
                      borderTop: `1px solid ${INK}`,
                      fontFamily: MONO,
                      fontSize: 14,
                      lineHeight: '22px',
                      color: MUTED,
                    }}
                  >
                    <p style={{ margin: '0 0 16px' }}>{e.notYou}</p>
                    <p style={{ margin: '0 0 16px', color: INK }}>{e.signature}</p>
                    <p style={{ margin: 0, fontSize: 12, lineHeight: '18px' }}>{e.footer}</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default InvitationEmail;
