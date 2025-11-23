"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

// --- Types ---

type EmbeddingFile = {
  domain: string;
  embeddings: number[][];
  metadata: Record<string, unknown>[];
  texts: string[];
};

type Node = d3.SimulationNodeDatum & {
  id: string;
  label: string;
  domain: string;
  path: string;
  desc: string;
  r: number;
  baseLabel?: boolean;
  degree?: number;
};

type Link = d3.SimulationLinkDatum<Node> & {
  value: number;
};

// --- Config ---

const DOMAINS = ["projects", "writings", "experience"]; // Exclude books & list100 for now
const DOMAIN_COLORS: Record<string, string> = {
  projects: "#FF6B6B",
  writings: "#4ECDC4", 
  experience: "#1A535C",
};
const SIMILARITY_THRESHOLD = 0.35; // Lowered to get more connections
const MAX_NEIGHBORS = 4;

// --- Helpers ---

function cosineSimilarity(a: number[], b: number[]) {
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  return dot / (Math.sqrt(magA) * Math.sqrt(magB) || 1);
}

function cleanSnippet(text: string): string {
  // Remove frontmatter (YAML between --- markers)
  let cleaned = text.replace(/^---[\s\S]*?---\s*/m, '');
  
  // Remove markdown heading markers at start
  cleaned = cleaned.replace(/^#+ /, '');
  
  // Remove markdown formatting
  cleaned = cleaned
    .replace(/[*_`]/g, '') // Remove markdown symbols
    .replace(/\n+/g, ' ') // Replace newlines with space
    .replace(/\s+/g, ' ') // Collapse multiple spaces
    .trim();
  
  return cleaned;
}

function parseFrontmatter(text: string): Record<string, string> | null {
  const match = text.match(/^---[\s\S]*?---/);
  if (!match) return null;
  const yaml = match[0].replace(/^---\s*/, '').replace(/\s*---$/, '');
  const out: Record<string, string> = {};
  yaml.split(/\n/).forEach((line) => {
    const m = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (m) out[m[1].trim()] = m[2].trim();
  });
  return out;
}

// --- Component ---

export default function GardenMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [loading, setLoading] = useState(true);
  const simulationRef = useRef<d3.Simulation<Node, Link> | null>(null);
  const isDraggingRef = useRef(false);
  const [stats, setStats] = useState({ nodes: 0, links: 0 });
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  useEffect(() => {
    async function init() {
      try {
        // 1. Fetch all data
        const promises = DOMAINS.map((d) =>
          fetch(`/embeddings-${d}.json`).then((res) =>
            res.ok ? res.json() : null
          )
        );
        const results = await Promise.all(promises);
        const files = results.filter(Boolean) as EmbeddingFile[];

        console.log("Loaded files:", files.map(f => ({ domain: f.domain, count: f.embeddings?.length || 0 })));

        // 2. Process Nodes
        const nodes: Node[] = [];
        const allEmbeddings: number[][] = [];

        files.forEach((file) => {
          const domain = file.domain || "unknown";
          
          console.log(`Processing domain: ${domain}, embeddings count: ${file.embeddings?.length || 0}`);

          file.embeddings.forEach((emb, i) => {
            if (!emb || emb.length === 0) return;
            
            const meta = file.metadata[i] || {};
            const rawText = (file.texts[i] || "");
            
            let label: string = "Untitled";
            let path: string = "";
            let description: string | undefined;

            // Clean up labels/paths based on domain
            if (domain === "projects") {
                // meta.name exists for projects/writings
                label = ((meta.name as string) || "Untitled").replace(/\.mdx?$/, "");
                path = `/projects/${label}`;
                const fm = parseFrontmatter(file.texts[i] || "");
                if (fm && fm.title) {
                  label = fm.title;
                }
                if (fm && fm.description) {
                  description = fm.description;
                }
                console.log(`Project: ${label}, desc: ${description?.slice(0, 50)}`);
            } else if (domain === "writings") {
                label = ((meta.name as string) || "Untitled").replace(/\.mdx?$/, "");
                path = `/writings/${label}`;
                const fm = parseFrontmatter(file.texts[i] || "");
                if (fm && fm.title) label = fm.title;
                if (fm && fm.description) description = fm.description;
            } else if (domain === "books") {
                // Books is aggregated, no "name" field
                path = "/library";
                label = "Library";
            } else if (domain === "list100") {
                // List100 is aggregated, no "name" field
                path = "/list100";
                label = "List 100";
            } else if (domain === "experience") {
                // Experience is aggregated
                path = "/experience";
                label = "Experience";
                description = "Places I've worked";
            }

            nodes.push({
              id: `${domain}-${i}`,
              label,
              domain,
              path,
              desc: description || "No description available",
              r: domain === "experience" ? 14 : 8,
              x: 0, y: 0,
            });
            allEmbeddings.push(emb);
          });
        });

        console.log("Total nodes:", nodes.length);
        console.log("Node breakdown:", nodes.reduce((acc, n) => {
          acc[n.domain] = (acc[n.domain] || 0) + 1;
          return acc;
        }, {} as Record<string, number>));

        // 3. Compute Links (KNN)
        const links: Link[] = [];
        const N = nodes.length;
        
        for (let i = 0; i < N; i++) {
          const sims: { idx: number; val: number }[] = [];
          for (let j = 0; j < N; j++) {
            if (i === j) continue;
            const sim = cosineSimilarity(allEmbeddings[i], allEmbeddings[j]);
            if (sim > SIMILARITY_THRESHOLD) {
              sims.push({ idx: j, val: sim });
            }
          }
          sims.sort((a, b) => b.val - a.val);
          const topK = sims.slice(0, MAX_NEIGHBORS);
          
          topK.forEach((item) => {
            if (i < item.idx) {
                links.push({
                  source: nodes[i],
                  target: nodes[item.idx],
                  value: item.val,
                });
            }
          });
        }

        setStats({ nodes: nodes.length, links: links.length });
        setLoading(false);
        
        // 4. D3 Viz
        if (!svgRef.current || !containerRef.current) return;
        
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        // Compute node degrees for label priority
        const degreeMap = new Map<string, number>();
        nodes.forEach((n) => degreeMap.set(n.id, 0));
        links.forEach((l) => {
          const s = (l.source as Node).id;
          const t = (l.target as Node).id;
          degreeMap.set(s, (degreeMap.get(s) || 0) + 1);
          degreeMap.set(t, (degreeMap.get(t) || 0) + 1);
        });
        nodes.forEach((n) => (n.degree = degreeMap.get(n.id) || 0));
        const BASE_LABEL_MIN = 10;
        const BASE_LABEL_FRACTION = 0.35; // show top 35% labels
        const topK = Math.min(nodes.length, Math.max(BASE_LABEL_MIN, Math.floor(nodes.length * BASE_LABEL_FRACTION)));
        const topNodes = [...nodes].sort((a, b) => (b.degree || 0) - (a.degree || 0)).slice(0, topK);
        const topSet = new Set(topNodes.map((n) => n.id));
        nodes.forEach((n) => (n.baseLabel = topSet.has(n.id)));

        // Root group for zooming
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();
        // Clean up any existing tooltips
        d3.selectAll(".graph-tooltip").remove();
        const g = svg.append("g");

        let zoomK = 1;
        const zoom = d3.zoom<SVGSVGElement, unknown>()
            .scaleExtent([0.3, 3])
            .on("zoom", (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
                zoomK = event.transform.k;
                g.attr("transform", event.transform.toString());
            });
        
        zoomBehaviorRef.current = zoom;
        svg.call(zoom);

        // Domain lanes (separate horizontally AND vertically by domain)
        const domainX: Record<string, number> = {
          writings: width * 0.28,
          projects: width * 0.72,
          experience: width * 0.5,
        };
        
        // Add vertical stratification to prevent horizontal stacking
        const domainY: Record<string, number> = {
          writings: height * 0.45,
          projects: height * 0.55,
          experience: height * 0.5,
        };

        // Dynamic link distance based on similarity (shorter for higher sim, MUCH longer for weak links)
        const distanceScale = d3
          .scaleLinear<number, number>()
          .domain([1, 0.6, 0.35])
          .range([30, 80, 180])
          .clamp(true);

        // Estimate label width for collision detection (approx 7px per char)
        nodes.forEach(n => {
          const labelWidth = n.label.length * 7;
          (n as Node & { collisionRadius: number }).collisionRadius = Math.max(n.r + 10, labelWidth / 2 + 5);
        });

        // Simulation tuned for better spacing and less clutter
        const simulation = d3.forceSimulation(nodes)
          .force(
            "link",
            d3
              .forceLink<Node, Link>(links)
              .id((d) => d.id)
              .distance((d) => distanceScale(d.value))
              .strength((d) => 0.08 + 0.42 * d.value)
          )
          .force("charge", d3.forceManyBody<Node>().strength(-280).distanceMax(300))
          .force("x", d3.forceX<Node>((d) => domainX[d.domain] ?? width / 2).strength(0.12))
          .force("y", d3.forceY<Node>((d) => domainY[d.domain] ?? height / 2).strength(0.08))
          .force("center", d3.forceCenter(width / 2, height / 2).strength(0.005))
          .force("collide", d3.forceCollide<Node>().radius((d) => (d as Node & { collisionRadius?: number }).collisionRadius || d.r + 10).strength(0.9).iterations(3))
          .alphaDecay(0.028)
          .velocityDecay(0.48);

        simulationRef.current = simulation;

        // Elements
        // Background for clearing highlights
        g.append("rect")
          .attr("x", -10000)
          .attr("y", -10000)
          .attr("width", 20000)
          .attr("height", 20000)
          .attr("fill", "transparent")
          .on("click", () => clearHighlight());

        const link = g.append("g")
          .attr("stroke", "#999")
          .attr("stroke-opacity", 0.4)
          .selectAll("line")
          .data(links)
          .join("line")
          .attr("stroke-width", (d) => Math.sqrt(d.value) * 3.5);

        const node = g.append("g")
          .attr("stroke", "#fff")
          .attr("stroke-width", 2)
          .selectAll("circle")
          .data(nodes)
          .join("circle")
          .attr("r", (d) => d.r)
          .attr("fill", (d) => DOMAIN_COLORS[d.domain] || "#ccc")
          .attr("cursor", "pointer");
        
        // Apply drag manually to avoid type issues
        (node as d3.Selection<d3.BaseType, Node, SVGGElement, unknown>).call(
          drag(simulation) as never
        );
        
        // Smart label positioning based on node degree (high-degree = below, low-degree = right)
        const text = g.append("g")
            .selectAll("text")
            .data(nodes)
            .join("text")
            .text(d => d.label)
            .attr("font-size", 11)
            .attr("fill", "currentColor")
            .attr("dx", (d) => {
              // High-degree nodes (hubs) get labels below to reduce overlap
              return (d.degree || 0) > 3 ? -d.label.length * 3.5 : 14;
            })
            .attr("dy", (d) => {
              return (d.degree || 0) > 3 ? 22 : 4;
            })
            .attr("text-anchor", (d) => (d.degree || 0) > 3 ? "middle" : "start")
            .style("pointer-events", "auto")
            .style("cursor", "pointer")
            .style("opacity", 0.95)
            .style("font-weight", 500);

        // Click to navigate (only if not dragging) - for both nodes and text
        const handleNavigate = (event: MouseEvent, d: Node) => {
            if (!isDraggingRef.current) {
                window.location.href = d.path;
            }
        };
        
        node.on("click", handleNavigate);
        text.on("click", handleNavigate);

        // Hover tooltips with clean text
        const tooltip = d3.select("body").append("div")
          .attr("class", "graph-tooltip")
          .style("position", "absolute")
          .style("visibility", "hidden")
          .style("background", "rgba(0, 0, 0, 0.85)")
          .style("color", "#fff")
          .style("padding", "8px 12px")
          .style("border-radius", "6px")
          .style("font-size", "12px")
          .style("max-width", "260px")
          .style("pointer-events", "none")
          .style("z-index", "9999");

        node.on("mouseover", (event: MouseEvent, d: Node) => {
          tooltip.style("visibility", "visible")
            .html(`<strong>${d.label}</strong><br/><span style="opacity:.85">${d.desc}</span>`);
        })
        .on("mousemove", (event: MouseEvent) => {
          tooltip.style("top", (event.pageY - 10) + "px")
            .style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", () => {
          tooltip.style("visibility", "hidden");
        });

        // Build adjacency for highlighting
        let isHighlighting = false;
        const neighborMap = new Map<string, Set<string>>();
        nodes.forEach((n) => neighborMap.set(n.id, new Set()));
        links.forEach((l) => {
          const s = (l.source as Node).id;
          const t = (l.target as Node).id;
          neighborMap.get(s)!.add(t);
          neighborMap.get(t)!.add(s);
        });

        function highlightEdge(d: Link) {
          isHighlighting = true;
          const s = (d.source as Node).id;
          const t = (d.target as Node).id;
          const related = new Set<string>([s, t]);
          neighborMap.get(s)!.forEach((n) => related.add(n));
          neighborMap.get(t)!.forEach((n) => related.add(n));

          (node as d3.Selection<d3.BaseType, Node, SVGGElement, unknown>)
            .attr("opacity", (n: Node) => (related.has(n.id) ? 1 : 0.15));
          link
            .attr("stroke-opacity", (l: Link) => {
              const s2 = (l.source as Node).id;
              const t2 = (l.target as Node).id;
              return related.has(s2) && related.has(t2) ? 0.9 : 0.1;
            })
            .attr("stroke", (l: Link) => {
              const s2 = (l.source as Node).id;
              const t2 = (l.target as Node).id;
              return related.has(s2) && related.has(t2) ? "#555" : "#999";
            })
            .attr("stroke-width", (l: Link) => (l === d ? 4 : Math.sqrt(l.value) * 3.5));
          
          // Hide non-highlighted node labels
          text.style("opacity", (n: Node) => (related.has(n.id) ? 0.95 : 0));
        }

        function clearHighlight() {
          isHighlighting = false;
          (node as d3.Selection<d3.BaseType, Node, SVGGElement, unknown>)
            .attr("opacity", 1);
          link
            .attr("stroke-opacity", 0.4)
            .attr("stroke", "#999")
            .attr("stroke-width", (d: Link) => Math.sqrt(d.value) * 3.5);
          
          // Show all node labels again
          text.style("opacity", 0.95);
        }

        link.style("cursor", "pointer").on("click", (_event: MouseEvent, d: Link) => {
          highlightEdge(d);
        });

        // Tick
        simulation.on("tick", () => {
          link
            .attr("x1", (d) => (d.source as Node).x || 0)
            .attr("y1", (d) => (d.source as Node).y || 0)
            .attr("x2", (d) => (d.target as Node).x || 0)
            .attr("y2", (d) => (d.target as Node).y || 0);

          node
            .attr("cx", (d) => d.x || 0)
            .attr("cy", (d) => d.y || 0);
            
          text
            .attr("x", (d) => d.x || 0)
            .attr("y", (d) => d.y || 0);
        });

      } catch (err) {
        console.error("Failed to build garden map", err);
        setLoading(false);
      }
    }

    init();
  }, []);

  // Drag helper with fixes
  function drag(simulation: d3.Simulation<Node, Link>) {
    let dragStartTime = 0;
    
    function dragstarted(event: d3.D3DragEvent<SVGCircleElement, Node, Node>) {
      dragStartTime = Date.now();
      isDraggingRef.current = false;
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: d3.D3DragEvent<SVGCircleElement, Node, Node>) {
      const dragDuration = Date.now() - dragStartTime;
      if (dragDuration > 100) { // Only consider it dragging after 100ms
        isDraggingRef.current = true;
      }
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGCircleElement, Node, Node>) {
      if (!event.active) simulation.alphaTarget(0);
      // Keep node where user dropped it
      setTimeout(() => { isDraggingRef.current = false; }, 150);
    }

    return d3.drag<SVGCircleElement, Node>()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  }

  const handleRecenter = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition().duration(750).call(
      zoomBehaviorRef.current.transform,
      d3.zoomIdentity
    );
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-background overflow-hidden" ref={containerRef}>
      
      {/* Canvas */}
      <div className="relative flex-1 overflow-hidden">
        {loading && (
            <div className="absolute inset-0 flex items-center justify-center text-muted">
                Computing semantic nebula...
            </div>
        )}
        <svg ref={svgRef} className="w-full h-full" />
        
        {/* Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 cursor-pointer">
          <button
            onClick={handleRecenter}
            className="px-3 py-2 bg-background/90 backdrop-blur border border-black/10 rounded-lg shadow-sm text-sm hover:bg-black/5 transition-colors cursor-pointer"
            title="Recenter View"
          >
            ⌘ Recenter
          </button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur p-3 rounded-lg border border-black/5 shadow-sm text-xs space-y-1 pointer-events-none">
            {Object.entries(DOMAIN_COLORS).map(([domain, color]) => (
                <div key={domain} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                    <span className="capitalize">{domain}</span>
                </div>
            ))}
        </div>

        {/* Instructions */}
        <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur p-3 rounded-lg border border-black/5 shadow-sm text-xs text-muted pointer-events-none max-w-[260px]">
          <p>Drag nodes to explore. Click a node to open its page. Scroll to zoom. Click an edge to highlight related nodes.</p>
          {!loading && stats && (
            <p className="mt-1 text-[10px] opacity-60">{stats.nodes} nodes • {stats.links} connections</p>
          )}
        </div>
      </div>
    </div>
  );
}
