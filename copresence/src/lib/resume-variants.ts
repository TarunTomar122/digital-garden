export type ResumeVariant = {
  name: string;
  html: string;
};

const sharedStyles = `
  *{box-sizing:border-box}
  body{margin:0;color:#171717;background:#fff;font-family:Georgia,"Times New Roman",serif;font-size:15px;line-height:1.65}
  a{color:#1c1917;text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:3px;text-decoration-color:rgba(28,25,23,.35)}
  a:hover{color:#1a5fb4;text-decoration-color:currentColor}
  h1,h2,h3,p,ul{margin:0}ul{padding-left:18px;list-style:disc}li+li{margin-top:6px}
  li::marker{color:#78716c}
  .muted{color:#57534e}
  .label{font-size:12.5px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#78716c;margin-bottom:14px}
  .resume{max-width:42rem;margin:0 auto;padding:40px 4px 44px}
  .contact{display:flex;flex-wrap:wrap;gap:6px 16px;font-size:14px}
  .section{padding:26px 0;border-top:1px solid #e7decb}
  .section:first-of-type{border-top:none}
  .item+.item{margin-top:20px}
  .item-head{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;align-items:baseline}
  .item h3{font-size:16px;font-weight:700}
  .date{font-size:13px;color:#78716c;white-space:nowrap}
  .skills{display:flex;flex-wrap:wrap;gap:8px 14px;font-size:14px}
  .story p{margin:0 0 14px}.story p:last-child{margin-bottom:0}
  .story .item p{margin-top:8px}
  @media(max-width:640px){body{font-size:14px}.contact{gap:4px 12px}}
`;

const plain = `
<style>${sharedStyles}</style>
<main class="resume story">
  <header>
    <h1>Tarun Tomar</h1>
    <p class="muted" style="margin-top:6px">I work somewhere between design, engineering, and figuring out how people should actually interact with intelligent systems.</p>
    <div class="contact muted" style="margin-top:14px"><a href="mailto:tomartarun2001@gmail.com">email</a><a href="https://www.tarat.space">tarat.space</a><a href="https://github.com/TarunTomar122">github</a><a href="https://x.com/tarat_211">@tarat_211</a></div>
  </header>
  <section class="section">
    <p>At Adobe, I spent a good amount of time working on the <a href="https://spectrum-web-components.adobe.com/?path=/docs/patterns-ai-toolkit-conversational-pattern-overview–docs">AI Toolkit for Spectrum</a>. That started much earlier than just implementing components. I was working with designers, talking to product teams about the kinds of AI experiences they were trying to build, thinking through the interaction and visual patterns, and then helping turn that into something reusable across Adobe products.</p>
  </section>
  <section class="section"><h2 class="label">Smaller things, outside work</h2>
    <p>Outside work I tend to build smaller things whenever an interaction feels like it could be better.</p>
    <article class="item"><h3><a href="https://github.com/TarunTomar122/better-voice">BetterVoice</a></h3><p class="muted">I wanted voice input to AI to carry some of the context that is usually lost when you have to describe everything in words, so I made a macOS prototype where you can talk while circling things on your screen and the visual context gets captured alongside what you are saying. I put it online fairly quickly and it unexpectedly took off on X, which was fun.</p></article>
    <article class="item"><h3><a href="https://github.com/TarunTomar122/keep">Keep</a></h3><p class="muted">More recently I built Keep for my fiancée. We have been long distance for most of our relationship, and I wanted something much quieter and more physical than another messaging app. It is a tiny camera and e-ink display system where a photo taken in one place eventually appears on the other person&#8217;s desk. I ended up working across the hardware, firmware, mobile app, image processing and the object itself.</p></article>
  </section>
  <section class="section"><h2 class="label">Products on the side</h2>
    <article class="item"><h3><a href="https://yourtrace.online">Trace</a></h3><p class="muted">The one I spend the most time on currently is Trace, a personalised daily briefing that tries to understand what you care about and compress everything happening in tech and AI into a small feed for you.</p></article>
  </section>
  <section class="section"><h2 class="label">ML research</h2>
    <p>Over the last year I have also been moving further down the stack into ML research. One piece of work looked at <a href="https://arxiv.org/pdf/2607.17052">pruning visual networks</a>, and more recently I have been studying <a href="https://github.com/TarunTomar122/visual-grounding-decoder-study/blob/main/paper/icprs/main.pdf">visual grounding architectures and how much of the standard decoder architecture is actually necessary</a>.</p>
  </section>
  <section class="section"><h2 class="label">Toward robotics</h2>
    <p>My interest in building intelligent systems has naturally pulled me toward robotics. I am currently putting together an SO-101 arm and experimenting with visual reasoning and planning for it, particularly how higher-level models can reason about the state of the world and choose useful actions rather than treating the robot as a direct action prediction problem.</p>
  </section>
</main>`;

export const RESUME_VARIANTS: readonly ResumeVariant[] = [{ name: "plain", html: plain }];

export function pickResumeVariant(): ResumeVariant {
  return RESUME_VARIANTS[0];
}
