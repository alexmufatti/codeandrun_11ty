---
title: 'Nvidia: chrome slow tab switching on linux'
id: '2143'
categories:
  - Linux
date: 2012-05-30 15:39:27
---

To correct Nvidia problem causing slow tab switching in Chrome:

```bash
nvidia-settings -a InitialPixmapPlacement=0
```
