"use client"

import { useState, useEffect, useRef } from "react"
import { useAppState } from "@/lib/store"

  const LOG_MESSAGES = [
    "[SYS] Orbital propagator initialized — 600 objects tracked",
    "[CONJ] Scanning primary object catalog for close approaches...",
    "[MANV] Δv budget: 0.35 m/s remaining across 1 burn window",
    "[CONJ] WARNING: High-risk conjunction detected — TCA imminent",
    "[TRK] Camera locked on AST-0042 — range: 1.2 AU",
    "[SYS] Ephemeris data refreshed — epoch: J2000.0",
    "[CONJ] Secondary screening complete — 6 events in queue",
    "[MANV] Burn window opens in 4h 22m — inclination change Δi=2.1°",
    "[TRK] Asteroid field density: 12.4 objects / AU³",
    "[SYS] Post-processing bloom intensity adjusted to 1.5",
    "[CONJ] Miss distance refined: 0.04 km — probability of collision: 1.2e-4",
    "[TRK] Orbit class distribution: NEO 34%, MBA 52%, TNO 14%",
    "[MANV] Optimal transfer orbit computed — Hohmann with plane change",
    "[SYS] Atmosphere shader recompiled — Fresnel edge glow active",
    "[CONJ] All-clear window: next 6h 15m — no close approaches",
  ]

  const BOOST_LOG = (km: number) => `[MANV] Boost burn executed — +${km} km altitude restored (ISS)`
  const DV_LOG = (dv: string) => `[MANV] Δv budget computed — Hohmann transfer: ${dv} m/s required`

function getTimestamp() {
  return new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })
}

export function AgentTerminal() {
  const { terminalExpanded, toggleTerminal, boostCount, deltaVCount } = useAppState()
  const [logs, setLogs] = useState<Array<{ time: string; msg: string }>>([])
  const scrollRef = useRef<HTMLDivElement>(null)
  const indexRef = useRef(3)
  const lastBoostSeen = useRef(boostCount)
  const lastDvSeen = useRef(deltaVCount)

  // Initialize logs and start interval on client side only to prevent hydration mismatch
  useEffect(() => {
    setLogs([
      { time: getTimestamp(), msg: LOG_MESSAGES[0] },
      { time: getTimestamp(), msg: LOG_MESSAGES[1] },
      { time: getTimestamp(), msg: LOG_MESSAGES[2] },
    ])
  }, [])

  // Auto-generate log entries
  useEffect(() => {
    const interval = setInterval(() => {
      const msg = LOG_MESSAGES[indexRef.current % LOG_MESSAGES.length]
      indexRef.current++
      setLogs((prev) => {
        const next = [...prev, { time: getTimestamp(), msg }]
        if (next.length > 50) next.splice(0, next.length - 50)
        return next
      })
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  // Append a log line whenever a boost burn fires
  useEffect(() => {
    if (boostCount !== lastBoostSeen.current) {
      lastBoostSeen.current = boostCount
      setLogs((prev) => {
        const next = [...prev, { time: getTimestamp(), msg: BOOST_LOG(50) }]
        if (next.length > 50) next.splice(0, next.length - 50)
        return next
      })
    }
  }, [boostCount])

  // Append a log line whenever Δv budget is computed
  useEffect(() => {
    if (deltaVCount !== lastDvSeen.current) {
      lastDvSeen.current = deltaVCount
      setLogs((prev) => {
        const next = [...prev, { time: getTimestamp(), msg: DV_LOG("N/A") }]
        if (next.length > 50) next.splice(0, next.length - 50)
        return next
      })
    }
  }, [deltaVCount])

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current && terminalExpanded) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs, terminalExpanded])

  return (
    <div
      className="glass-panel-flat"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: terminalExpanded ? "var(--terminal-expanded)" : "var(--terminal-collapsed)",
        zIndex: 40,
        borderBottom: "none",
        borderLeft: "none",
        borderRight: "none",
        borderRadius: 0,
        borderTop: "1px solid var(--glass-border)",
        transition: "height 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Toggle bar */}
      <button
        onClick={toggleTerminal}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          height: "var(--terminal-collapsed)",
          flexShrink: 0,
          background: "none",
          border: "none",
          borderBottom: terminalExpanded ? "1px solid var(--border-subtle)" : "none",
          cursor: "pointer",
          color: "var(--text-secondary)",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 17 10 11 4 5" />
            <line x1="12" y1="19" x2="20" y2="19" />
          </svg>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Agent Terminal
          </span>
          {!terminalExpanded && logs.length > 0 && (
            <span style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono), monospace" }}>
              — {logs[logs.length - 1].msg.substring(0, 60)}...
            </span>
          )}
        </div>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transition: "transform 0.3s ease",
            transform: terminalExpanded ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </button>

      {/* Terminal content */}
      {terminalExpanded && (
        <div
          ref={scrollRef}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "8px 20px",
            fontFamily: "var(--font-mono), monospace",
            fontSize: 11,
            lineHeight: 1.7,
          }}
        >
          {logs.map((log, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 10,
                opacity: i === logs.length - 1 ? 1 : 0.7,
              }}
            >
              <span style={{ color: "var(--text-muted)", flexShrink: 0 }}>{log.time}</span>
              <span
                style={{
                  color: log.msg.includes("WARNING")
                    ? "var(--accent-red)"
                    : log.msg.startsWith("[CONJ]")
                    ? "var(--accent-amber)"
                    : log.msg.startsWith("[MANV]")
                    ? "var(--accent-green)"
                    : log.msg.startsWith("[TRK]")
                    ? "var(--accent-cyan)"
                    : "var(--text-secondary)",
                }}
              >
                {log.msg}
              </span>
            </div>
          ))}
          {/* Blinking cursor */}
          <span className="animate-terminal-blink" style={{ color: "var(--accent-cyan)" }}>
            ▋
          </span>
        </div>
      )}
    </div>
  )
}
