# AstroDex — Space Objects & Debris Explorer

[Live demo](https://astrodex-nine.vercel.app/) · [Report a bug](https://github.com/SourabhX16/astrodex/issues/new/choose) · [Contributing guide](CONTRIBUTING.md)

AstroDex is an interactive, open-source 3D space situational awareness (SSA) dashboard and command center. It visualizes natural asteroids alongside human-made orbital debris, tracks conjunction threats with active satellites in real time, and presents mission telemetry in a cinematic glassmorphic HUD.

Built with **Next.js 16 (App Router)**, **React 19**, **React Three Fiber**, **Three.js**, custom GLSL shaders, and Tailwind CSS v4.

## Screenshots

The live demo is available at <https://astrodex-nine.vercel.app/>. If you are contributing visual changes, attach before/after screenshots or a short screen recording to your pull request.

Suggested screenshot set for maintainers:

- Main 3D viewport with Earth, asteroids, debris, and HUD panels.
- Target inspection mode with an object selected.
- Conjunction alert and Agent Terminal activity.
- Manual satellite controls and LEO decay monitor.

## Core features

- **Multi-object catalog tracking**
  - 400 rocky asteroids rendered with grey-brown procedural materials.
  - 200 human-made debris pieces rendered with high-visibility neon colors.
- **True Keplerian orbital mechanics**
  - Objects are propagated by solving Kepler's equation in `src/lib/kepler.ts`.
  - Per-frame Vis-Viva speed updates make objects accelerate at perigee and decelerate at apogee.
  - Orbit-line geometries are true ellipses instead of simple circular paths.
- **LEO orbital decay and boost burns**
  - ISS altitude decays over time and can be restored with a boost burn.
  - The Right Sidebar shows altitude, drag rate, and orbit health.
- **Interactive satellite system**
  - Renders ISS, Envisat, and Hubble Space Telescope on inclined Keplerian trajectories.
- **Real-time conjunction alerting**
  - Detects close approaches between satellites and catalog objects.
  - Logs alerts in the Agent Terminal and highlights risky objects in the viewport.
- **Dynamic orbital telemetry controls**
  - Update altitude, inclination, RAAN, and eccentricity, then apply the trajectory live.
- **Cinematic Earth shader**
  - Procedural day/night texture blending, city lights, ocean highlights, and atmospheric glow.
- **Agent Terminal**
  - Expandable mission log for sensor sweeps, conjunction alerts, and maneuver events.

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 App Router, Turbopack |
| Language | TypeScript |
| UI | React 19, Tailwind CSS v4, CSS custom properties |
| 3D rendering | Three.js r184, React Three Fiber v9 |
| 3D helpers | `@react-three/drei` v10 |
| Post-processing | `@react-three/postprocessing` v3 |
| Linting | ESLint 9, `eslint-config-next` |

## Prerequisites

- Node.js 20 or newer is recommended for Next.js 16.
- npm, included with Node.js.
- A modern browser with WebGL support.

## Local development

```bash
# Clone your fork
git clone https://github.com/<your-username>/astrodex.git
cd astrodex

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open <http://localhost:3000> in your browser.

## Available scripts

```bash
npm run dev      # Start the local Next.js dev server
npm run build    # Create a production build
npm run start    # Serve the production build locally
npm run lint     # Run ESLint
```

## Build and deployment

Create a production build before deploying:

```bash
npm run build
```

The project is a standard Next.js application and can be deployed to Vercel or any platform that supports Next.js. For Vercel, import the repository and keep the default Next.js build settings.

## Testing and validation

There is no dedicated test suite yet. Before opening a pull request, run:

```bash
npm run lint
npm run build
```

For UI or 3D changes, also verify the feature manually in the browser and include screenshots or a short recording in the PR.

## Project structure

```text
src/
├── app/
│   ├── globals.css          # Mission Control theme tokens, glassmorphism, animations
│   ├── layout.tsx           # Font loading and metadata
│   └── page.tsx             # HUD overlay layout assembly
├── components/
│   ├── earth/
│   │   ├── Earth.tsx        # Earth day/night custom GLSL shader
│   │   ├── CloudLayer.tsx   # Procedural cloud layer
│   │   ├── Atmosphere.tsx   # Atmosphere scattering shader glow
│   │   └── textures.ts      # Canvas 2D texture generators
│   ├── AsteroidField.tsx    # Instanced asteroids and debris with Keplerian motion
│   ├── SatelliteSystem.tsx  # ISS/Envisat/Hubble and LEO decay
│   ├── CameraController.tsx # Tracking camera controller
│   ├── Effects.tsx          # Post-processing composer
│   ├── Scene.tsx            # 3D scene orchestrator
│   ├── Header.tsx           # Simulation top navigation bar
│   ├── LeftSidebar.tsx      # Target tracking, load by ID, conjunction feed
│   ├── RightSidebar.tsx     # Orbital controls and LEO decay monitor
│   ├── AgentTerminal.tsx    # Expandable auto-scrolling log dock
│   └── AsteroidCard.tsx     # Inspector overlay panel
└── lib/
    ├── kepler.ts            # Orbital math utilities
    ├── store.tsx            # React state manager
    └── types.ts             # Shared TypeScript types
```

## Contributing

Contributions are welcome. Start with the existing [contributing guide](CONTRIBUTING.md), then follow this workflow:

1. Pick an open issue or create one describing the change.
2. Fork the repository and create a focused branch.
3. Keep the PR limited to one logical change.
4. Run `npm run lint` and `npm run build`.
5. Open a pull request with:
   - The issue number it closes or relates to.
   - A concise summary of the change.
   - Validation steps and screenshots for UI changes.

### Coding style

- Keep 3D components client-side and avoid server-rendering Three.js code.
- Reuse orbital helpers from `src/lib/kepler.ts` instead of duplicating orbital math.
- Avoid allocations inside `useFrame` render loops; reuse module-level scratch objects.
- Prefer small, readable TypeScript changes with explicit types for shared data structures.
- Run ESLint before submitting.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
