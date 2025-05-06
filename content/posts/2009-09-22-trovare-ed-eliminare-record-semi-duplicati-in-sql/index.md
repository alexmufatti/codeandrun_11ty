---
title: Trovare ed eliminare record (semi-)duplicati in SQL
id: '2191'
date: 2009-09-22 20:25:07
tags:
- Programming
---

Lo ammetto: non é certo la cosa più complicata del mondo eliminare le righe duplicate in un database; quando serve però non viene mai in mente un modo per farlo. Questo post lo categorizzo quindi come mio _promemoria_!

Perché (semi-)duplicati? Parto dall’esempio pratico: aggiungere una chiave ad una tabella già piena di dati. Ovviamente, per la [legge di Murphy](http://it.wikipedia.org/wiki/Legge_di_Murphy), i valori dei campi che dovrebbero diventare chiave non saranno mai tutti diversi. Voglio quindi eliminare dalla tabella i record con chiavi uguali, preservandone solo una copia per ognuno.

Poniamo che la nostra tabella di chiami table1 con campi field1,field2,field3 (la fantasia nel dare i nomi é il mio forte). Vogliamo far diventare field1 e field2 chiave primaria. Per eliminare i duplicati eseguiamo:

`SELECT * FROM db.table1 as t2 WHERE (t2.field1,t2.field2,t2.field3) not in ( SELECT t1.field1,t1.field2, min(t1.field3) FROM db.table1 as t1 group by t1.field1,t1.field2)`

Fatto! Come preannunciato niente di emozionante… ;-)

Ovviamente la regola `min(t1.field3)` puo' essere cambiata a piacimento per conservare il record piu' conveniente ai fini dell’applicazione.