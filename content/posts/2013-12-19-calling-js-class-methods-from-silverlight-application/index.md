---
title: Calling JS class methods from Silverlight application
id: '2125'
date: 2013-12-19 21:18:05
tags:
- Programming
---

I’m working on a project in which we have to call some JS method of the containing page from a Silverlight application.

It seems to be really straight forward like:

```csharp
HtmlPage.Window.Invoke("GlobalJsMethod",param1,param2);
```

But this works only for global methods and not for JS class methods.

In fact this will not work:

You can make a global wrapper for every class methods but you can also do something like this:

```csharp
private ScriptObject _jsObject = HtmlPage.Window.Eval("JsClassInstance") as ScriptObject;
private void UserControl_Loaded(object sender, RoutedEventArgs e)
        {
                _jsObject.Invoke("JsMethod",param1,param2);
        }
```

that is far more elegant.

This is only a quick tip. Maybe I’ll write a more detailed post an JS-Silverlight interaction in the future.