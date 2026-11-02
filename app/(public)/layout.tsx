import type { ReactNode } from 'react'
import AdSenseLoader from '../../components/adsense-loader'

export default function PublicLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      {children}
      <AdSenseLoader />
    </>
  )
}
