"use client";

import { useEffect, useRef } from "react";
import { LINKS, PIVOTS, type Layer, type Tone } from "./so101-geometry";

// Side view of my SO-101, drawn from its real CAD. Units are millimetres.
// Square frame (same footprint as before); the SVG overflows visibly so the
// gripper is never clipped when it waves or reaches past the edges.
const VB = { x: -36, y: -352, w: 362, h: 362 };

const S = PIVOTS.shoulder_lift;
const E = PIVOTS.elbow_flex;
const W = PIVOTS.wrist_flex;
const G = PIVOTS.gripper;
const T = PIVOTS.tip;

const L1 = Math.hypot(E[0] - S[0], E[1] - S[1]);
const L2 = Math.hypot(W[0] - E[0], W[1] - E[1]);
const L3 = Math.hypot(T[0] - W[0], T[1] - W[1]);
// Link directions with every joint at zero (SVG coords, y down).
const B1 = Math.atan2(E[1] - S[1], E[0] - S[0]);
const B2 = Math.atan2(W[1] - E[1], W[0] - E[0]);
const B3 = Math.atan2(T[1] - W[1], T[0] - W[0]);

const DEG = Math.PI / 180;
// URDF joint limits (shoulder_lift, elbow_flex, wrist_flex), a little inset.
const LIM1 = 95 * DEG;
const LIM2 = 92 * DEG;
const LIM3 = 92 * DEG;

const REST = { x: S[0] + 220, y: S[1] - 10 };
const REST_TOOL = 38 * DEG;
// Hover only nudges the arm toward the cursor; dragging still follows fully.
const HINT_X = 22;
const HINT_Y = 16;
const HINT_FALLOFF = 340;

// Raise arm → wave the wrist a few times → back to rest.
const WAVE_UP_START = 0.35;
const WAVE_UP_END = 0.95;
const WAVE_END = 2.6;
const WAVE_DOWN_END = 3.25;
const WAVE_LOOP_MS = 650;

const FILL: Record<Tone, string> = {
  p0: "#6cbc2a",
  p1: "#86d63c",
  p2: "#a3e65c",
  s0: "#161618",
  s1: "#222226",
  s2: "#33333a",
};
// The moving jaw is printed in black on my arm.
const JAW_FILL: Record<Tone, string> = {
  p0: "#1f1f22",
  p1: "#2c2c31",
  p2: "#3e3e45",
  s0: "#161618",
  s1: "#222226",
  s2: "#33333a",
};

type Joints = { q1: number; q2: number; q3: number; grip: number };

function clamp(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v));
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const u = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return u * u * (3 - 2 * u);
}

/** Planar IK for the tool tip at (tx, ty) pointing along `tool` (radians, y down). */
function solve(tx: number, ty: number, tool: number): Omit<Joints, "grip"> {
  let wx = tx - L3 * Math.cos(tool);
  let wy = ty - L3 * Math.sin(tool);
  let dx = wx - S[0];
  let dy = wy - S[1];
  let dist = Math.hypot(dx, dy);
  const maxR = L1 + L2 - 2;
  const minR = Math.abs(L1 - L2) + 40;
  if (dist > maxR || dist < minR) {
    const r = clamp(dist, minR, maxR);
    const k = dist > 0 ? r / dist : 0;
    dx *= k;
    dy *= k;
    wx = S[0] + dx;
    wy = S[1] + dy;
    dist = r;
  }
  const phi = Math.atan2(dy, dx);
  const A = Math.acos(clamp((L1 * L1 + dist * dist - L2 * L2) / (2 * L1 * dist), -1, 1));
  // Elbow up: in y-down coords that's the solution rotated counter-clockwise.
  const a1 = phi - A;
  const ex = S[0] + L1 * Math.cos(a1);
  const ey = S[1] + L1 * Math.sin(a1);
  const a2 = Math.atan2(wy - ey, wx - ex);

  const q1 = clamp(a1 - B1, -LIM1, LIM1);
  const q2 = clamp(a2 - B2 - q1, -LIM2, LIM2);
  const q3 = clamp(tool - B3 - q1 - q2, -LIM3, LIM3);
  return { q1, q2, q3 };
}

function wrap(a: number) {
  return Math.atan2(Math.sin(a), Math.cos(a));
}

// Hand-picked so the raised gripper stays inside the frame while it flaps.
const WAVE_POSE = { q1: -20 * DEG, q2: 55 * DEG, q3: -100 * DEG };

const REST_POSE: Joints = { ...solve(REST.x, REST.y, REST_TOOL), grip: 18 * DEG };

const rot = (q: number, p: readonly [number, number]) =>
  `rotate(${(q / DEG).toFixed(2)} ${p[0]} ${p[1]})`;

function Layers({ layers, fill }: { layers: readonly Layer[]; fill: Record<Tone, string> }) {
  return (
    <>
      {layers.map(([tone, d], i) => (
        <path
          key={i}
          d={d}
          fill={fill[tone]}
          fillRule="evenodd"
          stroke={tone.endsWith("0") ? (tone[0] === "s" ? "#000" : "#4b8f1c") : undefined}
          strokeWidth={tone.endsWith("0") ? 0.7 : undefined}
          strokeLinejoin="round"
        />
      ))}
    </>
  );
}

