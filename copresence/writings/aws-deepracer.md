---
title: Our car ranked 5th among 200+ participants
description: I raced a RC car in the office on a random wednesday
category: tech
date: 2024-09-25
---

![Image](/assets/posts/deepracer/logo.png)

This was our team's official poster. We're called the SmoothOperators and we ranked 5th in AWS-ADOBE Deepracer Challenge.

### About deepracer challenge?

AWS DeepRacer challenge is basically a race with autonomously driving model cars where each car is virtually trained with reinforcement training. AWS offers training and testing of cars in a virtual environment by using reinforcement learning algorithms.

### How did I get in?

Recently Adobe collaborated with AWS team to host deepracer event for Adobe India teams. One of my old friends from college who is also in Adobe decided
to take part in this event and so I joined her.

### What were we supposed to do?

First round of this challenge was virtual. Each team got a total of 10 hours free training time for their reinforcement learning model that they would build using the AWS platform. Most of the coding part was limited to just writing the reward function for the model (and tweaking a bunch of other parameters)

...

Once the models were done training we tested them in the virtual environment and teams were ranked based on the minimum time the model took to complete a given lap.

SmoothOperators was ranked 6th on the leaderboard in the virtual round and we qualified for the final event along with 14 other teams.

### Final Round

In the final round, our models were loaded on an actual rc car and then we had to race the car in the physical environment. This time there was a small twist.

![Image](/assets/posts/deepracer/event.jpg)

We had the access to a remote that would control the speed of the car. Only the steering would be controlled by the actual model that we trained. That meant if our model was able to predict the turns correctly we could increase the speed and save some lap time.

...

> It got extremely competitive in the end and we managed to get the best lap time as around 10seconds. 

### Conclusions

So that was it... That's how I ended up racing a rc car on wednesday morning in the office.   
PS: I'm gonna drop the reward function here incase you want to test it out yourself lol.

```python
import math
 
# planned speed based on waypoints
above_three = [1,2,3,4,5,6,7,8,9,10, 25, 26, 27,28, 29, 30, 31, 32, 33, 57,24, 37, 38, 48, 49, 50, 56]
below_two = [14, 15, 16, 17, 18, 19, 20, 21, 39, 40, 41, 42, 43]
PENALTY_RATIO = 0.9
SPEED_DIFF_NO_REWARD = 1
def dist(point1, point2):
    return ((point1[0] - point2[0]) ** 2 + (point1[1] - point2[1]) ** 2) ** 0.5
 
 
# thanks to https://stackoverflow.com/questions/20924085/python-conversion-between-coordinates
def rect(r, theta):
    """
    theta in degrees
 
    returns tuple; (float, float); (x,y)
    """
 
    x = r * math.cos(math.radians(theta))
    y = r * math.sin(math.radians(theta))
    return x, y
 
 
# thanks to https://stackoverflow.com/questions/20924085/python-conversion-between-coordinates
def polar(x, y):
    """
    returns r, theta(degrees)
    """
 
    r = (x ** 2 + y ** 2) ** .5
    theta = math.degrees(math.atan2(y,x))
    return r, theta
 
 
def angle_mod_360(angle):
    """
    Maps an angle to the interval -180, +180.
 
    Examples:
    angle_mod_360(362) == 2
    angle_mod_360(270) == -90
 
    :param angle: angle in degree
    :return: angle in degree. Between -180 and +180
    """
 
    n = math.floor(angle/360.0)
 
    angle_between_0_and_360 = angle - n*360.0
 
    if angle_between_0_and_360 <= 180.0:
        return angle_between_0_and_360
    else:
        return angle_between_0_and_360 - 360
 
 
def get_waypoints_ordered_in_driving_direction(params):
    # waypoints are always provided in counter clock wise order
    if params['is_reversed']: # driving clock wise.
        return list(reversed(params['waypoints']))
    else: # driving counter clock wise.
        return params['waypoints']
 
 
def up_sample(waypoints, factor):
    """
    Adds extra waypoints in between provided waypoints
 
    :param waypoints:
    :param factor: integer. E.g. 3 means that the resulting list has 3 times as many points.
    :return:
    """
    p = waypoints
    n = len(p)
 
    return [[i / factor * p[(j+1) % n][0] + (1 - i / factor) * p[j][0],
             i / factor * p[(j+1) % n][1] + (1 - i / factor) * p[j][1]] for j in range(n) for i in range(factor)]
 
 
def get_target_point(params):
    waypoints = up_sample(get_waypoints_ordered_in_driving_direction(params), 20)
 
    car = [params['x'], params['y']]
 
    distances = [dist(p, car) for p in waypoints]
    min_dist = min(distances)
    i_closest = distances.index(min_dist)
 
    n = len(waypoints)
 
    waypoints_starting_with_closest = [waypoints[(i+i_closest) % n] for i in range(n)]
 
    r = params['track_width'] * 0.9
 
    is_inside = [dist(p, car) < r for p in waypoints_starting_with_closest]
    i_first_outside = is_inside.index(False)
 
    if i_first_outside < 0:  # this can only happen if we choose r as big as the entire track
        return waypoints[i_closest]
 
    return waypoints_starting_with_closest[i_first_outside]
 
 
def get_target_steering_degree(params):
    tx, ty = get_target_point(params)
    car_x = params['x']
    car_y = params['y']
    dx = tx-car_x
    dy = ty-car_y
    heading = params['heading']
 
    distance , target_angle = polar(dx, dy)
 
    steering_angle = target_angle - heading
 
    return angle_mod_360(steering_angle)
 
 
def score_steer_to_point_ahead(params):
    best_stearing_angle = get_target_steering_degree(params)
    steering_angle = params['steering_angle']
 
    error = (steering_angle - best_stearing_angle) / 60.0  # 60 degree is already really bad
 
    score = 1.0 - abs(error)
 
    return max(score, 0.01)  # optimizer is rumored to struggle with negative numbers and numbers too close to zero
 
 
def reward_function(params):
    speed = params['speed']
    closest_waypoints = params['closest_waypoints']
    reward = 0
    if closest_waypoints[1] in below_two:
        if speed >= 2:
            reward -= 15
    elif closest_waypoints[1] in above_three:
        if speed >=3.5:
            reward +=15
    reward += float(score_steer_to_point_ahead(params))
    return reward
```