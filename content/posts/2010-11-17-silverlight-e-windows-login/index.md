---
title: Silverlight e Windows Login
id: '2181'
date: 2010-11-17 21:00:42
tags:
- Programming
---

In Sirverlight non esiste nativamente il modo per ottenere le informazioni sull’utente connesso a Windows. Quello che si può fare é utilizzare del codice ASP lato server e poi recuperare le informazioni da Silverlight.

Nel nostro container ASP che host il controllo Silverlight aggiungiamo qualcosa del tipo:

```csharp

....

    void Page_Load()
    {
      this.UsernameField.Value = User.Identity.Name;
    }

  ...
```

Nel body invece mettiamo un controllo nascosto per contenere i nostri dati:

```csharp

  ...

  ...

```

Lato Silverlight leggiamo, quando ci occorre, il volore del tag _input_:

```csharp
public string GetUser()
{
  HtmlDocument doc = HtmlPage.Document;
  if (doc == null)
  {
    return string.Empty;
  }
  HtmlElement elm = doc.GetElementById("UserField");
  if (elm == null)
  {
    return string.Empty;
  }
  return elm.GetAttribute("value");
}
```