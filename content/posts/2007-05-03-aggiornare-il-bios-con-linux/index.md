---
title: Aggiornare il BIOS con linux
id: '2206'
date: 2007-05-03 01:30:08
tags:
- Computers
---

Oggi ho controllato il sito dell per vedere se erano presenti aggiornamenti per il software del mio portatile. Con mio grande stupore, per la prima volta da quando l’ho acquistato, ho trovato un aggiornamento con priorità \_urgent \_e per di più un aggiornamento del BIOS. Da vero _smanettone_ non ho resistito alla tentazione e mi sono subito lanciato nell’aggiornamento :-) .

Come consueto, gli aggiornamenti per i BIOS dell (penso sia lo stesso anche per altre marche di pc) vengono rilasciati sotto forma di eseguibili…. windows :-( . Devo dire che é buffo se pensiamo che Dell ha preannunciato l’intenzione di rilasciare versioni dei propri pc con preinstallato Linux… ma lasciamo perdere.

_Purtroppo_ ( $GhignoSatanico) sul mio portatile, ormai da tempo, non esiste la minima ombra di un sistema operativo di casa MS (tranne in virtual machine); mi sono dovuto quindi ingenare per trovare una strada alternativa per l’upgrade. Non avendo in casa nessun boot disk del caro vecchio dos con il quale far partire l’aggiornamento, ho provato a rendere boot-abile una chiavetta USB. Dopo un po' di tentativi andati a vuoto (é necessaria in ogni caso un’immagine di un dischetto DOS per poterla rendere boot-abile) ho abbandonato questa strada per percorrerne un’altra assai più facile ;-) .

**Ingredienti**: una chiavetta usb nella quale é stato copiato il file di aggiornamento del BIOS; un cd di installazione di windows 98/Me (e chi non ne ha uno..).

**Preparazione:** Far partire il cd di installazione con inserita la chiavetta USB e scegliere l’opzione “Boot del computer con supporto cd-rom”. Al prompt DOS, per pura magia informatica, vedrete che il drive “c:” non é altro che la nostra fida chiavetta USB. Basta quindi lanciare il file eseguibile… et voilà, aggiornamento del BIOS in corso.

;-)

Dopo tutto i cd di windows allora servono a qualcosa….oltre che a mantenere in piano la scrivania. 8-)