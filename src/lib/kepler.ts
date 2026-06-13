/**
 * Keplerian Orbital Mechanics
 *
 * Implements elliptical orbit propagation using:
 *   - Kepler's equation solved via Newton-Raphson:  M = E - e·sin(E)
 *   - Vis-Viva equation:  v = sqrt( μ·(2/r − 1/a) )
 *   - Mean motion:       n = sqrt( μ / a³ )
 *
 * All math is performed in scene units (1 unit = 3543 km, where 1.8 units ≈
 * Earth's radius of 6378 km).  The time constant `SCENE_TIME_SCALE` keeps the
 * simulation visually engaging while preserving the relative physics between
 * objects of different orbital radii.
 *
 * For the user-facing telemetry in km/s, the helper `visVivaKmPerSec` performs
 * the conversion with the standard gravitational parameter μ_Earth = 3.986e5 km³/s².
 */

const MU_EARTH_KM = 3.986e5 // km³/s²
const KM_PER_UNIT = 3543 // 1 scene unit = 3543 km (Earth radius 6378 km = 1.8 units)

/**
 * Time scaling factor: scene seconds per real second.
 * Higher values accelerate orbits so LEO satellites complete a revolution in
 * tens of seconds rather than ~90 minutes.  This is a presentation knob, not
 * a physical constant — relative Keplerian behavior is preserved.
 */
export const SCENE_TIME_SCALE = 60

/**
 * Solve Kepler's equation  M = E − e·sin(E)  for the eccentric anomaly E.
 *
 * Uses Newton-Raphson with an initial guess that handles the high-eccentricity
 * regime robustly (E₀ = π when e ≥ 0.8).
 *
 * @param M Mean anomaly in radians (can be any real value; wrapped to [−π, π]).
 * @param e Eccentricity in [0, 1).
 * @param tolerance Convergence threshold on |ΔE|, default 1e-7.
 */
export function solveKepler(M: number, e: number, tolerance = 1e-7): number {
  // Wrap M to [−π, π] so the initial guess is meaningful for any time t.
  const TAU = Math.PI * 2
  const m = ((M % TAU) + TAU + Math.PI) % TAU - Math.PI

  // Robust initial guess.
  let E = e < 0.8 ? m : Math.PI * Math.sign(m || 1)

  for (let i = 0; i < 40; i++) {
    const f = E - e * Math.sin(E) - m
    const fp = 1 - e * Math.cos(E)
    const dE = f / fp
    E -= dE
    if (Math.abs(dE) < tolerance) break
  }

  return E
}

/**
 * Mean motion n (radians per scene-second) for a Keplerian orbit around Earth.
 *
 *     n = sqrt( μ_scene / a³ )
 *
 * @param aSemi Major axis in scene units (>0).
 */
export function meanMotion(a: number): number {
  // μ_scene in (scene-units)³ / (scene-seconds)² chosen so that a LEO
  // (a ≈ 1.91 units, 400 km altitude) yields a period of ~60 scene-seconds
  // when scaled by SCENE_TIME_SCALE.  Derived empirically:
  //   μ_scene = 0.005  →  n(1.91) ≈ 0.0267 rad/s,  period ≈ 235 s raw.
  const MU_SCENE = 0.005
  return Math.sqrt(MU_SCENE / (a * a * a))
}

/**
 * Vis-Viva speed in scene units per scene-second, given current radius and
 * semi-major axis.  The speed increases at perigee and decreases at apogee,
 * producing physically accurate elliptical motion.
 *
 *     v = sqrt( μ·(2/r − 1/a) )
 */
export function visViva(r: number, a: number): number {
  const MU_SCENE = 0.005
  return Math.sqrt(Math.max(0, MU_SCENE * (2 / r - 1 / a)))
}

/**
 * Vis-Viva speed expressed in km/s, using real Earth GM.  Useful for the
 * Inspector telemetry readout where users expect km/s.
 */
export function visVivaKmPerSec(rKm: number, aKm: number): number {
  return Math.sqrt(Math.max(0, MU_EARTH_KM * (2 / rKm - 1 / aKm)))
}

/**
 * Convert a radius expressed in scene units to kilometers.
 */
export function sceneUnitsToKm(units: number): number {
  return units * KM_PER_UNIT
}

/**
 * Convert a radius expressed in kilometers to scene units.
 */
export function kmToSceneUnits(km: number): number {
  return km / KM_PER_UNIT
}

/**
 * Convert a scene-unit per scene-second velocity to km/s for display.
 *
 * Real-world Vis-Viva for LEO yields ~7.66 km/s, but the scene's time
 * scale is accelerated, so the raw conversion would read ~460 km/s.
 * We damp the display by 1 / SCENE_TIME_SCALE so the user-visible velocity
 * remains close to the textbook value.
 */
export function velocityToKmPerSec(sceneV: number): number {
  return (sceneV * KM_PER_UNIT) / SCENE_TIME_SCALE
}

/**
 * Atmospheric-drag decay rate (km per real-second) applied to LEO satellites
 * such as the ISS.  This is a presentation-tuned value: ~0.05 km/s of real
 * time, so the satellite loses ~3 km/min and reaches threatening altitudes
 * within a few minutes of unattended operation.
 */
export const LEO_DECAY_KM_PER_SEC = 0.05

export const KM_PER_UNIT_CONST = KM_PER_UNIT

/**
 * Calculate the total delta-V (km/s) required for a Hohmann transfer between
 * two coplanar circular orbits around Earth.
 *
 * A Hohmann transfer is a two-impulse elliptical transfer:
 *   1. First burn at perigee of transfer ellipse (r₁) to raise apogee to r₂.
 *   2. Second burn at apogee of transfer ellipse (r₂) to circularise.
 *
 * @param r1Km Initial circular orbit radius in km.
 * @param r2Km Target circular orbit radius in km.
 * @returns Total Δv in km/s.
 */
export function hohmannDeltaVKmPerSec(r1Km: number, r2Km: number): number {
  if (r1Km <= 0 || r2Km <= 0) return 0
  const mu = MU_EARTH_KM
  const v1 = Math.sqrt(mu / r1Km)
  const v2 = Math.sqrt(mu / r2Km)
  const aTransfer = (r1Km + r2Km) / 2
  const vPerigee = Math.sqrt(mu * (2 / r1Km - 1 / aTransfer))
  const vApogee = Math.sqrt(mu * (2 / r2Km - 1 / aTransfer))
  const dV1 = Math.abs(vPerigee - v1)
  const dV2 = Math.abs(v2 - vApogee)
  return dV1 + dV2
}