export default function RobotArm() {
  const svgRef = useRef<SVGSVGElement>(null);
  const upperRef = useRef<SVGGElement>(null);
  const lowerRef = useRef<SVGGElement>(null);
  const wristRef = useRef<SVGGElement>(null);
  const jawRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const apply = (j: Joints) => {
      upperRef.current?.setAttribute("transform", rot(j.q1, S));
      lowerRef.current?.setAttribute("transform", rot(j.q2, E));
      wristRef.current?.setAttribute("transform", rot(j.q3, W));
      // The jaw opens counter-clockwise in this view.
      jawRef.current?.setAttribute("transform", rot(-j.grip, G));
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      apply(REST_POSE);
      return;
    }

    const startedAt = performance.now();
    const target = { x: REST.x, y: REST.y };
    const state: Joints = { ...REST_POSE };
    let lastMove = startedAt;
    let phase: "wave" | "follow" = "wave";
    let dragging = false;

    const onMove = (e: PointerEvent) => {
      const rect = svg.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      target.x = VB.x + ((e.clientX - rect.left) / rect.width) * VB.w;
      target.y = VB.y + ((e.clientY - rect.top) / rect.height) * VB.h;
      lastMove = performance.now();
    };

    const onDown = (e: PointerEvent) => {
      phase = "follow";
      dragging = true;
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
      let goal: Joints;
      let speed = 0.05;

      if (phase === "wave") {
        const t = elapsed / 1000;
        const blend = Math.min(
          smoothstep(WAVE_UP_START, WAVE_UP_END, t),
          1 - smoothstep(WAVE_END, WAVE_DOWN_END, t)
        );
        // Arm up, gripper pointing at the sky, wrist flapping hello.
        const up = WAVE_POSE;
        const waving = t > WAVE_UP_END && t < WAVE_END;
        const flap = waving ? Math.sin(((elapsed % WAVE_LOOP_MS) / WAVE_LOOP_MS) * Math.PI * 2) : 0;
        goal = {
          q1: REST_POSE.q1 + (up.q1 - REST_POSE.q1) * blend,
          q2: REST_POSE.q2 + (up.q2 - REST_POSE.q2) * blend,
          q3: REST_POSE.q3 + (up.q3 - REST_POSE.q3) * blend + flap * 25 * DEG * blend,
          grip: REST_POSE.grip + blend * 14 * DEG,
        };
        speed = 0.2;
        if (t > WAVE_DOWN_END) {
          phase = "follow";
          lastMove = now;
        }
      } else {
        let tx: number;
        let ty: number;
        if (dragging) {
          tx = target.x;
          ty = target.y;
          speed = 0.2;
        } else if (now - lastMove > 2600) {
          // Curious idle: slow wander with small quick glances.
          const t = now / 1000;
          tx = REST.x + 22 * Math.sin(t / 1.7) + 9 * Math.sin(t / 0.53);
          ty = REST.y + 16 * Math.sin(t / 2.13) + 7 * Math.cos(t / 0.61);
        } else {
          // A soft lean toward the cursor that saturates with distance.
          const hx = target.x - REST.x;
          const hy = target.y - REST.y;
          const hd = Math.hypot(hx, hy);
          const lean = hd > 0 ? Math.tanh(hd / HINT_FALLOFF) / hd : 0;
          tx = REST.x + hx * lean * HINT_X;
          ty = REST.y + hy * lean * HINT_Y;
        }
        // Stay in frame and above the table.
        tx = clamp(tx, S[0] + 60, VB.x + VB.w + 30);
        ty = clamp(ty, -280, -12);
        // Point the gripper down at low targets, more forward at high ones.
        const tool = clamp(REST_TOOL + ((ty - REST.y) / 200) * 55 * DEG, -15 * DEG, 85 * DEG);
        goal = { ...solve(tx, ty, tool), grip: dragging ? -4 * DEG : REST_POSE.grip };
      }

      state.q1 += wrap(goal.q1 - state.q1) * speed;
      state.q2 += wrap(goal.q2 - state.q2) * speed;
      state.q3 += wrap(goal.q3 - state.q3) * speed;
      state.grip += (goal.grip - state.grip) * 0.2;
      apply(state);
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
      viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`}
      className="robot-arm"
      role="img"
      aria-label="My SO-101 robot arm, which waves hello and follows your cursor"
    >
      <ellipse cx="30" cy="4" rx="92" ry="9" fill="rgba(23,23,23,0.08)" />
      <Layers layers={LINKS.base} fill={FILL} />
      <g ref={upperRef} transform={rot(REST_POSE.q1, S)}>
        <Layers layers={LINKS.upper} fill={FILL} />
        <g ref={lowerRef} transform={rot(REST_POSE.q2, E)}>
          <Layers layers={LINKS.lower} fill={FILL} />
          <g ref={wristRef} transform={rot(REST_POSE.q3, W)}>
            <Layers layers={LINKS.wrist} fill={FILL} />
            <g ref={jawRef} transform={rot(-REST_POSE.grip, G)}>
              <Layers layers={LINKS.jaw} fill={JAW_FILL} />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}
