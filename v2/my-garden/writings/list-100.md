---
title: Falling in love with Next.js
description: The story of how I made the homepage of tarat.space load faster using Partial Pre Rendering in Next.js.
category: thoughts
date: 2024-08-09
---

I've spent some unnecessary amount of hours trying to make the homepage of [tarat.space](https://www.tarat.space/), the most optimized homepage possible (*fast and seo friendly*) and in this article I wanna take you through the journey of how I did it.

## Context

Let's start with some context. The homepage of [tarat.space](https://www.tarat.space/) contains mainly two sections:

1. **Present**: This section contains a static component that renders text related to what I am doing right now.
2. **Recent**: This section contains a dynamic component that renders my most scrobbled tracks from [Last.fm](https://www.last.fm/).

For this website, I am using [Next.js](https://nextjs.org/) as the frontend framework and [Vercel](https://vercel.com/) as the hosting provider. One of the reasons why I chose Next.js was because I wanted my website to be SEO friendly and Next.js provides a great support for that using Server Side Rendering (SSR).

For those who are not familiar with [SSR](https://www.freecodecamp.org/news/server-side-rendering-javascript/), it is a technique used to render the web page on the server side and send the fully rendered page to the client. This is in contrast to the traditional client side rendering where the page is rendered on the client side using JavaScript.

## Initial Setup

I created my homepage and chose to use SSR for the entire website including the homepage. I deployed the website on Vercel and ran some tests on [Lighthouse](https://developers.google.com/web/tools/lighthouse) to see how the website was performing.

![Image](/assets/posts/fast-homepage/lighthouse-1.png)

One of the things that I noticed was that the **SEO score** was not 100.    
And even though the lighthouse gave a perfect 100 score for the performance, I got curious and checked the network tab in the browser's developer tools to see how the website was performing in terms of loading time.

![Image](/assets/posts/fast-homepage/network-1.png)

I noticed that the homepage was taking around **500 ms** to load which isn't too bad but then again we're literally just rendering some text on the homepage... so I thought I could do better.

## What's the problem?

I started by analyzing the network tab in the browser's developer tools and noticed that the homepage was making a request to fetch the data for the recent section. This was because the recent section was fetching the data from the Last.fm API on the server side.   
And since the data was being fetched on the server side, it was causing the homepage to take longer to load.

The obvious first thought that might come to your mind is to fetch the data on the client side instead of the server side. But I didn't want to do that because I wanted the website to be **SEO friendly** and fetching the data on the client side would mean that the data would not be available to the search engine crawlers.

So I had to come up with a solution that would allow me to fetch the data on the server side and still make the homepage load faster.

## The Solution

This is where the magic of **Next.js** comes in the form of [**Partial Pre Rendering**](https://nextjs.org/docs/app/api-reference/next-config-js/partial-prerendering).

> Partial Prerendering is an experimental feature that allows static portions of a route to be prerendered and served from the cache with dynamic holes streamed in, all in a single HTTP request.

![Image](/assets/posts/fast-homepage/thinking-in-ppr.png)

#### How can we use Partial Pre Rendering to make the homepage load faster?

1. **Cache the static portion of the homepage**: The static portion of the homepage is the present section which contains the text related to what I am doing right now. This section doesn't change frequently and can be cached.

2. **Stream the dynamic portion of the homepage**: The dynamic portion of the homepage is the recent section which contains the most scrobbled tracks from Last.fm. This section changes frequently and cannot be cached.

By using Partial Pre Rendering, we can cache the static portion of the homepage and stream the dynamic portion of the homepage in a single HTTP request. This will allow the homepage to load faster because the static portion of the homepage will be served from the cache and the dynamic portion of the homepage will be streamed in.

## Implementation

The implementation of PPR in Next.js is very straightforward. Except for the fact that it is an experimental feature that is only available in the **canary** version of Next.js.

The toughest part of this whole process was to figure out what version of `react` and `react-dom` would work with the canary version of Next.js. I had to go through a lot of trial and error to figure out the right versions.

![Image](/assets/posts/fast-homepage/packagejson.png)

Once I had the right versions of `react` and `react-dom`, I was able to use PPR in my Next.js application by adding the following code to my `next.config.js` file:

```js
module.exports = {
  experimental: {
    partialPrerender: true,
  },
};
```

Now when I ran `next build` I could see that the static portion of the homepage was being cached and the dynamic portion of the homepage was being streamed in.

![Image](/assets/posts/fast-homepage/nextbuild.png)

Note: I was getting some dependency conflicts when I tried `npm i` after adding those versions in `package.json`. So I removed my `node_modules` and `package-lock.json` and ran `npm i --force` to fix the dependency conflicts. 
I then had to update the install command in vercel dashboard to `npm i --force` as well. 

## Results

And now for the moment of truth... I ran some tests on Lighthouse to see how the website was performing after implementing PPR.

![Image](/assets/posts/fast-homepage/lighthouse-2.png)

The **SEO score** was now 100 which is awesome! And for the performance, the homepage was now taking around **70 ms** to load which is a significant improvement from the previous **500 ms**.

![Image](/assets/posts/fast-homepage/network-2.png)

This is cool and all but my favorite part about this homepage now is that if you refresh the page, the present section will be served from the cache and the recent section will be streamed in. This makes it feel like the homepage is loading instantly without any flicker.

![Image](/assets/posts/fast-homepage/homepage.gif)

## Conclusion

So yeah, that's what I spent my time on... optimizing the homepage of [tarat.space](https://www.tarat.space/) to make it as fast and SEO friendly as possible. I hope you found this article helpful.
I had a lot of fun working on this and I learned a lot about Partial Pre Rendering in the process. And I'm planning to write more often about the things I learn and the projects I work on. So stay tuned for more articles!

See you in the next one! 👋
