/**
 * Generative shape vocabulary, after Book of Shapes.
 *
 * Six generators, one per chapter, each drawn from a different family:
 * Grid (truchet), Radial (phyllotaxis, interference), Isometric (cubes),
 * Noise (mesh ridgelines) and Flow (lissajous).
 *
 * Every generator is a pure function of a seed and a viewBox. No Math.random,
 * no Date — the same seed always produces the same markup, so the server and
 * the client agree and React never reports a hydration mismatch.
 */

export type ShapeName =
  | "truchet"
  | "phyllotaxis"
  | "isometric"
  | "mesh"
  | "interference"
  | "lissajous";

export type Prim =
  | { k: "path"; d: string; w?: number; fill?: boolean; o?: number; accent?: boolean }
  | { k: "circle"; cx: number; cy: number; r: number; fill?: boolean; o?: number; accent?: boolean };

/** Mulberry32 — small, fast, and deterministic across environments. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const W = 1000;
const H = 1000;

/** Grid family — quarter-arc tiles in random orientation form continuous mazes. */
function truchet(seed: number, density = 14): Prim[] {
  const r = rng(seed);
  const s = W / density;
  const out: Prim[] = [];
  for (let y = 0; y < density; y++) {
    for (let x = 0; x < density; x++) {
      const px = x * s;
      const py = y * s;
      const flip = r() > 0.5;
      const accent = r() > 0.88;
      const d = flip
        ? `M${px} ${py + s / 2}A${s / 2} ${s / 2} 0 0 1 ${px + s / 2} ${py}` +
          `M${px + s / 2} ${py + s}A${s / 2} ${s / 2} 0 0 1 ${px + s} ${py + s / 2}`
        : `M${px + s / 2} ${py}A${s / 2} ${s / 2} 0 0 1 ${px + s} ${py + s / 2}` +
          `M${px} ${py + s / 2}A${s / 2} ${s / 2} 0 0 1 ${px + s / 2} ${py + s}`;
      out.push({ k: "path", d, w: 2, o: accent ? 0.9 : 0.42, accent });
    }
  }
  return out;
}

/** Radial family — sunflower packing at the golden angle. */
function phyllotaxis(seed: number, n = 620): Prim[] {
  const r = rng(seed);
  const GOLDEN = Math.PI * (3 - Math.sqrt(5));
  const out: Prim[] = [];
  for (let i = 0; i < n; i++) {
    const a = i * GOLDEN;
    const rad = 15.5 * Math.sqrt(i);
    const cx = W / 2 + rad * Math.cos(a);
    const cy = H / 2 + rad * Math.sin(a);
    if (cx < -20 || cx > W + 20 || cy < -20 || cy > H + 20) continue;
    const t = i / n;
    out.push({
      k: "circle",
      cx,
      cy,
      r: 1.6 + t * 7,
      fill: true,
      o: 0.16 + t * 0.5,
      accent: r() > 0.9,
    });
  }
  return out;
}

/** Isometric family — a cube grid drawn as three rhombus faces. */
function isometric(seed: number, cols = 11): Prim[] {
  const r = rng(seed);
  const s = W / cols;
  const hw = s / 2;
  const hh = s / 4;
  const out: Prim[] = [];
  for (let y = -2; y < cols * 2 + 2; y++) {
    for (let x = -1; x < cols + 1; x++) {
      if (r() > 0.62) continue;
      const cx = x * s + (y % 2 ? hw : 0);
      const cy = y * hh * 1.02;
      const h = s * (0.4 + r() * 0.5);
      const accent = r() > 0.85;
      const top = `M${cx} ${cy - hh}L${cx + hw} ${cy}L${cx} ${cy + hh}L${cx - hw} ${cy}Z`;
      const left = `M${cx - hw} ${cy}L${cx} ${cy + hh}L${cx} ${cy + hh + h}L${cx - hw} ${cy + h}Z`;
      const right = `M${cx + hw} ${cy}L${cx} ${cy + hh}L${cx} ${cy + hh + h}L${cx + hw} ${cy + h}Z`;
      out.push({ k: "path", d: top, w: 1.4, o: accent ? 0.85 : 0.4, accent });
      out.push({ k: "path", d: left, w: 1.4, o: 0.22 });
      out.push({ k: "path", d: right, w: 1.4, o: 0.3 });
    }
  }
  return out;
}

/** Noise family — stacked ridgelines, the Joy Division construction. */
function mesh(seed: number, rows = 26): Prim[] {
  const r = rng(seed);
  const out: Prim[] = [];
  const cols = 110;
  const phases = Array.from({ length: 5 }, () => r() * Math.PI * 2);
  for (let y = 0; y < rows; y++) {
    const baseY = 120 + (y / (rows - 1)) * (H - 240);
    let d = "";
    for (let x = 0; x <= cols; x++) {
      const t = x / cols;
      // Envelope keeps the disturbance in the middle of each line.
      const env = Math.exp(-Math.pow((t - 0.5) * 3.1, 2));
      const amp =
        Math.sin(t * 9 + phases[0] + y * 0.5) * 16 +
        Math.sin(t * 21 + phases[1] + y * 0.31) * 9 +
        Math.sin(t * 41 + phases[2] + y * 0.17) * 4.5;
      const px = t * W;
      const py = baseY - amp * env * 1.55;
      d += `${x === 0 ? "M" : "L"}${px.toFixed(1)} ${py.toFixed(1)}`;
    }
    out.push({ k: "path", d, w: 1.6, o: 0.28 + (y / rows) * 0.42, accent: y % 7 === 3 });
  }
  return out;
}

/** Radial family — overlapping ring sets create moiré interference. */
function interference(seed: number, sources = 3): Prim[] {
  const r = rng(seed);
  const out: Prim[] = [];
  for (let s = 0; s < sources; s++) {
    const cx = W * (0.2 + r() * 0.6);
    const cy = H * (0.2 + r() * 0.6);
    const rings = 26;
    for (let i = 1; i <= rings; i++) {
      out.push({
        k: "circle",
        cx,
        cy,
        r: i * 21,
        o: 0.3 - (i / rings) * 0.2,
        accent: s === sources - 1 && i % 6 === 0,
      });
    }
  }
  return out;
}

/** Flow family — a field of phase-shifted Lissajous curves. */
function lissajous(seed: number, curves = 16): Prim[] {
  const r = rng(seed);
  const out: Prim[] = [];
  for (let c = 0; c < curves; c++) {
    const a = 2 + Math.floor(r() * 5);
    const b = 2 + Math.floor(r() * 5);
    const phase = r() * Math.PI * 2;
    const scale = 180 + r() * 260;
    const cx = W / 2;
    const cy = H / 2;
    let d = "";
    const steps = 200;
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * Math.PI * 2;
      const px = cx + Math.sin(a * t + phase) * scale;
      const py = cy + Math.sin(b * t) * scale;
      d += `${i === 0 ? "M" : "L"}${px.toFixed(1)} ${py.toFixed(1)}`;
    }
    out.push({ k: "path", d, w: 1.2, o: 0.14 + r() * 0.3, accent: r() > 0.82 });
  }
  return out;
}

const GENERATORS: Record<ShapeName, (seed: number) => Prim[]> = {
  truchet,
  phyllotaxis,
  isometric,
  mesh,
  interference,
  lissajous,
};

export function generate(name: ShapeName, seed: number): Prim[] {
  return GENERATORS[name](seed);
}

export const VIEWBOX = `0 0 ${W} ${H}`;
