---
title: Voice-Powered Todo App with On-Device AI
description: Finetuned a 350M parameter LLM to understand natural language tasks and run locally on mobile
category: project
date: 2025-10-07
tags:
    - react-native
    - machine-learning
    - fine-tuning
links:
    - type: link
      url: https://colab.research.google.com/drive/1EOMzitHtcx7j-MU0xczpG9FX0xmS2_AG?usp=sharing
    - type: github
      url: https://huggingface.co/Taru/lumi-mobile
---

### Backstory

So, I have a problem. My problem is that I hate, absolutely hate, absolutely ducking hate, the way todo apps are built. 

####

> Why do you want me to click through 5 different input boxes and 2 teeny tiny buttons just to be able to add a task?

![Image](/assets/posts/overengineering-lumi/complex.gif)

And so this past summer I decided to build my own todo app. 

####

The idea was simple. I wanted it to be simple and frictionless to use. Kinda like how whatsapp makes sending messages so easy. 

####

**And that's how Lumi was born.**

![Image](/assets/posts/overengineering-lumi/feature.png)

If you want to check it out, you can find it [here](https://play.google.com/store/apps/details?id=com.lumi.mobile) but the main idea is that I used `chrono-node` and some custom regex to parse the natural language input and then added the task and reminder for it.

### Now

Now very recently, I thought it would be fun to build a lumi widget for home screen use. And so I asked chatgpt to show me how it will look like. 

![Image](/assets/posts/overengineering-lumi/widget.png)

It's not perfect but it's interesting. And my favorite part was that microphone icon on the top right corner.

####

I started to think, how cool would it be if I could just say "lumi remind me to clean my room tomorrow at 11am" or "hey lumi this book looks really nice let's add it to my notes" and it would just work.

####

And so I started to think about how I could do that. Ofcs I'll have to use AI for it cause otherwise it won't be smart enough to understand anything that I say and that would break the frictionless part of this app.

####

**Just USE GPT-4.1** is what you might say.

####

But I don't want to:

####

- Pay for GPT-4.1
- Use a third party service
- Depend on internet 
- Wait for the response
- Sell my data
etc. etc.

### Overengineering

And so the over engineering part begins.

####

I recently came across Liquid AI's 350M parameter model. Now with the very little experience I have so far working with SLMs, it stood out to me as a suspiciously good conversation model. 

####

> don't trust me? try [here](https://playground.liquid.ai/chat?model=cmewfn9y2000008lbey9u2hf7)

####

So I immediately thought, can I finetune this model and run it on my mobile phone (aka in lumi)?

####

Fyi, this idea didn't just randomly spawn. I have had some success in finetuning a SLM before. Let's just say it was good enough to get Google to repost my blog on their X account :)

![Image](/assets/posts/overengineering-lumi/repost.png)

Anyways, so I prepared a small dataset of around 500 different examples of how I would like to interact with the model. Here's a sample:

```javascript
{
    "instruction": "Add a to-do to buy groceries", 
    "output": {"task": "buy groceries", "note": null, "tag": null, "reflection": null}
}
```

Then I used unsloth with google colab to finetune the LORA adapters for this model. 
I am not going to bore you with the details but here is the [google colab link](https://colab.research.google.com/drive/1EOMzitHtcx7j-MU0xczpG9FX0xmS2_AG?usp=sharing) and [finetuned model](https://huggingface.co/Taru/lumi-mobile) for you to play with.
####

It only took like 15 minutes (4 hours) to do this whole thing and the result is...

![Image](/assets/posts/overengineering-lumi/final.gif)

> But hey tarat, this is not the widget you promised!!

####

SHUT UP! I have a 9-5 job you know! So I'll do it when I do it. For now let me just admire how fast this thing is on a relatively old phone :)


