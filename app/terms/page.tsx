import type { Metadata } from 'next'
import { LegalPage } from '../../components/legal-page'

export const metadata: Metadata = {
  title: 'Terms of Service — Ayra',
  description: 'Terms for using the Ayra Discord bot.',
}

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service">
      <section>
        <h2>Using Ayra</h2>
        <p>By inviting or using Ayra, you agree to these terms and to Discord’s Terms of Service and Community Guidelines. Use Ayra lawfully and do not use it to spam, harass, disrupt, or violate another person’s rights.</p>
      </section>
      <section>
        <h2>Server responsibility</h2>
        <p>Server administrators are responsible for Ayra’s permissions, configuration, and the channels where tickets or moderation logs appear. Administrators remain responsible for moderation decisions made in their server.</p>
      </section>
      <section>
        <h2>Availability</h2>
        <p>Ayra is provided as available. Features may change, pause, or end, and uninterrupted service is not guaranteed. You can remove Ayra from your server at any time.</p>
      </section>
      <section>
        <h2>Contact</h2>
        <p>Questions about these terms? Contact us through the <a href="https://discord.gg/GEPmvs57Yx" target="_blank" rel="noopener noreferrer">Ayra support server</a>.</p>
      </section>
    </LegalPage>
  )
}
