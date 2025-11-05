---
title: Automating youtube shorts
description: I automated the creation of youtube shorts based on the most viewed parts of popular videos
category: project
date: 2024-12-25
tags: 
    - javascript
    - python
links:
    - type: github
      url: https://github.com/TarunTomar122/Automating-a-Youtube-Channel-without-using-AI
---

###

This unarguably is one of the most fun projects I got to work on. So the story goes like this...

####

I was streaming on youtube (Yes, I do that sometimes) and somebody in the chat randomly pulled up this idea that I should automate my youtube shorts using my coding skills. I was like "Hmm, that's a cool idea" but I have no clue how to do that lmao.

#### The breakthrough

![Image](/assets/projects/youtube-automate/diewithsmile.png)

Few days later I hit the breakthrough when I was watching [this video](https://www.youtube.com/watch?v=PK-jh0QCoxc&ab_channel=BalladJukebox) and I was listening to the part where Em beihold starts singing and I noticed that the youtube timeline actually shows the most viewed parts of the video. I was like "Wait a minute, I can use this to automate my youtube shorts".

### The idea

Now the idea was simple...All I had to do was to

####

1. extract the most replayed part of the video.
2. cut that part out.
3. add subtitles to it.
4. change the aspect ratio to 9:16.
5. upload it to youtube.

###

So that's exactly what I did. I wrote a js script using pupeeter to download the html of the webpage and then I used a python script to process the html and extract the data of the bezier curves of the timeline. Then I used the bezier curves to extract the most viewed part of the video and then I used moviepy to cut that part out and add subtitles to it.

####

Subtitles were generated using the youtube api and the aspect ratio was changed using moviepy.

####

To upload the video to youtube I used the youtube api and the video was uploaded to my channel.

####

That's it. That was the whole process. Pretty simple but a lot of fun. Did you like it?