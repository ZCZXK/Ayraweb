'use client'

import { useEffect, useRef } from 'react'

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
  phase: number
  color: string
}

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const pointer = { x: 0, y: 0, active: false }
    let width = 0
    let height = 0
    let pixelRatio = 1
    let frame = 0
    let lastFrame = 0
    let particles: Particle[] = []

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.round(width * pixelRatio)
      canvas.height = Math.round(height * pixelRatio)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)

      const count = Math.min(78, Math.max(18, Math.floor((width * height) / 24000)))
      const colors = ['200,255,224', '216,197,255', '146,225,255']
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        radius: 0.8 + Math.random() * 1.3,
        opacity: 0.22 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
      }))
    }

    const draw = (time: number) => {
      frame = 0
      const step = lastFrame ? Math.min((time - lastFrame) / 16.67, 2) : 1
      lastFrame = time
      context.clearRect(0, 0, width, height)

      for (const particle of particles) {
        if (!motionPreference.matches) {
          particle.x += particle.vx * step
          particle.y += particle.vy * step
          if (particle.x < -4) particle.x = width + 4
          if (particle.x > width + 4) particle.x = -4
          if (particle.y < -4) particle.y = height + 4
          if (particle.y > height + 4) particle.y = -4
        }

        if (pointer.active && !motionPreference.matches) {
          const dx = particle.x - pointer.x
          const dy = particle.y - pointer.y
          const distance = Math.hypot(dx, dy)
          if (distance > 0 && distance < 170) {
            const proximity = 1 - distance / 170
            const force = proximity * 0.52 * step
            particle.x += (dx / distance) * force
            particle.y += (dy / distance) * force
            context.beginPath()
            context.moveTo(particle.x, particle.y)
            context.lineTo(pointer.x, pointer.y)
            context.strokeStyle = `rgba(${particle.color},${proximity * 0.2})`
            context.lineWidth = 0.7
            context.stroke()
          }
        }

        const twinkle = motionPreference.matches ? 1 : 0.72 + Math.sin(time * 0.001 + particle.phase) * 0.28
        context.beginPath()
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        context.fillStyle = `rgba(${particle.color},${particle.opacity * twinkle})`
        context.fill()
      }

      if (!motionPreference.matches) frame = window.requestAnimationFrame(draw)
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (motionPreference.matches) return
      pointer.x = event.clientX
      pointer.y = event.clientY
      pointer.active = true
    }

    const handleBlur = () => { pointer.active = false }
    const handleResize = () => {
      if (frame) window.cancelAnimationFrame(frame)
      resize()
      lastFrame = 0
      draw(performance.now())
    }
    const handleMotionChange = () => {
      if (frame) window.cancelAnimationFrame(frame)
      pointer.active = false
      lastFrame = 0
      draw(performance.now())
    }

    resize()
    draw(performance.now())
    window.addEventListener('resize', handleResize, { passive: true })
    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('blur', handleBlur)
    motionPreference.addEventListener('change', handleMotionChange)

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('blur', handleBlur)
      motionPreference.removeEventListener('change', handleMotionChange)
    }
  }, [])

  return <canvas ref={canvasRef} className="particle-field" aria-hidden="true" />
}
