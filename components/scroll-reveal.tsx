'use client'

import { useEffect } from 'react'

export function ScrollRevealObserver() {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion || !('IntersectionObserver' in window)) return

    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    if (targets.length === 0) return

    const root = document.documentElement
    root.classList.add('has-scroll-animations')

    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        currentObserver.unobserve(entry.target)
      })
    }, { threshold: 0.08, rootMargin: '0px 0px -7% 0px' })

    targets.forEach((target) => {
      const delay = Number.parseInt(target.dataset.revealDelay ?? '0', 10)
      target.style.setProperty('--reveal-delay', `${Number.isFinite(delay) ? delay : 0}ms`)
      observer.observe(target)
    })

    return () => {
      observer.disconnect()
      root.classList.remove('has-scroll-animations')
    }
  }, [])

  return null
}
