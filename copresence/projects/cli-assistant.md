---
title: CLI based AI Assistant
description: I built a CLI based AI assistant that can perform various tasks like sending emails, searching the web, and playing music
category: project
date: 2024-09-06
tags: 
    - python
    - machine-learning
links:
    - type: github
      url: https://github.com/TarunTomar122/cli-assistant
---

###

This is basically jarvis on a command line interface. I chose to build it on the command line because I wanted to have a simple and fast way to interact with the assistant and it also make me feel like I am a hacker when I use it lol.

#### Tech Stack

I used RASA to build the NLP model and I used an express server to handle the backend. The express server is connected to a mongodb database where I store the user data and the logs of the assistant.

![Image](/assets/projects/cli-assistant/flow.png)

#### 

I trained the model on a dataset of over 1000 conversations and I used the rasa core to handle the conversation flow. 

####

- Rasa would decide the action based on the intent and the entities extracted from the user input.
- The action would then be sent to the express server where the action would be performed.
- The response would then be sent back to the user.

####

So that's how the assistant worked. Simple and straight forward.