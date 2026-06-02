# AstroDex — Good First Issues

> A curated set of **beginner-friendly** tasks, sized to fit in a single PR
> and gated by the [`good first issue`](https://docs.github.com/articles/applying-labels-to-issues-and-pull-requests/#about-default-labels)
> label.  Each block below is copy-paste-ready for the GitHub Issue form.
>
> The bigger items in [src/github_issues.md](src/github_issues.md) are
> intended for experienced contributors; the issues here are intended to be
> a welcoming on-ramp for first-time contributors.

---

## 1. [Good First Issue] Global keyboard shortcuts (Space, R, /)

- **Difficulty**: Easy 🟢
- **Labels**: `good first issue`, `enhancement`, `frontend`
- **Description**: AstroDex exposes a lot of functionality through mouse
  clicks, but power users love keyboard shortcuts.  Add global hot-keys that
  work from anywhere in the dashboard:
  - `Space` — toggle the simulation (paused / running) — same action as the
    "Pause / Run" button in the Header.
  - `R` — reset the camera back to Earth (only when an object is selected).
  - `/` — focus the "Load by ID" search input in the Left Sidebar.
- **Expected Behavior**:
  - Shortcuts work regardless of which panel is open.
  - Typing inside an `<input>` or `<textarea>` must NOT trigger the shortcut
    (so users can still type "42" in the search field).
  - A small unobtrusive hint in the Header (e.g. a `kbd` legend) lists the
    available shortcuts.
- **Suggested Files**:
  - [src/app/page.tsx](src/app/page.tsx) — install the `keydown` listener
    here so the rest of the app stays unaware of the hot-keys.
  - [src/lib/store.tsx](src/lib/store.tsx) — read the existing
    `toggleSimulation`, `triggerReset` actions.
  - [src/components/Header.tsx](src/components/Header.tsx) — render the
    legend.
- **Hints**:
  - Use `event.target instanceof HTMLInputElement` to skip the shortcut
    when the user is typing.
  - Add a tiny CSS rule `.kbd-hint { font-family: var(--font-mono); … }` to
    style the key chips in `src/app/globals.css`.

---

## 2. [Good First Issue] Unit tests for `src/lib/kepler.ts`

- **Difficulty**: Easy 🟢
- **Labels**: `good first issue`, `testing`, `orbital-mechanics`
- **Description**: The Keplerian propagation in
  [src/lib/kepler.ts](src/lib/kepler.ts) is the math heart of the project
  and currently has zero automated tests.  Add a test file using
  [Vitest](https://vitest.dev/) (already a common choice with Next 16 +
  Turbopack) that verifies the solvers against known textbook values.
- **Expected Behavior**:
  - `npm test` runs the new suite and all assertions pass.
  - Cover at minimum:
    - `solveKepler` for `e = 0` returns `M` exactly.
    - `solveKepler` for `e = 0.5` matches a table from
      [Wikipedia / Curtis "Orbital Mechanics for Engineering Students"]
      to within `1e-4` rad.
    - `meanMotion(1)` returns a finite positive number and decreases
      monotonically as `a` increases.
    - `visVivaKmPerSec(R⊕ + 400, R⊕ + 400)` (a 400 km circular LEO) is
      within 1 % of the real ISS speed of 7.66 km/s.
    - `visVivaKmPerSec(r, a)` is monotonically increasing in `r` when
      `r < 2a` (perigee is fastest).
    - `kmToSceneUnits` and `sceneUnitsToKm` are exact inverses.
- **Suggested Files**:
  - New: [tests/kepler.test.ts](tests/kepler.test.ts) (create the
    `tests/` folder if it doesn't exist).
  - [package.json](package.json) — add `vitest` to devDependencies and a
    `"test": "vitest run"` script.
- **Hints**:
  - You don't need a runner config file — Vitest picks up `*.test.ts`
    automatically.
  - When adding `vitest`, also add a `tsconfig.json` include for the new
    `tests/` folder (or it will type-check under the wrong context).

---

## 3. [Good First Issue] Filter the conjunction table by risk level

- **Difficulty**: Easy 🟢
- **Labels**: `good first issue`, `enhancement`, `frontend`
- **Description**: The Conjunction Alerter in the Left Sidebar shows up
  to 15 alerts.  When many entries are stacked, scanning for the dangerous
  ones is hard.  Add a small "Risk filter" segmented control (similar in
  style to the existing `Filter Catalog` tabs) that lets the user show
  only `HIGH`, only `MEDIUM`, only `LOW`, or `ALL` rows.
- **Expected Behavior**:
  - A new segmented control sits directly above the conjunction table.
  - Selecting a risk level hides rows that don't match (the badge color
    is already in the data).
  - The default is `ALL` so existing behavior is preserved.
  - The "X Active alerts" counter reflects the *filtered* count, not the
    total.  (A tooltip clarifies this.)
- **Suggested Files**:
  - [src/components/LeftSidebar.tsx](src/components/LeftSidebar.tsx) —
    add local state for the filter, render the segmented control above
    the table, filter `conjunctions` before mapping.
- **Hints**:
  - The pattern for the segmented control already exists in this same
    file under the "Filter Catalog" tabs — copy that styling verbatim
    for visual consistency.
  - Use the `useMemo` hook to avoid re-filtering on every render.

---

## 4. [Good First Issue] "Snapshot to PNG" button in the Header

- **Difficulty**: Medium 🟡
- **Labels**: `good first issue`, `enhancement`, `frontend`
- **Description**: Add a "Snapshot" button next to the "Back to Earth"
  button in the Header.  Clicking it captures the current 3D viewport
  and triggers a browser download of the image.
- **Expected Behavior**:
  - The button is only enabled after the scene has rendered at least one
    frame (so we don't grab a blank canvas).
  - Clicking downloads a `astrodex-snapshot-YYYYMMDD-HHMMSS.png` file
    containing the current 3D view at the canvas's native resolution.
  - The HUD overlay is **not** included in the snapshot — only the
    WebGL canvas.
  - A short toast or log entry in the Agent Terminal confirms the
    capture (`[TRK] Snapshot saved: astrodex-snapshot-…`).
- **Suggested Files**:
  - [src/components/Header.tsx](src/components/Header.tsx) — add the
    button and handler.
  - The handler should look up the canvas via the R3F store.  A common
    pattern is `useThree()` inside a child component, but the snapshot
    can also be triggered from the page level by calling
    `document.querySelector('canvas')?.toDataURL('image/png')` followed
    by a programmatic `<a download>` click.
- **Hints**:
  - R3F's `<Canvas>` sets `preserveDrawingBuffer={false}` by default for
    perf, so call `gl.render(scene, camera)` immediately before
    `toDataURL` to ensure the framebuffer is fresh.
  - The Agent Terminal already accepts a `boostCount`-style trigger —
    a `snapshotCount` in the store would let the terminal subscribe the
    same way the boost-burn log works.

---

## 5. [Good First Issue] Accessibility — ARIA labels and keyboard focus

- **Difficulty**: Easy / Medium 🟢🟡
- **Labels**: `good first issue`, `a11y`, `enhancement`
- **Description**: AstroDex is a dashboard full of clickable buttons,
  toggles and tables, but it currently has no `aria-*` attributes or
  focus styles.  Screen-reader users and keyboard-only users can't
  navigate the sidebars or the conjunction table.
- **Expected Behavior**:
  - Every `<button>` in the Header, Left Sidebar, Right Sidebar and
    AsteroidCard has a meaningful `aria-label` (the visible text is
    often abbreviated — `LOAD`, `Apply`, `×`).
  - All sidebars and the Agent Terminal can be tabbed into.  When
    focus is on a sidebar button, a visible focus ring (similar to the
    input `:focus` style in `globals.css`) appears.
  - The conjunction table has `<th scope="col">` on its headers.
  - The "Risk: HIGH/MEDIUM/LOW" badge in the Header exposes its
    severity to screen readers via `aria-label="Risk level: HIGH"`.
- **Suggested Files**:
  - [src/components/Header.tsx](src/components/Header.tsx)
  - [src/components/LeftSidebar.tsx](src/components/LeftSidebar.tsx)
  - [src/components/RightSidebar.tsx](src/components/RightSidebar.tsx)
  - [src/components/AsteroidCard.tsx](src/components/AsteroidCard.tsx)
  - [src/app/globals.css](src/app/globals.css) — add `:focus-visible`
    styles for buttons.
- **Hints**:
  - Don't add `aria-label` to a button whose visible text is already
    self-describing — that creates duplicate announcements.
  - Use `:focus-visible` (not `:focus`) so mouse clicks don't draw a
    ring.

---

## 6. [Good First Issue] "Selected target" status chip in the Header

- **Difficulty**: Easy 🟢
- **Labels**: `good first issue`, `enhancement`, `frontend`
- **Description**: When you select an asteroid, the only visual feedback
  is the floating `AsteroidCard` panel.  Add a small pill-shaped chip
  in the Header (between the "Risk" badge and the "Back to Earth"
  button) that summarises the current selection: designator, type
  icon, and a click-to-deselect × button.
- **Expected Behavior**:
  - Hidden when nothing is selected.
  - Shows `AST-0042` / `DEB-1985-732A` plus an `×` that calls
    `selectAsteroid(null)`.
  - On mobile widths the chip's designator is truncated to fit, with
    the full name in a `title` attribute.
- **Suggested Files**:
  - [src/components/Header.tsx](src/components/Header.tsx)
  - [src/lib/store.tsx](src/lib/store.tsx) — `selectAsteroid` is
    already in the context.
- **Hints**:
  - The existing `.btn-ghost` class is the right starting point for
    styling.
  - Reuse the color convention from `AsteroidCard`:
    `var(--accent-amber)` for debris, `var(--accent-cyan)` for
    natural asteroids.

---

## 7. [Good First Issue] Hover tooltips for the catalog filter tabs

- **Difficulty**: Easy 🟢
- **Labels**: `good first issue`, `enhancement`, `frontend`
- **Description**: The `ALL` / `ASTEROIDS` / `DEBRIS` filter tabs in the
  Left Sidebar are unlabeled beyond the text.  On hover, a tooltip
  should appear explaining what each filter does, including the object
  count currently in view.
- **Expected Behavior**:
  - Hovering (or focusing) a tab for > 200 ms shows a small dark-glass
    tooltip above the tab.
  - Tooltip text: `"Show all 600 catalog items"`, `"Show 400 natural
    asteroids"`, `"Show 200 man-made debris pieces"`.
  - Object counts come from the existing `data` array length in
    `AsteroidField` (passed via the `registerAsteroidData` call) or
    recomputed in the component.
  - Tooltip is keyboard-accessible (appears on focus, dismissable with
    `Esc`).
- **Suggested Files**:
  - [src/components/LeftSidebar.tsx](src/components/LeftSidebar.tsx)
  - [src/app/globals.css](src/app/globals.css) — add a `.mc-tooltip`
    class with the existing glassmorphism tokens.
- **Hints**:
  - You don't need a tooltip library — a `useState<boolean>` and
    absolutely-positioned `div` is enough.
  - Wire the tooltip to `onMouseEnter`, `onMouseLeave`,
    `onFocus`, `onBlur` so it works for both pointer and keyboard.

---

## How to use this file

1. Open GitHub → your `astrodex` repo → **Issues** → **New issue**.
2. Copy the title, body, and labels for the issue you want to publish.
3. Apply the `good first issue` label (GitHub adds it automatically
   based on the title prefix if you want).
4. Pin the issue so newcomers see it first.

These are designed to be self-contained: a contributor can pick one up,
read the file list, and ship a working PR without joining your Discord
or pinging you for clarification.
