---
title: On robots
description: My understanding of robotics as an absolute beginner
category: tech
date: 2026-10-16
seoTitle: "Getting into robotics as an absolute begineer"
seoDescription: "What I understand and know about the field of robotics as an absolute beginner who just started building his first SO-100 robotic arm."
related:
  - /writings/on-risks
updated: "2026-10-16"
---

## Introduction

It's been over a month since I started diving deep and getting hands-on in the world of robotics.

My first ever project in robotics, and right now the only project that I've done, is my experiments on a cheap SO-100 arm that I built. For context, it's an open source arm, and building it basically means sourcing the materials and then assembling the parts. I didn't have to worry about making the motors work, figuring out how the end effector will change when you move the motors, or deciding the geometry. All of these things were done for me.

![My SO-100 arm and the yellow cube](/assets/posts/robotics/so100-arm.jpg)

In fact, it is one of the more popular open source robotic arm projects, so the community around it is very strong. They have so many models that were pre-trained on the dataset collected from this arm, and it's generally an easier starting point.

Now, I've been experimenting on that arm and trying to do so many different things over the last few weeks. In this blog, I wanted to share my two cents on where my understanding sits at the end of a month-long experimentation on the arm, and robotics in general.

By no means am I an expert in any of these things. In fact, the bigger reason why I'm even writing this blog in the first place is because I feel like I don't know enough. And it's okay to not know enough, but I want to write down my perspective, my thoughts, and the ideas that I have as an absolute beginner in the field of robotics. Because it would be pretty interesting to look back at this blog, maybe one or two years down the line, when both me and robotics will have matured and advanced a lot more.

## The two parts of robotics

I want to start there. One part is, of course, the brain part. The other part is the hardware part of it. In my opinion, both of those parts teach you very important and different things that one might need to know in order for the setup to work.

## The hardware part

When I say the hardware part, I don't mean how the motors work or how to make a motor. That is different. I think that goes in the mechanical side of things, not in the software-ish land that I'm exploring.

So when I say hardware, for me what it means is calibration, geometry, kinematics, all of those things. We're still in the realm of software, we're not in the mechanical world. But all of these things are hardware-specific. What does the camera look like? What is the focal length of your camera, and stuff like that? Your environment setup, lighting and whatnot. It could also be things like: what is your table height, if you want to do inverse kinematics and geometry kind of things? What is the object you're picking? What is the height and dimension of that, and things like that.

Why do you need to know all of those things? Well, you need them if you want precise control in a controlled environment. If you want to do a task, you can hard-code it. Once you know all the geometry of everything, it's relatively easy to prompt an AI agent to create a skill for your particular setup, where you can do a task repeatedly as long as the environment doesn't change.

And as the last sentence said, the biggest shortcoming of this is that if there is any change in the environment, the setup will not be able to adapt. Because it's a hard-coded setup and there's no AI, there's no brain. So adaptation is a big issue.

## The brain part

And so that brings me to the second part of robotics, which is adapting to the environment using AI and a smart brain. In the second part, this adaptation can happen in so many different ways and on so many different levels.

### Models trained on data

For example, you could train an AI model that looks at the camera images and the current motor joint positions, and predicts the next set of actions your arm should take to do the task you asked it to do. Here, everything is controlled by the model itself. The way it's trained is also different: you first build a dataset, and then train the model on that dataset.

### Reinforcement learning

The other approach for this same task could be reinforcement learning, where you build a simulation environment and train the policy in different environments, and then move it onto a real-world arm or whatever. It basically learns to do one specific task, whatever you trained it on.

