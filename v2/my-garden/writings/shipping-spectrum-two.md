---
title: My biggest work achievement so far
description: Shipping Spectrum Web Components 1.0
category: tech
date: 2024-11-08
---

## Introduction

We shipped the much awaited 1.0 version of [Spectrum Web Components](https://opensource.adobe.com/spectrum-web-components/) at Adobe last week and I was one of the core contributors to this release. This was the biggest project I've ever worked on so far and I'm really proud of the work we did. 
So in this blog I wanna take you through the journey of how we got here and what we did to make this release happen.

![Image](/assets/posts/spectrum-two/s2.jpeg)

## Backstory

I joined Adobe as a software engineer in June 2023 and I was assigned to the newly formed Spectrum Web Components team. The team was responsible for building and maintaining the web component library built on top of Adobe's own design system [Spectrum](https://spectrum.adobe.com/). It was a small team with only 4 people and we were all very new to the world of web components and design systems.

####

For those who don't know, web components are a set of web platform APIs that allow you to create new custom, reusable, encapsulated HTML tags to use in web pages and web apps. They are a set of standards-based APIs that help you create your own custom HTML elements.

####

Our library was built using [LitElement](https://lit.dev/) and our main consumers were the Adobe's own product teams. We had a lot of internal dependencies and we were also dependent on the Spectrum design system team for the design specs.

####

>At the time I joined, SWC was already being consumed by Adobe's top products like Firefly, Illustrator Web, Adobe.com etc. But the library was still in beta and we had a lot of work to do to make it production ready.

## The Journey

Around November 2023, we started planning for the 1.0 release. We had a lot of features that were in the pipeline and we had to make sure that we ship them all in the 1.0 release. We had a lot of discussions with the design system team to make sure that our components were in sync with the design specs. We also had to make sure that our components were accessible and performant.
###
Some of the major things that we needed to figure out were:

### Deprecation of old components

We wanted to understand what all components were being used by the product teams and what all components were not being used. We wanted to deprecate the components that were not being used and we wanted to make sure that the components that were being used were in sync with the design specs.
####
For this we worked very closely with the prototyping team and built a service that would track the usage of the components across all the products.
####
Over the next few months we started issuing deprecation warnings for the components that were not being used and we started working on the components that were being used to make sure that they were in sync with the design specs.

### Supporting older version of Spectrum

The bigger idea for this 1.0 release was that we would start shipping the components with the updated designs according to [Spectrum 2.0](https://s2.spectrum.adobe.com/). But we also wanted to make sure that the components were backward compatible with the older version of Spectrum i.e. 1.0.

####

This meant we had to come up with a strategy to adopt the new design tokens and styles from Spectrum 2.0 while still supporting the older ones in the same codebase. This was a big challenge for us as we had to make sure that the components were not breaking for the products that were still using the older version of Spectrum.
####
This involved rearchitecting the way we were handling the design tokens and styles in our components. We had to come up with a way to dynamically switch between the design tokens and styles based on the version of Spectrum that the product was using.

####
> I feel extremely proud to say that I was one the of the driving forces behind this effort. 
####
Since SWC is open source, you can check out my [PR](https://github.com/adobe/spectrum-web-components/pull/4442) for more details.

### Supporting multiple Icon sets

Another big feature that we wanted to ship with the 1.0 release was the support for both S1 and S2 icons. We wanted to make sure that the components were able to switch between the two icon sets based on the version of Spectrum that the product was using.
####
Our biggest challenge with this was that we wanted to hide all the complexity of the switcher on our end and we wanted to make sure that the product teams did not have to do anything to switch between the icon sets. 
####

> Once again, I was one of the driving forces behind this effort.

####

Here's the link to my [PR](https://github.com/adobe/spectrum-web-components/pull/4747) for more details.

### Collaboration across timezones

Our SWC team is spread across 3 different timezones. We have people in India, US and Germany. This plus the fact that we constantly needed to collaborate with the css, tokens and the design team made it very challenging for us to stay in sync with each other.

####

There were times when we had to wait for the other team to wake up to get a review on our PRs. This was a big bottleneck for us and we had to come up with a strategy to make sure that we were not blocked because of this.

####

As we kept working towards this release, we got better at handling the time zone differences. All of us started working in a more async manner and we started using tools like slack, github discussions and paper docs to make sure that we were always in sync with each other.

####

> For me personally, this was a big learning experience. I had never worked in a team that was spread across different timezones and I had to learn how to communicate effectively with my team members who were in a different timezone.

## The Release

Finally, after months of hard work, we shipped the 1.0 version of Spectrum Web Components last week. The release was a big success and we got a lot of positive feedback from the product teams. We also got a lot of contributions from the community and we were able to close a lot of issues that were pending for a long time.

####

Go checkout our [doc site](https://opensource.adobe.com/spectrum-web-components/) and [storybook](https://opensource.adobe.com/spectrum-web-components/storybook/index.html).

## My Learnings

For me personally this project was a big learning experience. 

####

I got learn a lot about **web components**, **design systems** and how to build a library that is being consumed by a lot of products. I also got to learn how to work in a team that is spread across different timezones and how to effectively communicate with my team members who are in a different timezones.

####

I also got to learn how to work with a lot of both internal and external dependencies and how to make sure that our components are accessible and performant.

####

All in all I would say that this project was a big success. With the 1.0 release now out, we are all very excited to start working towards a full fledged
production ready 2.0 release of Spectrum Web Components and I'm really looking forward to it.