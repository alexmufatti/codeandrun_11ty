---
title: IP Address in bash script
id: '2142'
date: 2012-06-06 17:58:04
tags:
- Linux
---

In linux you can get all of yours inferfaces IP with something like this:

```bash
sudo ifconfig   grep 'inet addr:' awk -F: '{ print $2}'  awk '{ print $1 }'
```

For example on my machine this command will output: