"use client";

import * as React from "react";
import PartySocket from "partysocket";

type Peer = {
  x: number;
  y: number;
  tx: number;
  ty: number;
};

const RAW_ENDPOINT = process.env.NEXT_PUBLIC_PARTYKIT_URL || "";
const normalizeHost = (raw: string) => {
  try {
    const u = new URL(raw);
    return u.host;
  } catch {
    return raw.replace(/^wss?:\/\//, "").replace(/^https?:\/\//, "").replace(/\/$/, "");
  }
};
const ROOM_HOST = normalizeHost(RAW_ENDPOINT);

// Simple hash to seed noise per peer id
const hashId = (id: string): number => {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = ((h << 5) - h) + id.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
};

// Pseudo-random based on seed for consistent shape per peer
const seededRandom = (seed: number, index: number): number => {
  const x = Math.sin((seed + index) * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

// Draw a soft gaussian heat point (no visible boundary)
const drawHeatPoint = (ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, opacity: number) => {
  // Create a smooth radial gradient with extreme softness
  const maxRadius = radius * 6;
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxRadius);
  
  // Brighter core with sharper falloff
  grad.addColorStop(0, `rgba(255, 180, 80, ${opacity * 0.4})`);
  grad.addColorStop(0.05, `rgba(255, 180, 80, ${opacity * 0.35})`);
  grad.addColorStop(0.15, `rgba(255, 170, 70, ${opacity * 0.25})`);
  grad.addColorStop(0.3, `rgba(255, 150, 60, ${opacity * 0.12})`);
  grad.addColorStop(0.5, `rgba(255, 130, 40, ${opacity * 0.05})`);
  grad.addColorStop(0.7, `rgba(255, 110, 20, ${opacity * 0.015})`);
  grad.addColorStop(1, `rgba(255, 100, 0, 0)`);

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, maxRadius, 0, Math.PI * 2);
  ctx.fill();
};

export default function Copresence() {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [enabled, setEnabled] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (!ROOM_HOST || typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setEnabled(false);
  }, []);

  React.useEffect(() => {
    if (!enabled || !ROOM_HOST) return;

    const ws = new PartySocket({ host: ROOM_HOST, room: "global" });
    const peers = new Map<string, Peer & { seed: number }>();
    const myId = crypto.randomUUID();

    const send = (data: any) => {
      try { ws.readyState === 1 && ws.send(JSON.stringify(data)); } catch {}
    };

    let lastSend = 0;
    const onPointer = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastSend < 80) return;
      lastSend = now;
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      send({ t: "cursor", id: myId, x, y });
    };

    const onTouch = (e: TouchEvent) => {
      const now = performance.now();
      if (now - lastSend < 80) return;
      lastSend = now;
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const x = touch.clientX / window.innerWidth;
        const y = touch.clientY / window.innerHeight;
        send({ t: "cursor", id: myId, x, y });
      }
    };

    const onMessage = (ev: MessageEvent) => {
      try {
        const m = JSON.parse(ev.data as string);
        if (m.t === "cursor" && m.id !== myId) {
          if (!peers.has(m.id)) {
            peers.set(m.id, { x: m.x, y: m.y, tx: m.x, ty: m.y, seed: hashId(m.id) });
          } else {
            const p = peers.get(m.id)!;
            p.tx = m.x;
            p.ty = m.y;
          }
        } else if (m.t === "leave") {
          peers.delete(m.id);
        }
      } catch {}
    };

    ws.addEventListener("message", onMessage as any);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Apply filter blur to the canvas
    canvas.style.filter = "blur(15px)";

    let raf = 0;
    const tick = () => {
      // Even slower easing: 0.02 instead of 0.05
      for (const p of peers.values()) {
        p.x += (p.tx - p.x) * 0.02;
        p.y += (p.ty - p.y) * 0.02;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "screen";

      const heatRadius = 280;
      for (const p of peers.values()) {
        const px = p.x * canvas.width;
        const py = p.y * canvas.height;
        drawHeatPoint(ctx, px, py, heatRadius, 0.3);
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("resize", resizeCanvas);
      ws.removeEventListener("message", onMessage);
      try { ws.close(); } catch {}
    };
  }, [enabled]);

  if (!ROOM_HOST) return null;
  return <canvas ref={canvasRef} aria-hidden className="fixed inset-0 pointer-events-none z-50" />;
}


