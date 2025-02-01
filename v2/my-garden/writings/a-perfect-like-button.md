---
title: An Almost Perfect Like Button
description: How hard can it be to code a like button? Well more than you think.
category: tech
date: 2025-02-01
---

### Introduction

You see that small heart below the description of this blog? That is what I am going to talk about today.

####

I wanted to add a like button to my blogs for a while now as without it I had no way of knowing if anybody was reading or liking them. But I never did it cause in my head adding a like button seemed like a very trivial task which won't teach me anything new and so I decided to just leave it.

####

Until one day I got my hands on this new AI based Code Editor called Trae AI. So then to test the power of this new tool I gave it a task of making a like button for my blog which it did in a few minutes.

####

So I now had a like button that worked. 

####

But everytime I would like a blog it would take a few milliseconds to load and then the counter would go up. That is very much understandable as the request to update the counter is sent to the server and the server responds with the updated counter which is then displayed on the page.

####

Refer to this GIF and the block diagram to understand how painful it looked like.

![GIF](/assets/posts/likebutton/likeanimation1.gif)

Part of the reason why it was kinda slow was because I was using free tier of firebase to store the likes. The obvious solution was to use a paid tier but I was too broke to pay for it. So then comes the interesting part.

### The Backstory

Notice how I don't ask you to sign up on the website and still you're able to like the blog? That is because I am using `localstorage` to store the likes. Localstorage is a way of storing data on the client side. So when you like a blog the like is stored in your browser and when you refresh the page the like is still there.

#### 

The important thing for you to note is that updating the **localstorage** is wayyy faster than updating the firebase. But we'd still need to update the likes in firebase so that the total likes are accurate.

####
And now we can talk about the implementation.

### The Base Case

We'll start with a base case and first assume that there is no central database (i.e. firebase) for now and we just have one user and we want to make a like button for one user only.

####

In that case we will update the localstorage when the user clicks on the button and then we will update the UI immediately after that. This whole process is super fast and the user will feel like the like button is working instantly.

![Block Diagram](/assets/posts/likebutton/block2.png)

Great! Now we have a like button that works instantly. But what if we have multiple users? 

####

If we have multiple users then we cannot store the likes in localstorage of one user only because that will be shared by all the users. So we need to store the likes in a central database.

### The Solution

This is where things get a little complicated. Let me try my best to explain them in the most simple way possible.

####

So what we're gonna do is we're still gonna make the UI update immediately as we make an update to the localstorage but we're gonna make the update to the database only after a certain amount of time.

#### 

Let's understand it with this block diagram:

![Block Diagram](/assets/posts/likebutton/block3.png)

Now this solution kindaa worked as now the UI update didn't have to wait for the server request to end. So we were almost there. Except for one thing.

#### A smol issue

If the user clicks on the like button multiple times in a short amount of time then the server request will be sent multiple times and the server will respond multiple times which will cause the UI to update multiple times which will cause the UI to look weird.

### `didIUpdateSomething?`

And this is where the legendary `didIUpdateSomething` variable comes in. This variable will be used to check if end result of all the clicks by the user is the same or not.

####

- It was liked before -> user clicked it even number of times -> it is still liked after all the clicks then we will not make the server request.

####
- It was liked before -> user clicked it odd number of times -> it is not liked after all the clicks then we will make the server request.

####
- And we'll only do this once every 500ms for all the time user spent clicking on the like button.

####
And this is how the updated block diagram looks like:

![Block Diagram](/assets/posts/likebutton/block4.png)

### The conclusion

If all of the tech stuff I threw at you was confusing then don't worry just enjoy this below gif to see how fast the like button is now after this change.

![GIF](/assets/posts/likebutton/likeanimation2.gif)

Cool right?

####

Anyways here's the [code for the like button](https://github.com/TarunTomar122/digital-garden/blob/main/v2/my-garden/src/components/LikeButton/LikeButton.tsx) and with that I'll close this blog. Bye Bye!