---
title: I built a better version of wispr flow (that got viral)
description: I hated how wispr didn't let me capture visual context so I built one for myself
category: project
date: 2026-08-26
tags: 
    - swift
    - machine-learning
links:
    - type: github
      url: https://github.com/TarunTomar122/better-voice
---

![BetterVoice settings overview](/assets/projects/better-voice/overview.jpg)

### context

so this is the story from a sunday evening... i was scrolling twitter (now called x but i prefer calling it twitter) and got to know that tibo is planning to hit the reset button on codex tonight.
so i thought to myself.. hmm what can i do to use up my weekly codex limits lol.

i thought for a bit and then i remembered a very simple problem that i have in my workflow (that's usually how most of my projects start tbh). i vibe code a lot of stuff and when u vibecode
your vibes are usually killed by all the mistakes that ai makes while designing the frontend... so the usual way around that for me was to click screenshots and paste them on the ai input box. 

it works fine bt i wish for a better solution. a solution that would let me capture the areas on my screen automatically as i speak my thoughts about what i want to change...

and that's how better-voice came into this world.

### the app 

the app in itself is also fully vibecoded and it took only a few prompts. i just wanted the basic mvp so i can test it and get a feel before i commit to anything. when i had the mvp ready i made a 2 minute video talking about it and posted that on x and linkedin before going to bed.

below is the video if you wanna watch...

<iframe src="https://platform.twitter.com/embed/Tweet.html?id=2091537625278726376" title="BetterVoice video" class="post-video" loading="lazy" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>

### the blowup

now this part was totally unpredictable honestly bt the video blew up... got like over 100k during the night and so many comments on the post also. 

everybody was talking about two things: 

a. how they hate wispr flow and dont wanna pay to use it   
b. how they also were dealing with the same problem of not having a great solution to capture visual context while talking to their agents

and so that's when i realised this project will need more love since initially i just did the basic mvp and it had many bugs. so right after brushing my teeth and drinking some water, i sat down at my desk and started bug fixes and feature updates on the app. in about an hour i reached a point where i felt its stable and good enough to release so i did a github release and went to office.

### the aftermath

over the next 24hours i got a few contributions from the community and a lot of requests for feature and bug fixes which i gracefully ended up finish all on my own. 

i even got dms from the maker of fluidvoice (the open source alternative to wisprflow) and we started chatting about how to get this feature inside of fluidvoice!! (yayy)

as for better-voice, the app is now in a super stable state with a proper ux for onboarding, updates and customizations. the biggest thing that's missing in this app is an intelligence layer on top of transcription to format, remove filter words and restructure the transcript properly. and even though i am (not actively) building it... i still think fluidvoice would be naturally a better long term project that people should use as it has much more dedicated support.

still better-voice was an amazing experiment that got me over 200K views across all social platforms in just 48 hours, 220+ github stars, 5+ community contributions, 200+ new X followers and my first linkedin banger LOL.

i don't think there's more to this but its a good reminder for everyone working on thins related to ai... the best ideas are the ones that come from your own problem. so next time u have some extra ai credit laying around for no good reason, think about how you can make your life 1% better and then post a video talkin about it cause who knows what happens next :) 

thanks for reading!
