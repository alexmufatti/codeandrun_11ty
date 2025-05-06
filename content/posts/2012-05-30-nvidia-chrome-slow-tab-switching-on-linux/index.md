---
title: 'Nvidia: chrome slow tab switching on linux'
id: '2143'
date: 2012-05-30 15:39:27
tags:
- Linux
---

To correct Nvidia problem causing slow tab switching in Chrome:

```bash
nvidia-settings -a InitialPixmapPlacement=0
```