With the first approach, the model can generalize better if you train it on a lot of varied data. That's how you get things like Generalist AI's [GEN-1.5](https://generalistai.com/blog/gen-1.5), a model that could generalize and even do in-context learning to a certain extent. That doesn't happen with reinforcement learning, because there you're training for one specific goal against a specific set of rewards, so there's no generalization in that sense.

### LLMs as high-level planners

Then there's a third approach. There are many more, of course, but this one is super interesting to me personally: using large language models as high-level planners for robotics.

What that basically means is using a large language model like ChatGPT or Claude, giving it control of your robot and all the images. There's no pre-training or whatever; you just ask it to do a thing. It works in a lot of different cases, and sometimes it fails. But the best part about this policy is that it's very smart, because the models running behind it are really smart. So they know how to adapt. They know how to fix the mistakes that they're making as they're trying to complete a task. And while you look at it, it's pretty exciting to see.

Now, the bigger problem with them, at least at the moment, is that they're really slow. And more importantly, you're wasting a lot of compute, because those models were not trained specifically for robotics. They were trained to do so much general stuff. So when you use them to do a robotic task, like picking up an object and placing it somewhere, you're still using all the compute inside them, and all the knowledge that they were trained on: writing an essay, writing code, generating images and whatnot. These are some of the skills that these models have which are not being used there. So it's a waste of compute, and it makes everything super slow.

## What I tried

I've tried all three of these things. Not only tried, but also tried to combine all three of them, because I believe in learning by doing.

### Geometry and inverse kinematics

I started with just geometry and inverse kinematics. From the camera image, I would convert the pixel into a 3D coordinate. Of course, that took multiple days for me, because of two reasons.

One of them was that the camera I was using was an ESP32 camera module, which has a very wide FOV (field of view). So the number of pixels is very high, and the error is very high when I'm tracking the end effector position through different images.

More importantly, the bigger problem in my case was that every time I would do some work and some calibration, then go to bed and come back, the camera position would have changed, because I didn't have it fixed in one position. So I would have to redo the whole thing, and it would take up a lot of my time.

And then it worked. I could reach the cube. But since the images were RGB and there was no depth in them, I couldn't precisely tell the depth. That basically meant that sometimes the policy, or the algorithm, would say that it had reached the cube, while it would be vertically on top of the cube, yes, but off sideways. These kinds of things would happen.

So that was my learning with kinematics: A, you have to do it and then pray to God that your cameras and settings don't change much. And B, you probably need a high-end depth camera if you want to be precise with it. But once you do it, it does work, and it's really fast, because it's just crunching a bunch of numbers and then getting an output. So that did work.

### Vision language action models

The second thing that I tried was vision language action models. I used a pre-trained MolmoAct v2, and I did not change anything. I just wanted to see how it would perform without any fine-tuning.

And that's where I saw the limitation of an un-fine-tuned model in a new environment. It would try to reach the cube, but it would never be able to grab it. It would make a lot, a lot of mistakes. It was hesitating a lot. After doing a bunch of reading online, I realized that the natural way people use it is by fine-tuning it in their particular environment, on their camera. And then it starts working, at least for the tasks that it has seen in its training data.

![MolmoAct v2 reaching for the cube but never grabbing it (sped up 5x)](/assets/posts/robotics/molmoact-reach.gif)

### Reinforcement learning in simulation

I tried reinforcement learning in simulation and then plugged it into real life, but I had zero success with it. Of course, I think I would need to spend a lot more time there. I haven't done that, which is one of the reasons. I never actually succeeded in creating a good enough simulation of the environment that my arm is currently in, and so the transfer was just not working. That is something I would probably need to work on.

### LLMs in control

And the third thing, the last thing, was using these big large language models. I tried giving them the entire freedom of moving the arm in any direction and just picking up objects or whatever.

After a lot of hit and trial, fixes, changing different models, working on the prompt system, and trying to guide the model by giving it as much information as I can to make its life easier, it did succeed. But to pick up a cube, it took almost three minutes, which is a lot of time.

![The LLM-controlled arm going for a sock (sped up 5x)](/assets/posts/robotics/llm-sock-pickup.gif)

Then there were some things that helped me optimize the time and bring it down to less than 20 seconds. The things that were helpful were marking the directions in the images, and also giving it tools that use somewhat faulty, somewhat messy geometry calculations, but are reliable enough that it can do some tasks.

For example, I hooked up the reach tool that I made in the first experiment, using inverse kinematics and geometry, with an LLM. My reach tool isn't accurate, it makes mistakes, but it gets the job 90% done. From there on, the bigger, smarter model takes over and does the small corrections. For grasping, I tried a hard-coded, geometry-based solution, but it wasn't reliable. So I'm still trying to figure out what the right thing to do here would be.

## Putting it all together

But this combination of all of these things together could, I think, be very interesting, and something that can generalize better. The way I like to think about this is just using a very smart model, giving it access to a bunch of tools, and hoping that those tools do the thing that they say they would do.

So as long as we can nail these things, the rest of the work which is left is essentially just using a smart planner, and only using it when it is necessary. And then we start playing to the strengths of those AI models, instead of what we're doing right now.

## Conclusion

In conclusion, these are some of my thoughts after doing the experiments that I did over the last month on my robo arm. I have been constantly reading a lot of papers on the side, trying to get as much information as I can and getting ideas from there. So I'm very hopeful that I'm definitely going to learn a lot more about all of these things as time goes on.

For now, I think I'm going to start by building a leader arm so that I can start collecting data, and start building those tools for the LLM to be able to use and do normal tasks. That's the one thing that I'm going to be working on next.

If you have some ideas, feel free to drop them. Thank you so much for reading this, and I will see you in the next one.
