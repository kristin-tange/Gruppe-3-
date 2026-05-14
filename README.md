Gatherly
========

Formål med prosjektet
---------------------

Gatherly er en demo-applikasjon utviklet av gruppe 3 i faget Frontend-utvikling emne 2 ved Gokstad Akademiet. Løsningen er bygget med Vite, TypeScript, vanilla HTML og CSS. Hvert gruppemedlem har fått ansvar for å utvikle én side i løsningen med full CRUD-funksjonalitet mot tildelt API ([CrudOps](https://github.com/vegarcodes/crudops)). Ansvarsfordeling og API er beskrevet nedenfor. 

Formålet med prosjektperioden har vært å: 
* etablere gode rutiner for gruppesamarbeid
* utarbeide detaljerte planer for utviklingsarbeidet med tydelig avgrenset scope og definerte krav til utførelse
* gjennomføre planene på en strukturert og tilfredstillende måte ved hjelp av Scrum, GitHub og GitHub Projects
* levere en ferdig løsning i tråd med kundecase, scope og akseptansekriterier i kravspesifikasjonen

Gruppen har også utformet en enkel og sammenhengende visuell profil med wireframes og styletile for å sikre et helhetlig og sammenhengende uttrykk. Videre har gruppen hatt fokus på semantisk html, aria-labels, tydelige brukermeldinger og media queries for å sikre god tilgjengelighet og responsivitet i ulike skjermstørrelser.

Om Gatherly
-----------

I dag er informasjon om arrangementer ofte spredt på ulike plattformer, noe som kan være uoversiktlig og lite tilgjengelig for mange brukere. En løsning på dette problemet er å samle alle arrangementer og meetups på ett sted, slik at brukere enkelt kan holde oversikt over relevante tilbud. Målet med Gatherly er dermed å gjøre det enkelt for brukere å både oppdage, opprette, delta på og engasjere seg i arrangementer og meetups innenfor et bredt spekter av interesser og fagfelt. 

### Funksjonalitet i løsningen

#### Gjestebruker
-   Se alle arrangementer
-   Sortere arrangementer etter kategori
-   Se detaljer om enkeltarrangement
-   Opprette brukerkonto
-  Logge inn*

#### Innlogget bruker
*   Redigere og slette brukerkonto
*   Redigere egen kontoinformasjon
*   Logge ut*
*   Sende spørsmål til kundesupport**
*   Opprette, redigere og slette mapper for kommende arrangementer
*   Melde seg på enkeltarrangementer*
*   Publisere og slette egne innlegg knyttet til arrangementer
*   Reagere og avreagere på innlegg
*   Kommentere på innlegg, samt redigere og slette egne kommentarer
*   Opprette, redigere og slette arrangementer

OBS: 

*Inn- og utlogging samt påmelding til arrangementer er implementert for å demonstrere en mer fullstendig løsning, men fungerer kun som placeholders. Data lagres lokalt i localStorage og sendes ikke til API-et. Denne funksjonaliteten er derfor ikke en del av den øvrige CRUD-implementasjonen.

**Kundesupport er nå kun tilgjengelig for innloggede brukere. I tidligere planer har vi skrevet at det også skulle være tilgjengelig for gjestebrukere. Endringen er gjort for å kunne koble henvendelser til riktig bruker, og at innloggede brukere kan se, redigere og slette egne henvendelser. 


CrudOps
-------

Prosjektet benytter [Gatherly-CrudOps](https://github.com/oscarwirum/crudops) som rest-API. Dette er en forket versjon av [CrudOps](https://github.com/vegarcodes/crudops) laget av faglærer Vegard Norman. [Gatherly-CrudOps](https://github.com/oscarwirum/crudops) benytter den originale Gatherly-templaten, i tillegg til endringene som er beskrevet nedenfor.

### Endringer i template

Gruppen har gjort noen endringer i den originale Gatherly-templaten for å kunne implementere funksjonalitet som planlagt. 

Vi har: 
*   lagt til flere felter i users: firstName, lastName, gender, image.
*   lagt til felter i meetups: summary, category, price, image, imageAlt.
*   lagt til flere arrangementer i meetups-endepunktet for å kunne vise mer innhold på sidene.
*   lagt til nytt endepunkt kalt folders, som inneholder feltene: name, events, userId. 
*   lagt til nytt endepunkt kalt supportTickets, som inneholder feltene: title, name, email, message, userId.


Ansvarsfordeling
-----------
Tabellen under viser hvem som har hatt ansvar for å utvikle de ulike sidene i løsningen, filnavn, og hvilken API-ressurs som er brukt til full CRUD. 

| SIDE    | FILNAVN     | ANSVAR | API-RESSURS    |
| ------- | ----------- | ------ | -------------- |
| Forside | index.html  | Adrian | supportTickets |
| Profil/innlogging| login.html/profile.html | Siva   | users 
| Lag arrangementer | createEvents.html  | Jan-Roger | meetups |
| Arrangementer | events.html  | Oscar | folders |
| Enkeltarrangement | singleEvent.html  | Kristin | posts |



