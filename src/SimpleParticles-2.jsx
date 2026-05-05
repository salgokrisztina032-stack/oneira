import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

// Small, performant point-cloud variant — floating landscape-style particle field
export default function SimpleParticles({ pulse = 0, color = 0xeee6e3 }) {
  const mountRef = useRef(null)
  // Keep pulse and color in refs so the animation loop always reads latest values
  // without needing to tear down and recreate the whole scene
  const pulseRef = useRef(pulse)
  const colorRef = useRef(color)
  const materialRef = useRef(null)

  // Sync pulse + color into refs whenever props change
  useEffect(() => {
    pulseRef.current = pulse
  }, [pulse])

  useEffect(() => {
    colorRef.current = color
    // Also update the live material if it exists
    if (materialRef.current) {
      materialRef.current.color.set(color)
    }
  }, [color])

  useEffect(() => {
    const el = mountRef.current
    if (!el) return

    const W = el.clientWidth || window.innerWidth
    const H = el.clientHeight || window.innerHeight

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W, H)
    renderer.domElement.style.position = 'absolute'
    renderer.domElement.style.inset = '0'
    el.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 500)
    camera.position.set(0, 0, 15)

    // Soft glowing sprite for each point
    const sprite = document.createElement('canvas')
    sprite.width = 80
    sprite.height = 80
    const ctx = sprite.getContext('2d')
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    g.addColorStop(0,   'rgba(255,255,255,0.5)')
    g.addColorStop(0.2, 'rgba(255,255,255,0.9)')
    g.addColorStop(0.6, 'rgba(255,255,255,0.2)')
    g.addColorStop(1,   'rgba(255,255,255,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 64, 64)
    const tex = new THREE.CanvasTexture(sprite)
    tex.minFilter = THREE.LinearFilter

    const material = new THREE.PointsMaterial({
      size: 0.20,
      map: tex,
      transparent: true,
      depthWrite: false,
      color: new THREE.Color(colorRef.current),
    })
    // Store reference so color updates can reach it
    materialRef.current = material

    // Landscape-shaped particle field — wider in x, shallow in y, moderate depth
    const count = 8000
    const positions = new Float32Array(count * 3)
    const phases    = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const x = (Math.random() * 2 - 1) * 22          // wide spread
      const z = (Math.random() * 2 - 1) * 7           // moderate depth
      // Base height follows a gentle terrain so the cloud looks like a landscape
      const baseY =
        Math.sin(x * 0.14) * 2.2 +
        Math.sin(z * 0.28) * 1.4 +
        (Math.random() - 0.5) * 3.5                   // some vertical scatter
      positions[i * 3 + 0] = x
      positions[i * 3 + 1] = baseY - 4               // centre the mass slightly below horizon
      positions[i * 3 + 2] = z
      phases[i] = Math.random() * Math.PI * 2
    }

    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const points = new THREE.Points(geom, material)
    scene.add(points)

    let t = 0
    let raf

    function animate() {
      raf = requestAnimationFrame(animate)
      t += 0.007

      const pulse = pulseRef.current || 0
      const arr = geom.getAttribute('position').array

      for (let i = 0; i < count; i++) {
        const i3 = i * 3
        const x  = arr[i3]
        const z  = arr[i3 + 2]

        // Target height: slow wave across the landscape surface
        const targetY =
          Math.sin(x * 0.13 + t * 0.85 + phases[i]) * 2.0 +
          Math.sin(z * 0.30 - t * 0.50 + phases[i] * 0.7) * 1.2 +
          Math.sin((x + z) * 0.09 + t * 0.40) * 1.5 -
          4 // keep centred below horizon

        // Spring toward target — pulse increases stiffness for a gentle swell effect
        const dy = (targetY - arr[i3 + 1]) * 0.032 * (1 + pulse * 1.1)
        arr[i3 + 1] += dy * 0.88

        // Subtle lateral drift for organic feel
        arr[i3]     += Math.sin(z * 0.04 + t * 0.55 + phases[i]) * 0.0012 * (1 + pulse * 1.0)
        arr[i3 + 2] += Math.cos(x * 0.04 + t * 0.45 + phases[i]) * 0.0008

        // Soft boundary — nudge particles back if they drift too far
        if (arr[i3]     >  24) arr[i3]     -= 0.09
        if (arr[i3]     < -24) arr[i3]     += 0.09
        if (arr[i3 + 2] >   9) arr[i3 + 2] -= 0.03
        if (arr[i3 + 2] <  -9) arr[i3 + 2] += 0.03
      }

      geom.getAttribute('position').needsUpdate = true
      renderer.render(scene, camera)
    }

    animate()

    const onResize = () => {
      const nW = el.clientWidth
      const nH = el.clientHeight
      camera.aspect = nW / nH
      camera.updateProjectionMatrix()
      renderer.setSize(nW, nH)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      geom.dispose()
      material.dispose()
      tex.dispose()
      renderer.dispose()
      materialRef.current = null
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
    }
  }, []) // scene only created once — pulse/color kept in sync via refs above

  return (
    <div
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    >
      <div
        ref={mountRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />
    </div>
  )
}
