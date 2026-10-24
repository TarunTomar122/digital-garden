---
title: Froggy
description: A robot arm I can talk to, running reach and grab policies I trained in a digital twin of my desk
category: project
cover: /assets/posts/froggy/thumbnail.jpg
date: 2026-10-24
tags:
    - python
    - pytorch
    - robotics
    - mujoco
seoTitle: "Froggy: A Voice-Controlled Robot Arm With Policies Trained in Simulation"
seoDescription: "Froggy is an SO-101 robot arm you can talk to: a realtime voice model plans, and point-conditioned reach and grab policies trained by imitation in a calibrated MuJoCo digital twin do the physical work. Everything trains and runs on one MacBook."
related:
  - /writings/on-robotics
  - /projects/better-voice
updated: "2026-10-24"
---

![Froggy holding the cube over the bowl](/assets/posts/froggy/thumbnail.jpg)

### Overview

Froggy is my SO-101 robot arm that you can just talk to. It looks at the desk, picks things up, puts them in a bowl and plays tic-tac-toe, all in real time.

####

A week before this I wrote [On robots](/writings/on-robotics), where an LLM controlling the arm directly took three minutes to pick up one cube. Froggy does it in about 9 seconds, with policies I trained myself.

<iframe width="1728" height="781" src="https://www.youtube.com/embed/0rpUeyFJPL8" title="Froggy" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>

### Highlights

- **Two visuomotor policies (reach and grab)**, trained by imitation learning in a calibrated MuJoCo digital twin and running on the real arm
- **Point-conditioned:** one policy works for any object, because a vision model marks the target with a single dot
- **Realtime voice agent** (OpenAI Realtime API) that plans and calls the trained policies as its only physical tools
- **Grab: 115/144** test scenes in the normal twin, **101/144** in the hard one. **Reach: 105/144**
- **One MacBook** for everything: simulation, training, inference and the live demo

### System

![How Froggy fits together: talking in the cloud, moving on my Mac, training in sim](/assets/posts/froggy/setup.svg)

####

Three layers:

####

- **Planning (cloud):** `gpt-realtime-2.1` listens, sees fresh frames from both cameras every turn, talks back, and decides what to do. Its tools are the two trained skills plus look, gripper, drop and park. There are no free-form "move to x, y, z" tools: every movement goes through a trained, camera-closed-loop policy.
- **Pointing (cloud):** when it calls `grab("yellow cube")`, a GPT vision model puts one dot on that object in the top camera image. On real photos of my desk it hits the right object 29 times out of 31.
- **Control (local):** the policy runs in a closed loop at ~7 Hz. Every step it reads both cameras and the six motor positions and outputs a small Cartesian move. An arm server turns that into joint targets with inverse kinematics and checks every command against the table and the arm itself before it reaches the motors.

### The policies

