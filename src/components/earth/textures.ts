export function createProceduralEarthTexture(): HTMLCanvasElement {
  const canvas = document.createElement("canvas")
  canvas.width = 1024
  canvas.height = 512
  const ctx = canvas.getContext("2d")!
  const w = canvas.width
  const h = canvas.height

  // Deep ocean base
  ctx.fillStyle = "#1a3d6b"
  ctx.fillRect(0, 0, w, h)

  // Add subtle ocean variation
  for (let i = 0; i < 30; i++) {
    const x = Math.random() * w
    const y = Math.random() * h
    const rx = 50 + Math.random() * 200
    const ry = 20 + Math.random() * 80
    ctx.beginPath()
    ctx.ellipse(x, y, rx, ry, Math.random() * Math.PI, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(20, 50, 90, ${0.1 + Math.random() * 0.2})`
    ctx.fill()
  }

  // Continent shapes
  const continents = [
    // North America
    { x: 0.2, y: 0.35, points: [[0,0],[0.06,-0.08],[0.12,-0.06],[0.16,0],[0.14,0.06],[0.1,0.1],[0.04,0.08],[0,0.04]] },
    // South America
    { x: 0.28, y: 0.55, points: [[0,0],[0.04,-0.06],[0.08,-0.04],[0.08,0.02],[0.06,0.08],[0.02,0.1],[0,0.06]] },
    // Europe
    { x: 0.47, y: 0.32, points: [[0,0],[0.04,-0.04],[0.08,-0.02],[0.08,0.02],[0.04,0.04],[0,0.03]] },
    // Africa
    { x: 0.48, y: 0.48, points: [[0,0],[0.04,-0.06],[0.08,-0.04],[0.1,0],[0.08,0.06],[0.04,0.1],[0,0.08]] },
    // Asia
    { x: 0.6, y: 0.3, points: [[0,0],[0.06,-0.06],[0.14,-0.08],[0.2,-0.04],[0.22,0.02],[0.18,0.08],[0.1,0.1],[0.04,0.06]] },
    // Australia
    { x: 0.8, y: 0.6, points: [[0,0],[0.05,-0.03],[0.08,0],[0.06,0.04],[0.02,0.05]] },
    // India
    { x: 0.63, y: 0.42, points: [[0,0],[0.03,-0.04],[0.05,-0.02],[0.05,0.02],[0.02,0.04]] },
  ]

  for (const cont of continents) {
    const cx = cont.x * w
    const cy = cont.y * h

    // Main landmass
    ctx.beginPath()
    const pts = cont.points
    ctx.moveTo(cx + pts[0][0] * w, cy + pts[0][1] * w)
    for (let i = 1; i < pts.length; i++) {
      ctx.lineTo(cx + pts[i][0] * w, cy + pts[i][1] * w)
    }
    ctx.closePath()
    const green = 50 + Math.floor(Math.random() * 60)
    ctx.fillStyle = `rgb(25, ${green}, 25)`
    ctx.fill()

    // Add some terrain variation
    const bound = ctx.getImageData(
      Math.max(0, cx - 0.12 * w),
      Math.max(0, cy - 0.12 * w),
      Math.min(w, 0.24 * w),
      Math.min(h, 0.24 * w)
    )
    for (let i = 0; i < 80; i++) {
      const tx = cx + (Math.random() - 0.5) * 0.2 * w
      const ty = cy + (Math.random() - 0.5) * 0.2 * w
      if (ctx.isPointInPath(tx, ty)) {
        ctx.fillStyle = `rgba(40, ${80 + Math.floor(Math.random() * 60)}, 30, ${0.3 + Math.random() * 0.4})`
        ctx.beginPath()
        ctx.arc(tx, ty, 3 + Math.random() * 12, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }

  // Desert areas
  for (let i = 0; i < 15; i++) {
    const x = (0.4 + Math.random() * 0.2) * w
    const y = (0.42 + Math.random() * 0.12) * h
    ctx.beginPath()
    ctx.ellipse(x, y, 15 + Math.random() * 40, 8 + Math.random() * 20, 0, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(180, 160, 100, ${0.2 + Math.random() * 0.3})`
    ctx.fill()
  }

  // Ice caps
  ctx.fillStyle = "rgba(220, 230, 240, 0.5)"
  ctx.fillRect(0, 0, w, h * 0.05)
  ctx.fillRect(0, h * 0.93, w, h * 0.07)

  return canvas
}

export function createProceduralNightTexture(): HTMLCanvasElement {
  const canvas = document.createElement("canvas")
  canvas.width = 1024
  canvas.height = 512
  const ctx = canvas.getContext("2d")!
  const w = canvas.width
  const h = canvas.height

  ctx.fillStyle = "#000408"
  ctx.fillRect(0, 0, w, h)

  // ── Urban center clusters with realistic distribution ──
  // Sodium-yellow base: R=255, G=160±30, B=40±20 for warm city glow
  const cityColor = (bright: number) => `rgba(255, ${150 + Math.floor(Math.random() * 40)}, ${30 + Math.floor(Math.random() * 30)}, ${bright})`

  const cities = [
    // North America East Coast (dense megalopolis)
    { x: 0.22, y: 0.37, r: 70 },
    // US West Coast (LA–SF corridor)
    { x: 0.15, y: 0.35, r: 50 },
    // Mexico City
    { x: 0.18, y: 0.44, r: 30 },
    // Chicago / Great Lakes
    { x: 0.20, y: 0.32, r: 30 },
    // Houston / Dallas
    { x: 0.17, y: 0.40, r: 25 },

    // Europe — dense
    { x: 0.47, y: 0.33, r: 55 },
    // London / UK
    { x: 0.45, y: 0.29, r: 30 },
    // Scandinavia
    { x: 0.50, y: 0.24, r: 25 },
    // Iberia
    { x: 0.44, y: 0.38, r: 25 },
    // Italy / Mediterranean
    { x: 0.49, y: 0.38, r: 28 },

    // East Asia — brightest
    // Japan (Tokyo–Osaka)
    { x: 0.78, y: 0.35, r: 45 },
    // China east coast (Shanghai–Beijing–Guangzhou)
    { x: 0.72, y: 0.33, r: 60 },
    // Korea
    { x: 0.77, y: 0.31, r: 25 },
    // Taiwan
    { x: 0.75, y: 0.40, r: 20 },

    // South Asia
    // India (Delhi–Mumbai–Kolkata)
    { x: 0.63, y: 0.42, r: 50 },
    // Bangladesh
    { x: 0.67, y: 0.43, r: 20 },

    // SE Asia
    // Jakarta / Singapore
    { x: 0.74, y: 0.48, r: 28 },
    // Bangkok / Vietnam
    { x: 0.70, y: 0.46, r: 22 },
    // Philippines
    { x: 0.76, y: 0.46, r: 20 },

    // South America
    // Brazil (Rio–São Paulo)
    { x: 0.30, y: 0.58, r: 45 },
    // Argentina (Buenos Aires)
    { x: 0.28, y: 0.65, r: 30 },
    // Colombia / Venezuela
    { x: 0.27, y: 0.50, r: 25 },

    // Middle East / Gulf
    { x: 0.55, y: 0.40, r: 30 },
    // Iran
    { x: 0.57, y: 0.35, r: 25 },
    // Turkey
    { x: 0.52, y: 0.37, r: 22 },

    // Africa
    // South Africa (Johannesburg)
    { x: 0.52, y: 0.58, r: 25 },
    // Egypt / Nile
    { x: 0.52, y: 0.43, r: 22 },
    // Nigeria / Gulf of Guinea
    { x: 0.49, y: 0.50, r: 20 },

    // Oceania
    // Australia east (Sydney–Melbourne)
    { x: 0.84, y: 0.60, r: 35 },
    // Australia west (Perth)
    { x: 0.78, y: 0.56, r: 18 },
  ]

  for (const city of cities) {
    const cx = city.x * w
    const cy = city.y * h
    const r = city.r

    // Urban core — dense concentration of bright lights
    const density = r < 25 ? 30 : r < 40 ? 50 : 70
    for (let i = 0; i < density; i++) {
      const angle = Math.random() * Math.PI * 2
      const dist = Math.random() * r * 0.4
      const px = cx + Math.cos(angle) * dist
      const py = cy + Math.sin(angle) * dist
      const size = 1.5 + Math.random() * 3.5
      const bright = 0.5 + Math.random() * 0.5
      ctx.beginPath()
      ctx.arc(px, py, size, 0, Math.PI * 2)
      ctx.fillStyle = cityColor(bright)
      ctx.fill()
    }

    // Suburban halo — sparser, dimmer
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2
      const dist = Math.random() * r
      const px = cx + Math.cos(angle) * dist
      const py = cy + Math.sin(angle) * dist
      const size = 0.8 + Math.random() * 2
      const bright = 0.2 + Math.random() * 0.4
      ctx.beginPath()
      ctx.arc(px, py, size, 0, Math.PI * 2)
      ctx.fillStyle = cityColor(bright)
      ctx.fill()
    }

    // Sodium-vapor city glow (warm amber-orange)
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 2.8)
    grad.addColorStop(0, `rgba(255, ${160 + Math.floor(Math.random() * 30)}, ${40 + Math.floor(Math.random() * 30)}, 0.20)`)
    grad.addColorStop(0.4, `rgba(255, 140, 40, 0.08)`)
    grad.addColorStop(1, `rgba(255, 80, 20, 0)`)
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(cx, cy, r * 2.8, 0, Math.PI * 2)
    ctx.fill()
  }

  // Scattered rural lights (warm, dim)
  for (let i = 0; i < 500; i++) {
    const x = Math.random() * w
    const y = Math.random() * h
    const size = 0.4 + Math.random() * 1.2
    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    const bright = 0.05 + Math.random() * 0.2
    ctx.fillStyle = `rgba(255, ${170 + Math.floor(Math.random() * 50)}, ${50 + Math.floor(Math.random() * 40)}, ${bright})`
    ctx.fill()
  }

  // Fishing fleet lights (coastal, slightly blue-white tint)
  for (let i = 0; i < 120; i++) {
    const x = Math.random() * w
    const y = Math.random() * h
    const size = 0.3 + Math.random() * 0.8
    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(200, 220, 255, ${0.03 + Math.random() * 0.08})`
    ctx.fill()
  }

  return canvas
}

export function createProceduralSpecularTexture(): HTMLCanvasElement {
  const canvas = document.createElement("canvas")
  canvas.width = 1024
  canvas.height = 512
  const ctx = canvas.getContext("2d")!
  const w = canvas.width
  const h = canvas.height

  ctx.fillStyle = "#000"
  ctx.fillRect(0, 0, w, h)

  // Ocean areas - specular highlights
  for (let i = 0; i < 120; i++) {
    const x = Math.random() * w
    const y = Math.random() * h
    const rx = 40 + Math.random() * 180
    const ry = 15 + Math.random() * 60
    ctx.beginPath()
    ctx.ellipse(x, y, rx, ry, Math.random() * Math.PI, 0, Math.PI * 2)
    const val = 40 + Math.floor(Math.random() * 80)
    ctx.fillStyle = `rgb(${val}, ${val}, ${val})`
    ctx.fill()
  }

  return canvas
}

export function createProceduralCloudTexture(): HTMLCanvasElement {
  const canvas = document.createElement("canvas")
  canvas.width = 1024
  canvas.height = 512
  const ctx = canvas.getContext("2d")!
  const w = canvas.width
  const h = canvas.height

  ctx.fillStyle = "#000"
  ctx.fillRect(0, 0, w, h)

  // Cloud bands
  for (let band = 0; band < 8; band++) {
    const cy = (0.15 + band * 0.1) * h + (Math.random() - 0.5) * 0.05 * h
    for (let i = 0; i < 40; i++) {
      const x = Math.random() * w
      const y = cy + (Math.random() - 0.5) * 0.06 * h
      const rx = 20 + Math.random() * 100
      const ry = 5 + Math.random() * 20
      ctx.beginPath()
      ctx.ellipse(x, y, rx, ry, Math.random() * 0.5, 0, Math.PI * 2)
      const alpha = 0.1 + Math.random() * 0.35
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
      ctx.fill()
    }
  }

  // Storm systems
  for (let i = 0; i < 12; i++) {
    const x = Math.random() * w
    const y = Math.random() * h
    const r = 20 + Math.random() * 60
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r)
    grad.addColorStop(0, "rgba(255, 255, 255, 0.4)")
    grad.addColorStop(0.5, "rgba(255, 255, 255, 0.15)")
    grad.addColorStop(1, "rgba(255, 255, 255, 0)")
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }

  return canvas
}
