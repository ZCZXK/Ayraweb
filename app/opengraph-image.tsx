import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Ayra — Discord bot for moderation, tickets, and community tools'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

function toDataUri(bytes: Uint8Array, mediaType: string) {
  let binary = ''
  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000))
  }
  return `data:${mediaType};base64,${btoa(binary)}`
}

export default async function OpenGraphImage() {
  const [logoResponse, auroraResponse] = await Promise.all([
    fetch('https://ayrabot.fun/bot-icon.png'),
    fetch('https://ayrabot.fun/aurora-bg.jpg'),
  ])
  if (!logoResponse.ok || !auroraResponse.ok) {
    throw new Error('Unable to load Ayra assets for the social preview.')
  }

  const [logoBytes, auroraBytes] = await Promise.all([
    logoResponse.arrayBuffer(),
    auroraResponse.arrayBuffer(),
  ])
  const logo = toDataUri(new Uint8Array(logoBytes), 'image/png')
  const aurora = toDataUri(new Uint8Array(auroraBytes), 'image/jpeg')

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          color: '#f4f7f5',
          background: '#070a0c',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <img src={aurora} width={1200} height={630} style={{ position: 'absolute', inset: 0, objectFit: 'cover', opacity: 0.62 }} />
        <div style={{ display: 'flex', position: 'absolute', inset: 0, backgroundColor: 'rgba(4, 7, 10, .28)' }} />
        <div style={{ display: 'flex', position: 'absolute', top: 0, bottom: 0, left: 0, width: 690, backgroundColor: 'rgba(4, 7, 10, .56)' }} />
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            left: 68,
            top: 62,
            alignItems: 'center',
            gap: 12,
            color: 'rgba(225, 239, 232, .86)',
            fontSize: 17,
            fontWeight: 600,
            letterSpacing: 5,
          }}
        >
          <div style={{ width: 34, height: 2, flexShrink: 0, backgroundColor: '#9df2c4' }} />
          DISCORD BOT
        </div>
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            left: 68,
            top: 172,
            flexDirection: 'column',
            gap: 24,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', fontSize: 102, fontWeight: 700, letterSpacing: -5 }}>
            Ayra<span style={{ color: '#a3f3c7' }}>.</span>
          </div>
          <div style={{ maxWidth: 570, color: 'rgba(245, 248, 246, .92)', fontSize: 29, lineHeight: 1.4 }}>
            Moderation, tickets, and community tools.
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            top: 122,
            right: 92,
            width: 336,
            height: 336,
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(228, 255, 240, .3)',
            borderRadius: 76,
            background: 'linear-gradient(145deg, rgba(255,255,255,.17), rgba(255,255,255,.055) 62%, rgba(135,255,199,.14))',
            boxShadow: '0 30px 90px rgba(0,0,0,.34)',
          }}
        >
          <img src={logo} width={270} height={270} style={{ borderRadius: 54, objectFit: 'cover' }} />
        </div>
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            left: 68,
            bottom: 50,
            color: 'rgba(236, 245, 240, .8)',
            fontSize: 15,
            letterSpacing: 4,
          }}
        >
          AYRABOT.FUN
        </div>
      </div>
    ),
    { ...size },
  )
}
