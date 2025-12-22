---
title: Coding my own transformer model
description: I coded a small transformer model to act like my girlfriend
category: project
date: 2025-12-11
tags:
    - python
    - machine-learning
    - pytorch
---

If you've read my past blogs then you know how I was playing around with nanochat and trying add vision to that tiny model (which worked out fine!!) and while I was doing all that I realised how little I know about transformers. 

Long story short, I didn't like that feeling and so I put my head down for next 2 weeks to learn all the maths behind "Attention is All You Need" with one simple goal of coding my own transformer block from scratch without using AI. 

This would have been 10x harder if I hadn't found this amazing [channel](https://www.youtube.com/@statquest) and so a huge shoutout to Josh Starmer for all this amazing videos.

<iframe width="1728" height="781" src="https://www.youtube.com/embed/PSs6nxngL6k" title="Attention for Neural Networks, Clearly Explained!!!" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

Now knowing maths is only one-half of the requirement cause the other half includes coding and for that you need to know how to use libraries like pytorch and that's a whole different ball game. 

For this half I used the legendary **"Let's build GPT: from scratch, in code, spelled out."** by Andrej Karpathy.

<iframe width="1718" height="739" src="https://www.youtube.com/embed/kCc8FmEb1nY" title="Let&#39;s build GPT: from scratch, in code, spelled out." frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

This video is such a goldmine and honestly it had been a while since I looked at a video and tried to write the code by following it. I realised how much I missed it and how useful this technique was back when I was learning how to code. So that was fun. 

Here's a single tranformer Head in code (isn't it beautiful)

```python
class Head(nn.Module):
    """ one head of self-attention """

    def __init__(self, head_size):
        super().__init__()
        self.key = nn.Linear(n_embd, head_size, bias=False)
        self.query = nn.Linear(n_embd, head_size, bias=False)
        self.value = nn.Linear(n_embd, head_size, bias=False)
        self.register_buffer('tril', torch.tril(torch.ones(block_size, block_size)))

        self.dropout = nn.Dropout(dropout)

    def forward(self, x):
        # input of size (batch, time-step, channels)
        # output of size (batch, time-step, head size)
        B,T,C = x.shape
        k = self.key(x)   # (B,T,hs)
        q = self.query(x) # (B,T,hs)
        # compute attention scores ("affinities")
        wei = q @ k.transpose(-2,-1) * k.shape[-1]**-0.5 # (B, T, hs) @ (B, hs, T) -> (B, T, T)
        wei = wei.masked_fill(self.tril[:T, :T] == 0, float('-inf')) # (B, T, T)
        wei = F.softmax(wei, dim=-1) # (B, T, T)
        wei = self.dropout(wei)
        # perform the weighted aggregation of the values
        v = self.value(x) # (B,T,hs)
        out = wei @ v # (B, T, T) @ (B, T, hs) -> (B, T, hs)
        return out
```

Anyhow I learnt how to code the attention head and how to add multiple heads and then pretrain them. 
This *pretraining* thing surprised me a bit cause I didn't know that in pretraining we literally have to teach the model to blabber words (not even sentences often). 

The way it works essentially is that we first tokenize the input and then pass the input to the model and try to teach it to predict the next token. This very small and not so intuitive thing helps model understand rules of grammar, maths and if you're model is big enough and you're training it on a huge dataset, even physics and science (which is crazyyyyy!!!). However ofcs my model was very small and it was being trained on a dataset that was way smaller than the entire internet so mine just learnt how to blabber random words.

Next up the thing that I wanted to try was to go from blabbering to actually responding to user queries and for that the next stage was SFT or Supervised Fine Tuning. This is actually quite straight forward, its this stage where we fine tune the model on a dataset containing user questions and assitant responses. And at this point I decided that I want to finetune my model on the whatsapp conversations between me and my GF (Do not try this without permission) cause why not?

I simply exported the whatsapp chats and then asked cursor to write a script to convert those chats from a .txt file to a nicely formatted json that i would use during SFT of my model and then I used that json to finetune the model for 4 epochs with a small batch size (cz I only had one GPU to train on) and lower learning rate. I couldn't get the validation loss to go below 4 but even at that point the best model was responding with some half baked but gf sounding messages.

![Image](/assets/posts/owntransformer/aigf.png)

#### So why did I write all this?

Maybe just to highlight how in the age of abundance you can just do things.



