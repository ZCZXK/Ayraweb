import type { Metadata } from 'next'
import { LegalPage } from '@/components/legal-page'

const CANONICAL_URL = 'https://cookies.ayrabot.fun/'
const DESCRIPTION = 'Information about Google AdSense, advertising cookies, third-party ad technology providers, and user controls on the Ayra website.'

export const metadata: Metadata = {
  title: 'Cookies & Advertising — Ayra Website',
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL_URL },
  openGraph: {
    type: 'article',
    url: CANONICAL_URL,
    siteName: 'Ayra',
    title: 'Cookies & Advertising — Ayra Website',
    description: DESCRIPTION,
  },
  twitter: { card: 'summary', title: 'Cookies & Advertising — Ayra Website', description: DESCRIPTION },
}

export default function CookiesPage() {
  return (
    <LegalPage title="Cookies & Advertising" eyebrow="AYRA WEBSITE · COOKIES">
      <section>
        <h2>Google advertising code</h2>
        <p>The Ayra website includes Google AdSense code. When advertising is served, Google and other third-party ad technology providers may use cookies or similar identifiers to deliver, measure, and limit ads. Depending on provider settings and applicable consent choices, ads may be based on your visit to this or other websites. The code being present does not mean that an ad placement or advertisement is currently displayed.</p>
      </section>
      <section>
        <h2>Providers and controls</h2>
        <p>Google's <a href="https://support.google.com/adsense/answer/9012903?hl=en" target="_blank" rel="noopener noreferrer">AdSense ad technology provider list</a> describes potential advertising partners. You can manage Google personalized advertising through <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer">Google Ads Settings</a> and opt out of some third-party personalized advertising through <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">aboutads.info choices</a>. Google also explains its advertising technologies and controls in its <a href="https://policies.google.com/technologies/ads?hl=en" target="_blank" rel="noopener noreferrer">advertising privacy information</a>.</p>
      </section>
      <section>
        <h2>Consent and regional requirements</h2>
        <p>This notice is information, not a consent-management tool. Google says publishers serving personalized ads to people in the EEA, UK, or Switzerland must use a Google-certified consent management platform integrated with the IAB Transparency and Consent Framework. See Google's current <a href="https://support.google.com/adsense/answer/13554116?hl=en" target="_blank" rel="noopener noreferrer">publisher CMP requirements</a>. This site does not claim that a CMP or consent setup is configured.</p>
      </section>
      <section>
        <h2>Ayra privacy policy</h2>
        <p>For information about data processed by the Ayra Discord bot and website, read the separate <a href="https://policy.ayrabot.fun/">Ayra Privacy Policy</a>. For use of the bot, see the <a href="https://terms.ayrabot.fun/">Terms of Service</a>.</p>
      </section>
    </LegalPage>
  )
}
