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
*   Logge inn
*   Opprette brukerkonto
*   Se alle arrangementer
*   Sortere arrangementer etter kategori
*   Se detaljer om enkeltarrangement

#### Innlogget bruker
*   Logge ut
*   Redigere og slette brukerkonto
*   Redigere egen kontoinformasjon
*   Sende spørsmål til kundesupport
*   Melde seg på enkeltarrangementer
*   Publisere og slette egne innlegg knyttet til arrangementer
*   Reagere og avreagere på innlegg
*   Kommentere på innlegg, samt redigere og slette egne kommentarer
*   Opprette, redigere og slette mapper for kommende arrangementer
*   Opprette, redigere og slette arrangementer


CrudOps
-------

Prosjektet benytter [Gatherly-CrudOps](https://github.com/oscarwirum/crudops) som rest-API, dette er en forket versjon av [CrudOps](https://github.com/vegarcodes/crudops) laget av faglærer Vegard Norman. [Gatherly-CrudOps](https://github.com/oscarwirum/crudops) benytter den originale Gatherly-templaten, i tillegg til endringene som er beskrevet nedenfor.

### Endringer i Gatherly-templaten

*   lagt til flere felter under users-endepunktet (eks: firstName, lastName, username, gender, image)
*   lagt til felter i meetups (eks: summary, category, price, image, imageAlt).
*   lagt til flere meetups i meetups-endepunktet for å ha mer innhold på sidene.
*   lagt til nytt endepunkt kalt folders, som inneholder feltene: name, events, userId. 
*   lagt til nytt endepunkt kalt suportTickets, som inneholder feltene: title, name, email, message, userId.


### Ansvarsfordeling

#### Sider i løsningen:

*   Forside: Adrian
    * index.html
    *   Ressurs for full CRUD: supportTicket
*   Brukerkonto/innlogging: Siva
    * login.html + profile.html  
    *   Ressurs for full CRUD: Users
*   Lag arrangementer: Jan-Roger
    *   createEvent.html
    *   Ressurs for full CRUD: Meetups
*   Samleside for arrangementer: Oscar
    *   events.html   
    *   Ressurs: Folders
*   Enkeltarrangement: Kristin
    *   singleEvent.html  
    *   Ressurs for full CRUD: Post
 




