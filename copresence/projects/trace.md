---
title: Trace
description: Reads 100+ tech sources every morning and turns them into the 10 stories that matter. Now free and open source
category: project
cover: /assets/posts/trace/landing.png
date: 2026-01-18
tags:
    - nextjs
    - python
    - ai-agents
links:
    - type: link
      url: https://www.yourtrace.online
    - type: github
      url: https://github.com/TarunTomar122/trace
seoTitle: "Trace: An Open-Source AI News Brief for Tech and AI"
seoDescription: "Nine months, $432 in revenue and 1,100+ signups later, getting into Anthropic's Claude for Startups programme let me make Trace, my AI-curated tech news brief, free for everyone and open source."
related:
  - /projects/stocksbrew
  - /projects/better-voice
updated: "2026-10-16"
---

### How do you keep up with everything happening in tech?

Honestly, I couldn't.

####

Every morning it was the same thing. Hacker News, a few newsletters, X, Reddit, some YouTube. And half the time I was reading the same story five times, written by five different outlets.

####

I had already built [StocksBrew](/projects/stocksbrew) to do this for my stocks, so the obvious next step was to do it for tech and AI news too.

####

**And that's how Trace was born :)**

![Trace landing page](/assets/posts/trace/landing.png)

### What it does

Trace reads tech and AI news from over a hundred sources every morning and gives you the 10 stories that actually matter. What happened, why it matters, five minutes.

####

You can read it wherever you are:

####

- **The feed:** one card per story, with every source attached
- **A morning email:** you pick your topics and whether you want 5, 10 or 15 stories
- **Android app:** for when you'd otherwise be doomscrolling
- **Chrome new tab:** the latest stories every time you open a tab
- **Your AI agent:** Trace is an MCP server, so Claude, Cursor, Codex or anything else that speaks MCP can read your brief

![Build your own brief](/assets/posts/trace/builder.png)

### How it works

The trick is the grouping. When five outlets cover the same story, Trace merges them into one card, ranks it, and summarises each article once.

```
sources (RSS, HN, Reddit, Product Hunt, X, ...)
   → fetch → filter → group same-event coverage → rank
   → summarise each article once (cached) → pick the brief
```

####

So instead of five near-identical links you just see "1 story · 5 sources".

####

Ranking is a mix of how many outlets are covering it, how much I trust each source, how recent it is, and an LLM acting as an editor that decides what makes the cut.

####

And because summaries are cached per article, **it costs the same for 10 readers or 10,000**. That one decision ends up mattering a lot later.

### Nine months later

I launched Trace in January as a simple **$3/month** subscription. It got to #7 on Product Hunt and $50 MRR in the first week, not bad for my first app.

####

Nine months later:

####

- **$432** in revenue
- **1,100+** signups
- **15,000+** visitors
- **40** people who actually paid for it, with **18+** active subscriptions at the end
- **461** commits

####

Somewhere along the way it stopped being a weekend project. I moved the database off Firestore onto a tiny SQLite document store I'd originally built for StocksBrew, ran the pipeline on a VPS because GitHub's cron kept firing hours late, and even set up my own mail server to send the daily email.

### Making it free (and open source)

Then Trace got into Anthropic's **Claude for Startups** programme. That came with a free Claude subscription for a year and a lot of API credits.

####

With the API costs covered by those credits, there wasn't much reason to keep charging. And since the summaries are cached per article, the cost doesn't really grow with readers either.

####

So the decision was pretty simple.

####

> If I don't have to pay anything, then let it be open source.

####

**So I killed the $3 subscription. Trace is now free for everyone, and the entire thing is open source.**

![The launch post](/assets/posts/trace/tweet.png)

####

To the 40 people who paid for Trace: you kept it alive long enough to get good. Thank you. Your accounts stay Pro.

####

And thank you to Anthropic and OpenAI for making this possible.

### Try it

- **Read it:** [yourtrace.online](https://www.yourtrace.online), no sign-up needed
- **Build your own morning email:** [yourtrace.online/brief/customize](https://www.yourtrace.online/brief/customize)
- **Every daily edition is public:** [yourtrace.online/brief](https://www.yourtrace.online/brief)
- **Plug it into your agent:** [yourtrace.online/agents](https://www.yourtrace.online/agents)

####

If you want to run it yourself, it self-hosts with Docker Compose and your own OpenAI key. It's AGPL licensed.

####

The easiest first PR is adding a news source. It's literally one JSON entry :)

####

And if it saves you time, you can [buy me a coffee](https://buymeacoffee.com/taratdev).
