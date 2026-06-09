---
title: How I Automated My Entire YouTube Shorts Pipeline with AI (Hermes + Runway + Buffer)
description: Zero-touch YouTube Shorts from story to post.
category: tech
date: 2026-06-09
---

### The setup

So I run a finance content channel called [StocksBrew](https://stocksbrew.online) ([YouTube](https://www.youtube.com/@stocksbrew.online)) and over the past few weeks I basically built a fully automated pipeline that takes a stock market story, writes a script, generates a talking head avatar video, transcribes it, overlays subtitles and visuals, and posts it to both YouTube and Instagram. All without me touching anything. Here's how it works and how you can build something similar.

### The Stack

The whole thing runs on a few key pieces:

####

1. **Hermes Agent**: this is an open source AI agent framework by Nous Research. Think of it as an always-on AI assistant that can run terminal commands, browse the web, manage files, call APIs, and schedule recurring tasks via cron. It's basically the brain of the whole operation.

2. **Runway Gen-4 Avatars**: Runway has an avatar video API where you give it a character ID and a text script, and it generates a video of that character speaking your words. No filming, no editing, no cameras. The character looks like a real person and the lip sync is honestly pretty solid.

3. **Whisper (faster-whisper)**: for transcription. The avatar video comes out with audio but no subtitles, so I run Whisper on it to get word-level timestamps, then burn those into the video as bold yellow-highlighted subtitles using ffmpeg.

4. **ffmpeg**: the workhorse for all video rendering. Scaling to 9:16 vertical, adding subtitle overlays, inserting ticker graphics at the right timestamps, adding a subtle brand watermark. All done through ffmpeg filter chains.

5. **Buffer MCP**: Buffer has an MCP (Model Context Protocol) server that lets you schedule posts programmatically. I use it to post every video to both YouTube and Instagram simultaneously. One API call, two platforms.

6. **Xiaomi MiMo**: this is the LLM I use for the story picker step. It reads through Reddit posts about stock market news and picks the most interesting ones to turn into videos. Any LLM would work here honestly but MiMo is fast and cheap.

### How the Pipeline Actually Works

**Step 1 is story gathering.** The agent searches Reddit and financial news sources for trending stock market stories. It feeds those into MiMo which picks the best one based on what has performed well historically (we track all uploads in a local JSON file).

####

**Step 2 is script writing.** The agent writes a short punchy script, around 30-45 words. This is where the personality comes in. We don't do neutral news recaps like "NVIDIA dropped 3% today." Every script has an opinion or a personal trade angle. Something like "NVIDIA just dropped 3% and I think this is the buying opportunity of the year." That opinionated framing gets like 4x more views than neutral content, we tested it.

####

**Step 3 is avatar video generation.** The script gets sent to Runway's avatar API. We use a custom avatar character (Rae2) that was created on Runway's platform. You upload reference images of your character, Runway trains on them, and then you can generate unlimited videos of that character speaking any text. The API returns a video URL, we download it.

####

**Step 4 is transcription.** We run faster-whisper on the avatar video to get word-level timestamps. This is important because we need precise timing for the subtitles. Whisper sometimes mishears stock terms (like "NVIDIA" becomes "In video") so we have a post-processing step that fixes those common errors.

####

**Step 5 is rendering.** This is where ffmpeg does its thing. We take the raw avatar video and scale it to vertical 9:16 format (1080x1920). The avatar gets positioned slightly above center with padding on top and bottom. Then we burn in the subtitles at 73% height, bold font, no outline, no background bar. Numbers in the subtitle text get highlighted in yellow. We also overlay a small ticker card (stock symbol + percent change) at about 30% into the video for 3 seconds. There's a subtle "StocksBrew" watermark at the bottom. That's it, clean and minimal.

####

**Step 6 is posting.** We use Buffer's MCP server to schedule the video on both YouTube and Instagram at the same time. The video gets uploaded to tmpfiles.org first (Buffer needs a public URL), then we call Buffer's create_post endpoint with the video URL, caption, hashtags, and platform-specific metadata. YouTube gets a title and category, Instagram gets marked as a Reel. We schedule it for 5 minutes from when the cron runs so there's a small buffer (no pun intended) but it goes up quick.

### The Automation Part

All of this runs on cron jobs managed by Hermes. I have 4 scheduled video slots per day timed to when US audiences are most active (1-2 AM IST is the golden hour because that's US lunch time). Each cron job is a self-contained prompt that tells the agent exactly what to do: research, script, generate, render, post.

####

The agent runs completely autonomously. It picks the story, writes the script, calls the Runway API, runs Whisper, renders with ffmpeg, and posts to Buffer. I just get a message in Telegram when it's done telling me what was posted.

### The Key Insight: MCP Changed Everything

The game changer was discovering MCP (Model Context Protocol). Buffer has an MCP server at [mcp.buffer.com](https://mcp.buffer.com) that exposes all their functionality as tools the AI agent can call directly. So instead of building some complex integration layer, the agent just calls Buffer's tools naturally as part of its workflow. It can create posts, schedule them, manage channels, all through the MCP interface.

####

Same thing with Runway. Their Python SDK makes it dead simple. You create a client, call `avatar_videos.create()` with your character ID and script, and wait for the result. No complex setup, no webhook listeners, no polling loops.

### What I Learned Along the Way

A few things that would have saved me a lot of time if I knew them from the start:

####

- **Avatar content moderation is weird.** Runway blocks certain words with strong non-financial associations. "Thor" for example is blocked because of Marvel. If your stock is Thor Industries you have to spell it as "T-H-O Industries" in the script. Took me a while to figure that one out.

- **Whisper is not perfect with financial terms.** It consistently mishears "NVIDIA" as "In video" and "Micron" as "micro." Build a corrections step into your pipeline.

- **Don't dump all videos at once.** YouTube will throttle your channel if you upload 4 videos in 15 minutes. I learned this the hard way. Space them out by at least 2 hours.

- **The avatar ID needs to be synced across all your scripts.** I had a situation where my main pipeline file was updated to a new character but the queued pipeline file still had the old one. Crons were generating videos with the wrong character for a full day before I noticed.

- **Buffer's addToQueue mode** will schedule your posts at whatever their default queue slots are, which might be hours away. If you want precise timing, always use customScheduled mode with an explicit ISO timestamp.

- **ffmpeg drawtext filters break if your subtitle text has apostrophes.** "Here's" becomes a parsing error. Strip apostrophes from all subtitle words before generating the filter string.

### The Numbers

Since setting this up the channel went from basically zero to **24.3K views in 28 days**, **54 hours of watch time**, and **+29 subscribers**, all from a standing start in late May.

![YouTube Studio analytics for StocksBrew](/assets/posts/youtube-shorts-pipeline-ai/analytics.png)

####

The graph tells the story. Flatline until May 29, then a sharp spike, peaking around **6K views in a single day** on June 1. Realtime is still hot: **4.1K views in the last 48 hours** alone. Top performers right now are the opinionated trade takes like "MU Micron Down 16%" at 1.4K views, "SMCI Down 11%" at 643, "ARM Down 13%" at 445.

####

Compare that to the neutral news recap style I started with, which was averaging **23 views per video**. The opinionated framing ("I'm loading up" / "buying the dip") gets roughly **4x more views** on average, with some crossing 1K individually. The content angle matters way more than the automation honestly, but the automation lets you test and iterate way faster.

### Can You Build This?

If you want to build something similar, the pieces are all accessible. Hermes Agent is open source ([github.com/NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent)). Runway has a developer API with avatar support. Buffer has a free tier with MCP access. Whisper is free and runs locally. ffmpeg is ffmpeg.

####

The hardest part is honestly not the tech, it's figuring out what content works. I spent weeks posting videos that got 12 views before finding the right angle. The automation just lets you fail faster and iterate quicker.
