---
title: Opml to Html converter
id: '2129'
date: 2013-08-21 10:00:14
tags:
- Programming
---

Yesterday I discovered that wordpress does not have a blogroll feature any more so I looked around to find a way to show my feedly subscription list in my blog.

I didn’t find anything interesting so decided to implement a simple javascipt class to convert the _opml_ file exported from feedly to an _html_ page so that I could easily create a wordpress page or widget.

The script is really very simple, it takes the ompl, deserialize it and create a corresponding HTML string using from a basic template defined in the JS itself. It can be certainly improved (for example adding some css class to the template for graphical customization) but, for now, it just work for my needs.

In this version you can customize the export style editing the first lines of the JS:

```js
this.export_template = '&lt;html&gt;&lt;title&gt;Opml export&lt;/title&gt;&lt;body&gt;{INNERHTML}&lt;/body&gt;&lt;/html&gt;';

this.html_template = '&lt;h1&gt;{OPMLTITLE}&lt;/h1&gt;n&lt;ul&gt;{ITEMS}&lt;/ul&gt;';

this.rss_template = '&lt;li&gt;[&lt;a href="{XMLURL}"&gt;RSS&lt;/a&gt;] &lt;a href="{HTMLURL}"&gt;{TITLE}&lt;/a&gt;&lt;/li&gt;n';

this.folder_template_start = '&lt;li&gt;{TITLE}n&lt;ul&gt;n';

this.folder_template_end = '&lt;/ul&gt;&lt;/li&gt;n';
```

These variables describe the export format:

* **export\_template** is the template for the export html page;
* **html\_template** is the template for the page content;
* **rss\_template** is the template for each RSS line;
* **folder\_template\_start** is the template for the opening tag of RSS folder line;
* **folder\_template\_end** is the template for the closing tag of RSS folder line.

You can find it on ghitub, under my script repository: [opml.js](https://github.com/alexmufatti/Scripts/blob/master/scripts/opml.js "opml.js") and [opml.html](https://github.com/alexmufatti/Scripts/blob/master/scripts/opml.html "opml.html").

I hope it can be useful.