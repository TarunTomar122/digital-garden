---
title: Meet my new intern - Cursor AI
description: Got my hands on Cursor AI and I'm in love.
category: tech
date: 2025-01-15
---

###

I got my hands on Cursor AI about a week ago and since then I've been using it for all my coding needs trying to find out if it's worth the hype.

![Image](/assets/posts/cursor-ai/cursor-ai.png)

And I'm here to tell you that it's absolutely worth the hype. Here's some of the things I've been able to do with it.

### Setup NextAuth in a vite+react project

In one of my projects I needed to setup NextAuth for authentication. Now the funny part was that my project was not a pure Next.js project but a vite+react project and so I couldn't get the NextAuth.js library to work.

####

That's until I used Cursor AI. I typed in my prompt telling it that I'm using vite+react and it's not a pure Next.js project and I wanted to setup NextAuth for authentication. 

####

Within seconds, I saw Cursor AI changing the folder structure of my project and adding the necessary files and code to setup NextAuth.

####

At first I was skeptical but then after running the project, I saw that it was working. I was amazed. Amazed being an understatement.

If you wanna see my live reaction, you can [check out the attached video.](https://www.youtube.com/watch?v=BIR4Cn4hQIU&t=3175s&ab_channel=taratcodes).

### Refactor my stupid code

Now this is something I've found to be the most useful. Below I'll give you an example of how my code looked before and after I used Cursor AI to refactor it.

####

Before:

```javascript
async function getWeeklyTrack() {
    // Get the weekly favourite track from last.fm
    const lastFMResponse = await fetch(url, { cache: 'no-store' })
    const data = await lastFMResponse.json()
    const weeklyTrack =  data.weeklytrackchart.track[0]

    // Get the songUrl from spotify
    const searchResponse = await spotifyApi.searchTracks(
        weeklyTrack.name + " " + weeklyTrack.artist['#text']
    );
    const songUrl = searchResponse.tracks.items[0].preview_url
    return songUrl
}
```

####

After:

```javascript
async function getWeeklyTrack() {
    try {
        // Get the weekly favourite track from last.fm
        const lastFMResponse = await fetch(url, { cache: 'no-store' })
        if (!lastFMResponse.ok) {
            throw new Error('Failed to fetch from Last.fm')
        }
        
        const data = await lastFMResponse.json()
        const weeklyTrack = data.weeklytrackchart?.track?.[0]
        if (!weeklyTrack) {
            throw new Error('No weekly track found')
        }

        // Get the songUrl from spotify
        const searchQuery = `${weeklyTrack.name} ${weeklyTrack.artist?.['#text'] || ''}`
        const searchResponse = await spotifyApi.searchTracks(searchQuery)
        const songUrl = searchResponse?.tracks?.items?.[0]?.preview_url
        
        if (!songUrl) {
            throw new Error('No preview URL found on Spotify')
        }
        
        return songUrl
    } catch (error) {
        console.error('Error fetching weekly track:', error)
        return null // or a fallback URL
    }
}
```

####

Notice how the code is now more readable and error handling is added. 

####

>See the point is that I could have done this manually too but it would take my time and energy to do so which I was able to save by using Cursor AI. So I'm saving my time and energy for more important things.

####

I have a commit that was entirely written by Cursor AI and you can check out the commit [here](https://github.com/TarunTomar122/digital-garden/commit/507acfdbe7c17374faa5ecc11bab55bc1b344f5d#diff-4bb03300c200a3e9139e95c92959f37c3b8eb12ea62e0e22a7f31f5aa3980134R7).

### Fix the squiggly red underline errors

I'm sure you've seen these red underline errors in your code and it's annoying to solve them.

![Image](/assets/posts/cursor-ai/redlines.png)

But with Cursor AI, you can hover over the error and it will give you an option to either `fix in composer` or `fix in chat`. For me, I prefer using `fix in chat` because these errors are generally easy to fix. 

With that one click, Cursor AI will fix the error for you.

####

Smooth right?

### Conclusion

I've been using Cursor AI for a week now and I'm absolutely in love with it. It's a game changer for me and I'm sure it will be for you too.

####

So if you're looking for a way to speed up your coding, I highly recommend you give Cursor AI a try. (The only downside is that it's not free and you need to pay for it.)

####

Chalo, bye!