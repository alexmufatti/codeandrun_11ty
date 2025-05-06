---
title: 'VMware: Microfono rumoroso in Windows 10 host'
id: '2122'
date: 2020-08-10 12:00:00
---

![image](/images/2021/08/mic.jpg)

Utilizzando Linux come sistema operativo di base a volte capita di dover avviare delle macchine virtuali Windows per eseguire quei programmi che su linux non esistono o hanno funzionalità limitate. Esempi tipici sono _Skype for Business_ che non esiste in linux o _Teams_ che non ha tutte le funzionalità della versione nativa.

Purtroppo però l’audio del microfono all’interno della VM a volte risulta estremamente disturbato, tanto da essere inutilizzabile.

Dopo un po' di prove e molte ricerche ho trovato un modo, assolutamente contro-intuitivo, per sistemare questo problema.

Per prima cosa installate i VmWareTools se non lo avete ancora fatto e assicuratevi che nella macchina virtuale sia configurata una scheda audio in modalità `auto detect`.

![image](/images/2021/08/setup.jpg)

A questo punto spegnete la macchina virtuale ed editate il corrispettivo file `.vmx`.

Cercate la riga contenente `sound.virtualDev = "hdaudio"` e rimuovetela. Sì, questo è il passaggio contro-intuitivo: rimuovendo quella riga si eviterà che VmWare simuli una scheda audio virtuale e utilizzi invece quella presente sulla vostra macchina.

Al riavvio della macchina virtuale noterete che non viene rilevato nessun hardware per la riproduzione audio. Ora montate il cd dei vmware tools come se voleste reinstallarli (potete anche usare la voce del menu di vmware) ma non fatelo. Aprite un _prompt_ e andate sul device che contiene l’installer. Da qui lanciate il comando `setup64.exe /a`. L’opzione `a` fará in modo che i vmware tools, al posto di essere installati, siano solo scompattati una cartella di vostra scelta. Scegliete una cartella e continuate.

Ora aprite il `Device Manager`; troverete una periferica multimediale non riconosciuta. Scegliete di aggiornare il driver e, invece di farlo cercare automaticamente dal sistema operativo, scegliete di indicare voi dove trovarlo.

![image](/images/2021/08/browse.jpg)

Come percorso scegliete quello dove avete scompattato i vmware Tools e poi navigate nelle sotto cartelle `vmware/drivers/audio/vista`.

![image](/images/2021/08/folders.jpg)

Verrà quindi installato il driver corretto e da quel momento non dovreste avere più problemi di disturbi nell’uso del microfono all’interno di Windows 10 in vmware!

![image](/images/2021/08/done.jpg)