export type ResumeVariant = {
  name: string;
  html: string;
};

const sharedStyles = `
  *{box-sizing:border-box}
  body{margin:0;color:#222;font-family:-apple-system,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6}
  a{color:#1a5fb4;text-decoration:none}a:hover{text-decoration:underline}
  h1,h2,h3,p,ul{margin:0}ul{padding-left:18px;list-style:disc}li+li{margin-top:6px}
  .muted{color:#5f5f5f}
  .label{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#5f5f5f;margin-bottom:14px}
  .resume{max-width:42rem;margin:0 auto;padding:8px 4px 40px}
  .contact{display:flex;flex-wrap:wrap;gap:6px 16px;font-size:14px}
  .section{padding:26px 0;border-top:1px solid #eee}
  .section:first-of-type{border-top:none}
  .item+.item{margin-top:20px}
  .item-head{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;align-items:baseline}
  .item h3{font-size:16px;font-weight:600}
  .date{font-size:13px;color:#5f5f5f;white-space:nowrap}
  .skills{display:flex;flex-wrap:wrap;gap:8px 14px;font-size:14px}
  @media(max-width:640px){body{font-size:14px}.contact{gap:4px 12px}}
`;

const plain = `
<style>${sharedStyles}</style>
<main class="resume">
  <header>
    <h1>Tarun Tomar</h1>
    <p class="muted" style="margin-top:6px">AI builder, currently doing an MSc in AI at the University of Edinburgh. Previously a Design Engineer at Adobe.</p>
    <div class="contact muted" style="margin-top:14px"><a href="mailto:tomartarun2001@gmail.com">email</a><a href="https://www.tarat.space">tarat.space</a><a href="https://github.com/TarunTomar122">github</a><a href="https://x.com/tarat_211">@tarat_211</a></div>
  </header>
  <section class="section"><h2 class="label">Education</h2>
    <article class="item"><div class="item-head"><h3>MSc Artificial Intelligence · University of Edinburgh</h3><span class="date">Sep 2026 — Sep 2027</span></div><p class="muted">In progress.</p></article>
    <article class="item"><div class="item-head"><h3>B.Tech Computer Science · IIT Jodhpur</h3><span class="date">Graduated May 2023</span></div><p class="muted">CGPA 8.0 / 10</p></article>
  </section>
  <section class="section"><h2 class="label">Experience</h2>
    <article class="item"><div class="item-head"><h3>Adobe · Design Engineer (SDE II)</h3><span class="date">Jun 2023 — Sep 2026</span></div><ul><li>Led the architectural migration of Spectrum Web Components to Spectrum 2.0, impacting Firefly, Illustrator Web, Adobe.com, and thousands of engineers.</li><li>Built App Frame from scratch for cross-platform rendering, WCAG accessibility, and design consistency.</li><li>Built internal tooling to track component adoption across Adobe; promoted to SDE II in January 2025.</li></ul></article>
    <article class="item"><div class="item-head"><h3>Adobe · Emerging Tech Intern</h3><span class="date">May — Jul 2022</span></div><p>Built a multimodal GenAI assistant for Adobe Express covering template matching, context-aware canvas editing, and asset generation.</p></article>
  </section>
  <section class="section"><h2 class="label">Selected AI projects</h2>
    <article class="item"><h3><a href="https://www.tarat.space/projects/smollms">i trained tiny LLMs on Shakespeare</a></h3><p class="muted">smollms is my tiny architecture lab for understanding dense attention, recurrence, sparse selection, compressed memory, and MoE without pretending I have a GPU cluster.</p></article>
    <article class="item"><h3><a href="https://www.tarat.space/projects/deepseek-nanochat-1">Vision-Enhanced NanoChat with Extended Context</a></h3><p class="muted">Extending a tiny LLM's context limit by compressing text into visual tokens using a vision encoder.</p></article>
    <article class="item"><h3><a href="https://stocksbrew.online">StocksBrew</a></h3><p class="muted">AI-curated stock briefings delivered before market open; a live, revenue-generating product.</p></article>
  </section>
  <section class="section"><h2 class="label">Toolbox</h2><div class="skills muted"><span>TypeScript</span><span>React / Next.js</span><span>Web Components</span><span>Design systems</span><span>Accessibility</span><span>Python</span><span>PyTorch</span><span>Vision-language models</span><span>LoRA / PEFT</span><span>On-device inference</span><span>RAG</span></div></section>
</main>`;

export const RESUME_VARIANTS: readonly ResumeVariant[] = [{ name: "plain", html: plain }];

export function pickResumeVariant(): ResumeVariant {
  return RESUME_VARIANTS[0];
}
