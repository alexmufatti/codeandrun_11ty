---
title: 'Silverlight: detecting design mode'
id: '2128'
categories:
  - Computers
date: 2013-08-29 20:36:11
---

Just a quick tip useful when you have to do something special for Silverlight designer to work correctly.

```csharp
bool _inInDesignMode = DesignerProperties.IsInDesignTool;
```
