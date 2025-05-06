---
title: Cinnamon screenshot applet default folder
id: '2124'
date: 2013-12-20 21:54:50
tags:
- Linux
---

I’ve switched some weeks ago to Linux Mint and Cinnamon from Xfce and in these days I’m a kind of exploring the new desktop.

I’m used to take screenshot for work, totake some notes and so I installed the [Cinnamon screenshot applet](http://cinnamon-spices.linuxmint.com/applets/view/35 "screenshot applet").

![image](/images/2021/08/screenshot-from-2013-12-20-195253.png)

After some day using it I was a bit bored by the screenshots saved in Pictures folder by default so I traied to change this behaviur.

Looking into the applet js file i discover that the applet is based on gnome-screenshot and so I find an easy solution to my problem.

You can edit the with dconf-editor the configuration string

`org.gnome.screenshot.auto-save-directory`

ad set you favorite screenshot folder!