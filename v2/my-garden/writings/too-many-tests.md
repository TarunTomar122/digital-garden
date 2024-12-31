---
title: Ship it! Or not?
description: How much testing is too much testing?
category: tech
date: 2024-09-06
---

### Flashback

I joined Adobe as my first full time job back in June 2023 (about a year ago). And since before this I had no prior experience of working on big codebases, I never really spend enough time writing tests. I was always in a hurry to ship the code and move on to the next task. 

### Recently

Over the last one year, I have been constantly learning and improving my skills and also my mindset. For most of the times, I write tests for every functionality I build. **And this never really bothered me until recently.**

### The Problem

So I working on a bug fix in one of the components in our library. 

> For those who don't know, I work on Adobe's design system library for web. It's called [Spectrum Web Components](https://opensource.adobe.com/spectrum-web-components/). 

The change was pretty simple. The menu-item was not reflecting the selected state when the value was set. I checked the code and found that the selected attribute was not being set on the menu-item.

So I added the attribute and made a [PR](https://github.com/adobe/spectrum-web-components/pull/4730/files#diff-cb5478be57036b07f8730a33bf2fe9f6480c71667ac86a7892328787eb76f2c9).

```js
<sp-menu-item
    .selected=${option.value === this.itemValue} // This is the attribute I added
>
    ${option.itemText}
</sp-menu-item>
```

### The Review

The PR was reviewed by my senior and he asked me to add a test for this change. I immediately texted him back saying that I wanna talk about why we need a test for this change.

### The Discussion

We went back and forth on this for a while. 

Basically my argument (which sounds very stupid as I am writing about it) was that this is such an expected behavior that we don't need a test for this. This should have been taken care of while writing this component in the first place.

> I was trying to argue for not writing a test for behaviours that are bare minimum expected from a component.

Now that I am writing about it, I feel so stupid because the reality is that 

#### We ideally would expect the bare minimum to work as expected always. And to make sure it does, we need to write even more tests.

### The Conclusion

Don't be like Tarun. 

> Make sure you write tests for the bare minimum expected behaviour of your codebase atleast.

PS: I am yet to add tests in that PR as I'm writing this. I'll do that now bwahahaha.

   