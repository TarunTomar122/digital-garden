---
title: Anime Recommendation System
description: I scraped data of over 100K users from MyAnimeList and built a recommendation system using collaborative filtering.
category: project
date: 2024-12-25
tags: 
    - python
    - reactjs
    - django
    - ai
links:
    - type: github
      url: https://github.com/TarunTomar122/AnimeRecommendation/tree/master
---

###

It was the summer of 2021... Rohan convinced me to watch an anime called "Attack on Titan". 6 hours and 8 episodes later he was showing me the [MyAnimeList](https://myanimelist.net/) website where the anime freaks like him rate and review the anime they watch.   
      
####
     
**Now here me out...**

####

That website has like shit ton amount of users and all the users are like making list of their fav anime and they review them and for some reason the website still didn't have a nice recommendations system :(

###

**So I imagined this...**

####

-> I can extract the data of those thousands of people 
####
-> I can then use that data and create a collaborative filtering based recommendation engine 
####
-> and then I can create a service which will give recommendations to MyAnimeList users

###

**Rest assured that's exactly what I did**

####

1. used scrapy and ran a few bots for over 3 days to extract user data from the website
2. cleaned and analysed the data using pandas and matplotlib
3. used scikit learn and trained a collaborative filtering based recommendation model
4. created a flask app and hosted the model backend
5. created a react app and hooked that to the backend to complete the service

###

Now... I would have loved to have a demo website of this project up and running but unfortunately a lot has changed since then and when I run the react app it just throws a bunch of errors. So I am just gonna leave the [github link](https://github.com/TarunTomar122/AnimeRecommendation/tree/master?tab=readme-ov-file) here and you can check out the code if you want to.