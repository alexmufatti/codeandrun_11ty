---
title: Xfce loses theme settings
id: '2127'
date: 2013-10-10 22:01:59
tags:
- Linux
---

![image](/images/2021/08/xfce-logo.jpg)

Today I started my xfce desktop and it looks like …“different”. No theme loaded, default icons, no background. I tried to change theme from Xfce Settings but nothing, it doesn’t work.

My .session-errors reveals a

After a bit o googling it seems to be an [aged bug](https://bugzilla.redhat.com/show_bug.cgi?id=867455) of xfce when used on multiple monitor configuration.

The [solution](http://suluke.blogspot.it/2013/07/xfce-suddenly-not-applying-any-themes.html), or better, the workaround is to delete the file:

Now you can log out and log in again in your themed Xfce :-)