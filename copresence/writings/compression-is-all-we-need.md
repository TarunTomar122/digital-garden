---
title: Compression is all we need
description: Drawing parallels between compression and intelligence
category: tech
date: 2025-04-28
---

<iframe width="600" height="300" src="https://www.youtube.com/embed/6nJZopACRuQ" title="Pre-Training GPT-4.5" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

###

This post is inspired from the above video. In this video at around [38:47](https://youtu.be/6nJZopACRuQ?t=2329) minutes, **Daniel Selsam** draws a parallel between an AGI and human intelligence and talks about how compression leads to a general intelligence.

####

Now this idea initially sounded weird to me but after some thinking, I was able to see the connection between compression and intelligence. So that's what I want to talk about in this post.

### How does compression leads to intelligence?

So this idea actually is talked about far back 1960s by **Ray Solomonoff** and it is called **Solomonoff Induction**. It's core is very simple:

####

> Finding the shortest program leads to the best prediction

####

For example, say you were given this series of numbers:

```
2, 4, 6, 8
```

####

And now if I were to ask you what the next number in the series is, you would probably say it's 10. However there are actually multiple ways to generate this series of numbers.

####

There must be a way to generate this series in such a way that the next number is say 123. Sure that might be a very complicated function but it's still possible.

####

The fact however is that you chose the simplest way to generate this series and that's what **Solomonoff Induction** is all about.

####

> **"choose the simplest explanation."**

####

### How does this relate to intelligence?

####

In the context of machine learning, this translates to the idea that "the model that can most compactly compress data will have the best generalization performance." and thus that model is the most intelligent.

####

### Back to understanding compression

####

Compression is basically the process of reducing the size of some data and if you have a huge amount of data, one way you can compress it is by **categorizing** it.

####

Categorizing is only possible if you can **identify** the patterns in the data. And this is where intelligence comes in.


####

Think about our brain. 

####

> A brain is a small piece of the universe that tries to predict what the rest of the universe will do next. Because it's much smaller than the universe, a brain needs a very compressed model of the parts of the universe it cares about.

####

So our brain is able to identify patterns in the world around us and this is what intelligence is. We as humans are able to capture a lot of information from our surroundings and then we identify patterns and categorize that information and then we are able to make sense of it. Our brain is literally a compressed model of the world around us.

####
This whole process is very similar to how a large language model learns.

### Pretraining a large language model

Let's take a look at how a large language model learns.

####

During its pretraining phase, the model is given a set of tokens and it learns how to predict the next token in the sequence.  For example, if the model is given the sentence "The cat sat on the ____", it learns how to predict the next token in the sequence (in this case "mat").

####

The way a model is able to do this is by learning the patterns, the rules of grammer, rules of language, etc. from the training data. These patterns and rules are compressed into a smaller set of parameters which are then used to predict the next token in the sequence.

####

This is the core of how a large language model learns. It learns by compressing the data into a smaller set of parameters.

####

And thus the way these models learn is very similar to how we humans learn. Which in turn means that the problem of creating an AGI would be solved the day we can create a simple model that is able to compress all form of information like we do.

####

Sounds like a simple explanation right? (pun intended)

