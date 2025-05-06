---
title: VMware and NTFS storage for vmdk
id: '2147'
date: 2012-05-02 20:49:23
tags:
- Computers
---

I face the problem of having vmware disks files (vmdk) on ntfs partition (for sharing them between windows and linux installations).

When I run vmware with this configuration in linux I get an hight CPU usage by _ntfs.mount_ process. Many blogs says that adding _mainMem.useNamedFile=FALSE_ to virtual machine configuration file will fix this issue.

This probably worked only with older vmware versions.

Then I found [this](http://www.ajopaul.com/2011/07/22/ubuntu-vmware-and-mount-ntfs-high-cpu-usage-fix/).

It says to change the location for snapshot and suspend files to a non ntfs partition. This just works!!