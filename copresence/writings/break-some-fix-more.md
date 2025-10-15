---
title: Break some to fix more
description: How breaking things can help you fix them faster
category: tech
date: 2024-09-24
---

## Context
I have been spending a lot of my time at work trying to migrate our design system at Adobe to its next version. And a huge part of it is to make sure that our existing components work and look exactly the same way.
The fun part is that they don’t. A lot of things break. And a lot of my time went into figuring out why those components are breaking.

### Let’s define *breaking*
So when I say that things broke (in this context), I’m specifically talking about the UI changes. 
For example, a component (say accordion) has some visual differences after migration (see below screenshot)
![Image](/assets/posts/break-things/accordion-before-after.png)
As you can see, the height of `accordion-item` component has decreased after the update and now my job is to figure out why is that case and how to fix that.

### Process
This is how I earlier used to try and tackle these issues.
- open local storybook
- inspect element
- check for missing styles by comparing it to the original (non-migrated) version of the component

This is a very tedious process and sometimes it would take me hours to figure out what’s missing. 

### Hack
So here’s a little modification I did after multiple iterations over my process. 
- open main storybook
- inspect element
- try and break the original component’s style to match the migrated component’s style.

This small change in my process of trying to triage these bugs helped me save a lot of time. 

> It’s way more fun to break things than to figure out why they are breaking. 

### Conclusion
It’s time for you to go and reflect on your approach towards doing everyday tasks and figure out if **you should break some to fix more**.