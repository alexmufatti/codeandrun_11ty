---
title: Debootstrap
id: '2178'
date: 2012-02-17 01:20:53
tags:
- Computers
---

Questo post é un piccolo howto su come installare Debian (o distro derivate come ubuntu) con debootstrap.

### Nota importante

Lo scopo principale di questo post é spiegare il funzionamento di debootstrap e tenere degli appunti sulle fasi principali per l’installazione, non quello di fare un cut&paste diretto dei comandi.

### Assunzioni

In questo post si assume che:

* il disco sia già stato partizionato nella maniera corretta;
* si stia installando debian sid;
* la partizione di root é `/dev/sda1`;
* la partizione /home `/dev/sda5`;
* la partizione di swap é `/dev/sda2`.

### Preparare il sistema live

Per prima cosa occorre avere un media boot-abile di una distribuzione debian-based (ubuntu, mint, debian…etc). Facciamo il boot con il sistema live e accediamo alla console o, se si preferisce l’interfaccia grafica, ad un emulatore di terminale.

Probabilmente l’installazione live non contiene debootstrap. Lo si può installare con: `sudo apt-get install debootstrap`.

### Preparare le partizioni

Se il disco non é partizionato o si vuole cambiarne la suddivisione si può usare fdisk. Il mio disco solitamente é già partizionato e, soprattutto, nella partizione /home ci sono tutti i miei dati. Se questa é anche la vostra condizione occorre stare _molto_ attenti a formattare unicamente la partizione root e non quella home. Il comando da eseguire é: `sudo mkfs.ext3 /dev/sda1`.

Ora creiamo una directory sotto /mnt che sarà la base dell’installazione: `sudo mkdir /mnt/new_install` Successivamente montiamo lì i nostri filesystem: `sudo mount /dev/sda1 /mnt/new_install`. (si potrebbe montare già da ora anche la directory /home ma per evitare cancellazioni accidentali meglio farlo dopo)

### Eseguire debootstrap

Ok, si é pronti finalmente a lanciare debootsrap: `sudo debootstrap --verbose --arch=amd64 sid /mnt/new_install`. Per fare questo dovrete essere connessi ad internet. Una volta eseguito il comando si dovrà aspettare lo scaricamento e l’installazione del sistema base.

Ora, se tutto é andato per il verso giusto, dovremmo avere in /mnt/new\_install la struttura base del fileystem e possiamo dunque procedere con il mount dei filesystem di sistema:

* proc: `sudo mount -t proc /proc /mnt/new_install/proc`
* sysfs: `sudo mount -t sysfs /sys /mnt/new_install/sysfs`
* dev: `sudo mount --bind /dev /mnt/new_install/dev` Inoltre creiamo un file che servità durante l’installazione del bootloader: `touch /mnt/new_install/etc/mtab`

Infine copiamo il file con i dns di sistema nella nuova installazione: `sudo cp -a /etc/resolv.conf /mnt/new_install/etc/resolv.conf`

### Chrooting

Possiamo ora fare chroot nella nuova installazione: `sudo chroot /mnt/new_install /bin/bash`

Da questo momento in poi saremo all’interno della nuova installazione. Per prima cosa, prima che ci si dimentichi e si debba rifare tutto da capo, impostiamo la password di root del sistema: `passwd`

Dopodiché installiamo qualche pacchetto fondamentale con apt-get o aptitude:

* linux-image
* grub
* vim :-) Nel mio caso ora é il momento di montare il filesystem /home con: `sudo mount /dev/sda5 /mnt/new_install/home` e, se si vuole partire da un configurazione pulita per il proprio utente, spostare la vecchia home\_dir: `sudo mv /mnt/new_install/home/user /mnt/new_install/home/user_old`

Ultimo passo da non dimenticare, pena un kernel panic al primo avvio, creare il file /etc/ contenente:

`proc /proc proc nodev,noexec,nosuid 0 0 /dev/sda1 / ext3 errors=remount-ro 0 1 /dev/sda5 /home ext3 defaults,user_xattr 0 2 /dev/sda2 none swap sw 0 0`

Ora é possibile uscire dal chroot e fare il reboot del sistema. Una volta fatto il boot nel sistema base si può partire con l’installazione di tutti i pacchetti (xorg, etc) e con la creazione degli utenti.

Finito, la nostra disto é installata!