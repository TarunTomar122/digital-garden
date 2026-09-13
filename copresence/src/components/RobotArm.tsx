"use client";

import { useEffect, useRef } from "react";

const VIEW = 300;
const L1 = 80;
const L2 = 70;
const SHOULDER = { x: 150, y: 220 };
const REST = { x: SHOULDER.x + 88, y: SHOULDER.y - 78 };
const MIN_REACH = 100;
const MAX_REACH = 128;

// Disable before the wave starts → raise arm → wave a few times → back to rest.
const WAVE_UP_START = 0.35;
const WAVE_UP_END = 0.95;
const WAVE_END = 2.5;
const WAVE_DOWN_END = 3.15;
const WAVE_LOOP_MS = 1500;

function smoothstep(edge0: number, edge1: number, x: number) {
  const u = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return u * u * (3 - 2 * u);
}

export default function RobotArm() {
  const svgRef = useRef<SVGSVGElement>(null);
  const upperRef = useRef<SVGGElement>(null);
  const foreRef = useRef<SVGGElement>(null);
  const gripRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const pose = (a1: number, a2: number) => {
      upperRef.current?.setAttribute(
        "transform",
        `translate(${SHOULDER.x} ${SHOULDER.y}) rotate(${(a1 * 180) / Math.PI})`
      );
      foreRef.current?.setAttribute(
        "transform",
        `translate(${L1} 0) rotate(${((a2 - a1) * 180) / Math.PI})`
      );
    };

    const setGrip = (amount: number) => {
      gripRef.current?.setAttribute(
        "transform",
        `translate(${L2 + 8} 0) scale(1 ${(1 - amount * 0.35).toFixed(3)})`
      );
    };

    if (reduce) {
      pose(-Math.PI / 3.4, -Math.PI / 5);
      return;
    }

    const startedAt = performance.now();
    const target = { x: REST.x, y: REST.y };
    const state = { a1: -Math.PI / 3.4, a2: -Math.PI / 5 };
    let lastMove = startedAt;
    let phase: "wave" | "follow" = "wave";
    let dragging = false;
    let grabAmount = 0;
    let branch = 1; // knee preference for IK continuity

    const onMove = (e: PointerEvent) => {
      const rect = svg.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      target.x = ((e.clientX - rect.left) / rect.width) * VIEW;
      target.y = ((e.clientY - rect.top) / rect.height) * VIEW;
      lastMove = performance.now();
    };

    const onDown = (e: PointerEvent) => {
      phase = "follow";
      dragging = true;
      grabAmount = 1;
      svg.setPointerCapture?.(e.pointerId);
      onMove(e);
    };

    const onUp = () => {
      dragging = false;
      lastMove = performance.now();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    svg.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    let raf = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);

      const elapsed = now - startedAt;
      let tx: number;
      let ty: number;

      if (phase === "wave") {
        const t = elapsed / 1000;
        const rising = smoothstep(WAVE_UP_START, WAVE_UP_END, t);
        const falling = 1 - smoothstep(WAVE_END, WAVE_DOWN_END, t);
        const blend = Math.min(rising, falling);

        const wavePos = {
          x: SHOULDER.x + 84,
          y: SHOULDER.y - 112,
        };
        const waving = t > WAVE_UP_END && t < WAVE_END;
        const swing = waving
          ? Math.sin(((elapsed % WAVE_LOOP_MS) / WAVE_LOOP_MS) * Math.PI * 2) * 34
          : 0;

        tx = REST.x + (wavePos.x + swing - REST.x) * blend;
        ty = REST.y + (wavePos.y - REST.y) * blend;

        if (t > WAVE_DOWN_END) {
          phase = "follow";
          lastMove = now;
        }
      } else if (now - lastMove > 2600) {
        // Curious idle: slow wander with small quick glances.
        const t = now / 1000;
        tx = REST.x + 16 * Math.sin(t / 1.7) + 7 * Math.sin(t / 0.53);
        ty = REST.y + 12 * Math.sin(t / 2.13) + 5 * Math.cos(t / 0.61);
      } else {
        tx = target.x;
        ty = target.y;
      }

      // Reach envelope: never behind the base, never straight down, always
      // extended enough that the arm can't fold onto itself.
      tx = Math.max(56, Math.min(VIEW - 56, tx));
      ty = Math.max(44, Math.min(SHOULDER.y + 30, ty));

      const dx = tx - SHOULDER.x;
      const dy = ty - SHOULDER.y;
      const dist = Math.min(
        Math.max(Math.hypot(dx, dy), MIN_REACH),
        MAX_REACH
      );
      const phi = Math.atan2(dy, dx);
      const cosA = (L1 * L1 + dist * dist - L2 * L2) / (2 * L1 * dist);
      const A = Math.acos(Math.min(1, Math.max(-1, cosA)));

      // Prefer the "elbow up" solution so the arm arches instead of drooping.
      const a1a = phi - A;
      const a1b = phi + A;
      const elbowYA = SHOULDER.y + L1 * Math.sin(a1a);
      const elbowYB = SHOULDER.y + L1 * Math.sin(a1b);
      let a1: number;
      if (Math.abs(elbowYA - elbowYB) < 2) {
        // Singular pose (target straight up): keep the previous branch.
        a1 = branch >= 0 ? a1a : a1b;
      } else if (elbowYA < elbowYB) {
        a1 = a1a;
        branch = 1;
      } else {
        a1 = a1b;
        branch = -1;
      }
      const ex = SHOULDER.x + L1 * Math.cos(a1);
      const ey = SHOULDER.y + L1 * Math.sin(a1);
      const a2 = Math.atan2(ty - ey, tx - ex);

      const speed = dragging ? 0.22 : phase === "wave" ? 0.2 : 0.09;
      let d1 = a1 - state.a1;
      d1 = Math.atan2(Math.sin(d1), Math.cos(d1));
      let d2 = a2 - state.a2;
      d2 = Math.atan2(Math.sin(d2), Math.cos(d2));
      state.a1 += d1 * speed;
      state.a2 += d2 * speed;

      pose(state.a1, state.a2);

      // Close the gripper while grabbed.
      const gripTarget = dragging ? 1 : 0;
      if (Math.abs(grabAmount - gripTarget) > 0.001) {
        grabAmount += (gripTarget - grabAmount) * 0.2;
        setGrip(grabAmount);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      svg.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${VIEW} ${VIEW}`}
      className="robot-arm"
      role="img"
      aria-label="A little robot arm that waves hello and follows your cursor"
    >
      <defs>
        <linearGradient id="ra-metal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fafafa" />
          <stop offset="0.55" stopColor="#e4e4e7" />
          <stop offset="1" stopColor="#c9c9ce" />
        </linearGradient>
        <radialGradient id="ra-joint" cx="0.35" cy="0.3" r="0.95">
          <stop offset="0" stopColor="#52525b" />
          <stop offset="1" stopColor="#18181b" />
        </radialGradient>
        <linearGradient id="ra-base" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3f3f46" />
          <stop offset="1" stopColor="#18181b" />
        </linearGradient>
      </defs>

      {/* ground shadow */}
      <ellipse cx={SHOULDER.x} cy="272" rx="60" ry="8" fill="rgba(23,23,23,0.08)" />

      {/* base pedestal */}
      <rect x={SHOULDER.x - 34} y="263" width="68" height="10" rx="4" fill="#18181b" />
      <rect x={SHOULDER.x - 22} y="231" width="44" height="36" rx="9" fill="url(#ra-base)" />
      <rect x={SHOULDER.x - 22} y="231" width="44" height="9" rx="4.5" fill="#52525b" opacity="0.55" />

      {/* shoulder housing */}
      <circle cx={SHOULDER.x} cy={SHOULDER.y + 4} r="18" fill="#18181b" />
      <circle cx={SHOULDER.x} cy={SHOULDER.y + 4} r="18" fill="url(#ra-joint)" />
      <circle
        cx={SHOULDER.x}
        cy={SHOULDER.y + 4}
        r="11"
        fill="none"
        stroke="#dc2626"
        strokeWidth="1.4"
        strokeDasharray="2.5 3.5"
        opacity="0.9"
      />
      <circle cx={SHOULDER.x} cy={SHOULDER.y + 4} r="4" fill="#71717a" />

      {/* upper arm */}
      <g ref={upperRef} transform={`translate(${SHOULDER.x} ${SHOULDER.y}) rotate(-60)`}>
        <rect
          x="8"
          y="-12"
          width={L1 - 8}
          height="24"
          rx="12"
          fill="url(#ra-metal)"
          stroke="#a1a1aa"
          strokeWidth="1"
        />
        <rect x="20" y="-4" width={L1 - 38} height="8" rx="4" fill="#18181b" opacity="0.82" />
        <rect x="14" y="-8.5" width="10" height="17" rx="4" fill="#d4d4d8" opacity="0.7" />

        {/* elbow housing */}
        <circle cx={L1} cy="0" r="14" fill="#18181b" />
        <circle cx={L1} cy="0" r="14" fill="url(#ra-joint)" />
        <circle cx={L1} cy="0" r="5" fill="#3f3f46" />
        <circle cx={L1} cy="0" r="2" fill="#a1a1aa" />

        {/* forearm */}
        <g ref={foreRef} transform={`translate(${L1} 0) rotate(10)`}>
          <rect
            x="6"
            y="-10"
            width={L2 - 6}
            height="20"
            rx="10"
            fill="url(#ra-metal)"
            stroke="#a1a1aa"
            strokeWidth="1"
          />
          <rect x="16" y="-3.5" width={L2 - 32} height="7" rx="3.5" fill="#18181b" opacity="0.82" />

          {/* wrist */}
          <rect x={L2 - 6} y="-11" width="16" height="22" rx="5" fill="#18181b" />
          <circle cx={L2 + 2} cy="0" r="3" fill="#52525b" />

          {/* gripper fingers */}
          <g ref={gripRef} transform={`translate(${L2 + 8} 0)`}>
            <path
              d="M0 -14 C10 -15 20 -13 27 -9 L23 -3 C17 -6 9 -6 2 -5 Z"
              fill="#27272a"
            />
            <path
              d="M0 14 C10 15 20 13 27 9 L23 3 C17 6 9 6 2 5 Z"
              fill="#27272a"
            />
          </g>
        </g>
      </g>
    </svg>
  );
}
