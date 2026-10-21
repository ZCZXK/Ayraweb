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

    const observedTargets = new WeakSet<HTMLElement>()
    const observeTarget = (target: HTMLElement) => {
      if (observedTargets.has(target)) return
      observedTargets.add(target)
      const delay = Number.parseInt(target.dataset.revealDelay ?? '0', 10)
      target.style.setProperty('--reveal-delay', `${Number.isFinite(delay) ? delay : 0}ms`)
      observer.observe(target)
    }
    targets.forEach(observeTarget)

    const mutationObserver = new MutationObserver((records) => {
      records.forEach(({ addedNodes }) => {
        addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return
          if (node.matches('[data-reveal]')) observeTarget(node)
          node.querySelectorAll<HTMLElement>('[data-reveal]').forEach(observeTarget)
        })
      })
    })
    mutationObserver.observe(document.body, { childList: true, subtree: true })

    return () => {
      mutationObserver.disconnect()
      observer.disconnect()
      root.classList.remove('has-scroll-animations')
    }
  }, [])

  return null
}
