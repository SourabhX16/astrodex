# AstroDex — Space Objects & Debris Explorer
link : astrodex-nine.vercel.app

**AstroDex** is an interactive, open-source 3D space situational awareness (SSA) dashboard and command center. It visualizes natural asteroids alongside man-made orbital space debris, tracking conjunction threats (close approaches) with active satellites in real-time.

Built with **Next.js 16 (App Router)**, **React Three Fiber (R3F)**, **Three.js**, custom GLSL shaders, and a premium glassmorphic HUD design.

---

## 🌌 Core Features

- **Multi-Object Catalog Tracking**:
  - **400 Rocky Asteroids (Natural)**: Rendered in grey-brown rock textures, each on its own random elliptical orbit (`e ∈ [0, 0.28)`).
  - **200 Space Debris Pieces (Man-made)**: Spent rocket stages, dead satellites, and metallic fragments orbiting closer to Earth, rendered in high-visibility neon colors (orange, cyan, magenta).
- **True Keplerian Orbital Mechanics**:
  - Every object (asteroids, debris, and the 3 satellites) is propagated by solving **Kepler's Equation** `M = E − e·sin(E)` with a Newton-Raphson solver in `src/lib/kepler.ts`.
  - Per-frame **Vis-Viva** speed `v = √(μ·(2/r − 1/a))` — objects accelerate at perigee and decelerate at apogee.
  - Orbit-line geometries are drawn as true ellipses sweeping eccentric anomaly, not circles.
- **LEO Orbital Decay & Boost Burn**:
  - The ISS altitude continuously drops from atmospheric drag (`0.05 km/s` of real time, clamped to 180 km re-entry floor / 500 km ceiling).
  - The Right Sidebar **LEO Decay Monitor** shows a green → amber → red health bar plus the current altitude and drag rate.
  - Clicking **Boost Burn (+50 km)** injects Δv that restores the orbit; the boost is logged to the Agent Terminal.
  - As the ISS decays the orbit ring visibly shrinks and conjunction risks with debris rise.
- **Interactive Satellite System**:
  - Renders 3D orbital planes for active satellites: **ISS (ZARYA)**, **Envisat (Polar)**, and **Hubble Space Telescope**.
  - Satellites move along realistic inclined Keplerian trajectories.
- **Real-Time Conjunction Alerting**:
  - Performs live 3D collision detection between satellites and the orbital catalog.
  - Triggers alerts inside the **Conjunction Alerter** panel and log notifications in the **Agent Terminal** if a space object approaches within critical distance.
  - Highlights at-risk objects in the 3D viewport by flashing their colors to a pulsing red indicator.
- **Dynamic Orbital Telemetry controls**:
  - The Right Sidebar's **Manual Satellite (3D Orbit)** panel is fully functional. Update parameters (Altitude, Inclination, RAAN, Eccentricity) and click **Apply Trajectory** to watch the ISS satellite and its elliptical orbit trail dynamically recalculate and warp in 3D in real-time.
- **Cinematic Earth Shader**:
  - Custom GLSL material blending Earth day/night textures dynamically based on sun angle, highlighting glowing cities, ocean specular reflections, a twilight terminator ring, and atmospheric Rayleigh scattering effects.
- **Agent Terminal**:
  - Expandable bottom terminal dock generating monospace logs of sensor sweeps, conjunction alerts, and maneuver sequences (including boost burns).

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Vanilla CSS Custom Tokens & Tailwind CSS v4 |
| 3D Graphics | Three.js r184 / React Three Fiber v9 |
| 3D Helpers | @react-three/drei v10 |
| Post-Processing | @react-three/postprocessing v3 (Bloom, Vignette) |

---

## 🚀 Getting Started

Ensure you have Node.js 18+ installed.

```bash
# Clone the repository
git clone https://github.com/your-username/astrodex.git
cd astrodex

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for production

```bash
# Compile and check TypeScript
npm run build

# Start the production build locally
npm run start
```

---

## 📂 Project Structure

```
src/
├── app/
│   ├── globals.css          # Mission Control theme tokens, glassmorphism, animations
│   ├── layout.tsx           # Font loading (Geist & JetBrains Mono), SEO metadata
│   └── page.tsx             # HUD overlay layout assembly
├── components/
│   ├── earth/
│   │   ├── Earth.tsx        # Earth day/night custom GLSL shader
│   │   ├── CloudLayer.tsx   # Procedural cloud layer
│   │   ├── Atmosphere.tsx   # Atmosphere scattering shader glow
│   │   └── textures.ts     # Canvas 2D texture generators (zero external assets)
│   ├── AsteroidField.tsx    # Dual InstancedMesh (Asteroids & Space Debris) — Keplerian
│   ├── SatelliteSystem.tsx  # ISS/Envisat/Hubble + LEO decay
│   ├── CameraController.tsx # Tracking camera controller
│   ├── Effects.tsx          # Post-processing composer (Bloom, Vignette)
│   ├── Scene.tsx            # Orchestrator canvas
│   ├── Header.tsx           # Simulation top navigation bar
│   ├── LeftSidebar.tsx      # Target tracking, load by ID, conjunction feed
│   ├── RightSidebar.tsx     # Orbital constraints + manual satellite + LEO decay monitor
│   ├── AgentTerminal.tsx    # Expandable log dock (auto-scrolls, color-coded)
│   └── AsteroidCard.tsx     # Inspector overlay panel
└── lib/
    ├── kepler.ts            # Newton-Raphson solver, Vis-Viva, mean motion, decay
    ├── store.tsx            # React state manager (filters, simulation, orbits, alerts)
    └── types.ts             # TypeScript definitions
```

---

## 🤝 Contributing & GitHub Issues

This is an open-source project! We want to make it easy for developers to contribute. We have created a curated list of **10 open issues** ranging from easy UI tasks to advanced orbital mechanic calculators.

Check out the full issue specifications in [src/github_issues.md](file:///Users/sourabhpatne16/Desktop/AstroDex/src/github_issues.md) to pick an issue, paste it onto GitHub, and start coding!

---

## 📄 License

This project is licensed under the MIT License.
