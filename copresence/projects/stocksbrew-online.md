---
title: "StocksBrew: an AI agent for stocks"
description: An open-source investing app that Opus 5.5 built in 24 hours on its own, judged by a council of Codex and Cursor
category: project
cover: /assets/posts/stocksbrew-online/stock-page.jpg
date: 2026-11-13
tags:
    - agents
    - nextjs
    - python
    - claude
links:
    - type: link
      url: https://stocksbrew.online
    - type: github
      url: https://github.com/TarunTomar122/Stocksbrew
seoTitle: "StocksBrew: 4 Billion Tokens, 24 Hours and a Hill Climb Loop"
seoDescription: "How I had Opus 5.5 run for 24 hours on a hill climb task, with Codex and Cursor as a strict judging council, and ship stocksbrew.online: an open-source US stock research app, with about 3-4 prompts from me."
related:
  - /projects/stocksbrew
  - /projects/trace
  - /writings/tokens-are-cheap-thinking-isnt
updated: "2026-11-15"
---

![StocksBrew's stock page on desktop and phone](/assets/posts/stocksbrew-online/stock-page.jpg)

### Overview

I did not think that I'd be saying this, but I ended up burning almost 4 billion tokens in the last 24 hours, and I barely wrote any prompt. Most of those tokens were on Opus 5.5, so if you compare the actual API cost, that would be around $1,500. That's insane.

![3.96B tokens in one day, 99.5% of them in Claude Code](/assets/posts/stocksbrew-online/tokens.png)

What did those 4 billion tokens get me in return? An app called [stocksbrew.online](https://stocksbrew.online), and it's open source.

### Highlights

- **~4 billion tokens in 24 hours**, mostly Opus 5.5, about $1,500 at API prices
- **3-4 prompts from me** in total, and none of them were about the app, only about the hill climb task
- **A judging council:** Codex and Cursor rated every piece of work out of 10, and nothing under 8/10 shipped
- **Hundreds of sub-agents** running in parallel, each one having to impress the council
- **Open source:** [github.com/TarunTomar122/Stocksbrew](https://github.com/TarunTomar122/Stocksbrew)

### Why I did this

The biggest reason is the fact that I could. I have not one, not two, but three Claude Pro accounts, so I had a lot of tokens and could waste a lot of tokens.

But my biggest problem with wasting tokens is that I don't want to sit in front of my computer and prompt an AI. That's not my idea of fun. In fact, I hate it so much that I left my job because I wanted to get into hardware and all the crazy stuff that would not require me to spend all my time in front of a computer prompting an AI.

So if I were to burn 4 billion tokens in one day, I would not be the one constantly prompting my AI. But then who would be prompting it? Somebody has to, it won't just work on its own, right? Wrong. Turns out it does.

### The idea

I recently saw an X post about a company that made AI agents for investing, and they raised one million dollars. I was like, what? It doesn't look like you need a million dollars in funding to build a product like this. Honestly, half of their features I already had in one of my other apps that I built a year ago, when AI wasn't even that good, and it has a bunch of paying users as well.

So I thought, what if I clone their product and make it open source? That would be pretty evil, right? That's exactly what I did.

I have used enough AI to know that if I just go to Claude, give it the link to this startup and say "hey, clone this startup for me", it's not going to work. It definitely ain't going to work for 24 hours non-stop.

### What it made

With StocksBrew you can read about any stock on the US market: all the financials, earnings, who's buying it, who's holding it, and what the AI suggests you do, whether you should buy or hold. You can manage your portfolio, check how the market is acting, check out different sectors, follow baskets it already created for you if you're new to investing, and backtest your portfolio. There are a ton of other features that I don't even know about, because I haven't gone through the entire app myself yet.

And they're not AI vibe-coded slop features. The UI looks good, the UX is fine, and I don't particularly hate the colors, the borders and everything. I'm pretty sure if you give your agent one prompt and ask it to do this, it's going to suck, and it's never going to reach the quality this app reached in just 24 hours.

### Hill climb

I have been hearing a lot about this thing called hill climb, and I wanted to try it myself. In the context of AI, it means what you would think: you have to climb a hill, you don't know where the top is, and all you have to do is keep climbing. So you have to figure out a setup where your AI keeps climbing, the goal is so far away that it doesn't stop in between, and at the same time it doesn't fall into the valleys, which happens quite often unless you do it correctly.

The way I do that is by setting up very strict ground rules for how my AI agent works, and then making sure it's reminded of those ground rules every 30 minutes. Yeah, it sounds kind of crazy, but that's literally what I did. A scheduled task kept running so that it doesn't lose the plot, and it worked.

### The ground rules

They were pretty simple. Of course, I talked about the goal: I wanted to clone this app and make it open source. I also made sure it understood that it should take very ambitious tasks and make very bold decisions instead of fixing common things.

Another way I managed that was by telling my agent: if the last two things you worked on were small fixes, the third thing cannot be a small fix. It has to be something big, something huge, something ambitious, something bold. Those were the exact words I used.

### The council

There has to be a judge in your hill climb session. If there's just one agent doing things, it's going to think it has reached the goal. If you ask it to build something, it'll build a very stupid version of it and say "hey, it's done". So you need a judge that can tell it you're not at the goal yet.

In my case, I used Codex and Cursor as my judges. Everything Opus 5.5 did, it had to send to Codex and Cursor to rate on a set of parameters for how things should be. Those parameters are very simple. For UI work: the writing shouldn't be AI slop, the spacing has to be nice, the corner radius and everything, visuals must be there, there shouldn't be a lot of text on the website, and it should work on all devices, including mobile phones.

With those parameters, Codex and Cursor rated every single thing Opus did out of 10. They were specifically told to keep their scores very strict and critical, and Opus was told to never ship anything below 8/10.

To reach that 8/10, Opus had to do a lot of iterations. The UI didn't look the way it does now after the first round. It looks this way after 20 rounds of iteration that Opus did on its own design to impress the council members. Once they said "okay, it's at least 8/10 now, everything is easy to read and there isn't a lot of AI slop", Opus moved on to the next thing.

### Hundreds of sub-agents, and taste

Of course, it wasn't doing everything sequentially. There were hundreds of sub-agents running in parallel, and every single one of them reached out to the council for everything it did, whether it was UI/UX, back-end or a new feature. In all of those cases, they had to impress the council members.

If you set up the council smartly enough, the members start acting like you and me, and they develop their taste over time. By that I mean you keep a memory file where they note their findings, so every time a new council member is asked to judge a piece of work, it has the taste that has been developing over time.

When you combine this entire system, Opus keeps working on features, keeps getting feedback from the council, keeps improving based on that feedback, and it keeps going for 24 hours and burns over 4 billion tokens.

### My part: 3-4 prompts

I intentionally don't want to give a step-by-step guide on how to set this up, because it should be very specific to you and your project. You don't even need to do the setup part yourself, and that's the crazy thing. I did not spend hours figuring out how to set up the hill climb task. I worked with Opus on it.

I wrote 3-4 prompts in those 24 hours. They weren't to fix the UI or the app. They were only to update the hill climb task that was running. As long as the goal is big enough and there are actual reviewers for it, Opus takes care of everything else.

### If you want to try it

Ask your agent to set up a hill climb task. Ask it to set up a council. Give the council enough parameters to judge things on, and as much information about your taste as you can, so that together they represent a stricter version of you. When they start doing that, your agent is going to try to impress them, and in the end it will definitely end up impressing you.

But this only works if you have a lot of tokens. If you don't, the right way is to actually prompt your agent and make it do these things yourself. I'm pretty sure you can't get it to do the amount of work it did in these 24 hours in the same time, though. That's just impossible.

It's pretty crazy that you can now ask AI to prompt AI to impress another AI, and that loop goes on and on and you get something like this. I still don't think I 100% understand how all of this works. What I need to do is trust these agents more and be more ambitious with the tasks I give them, instead of just making a landing page or whatever.
