# Contributing to AstroDex

Thank you for taking the time to contribute to **AstroDex**! This guide covers everything you need to get up and running, follow project conventions, and submit a great pull request.

> **New here?** Check out the [open issues][issues] for a good starting point — issues labeled `good first issue` are beginner-friendly!

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Project Structure](#project-structure)
3. [Code Style](#code-style)
4. [Project Conventions](#project-conventions)
5. [Commit Message Guidelines](#commit-message-guidelines)
6. [Pull Request Process](#pull-request-process)
7. [Adding Real Textures](#adding-real-textures)
8. [Future Supabase Setup](#future-supabase-setup)
9. [Reporting Bugs](#reporting-bugs)
10. [Code of Conduct](#code-of-conduct)

---

## Getting Started

### Prerequisites

Make sure you have the following installed before proceeding:

| Tool | Version | Download |
|------|---------|----------|
| Node.js | 18 + | [nodejs.org][nodejs] |
| npm | 9 + | Bundled with Node.js |
| Git | Any recent version | [git-scm.com](https://git-scm.com) |

### Local Setup

```bash
# 1. Fork the repository via GitHub, then clone your fork
git clone https://github.com/<your-username>/astrodex.git
cd astrodex

# 2. Add the upstream remote so you can pull future changes
git remote add upstream https://github.com/SourabhX16/astrodex.git

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. Hot-reload is enabled, so changes are reflected instantly.

### Keeping Your Fork Up to Date

```bash
git fetch upstream
git checkout main
git merge upstream/main
```

---

## Project Structure

```
astrodex/
├── public/
│   └── textures/          # Static assets and texture images
├── src/
│   ├── app/               # Next.js App Router — pages and layouts
│   ├── components/        # Reusable React components
│   │   └── earth/         # Earth-specific 3D components
│   └── lib/               # Utilities, types, hooks, and global state
├── .env.local.example     # Example environment variables (copy to .env.local)
├── .eslintrc.json         # ESLint configuration
├── next.config.js         # Next.js configuration
├── tailwind.config.ts     # Tailwind CSS configuration
└── tsconfig.json          # TypeScript configuration
```

---

## Code Style

| Area | Rule |
|------|------|
| **Language** | [TypeScript][ts] — strict mode is enabled. Avoid `any`; prefer `unknown` and narrow types explicitly |
| **Components** | Add `"use client"` at the top of any component that uses hooks or browser APIs |
| **Imports** | Always use the `@/` path alias (resolves to `src/`). Avoid relative `../` chains |
| **Formatting** | [ESLint][eslint] is configured — run `npm run lint` before every commit |
| **CSS** | [Tailwind CSS][tailwind] utility classes are preferred. Custom CSS is only acceptable for global resets or styles that Tailwind cannot handle |
| **No unused imports** | Remove any unused imports before opening a PR |

### Running the Linter and Type Checker

```bash
# Lint all files
npm run lint

# Type-check without emitting output
npx tsc --noEmit
```

Both commands must pass with **zero errors** before you open a pull request.

---

## Project Conventions

### Naming Conventions

| Thing | Convention | Example |
|-------|-----------|---------|
| Components | PascalCase | `AsteroidBelt.tsx` |
| Functions / variables | camelCase | `claimAsteroid()` |
| Types and interfaces | PascalCase | `AsteroidRecord` |
| Component files | PascalCase | `Earth.tsx` |
| Utility / hook files | camelCase | `useAsteroidStore.ts` |
| GLSL uniform variables | `u` prefix + camelCase | `uTime`, `uResolution` |
| GLSL varying variables | `v` prefix + camelCase | `vNormal`, `vUv` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_ASTEROID_COUNT` |

### 3D / WebGL Component Guidelines

AstroDex uses **React Three Fiber** and **Drei**. Follow these rules when working on 3D components:

- **Shaders** — Inline GLSL as template literals. Next.js does not support `.glsl` file imports out of the box without additional Webpack configuration.
- **Uniforms** — Always create uniform objects with `useRef` so they are not re-created on every render cycle.
- **Textures** — Load and update textures inside `useEffect`, not `useMemo`, to correctly handle async loading and disposal.
- **Event handlers** — Wrap all event handlers in `useCallback` before passing them to `InstancedMesh` or other R3F primitives.
- **Disposal** — Always dispose of geometries, materials, and textures when a component unmounts to prevent memory leaks.

```tsx
useEffect(() => {
  return () => {
    geometry.dispose()
    material.dispose()
    texture.dispose()
  }
}, [geometry, material, texture])
```

### Component Checklist

Before submitting any component, verify:

- [ ] `"use client"` is present if the component uses hooks or browser APIs
- [ ] Props are typed with an explicit TypeScript interface, not inlined `any`
- [ ] No hard-coded magic numbers — extract them as named constants
- [ ] No `console.log` statements left in production code
- [ ] Disposals are handled for any Three.js objects created in `useEffect`

---

## Commit Message Guidelines

We follow a simplified version of [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<optional scope>): <short summary>
```

| Type | When to use |
|------|------------|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation changes only |
| `style` | Formatting, missing semicolons — no logic change |
| `refactor` | Code restructure without adding features or fixing bugs |
| `perf` | Performance improvements |
| `test` | Adding or updating tests |
| `chore` | Dependency updates, build scripts, tooling |

**Examples:**

```
feat(earth): add atmosphere glow shader
fix(asteroid-belt): prevent NaN position on first render
docs(contributing): add commit message guidelines
chore: upgrade three.js to v0.164
```

- Use the **imperative mood** in the summary: *"add feature"* not *"added feature"*
- Keep the summary line under **72 characters**
- Reference relevant issues at the end of the body: `Closes #42`

---

## Pull Request Process

1. **Sync with upstream** before branching to avoid merge conflicts:
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create a focused branch** with a descriptive name:
   ```bash
   git checkout -b feat/atmosphere-shader
   # or
   git checkout -b fix/asteroid-nan-position
   # or
   git checkout -b docs/update-contributing
   ```

3. **Make small, atomic commits.** Each commit should represent one logical change.

4. **Lint and build — both must pass:**
   ```bash
   npm run lint
   npm run build
   ```

5. **Open a pull request** against the `main` branch and fill in the PR template with:
   - A clear, descriptive title following the commit convention
   - A summary of *what* changed and *why*
   - Steps to test or reproduce the changes
   - Screenshots or screen recordings for any visual changes
   - A reference to the related issue (e.g., `Closes #12`)

6. **Respond to review comments** promptly. A maintainer will review your PR and may request changes before merging.

> **Tip:** Keep PRs small and focused. Large, unfocused PRs take longer to review and are more likely to introduce conflicts.

---

## Adding Real Textures

Drop image files into `public/textures/`, then load them in a component using Drei's `useTexture` hook:

```tsx
import { useTexture } from "@react-three/drei"

export function Earth() {
  const [dayMap, nightMap, specMap] = useTexture([
    "/textures/earth_day.jpg",
    "/textures/earth_night.jpg",
    "/textures/earth_specular.jpg",
  ])

  return (
    <mesh>
      <sphereGeometry args={[1, 64, 64]} />
      <meshPhongMaterial
        map={dayMap}
        specularMap={specMap}
      />
    </mesh>
  )
}
```

### Texture Guidelines

- **Format:** Prefer `.jpg` for opaque textures and `.png` for textures that require transparency
- **Resolution:** Keep texture resolution at or below `4096×2048` to avoid performance issues on lower-end devices
- **File size:** Compress images before committing. Tools like [Squoosh](https://squoosh.app) work well
- **Naming:** Use lowercase `snake_case` — e.g., `earth_day.jpg`, `mars_surface.jpg`

### Recommended Free Texture Sources

| Source | Notes |
|--------|-------|
| [NASA Visible Earth](https://visibleearth.nasa.gov) | Public domain satellite imagery |
| [Solar System Scope](https://www.solarsystemscope.com/textures/) | High-res planetary textures (free tier available) |
| [3D Planet Textures](https://planetpixelemporium.com) | Lightweight planet texture maps |

---

## Future Supabase Setup

> **Note:** Supabase is not yet integrated. This section is a reference for when that integration is added.

### 1. Environment Variables

Copy the example file and fill in your project credentials:

```bash
cp .env.local.example .env.local
```

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

> ⚠️ **Never commit `.env.local`.** It is already listed in `.gitignore`. Committing secrets will require a key rotation.

### 2. Supabase Client

Create `src/lib/supabaseClient.ts`:

```ts
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### 3. Database Schema

Create an `asteroids` table with the following columns:

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | Primary key, default `gen_random_uuid()` |
| `asteroid_id` | `text` | Unique identifier from the NASA API; add a `UNIQUE` constraint |
| `claimed_by` | `text` | User identifier (e.g., Supabase Auth `user.id`) |
| `claimed_at` | `timestamptz` | Defaults to `now()` |

### 4. Replacing the Mock Store

Swap the mock `claimAsteroid` function in `src/lib/store.tsx` with a real Supabase upsert:

```ts
import { supabase } from "@/lib/supabaseClient"

export async function claimAsteroid(asteroidId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from("asteroids")
    .upsert(
      {
        asteroid_id: asteroidId,
        claimed_by: userId,
        claimed_at: new Date().toISOString(),
      },
      { onConflict: "asteroid_id" }
    )

  if (error) throw new Error(`Failed to claim asteroid: ${error.message}`)
}
```

---

## Reporting Bugs

Found a bug? Please [open an issue][issues] and include:

- A clear, descriptive title
- Steps to reproduce the problem
- Expected behavior vs. actual behavior
- Your browser, OS, and Node.js version
- Screenshots or console errors if applicable

If you have a fix ready, feel free to open a PR directly — just reference the issue in your description.

---

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). By participating, you agree to uphold a welcoming and respectful environment for everyone.

If you witness or experience unacceptable behavior, please report it by opening a private issue or contacting the maintainer directly via GitHub.

---

[issues]: https://github.com/SourabhX16/astrodex/issues
[nodejs]: https://nodejs.org
[npm]: https://www.npmjs.com
[ts]: https://www.typescriptlang.org
[eslint]: https://eslint.org
[tailwind]: https://tailwindcss.com
