---
title: keep
description: A long distance gift for my fiancee
category: life
date: 2026-09-24
---

![keep](/assets/posts/keep/keep-thumb.jpg)

This project happened because of two reasons: 

1. I wanted to build something that involved hardware
2. I wanted to gift something super personal to Monisha 

So one fine afternoon I was scrolling internet and saw some gifting ideas and one of those were this small [lcd picture frames with usb](https://www.amazon.co.uk/Digital-Picture-1280x800-Calendar-Mountable/dp/B0HJ4HTPS4/ref=asc_df_B0HJ4HTPS4?mcid=5fc9311859b53dcb88b6c3bb7d15f2ec&tag=googshopuk-21&linkCode=df0&hvadid=820477447850&hvpos=&hvnetw=g&hvrand=15288938766939283979&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=9046888&hvtargid=pla-2503326051320&psc=1&hvocijid=15288938766939283979-B0HJ4HTPS4-&hvexpln=0&gad_source=1) where you can display images on the screen. 

That got me thinking if I can build something similar where I control the images displayed on the screen. So then I can click a photo from Edinburgh and Monisha can see it on her desk everyday :)

I did some quick research and found out that its not too difficult to build something like this... I learned about e-paper displays which are these beautiful displays that use e-ink technology and can be controlled via a simple microcontroller. 

One of the most important thing for me was to make sure that Monisha wouldn't have to worry about the technical parts of this project so much so that I didn't even want her to deal with charging and updating the display. I wanted something that I can give her and it would just work for months and months before she'd need to charge it.

And these epaper displays are the perfect solution for this since the way they work is that once the image is displayed, it stays on the screen and u don't have to power it at all. So theoretically I could code the microcontroller to fetch and display image daily and then shut itself off or go to sleep.

This is exactly what I ended up doing. The microcontroller in this case was a seed studio esp32 that I got from thinkingrobotics (not sponsored) for quite cheap. I bought two of those controllers and one epaper display along with basic stuff like soldering iron and jumper wires.

![keep](/assets/posts/keep/parts.png)

Before this I had done a bit of soldering back in my undergrad days but I'd say all of it was pretty new to me so I needed a lot of help from ChatGPT to get me started. 

I put ChatGPT in voice mode while I did the soldering and I kept asking it questions and telling it about my progress... This was unusally helpful and after a few bad tries I figured it out.

So after the hardware was set up, I asked Codex to create a companion app for this. The app was necessary as to allow Monisha to setup wifi credentials in the microcontroller so it can fetch images from the server. But then we doubled down on it and made a widget for the app as well so she could also see the image on her homescreen. 

![keep](/assets/posts/keep/app.png)

I was able to get the 90% of the work done before Monisha came to Delhi and then after that she did the rest of the stuff to make the frame look nice and not so ugly lol. 

The final piece looks like this: 

![keep](/assets/posts/keep/final.png)

If you're into code and stuff then you can check that out on [GitHub](https://github.com/TarunTomar122/keep)

Oh and I also made a video about it which you should definitely watch [here](https://youtu.be/kkhD97BJ-2o)
