---
title: Chinese AI got me excited about LLMs again
description: Alibaba and DeepSeek to the rescue!
category: tech
date: 2025-02-18
---

### Chapter 1: The Beginning

Earlier this year DeepSeek (a Chinese company) released their best LLM yet, DeepSeek-R1.

####

The price drop was **huge** and the performance was **almost as good** as the other LLMs in the market at that time.

![Image](/assets/posts/local-llm/price-comparison.webp)

But the bigger deal was the fact this was an open source LLM unlike the other SOTA models from the likes of Google, Meta, and Anthropic. Having an open source LLM that is as good as the other SOTA models was a game changer. It opened up a whole new world of possibilities. **You could run it on your local machine or your own servers.** 

### Chapter 2: The Continuation

Soon after DeepSeek-R1, Alibaba released Qwen-2.5B. 

![Image](/assets/posts/local-llm/qwen.jpg)

####

Another really good open source LLM that was **cheaper** and **faster** than the other LLMs in the market at that time.

####
At this point, I was really asking this one question... **How?**

####

>But more importantly What would the release of these SOTA + Open Source LLMs mean for an average user like me?

### Chapter 3: The Future

So I went down the rabbit hole and I spent a few days trying to understand how these Open Source LLMs can be used in a meaningful way that isn't already being covered by other apps like ChatGPT or Claude.

#### Tldr; Local LLMs are the future

Yes! This is a real thing now. I mean it was always possible but now with these SOTA LLMs being open source, running them on your local machine makes a lot more sense now.

#### 

Especially with the release of Qwen-2.5! This model is so good at distillation and it's derivatives are good. Good enough for most of the things you'd want to do with an LLM on a daily basis. 

####

> wait wait wait... What's up with these fancy words?

### Chapter 0: Knowledge Base

Let's take a step back here and try to understand what distillations, derivaties and Quantization are when it comes to LLMs.

#### AI Distillation

AI Distillation is a technique used to create smaller, faster, and more efficient models from larger, more complex models. It involves training a smaller model to mimic the behavior of a larger model, while preserving the knowledge and capabilities of the original model.

####

So for example, you can take a bigger model like GPT-4o and distill it into a smaller model like Qwen-2.5. This smaller model will be faster and more efficient than the original model but it will still have the same knowledge and capabilities.

![Image](/assets/posts/local-llm/distillation.png)

#### AI Derivatives

AI Derivatives are models that are created from existing models. They are created by taking the existing model and adding some new features to it.

####

So for example, you can take a model like Qwen-2.5 and create a derivative model that is better at understanding and generating code or more specific tasks like summarization, translation, etc.

![Image](/assets/posts/local-llm/derivatives.webp)

#### Quantization

Quantization is a technique used to reduce the size of a model by converting the weights and activations from floating-point numbers to lower-precision numbers. This reduces the memory footprint and computational requirements of the model, making it faster and more efficient.

####

So for example, you can take a model like GPT-4.5 and quantize it to 8-bit or 4-bit precision. This will make the model smaller and faster but it will also reduce the accuracy of the model. 

![Image](/assets/posts/local-llm/quantization.gif)

### The conclusion

Now having these Open Source LLMs that are good means we can do any/all of those 3 things we talked about earlier. 

####

So what does this mean for an average user like me?

####

**It means with just a few hours of effort, I can have a custom LLM trained to do a specific thing, running on my local machine that is comparable to the other SOTA models in the market.**

#### In more technical terms

> You could distill a model like GPT-4o into a model like Qwen-2.5 and then create a derivative model that is better at understanding and generating code and then quantize it to 8-bit precision and then run it on your laptop. Essentially now you have a custom AI agent that can work on your proprietary codebase and help you with your daily tasks.

####

> You no longer have to worry about OpenAI stealing your data and your pocket doesn't have to take a hit either.

####

**Isn't that amazing?**

####

I think so.

#### But how do you do that?!!! I'll tell you in the next chapter.

Byeeee!!!!