![Left: the vision model's dot on the yellow cube. Right: the 96x128 image and dot heatmap the policy actually gets](/assets/posts/froggy/dot.jpg)

####

| Part | Details |
|---|---|
| **Inputs** | top camera 96×128 + the dot as a Gaussian heatmap channel, wrist camera 128×64, 6 joint readings |
| **Network** | two ImageNet-pretrained ResNet-18 trunks (cut after layer 3), fused with the joints by an MLP |
| **Output** | 5-D action: Δx, Δy, Δz, wrist roll, gripper |
| **Auxiliary heads** | object offset from the fingers, task phase, remaining wrist roll (training only) |
| **Size / speed** | 6.8M parameters, ~25 ms per step on the CPU |

####

The design choices that mattered most:

####

- **Point conditioning.** The policy never sees an object name, only the dot. Language and object identity stay with the big models, and moving the dot to another object in the same scene makes the policy go for the new one.
- **Two cameras for two jobs.** The top camera finds the object; the wrist camera handles the last few centimetres. An oracle test (feeding the true object position near the goal) took success from ~70% to 96%, which showed that close-range perception, not control, was the bottleneck.
- **Auxiliary heads.** Predicting the object's offset and the task phase forces the trunks to localise the object instead of memorising scenes.
- **Generalisation.** Fresh random scenes for every run, random-shift augmentation and an EMA of the weights closed a gap where the policy scored 53% on training scenes but 20–27% on new ones.

![One real grab, top camera above and wrist camera below](/assets/posts/froggy/two-eyes.jpg)

### Training in a digital twin

The training data comes from a MuJoCo copy of my desk and a scripted teacher that can see the full sim state. The policy only gets what the real arm gets, and learns to copy the teacher from images (behaviour cloning with a privileged expert).

####

**Calibration.** The twin is fitted to the real rig:

####

- wrist lens intrinsics and distortion from a checkerboard (0.47 px reprojection error), and the wrist camera's mount from hand-eye calibration
- top camera pose and focal length, fitted by matching rendered arm silhouettes to real ones (~4 px median error)
- per-joint offsets between the real arm and the twin, and the table height from fingertip touches
- the real actuators: a weak, laggy shoulder at long reach on a 5 V supply, servo delay and camera latency

####

**Teacher.** Every teacher decision is a smooth function of what the student can observe. Hidden timers or a hard hover-to-descend switch give the same image two different labels, and the student averages them into hovering.

####

**Real data.** Real runs are relabelled with the action the teacher would have taken in that state, and make up 30% of every training batch. On held-out real frames this cut the action error from **0.33 to 0.05**.

####

**Scale.** The final grab policy trained on ~800k sim frames plus 12k relabelled real frames. Three sim workers render ~200k steps an hour; training runs on the Mac's GPU (MPS) under an 18 GB RAM budget.

![The twin and the real desk, at the resolution the policy sees them](/assets/posts/froggy/sim-vs-real.jpg)

####

### Reach

Grab picks things up; reach moves the hand to a spot and holds it there. In the demo, reach is what carries a held cube over the bowl before the drop, and what places Froggy's piece on a tic-tac-toe square.

####

It is a separate policy with the same architecture and the same dot, trained against its own privileged teacher:

####

- **Task.** End with the fingertips 2 cm above the target's top (±1 cm), centred over it within 1 cm, and hold that for 2 s. Touching the target or anything else on the way fails the episode.
- **Height.** Objects in the twin are 2–8 cm tall, so the policy has to judge height from the images, not just position.
- **Teacher.** Rise until the fingers clear the tallest object on the path by 4 cm, fly over the target, and come down to hover height as the distance closes.
- **Holding things.** In 30% of episodes a cube is already held in the closed gripper, so the policy learns to reach while carrying.
- **Real-arm starts.** Episodes also start from where real grabs end: stretched far out, low, often above the board.

####

Training follows the grab recipe, with relabelled real frames at 15% of each batch. Reach scores **105/144** in the normal twin and **82/144** in the wide twin while holding a cube. On the real arm it hovers over the target in about 8 s.

### Results

Every policy runs the same 144 fixed test scenes in three versions of the twin: normal; hard (weak shoulder, camera lag, far starts); and wide (even further out and higher up, on both sides). Run-to-run noise is about ±3–5 scenes, so every comparison is paired on identical scenes.

####

| Policy | Normal | Hard | Wide |
|---|---|---|---|
| Scripted teacher (sees the full state) | ~140 | | |
| **Grab** | **115** | **101** | **99** |
| **Reach** | **105** | | 82 (holding a cube) |

####

On the real arm, the grab lifts the cube in ~9 s, and the voice agent chains reach, grab and drop for multi-step tasks like clearing the desk into a bowl or playing a full game of tic-tac-toe.

####

**Robustness.** Moving the top camera 4 cm costs grab about 20% of its successes (101 → 81). Training with randomised camera poses recovers part of it (85), so the arm also checks at startup whether the camera has moved since calibration, by aligning the static background against a reference frame.

### Ongoing: RL fine-tuning

Imitation can only match the teacher. Replaying 1,594 real in-gripper frames shows the remaining gap: the teacher lifts 4.0 mm straight up per step with 0.5 mm of sideways drift, the policy lifts 2.3 mm with 2.3 mm of drift.

####

So the next step is RL on top of the frozen imitation policy, as a small bounded residual correction:

####

- **On-policy residual PPO** with a privileged critic: 101 → 105 in the hard twin after ~0.4M steps (within noise)
- **Off-policy residual RL** (IBRL / RLPD-style): a LayerNorm Q-ensemble, the base policy's action proposed inside the critic target, and half of every batch from base-policy rollouts. Training now

####

After that: RL directly on the real arm for grasping.

### Stack

Python, PyTorch (MPS), MuJoCo, OpenCV, OpenAI Realtime API, and an SO-101 arm with a top camera and a wrist camera. Everything trains and runs on one MacBook.
