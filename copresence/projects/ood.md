---
title: Project Nimbus
description: An app that helps you iterate on your UX flows for your website
category: project
date: 2025-02-17
tags: 
    - nextjs
    - tailwindcss
    - ai
links:
    - type: website
      url: https://project-nimbus.netlify.app/
    - type: github
      url: https://github.com/TarunTomar122/Project-Nimbus
---

### Why?

Because I watched [Lu talking about autocomplete for infinite canvas](https://www.youtube.com/watch?v=01yE-vzJ-NE&t=50s&ab_channel=AIDemoDays) and that was super cool.

### Flow 

The idea here is to provide a canvas to the users where they can collborate with an AI agent to create UX flows for their website.

You start by making Object mapping for your website and hit the magic create button.

![Image](/assets/projects/ood/mapping.png)

The app will take the object mapping and any additional instruction if you provide and then it'll generate wireframes for you using html, css and javascript.

![Image](/assets/projects/ood/wireframes.png)

Now you can can make selections directly on the canvas and continue iterating on the UX flows and ask AI to update specific parts of the UX flow.

![Image](/assets/projects/ood/iterate.png)

And continue iterating and collborate with the AI agent to get the best UX flow for your website.

![Image](/assets/projects/ood/final.png)

### THE HOW?

Simple!

#### Here's everything I used to build this:

- [react-flow](https://reactflow.dev/) to create the canvas and node based ui.
- [gemini flash 2.0](https://ai.google.dev/gemini-api) for the AI agent.
- [nextjs](https://nextjs.org/) for the framework.
- [tailwindcss](https://tailwindcss.com/) for the styling.


