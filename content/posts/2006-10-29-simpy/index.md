---
title: Simpy
id: '2213'
date: 2006-10-29 02:34:54
tags:
- Computers
---

Come sempre in perfetto orario vi annuncio che, da ormai qualche settimana, è online la lacalizzazione in italiano di simpy. Vi chiederete perché questa dovrebbe essere una notizia degna di un post (visto che ne pubblico così pochi); bè, il motivo è presto detto: la traduzione è stata fatta da [Stefano Nurchi](http://www.casperize.com) e dal sottoscritto. Non è una novità tradurre qualcosa per la comunità Open Source (faccio parte del progetto [ILDP](http://www.pluto.it/ildp) da un po' anche se non ho tantissimo tempo da dedicarvi) però questa è la prima volta che il mio “lavoro” ha visibilità globale; prima le traduzioni di guide e howto su linux restavano confinate ad un pubblico sicuramente più ristretto.

Mi sento di dire che è stato fatto un bel lavoro anche se rimane ancora qualcosa da fare a causa della natura “hard-coded” di alcune parti dell’interfaccia. :-)

Probabilmente molti di voi non sanno che cosa sia Simpy… è un sito di [Social Bookmarking](http://en.wikipedia.org/wiki/Social_bookmarking) come i più famosi [Digg](http://digg.com) e [del.icio.us](http://del.icio.us/). Questi siti permettono di salvare i propri bookmark, classificarli ed effettuare ricerche su di essi; in più è possibile ricercare tra i bookmark di tutta la comunità quelli simili o che trattano un argomento di nostro interesse e vedere quali sono i più “linkati” o i più cliccati. Non è da sottovalutare un’altra utilità fondamentale: permette di avere i propri bookmark sempre disponibili anche se si utilizzano browser diversi o non si è sul proprio pc; a questo proposito è molto utile la possibilità di avere un feed RSS contenente i propri link sempre aggiornato.

Per chi volesse rischiare l’integrità del proprio pc (:-p) ho scritto un piccolissimo script python (non concluso, non testato, in alfa version, che probabilmente funziona solo sul mio pc) che, sfruttando le API di simpy, genera come output il contenuto del file bookmark.html da utilizzare con firefox. :-) Se qualcuno è così pazzo da utilizzarlo poi mi faccia sapere se funziona.

(purtroppo lo script è andato perduto in qualche migrazione dei webserver)

N.B. fare un backup dei propri bookmark prima di eseguire lo script è da ritenersi obbligatorio soprattutto perché lo script non ha la pretesa di effettuare un’integrazione tra i link locali e quelli di simpy ma unicamente di creare i dati per un file html contenente i SOLI bookamrk provenienti da simpy.