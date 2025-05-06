---
title: Storage USB e mount point
id: '2194'
date: 2008-09-13 15:14:11
tags:
- Computers
---

**Problema:** come tutti ormai vivo con quantità abnormi di dati memorizzate su dispositivi usb esterni. Come fare per avere questi dati sempre a disposizione sullo stesso “mount point” in linux?

**Soluzione:** ci sono 2 possibilità; la prima é quella di editare i files di regole di udev (ormai tutte le distribuzioni lo utilizzano) in modo da identificare il dispositivo hardware e assegnargli cosi' un nome unico all’interno dello pseudo filesystem “dev”. Una volta ottenuto questo non resta che inserire in fstab la riga corretta per il montaggio del filesystem. Non é nulla di particolarmente complicato ma, come dicevo, c’é un’altra soluzione che é ancora piu' semplice. Quasi tutte le distribuzioni moderne hanno abilitata la funzione di automount dei dispositivi usb; bene, il punto di mount utilizzato in maniera predefinita é la “label” del filesystem che deve essere montato (se presente). Quindi l’unica cosa da fare se volete avere un mount point fisso per il vostro filesystem non é altro che impostare una label a vostro piacimento per tutti i dispositivi usb, quando li collegherete ve li troverete montati automaticamente in `/media/&lt;label&gt;`. Una guida su come impostare la label per i tutti i filesystem linux la trovate [qui.](https://help.ubuntu.com/community/RenameUSBDrive "guide") Inoltre, se avete necessità di impostare delle opzioni di mount avanzate, potete utilizzare in ogni caso il file fstab prendendo come device `/dev/disk/by-label/&lt;label&gt;` e forzare il punto di mount o le opzioni come meglio credete.