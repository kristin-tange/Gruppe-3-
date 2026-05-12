Gatherly
========

Formål med prosjektet
---------------------

En demo-applikasjon utviklet av gruppe 3, i faget Frontend-utvikling emne 2, ved Gokstad Akademiet. Gatherly er bygget med Vite, vanilla html/css og TypeScript.

Om Gatherly
-----------

I dag er informasjon om arrangementer ofte spredt på ulike plattformer, noe som kan være uoversiktlig og lite tilgjengelig for mange brukere. Tanken bak Gatherly er å løse dette problemet ved å samle alle arrangementer og meetups på ett sted, slik at brukere enkelt kan holde oversikt over relevante tilbud.

### Funksjonalitet i løsningen

#### Gjest

*   Se alle arrangementer
*   Sortere arrangementer etter kategori
*   Sende spørsmål til kundesupport
*   Se detaljer om enkelarrangement
*   Melde seg på enkeltarrangementer

#### Innlogget bruker

*   Opprette og slette brukerkonto
*   Logge inn og ut
*   Redigere egen kontoinformasjon
*   Publisere og slette innlegg knyttet til arrangementer
*   Reagere og avreagere på innlegg
*   Kommentere på innlegg, samt redigere og slette egne kommentarer
*   Opprette, redigere og slette en “huskemappe” for kommende arrangementer
*   Opprette, redigere og slette egne arrangementer


CrudOps
-------

Prosjektet benytter [Gatherly-CrudOps](https://github.com/oscarwirum/crudops) som rest-API, dette er en forket versjon av [CrudOps](https://github.com/vegarcodes/crudops) laget av faglærer Vegard Norman. [Gatherly-CrudOps](https://github.com/oscarwirum/crudops) benytter den originale Gatherly-templaten, i tillegg til endringene som er beskrevet nedenfor.

### Endringer i Gatherly-templaten

*   lagt til flere felter under users-endepunktet (eks: firstName, lastName, gender, age, image
*   FLERE ENDRINGER?
*   lagt til flere meetups i meetups-endepunktet
*   lagt til felter i meetups (eks: summary, category, price, image)


### Ansvarsfordeling

#### Sider i løsningen:

*   Forside: Adrian
    *   Ressurs for full CRUD: supportTicket?
*   Brukerkonto/innlogging: Siva
    *   Ressurs for full CRUD: Users
*   Lag arrangementer: Jan-Roger
    *   Ressurs for full CRUD: Meetups
*   Samleside for arrangementer: Oscar
    *   Ressurs: Folders?
*   Enkeltarrangement: Kristin
    *   Ressurs for full CRUD: Post
 
### Mappestruktur

Kommer senere... 



