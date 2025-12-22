---
title: Deepseeking Nanochat
description: Extending the context limit of a LLM by using a vision encoder
category: project
date: 2025-11-05
tags: 
    - python
    - machine-learning
    - pytorch
links:   
    - type: github
      url: https://github.com/TarunTomar122/vision-encoded-nanochat
---

### Introduction

Over the past few weeks I’ve been working on a small research project I’m calling Deepseeking-Nanochat.

The core idea is simple:

> Can a tiny language model extend its context limit by using vision instead of text tokenization?

NanoChat, a small model by Andrej Karpathy, has a fixed context window of ~2,048 tokens.
Instead of resizing the model or retraining it from scratch, the question is:

What if the model could see information instead of reading it?

If long documents, codebases, or reports could be compressed into visual tokens—via screenshots or OCR embeddings—then even tiny models could process far more content than their token budgets allow.

This blog documents the current state of this experiment.

### Motivation

The original spark came from the DeepSeek-OCR paper.
Although presented as an OCR system, the most interesting part was not OCR at all—it was compression.

DeepSeek demonstrated that a vision encoder could represent the semantics of hundreds or thousands of characters in far fewer tokens than a text tokenizer.
Instead of outputting 1,000+ text tokens, the image encoder might produce 256 tokens with roughly equivalent meaning.

This naturally led to the question:

Could I use a vision encoder in front of Nanochat to compress text using screenshots, then inject those tokens directly into the LLM?

This forms the conceptual backbone of Deepseeking-Nanochat.

### Current Architecture

#### Vision Backbone

- BLIP-2 ViT-g encoder

- Frozen Q-Former, yielding 32 visual tokens

No training performed on the encoder layers (compute-efficient)

The Q-Former serves as a learned bottleneck that extracts semantically rich tokens from images without needing to fine-tune the vision model.

#### Projector

- A single nn.Linear layer:

```python
768 → 2048 
```


This maps Q-Former embedding vectors into Nanochat’s embedding space.
This projector is currently the only trainable module in the system.

Optimizer: AdamW

Learning rate: tuned with linear warmup
Trainable params: ~1.5M (very small)

#### Language Model

- NanoChat by Karpathy

- ~2K token context

- No modifications

Operates as a frozen backbone (for now)

The projected visual tokens are inserted at the beginning of the prompt, allowing NanoChat to jointly process visual + textual context.

### Training Setup

#### Dataset

Dataset

- 21K samples from COCO Captions

- Chosen for object-centric scenes

- Sufficient for learning alignment between visual tokens and textual outputs

- Not document-heavy (this will change later)

#### Hardware

- 1× RTX 4090 (24GB)

- Provided via Hivenet

- ~2 hours of training for early tests

- Max batch size: 32 (gradient accumulation for stability)

#### Procedure

- Randomly sample image → feed into BLIP-2 → Q-Former → projector → Nanochat

- Target: caption text

- Loss: cross-entropy over Nanochat's output tokens

This creates the basic ability for NanoChat to respond to images with descriptions.

### Results (So Far)

Despite training only the projector for a short time on a small dataset:

- NanoChat can now describe images
- The system responds coherently to visual prompts
- Early hallucinations are decreasing over iterations
- Real-time demo shows stable generation speed

<div className="my-4">
  <video className="w-full rounded-lg" controls preload="metadata" playsInline>
    <source src="https://video.twimg.com/amplify_video/1984994805076697088/vid/avc1/1920x1080/GMEZUoYg0xl7olX9.mp4?tag=21" type="video/mp4" />
    Your browser does not support the video tag.
  </video>
  <p className="text-sm text-muted mt-2">Demo clip hosted on X</p>
  
</div>

A few sample behaviors:

- Recognizes objects (cars, buildings, signs)

- Provides scene descriptions

- Sometimes invents details (common at this stage)

- Stronger performance on COCO-like scenes vs. unusual compositions

This confirms that the alignment between visual tokens and Nanochat’s embedding space is functional, even with minimal training.

### Next Steps

#### Train on Text-Heavy Image Datasets

The current COCO dataset isn’t optimized for text extraction.
The next phase introduces:

- DocVQA

- LAION-OCR

- InfographicsVQA

Goal: teach the model to interpret text inside images, not just objects.

This is required for the long-term goal of text-compression via screenshots.

#### Add LoRA Fine-Tuning to NanoChat

Until now, NanoChat has been frozen.
Applying LoRA adapters will:

- allow NanoChat to better model cross-modal patterns

- stabilize alignment between visual tokens + language

- improve reasoning over document images

This will likely dramatically improve OCR-style usage.

#### Context Extension Experiments

This is the core research question:

> Can long documents be represented as a compressed visual embedding?

Initial plan:

- Take a long article or PDF

- Convert into high-resolution image(s)

- Pass through the vision encoder

- Produce 32–64 visual tokens

- Inject into NanoChat

- Query the document (summaries, lookup, explanations)

This would mean a small model effectively gets a massive context window via vision tokens.

#### Inspiration: Visual Token Compression Work

A recent paper
- “Visual Token Compression for Efficient Multimodal LLMs” (arXiv:2510.17800)
validated many of the intuitions behind this project.

Their work suggests that a well-designed visual compression pipeline can encode long-range semantics in a tiny token budget.
This opened several future directions, specifically:

- aggressive token merging

- mixed image-patch/token routing

- adaptive token pruning based on information entropy

These ideas may be integrated later.

### Why This Matters (Technically)

This project is less about building another multimodal model and more about exploring:

- small-scale multimodality

- embedding-space alignment

- compression of semantic content

- efficient fine-tuning

- context window extensions without modifying transformer depth

- "visual context hacks" for tiny models

The overarching thesis:

> If LLMs hit context limits, vision may become the new compression layer.

> And if tiny models can use that—everyone can.

### Closing Notes

Deepseeking-Nanochat is still early in development, but the results so far are encouraging.
- The vision encoder is working.
- The projector alignment is functional.
- NanoChat can now “see,” and soon it should start reading.

As next steps unfold—OCR alignment, long-context compression, LoRA training—I’ll continue documenting progress in this digital garden and on my [X profile (@tarat_211)](https://x.com/tarat_211).

If you’re interested in multimodal compression, tiny-model scaling, or experimental LLM architectures, this space may be fun to follow.