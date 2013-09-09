# Pizzabyte

Ovo je moja sails.js/node.js web aplikacija kao rad za ovaj kurs:

http://c2.etf.unsa.ba/course/view.php?id=171

<<<<<<< HEAD
=======
<strike>Možete ju vidjeti na djelu</strike> ovdje:
* http://pizzabyte.herokuapp.com
* http://pizzabyte.herokuapp.com/bo  (Back office)

> zapravo ako želite koristit Heroku verziju morate prilikom svakog reseta aplikacije popuniti dummy podatke putem ovog linka: http://pizzabyte.herokuapp.com/populate

>>>>>>> ba17b8e... Update LICENSE
# Racional

Prikazati moć web socket-a i SPA (jedno-straničnih web aplikacija). Koristi slijedeće tehnologije:

* [Sails.js](http://sailsjs.org/) kao MVC backend aplikacije i kao REST-ful bazu podataka.
* [Knockout.js](http://knockoutjs.com/) kao front-end MVx biblioteku za jednostranične aplikacije, ojačanu sa [Sammy.js](http://sammyjs.org/) koji se koristi kao ruter za SPA.
* [Socket.io](http://socket.io/) kao implementacija web socketa, [Express.js](http://expressjs.comno/) kao web servis biblioteka, te [node.js](http://nodejs.org/) kao runtime, su osnovne tehnologije na kojima je Sails.js zasnovan.
* [jQuery](http://jquery.com/) o kojem Knockout.js ovisi za rad, a dodatno se koristi za baratanje DOM-om, vizualne efekte i AJAX.
* [Pure CSS](http://purecss.io/) se koristi za osnovicu grafičkog dizajna u front-end aplikacijama.

Naravno, kao poslijedica izbora tehnologija, aplikacija je gotovo u potpunosti napisana u JavaScriptu.

## Šta je ovo

To je aplikacija za naručivanje pice za zamišljenu piceriju. Korisnici naruče picu kroz meni u front-endu, a osoblje picerije printa i obrađuje narudžbe kroz back-end.

## Instalacija

Da bi pokrenuli aplikaciju lokalno potreban je Node.js. Ljudi rade sa node aplikacijama pod Windowsima, ali ja ne bih znao kako. Da bi ste pratili instalacijske korake potreban vam je nekakav \*nix (može i virtualni stroj). Aplikacije i koraci testirani su pod Ubuntu Raring, Ubuntu Precise i OSX Mountain Lion, pod **nodeenv** dok je lakši način testiran samo pod Ubuntu Raring.

Dva su načina pokretanja.

### Lakši način

Pod uvjetom da već imate node.js, možete samo klonirati ovaj repozitorij i instalirati ovisne biblioteke lokalno sa `npm`:

    # git clone https://github.com/bmarkovic/pizzabyte.git
    # cd pizzabyte
    # npm install

Konačno nakon instalacije, aplikaicju pokrećete sa:

    # node app.js

iz direktorija `pizzabyte`.

### Preporučani način

Sails zahtjeva relativno novu verziju node-a. Ovo se može sukobiti sa drugim node aplikacijama sa kojim radite. Srećom, dobri ljudi iz Python zemlje su preradili svoj izvanredni alat za virtualizaciju razvojnih okruženja, `virtualenv` da radi sa node.js, i gle čuda, nazvali ga `nodeenv`.

Python je sveprisutan, ali pod OSX može biti nekompatibilnosti sa načinom na koji se stvari rade pod Linuxom pa je preporučeno instalirati Python pomoću [Homebrew](http://brew.sh/).

Tako da ovi prvi koraci nisu isti na oba OS-a:

Linux:

    # sudo apt-get install python-pip
    # sudo pip install nodeenv

Mac:

    # ruby -e "$(curl -fsSL https://raw.github.com/mxcl/homebrew/go)"
    # brew install python
    # easy_install pip
    # pip install nodeenv

Dalje se putevi ova dva OS-a spajaju.

Prvo treba kreirati novo virtualno okruženje pomoću `nodeenv` i instalirati **Sails.js** globalno:

    # nodeenv sails
    # cd sails
    # . bin/activate
    # npm -ginstall sails@0.8.94

Bitno je da ovo bude verzija Sails-a jer je ovaj framework trenutno pokretna meta, a verzija 0.9 dostupna u vrijeme razvoja ove aplikacije nije dobro riješila hostanje više SPA u jednoj instanci.

Nakon bootsrappinga nastavljate kao u lakšoj verziji:

    # git clone https://github.com/bmarkovic/pizzabyte.git
    # cd pizzabyte
    # npm install

Dodatno, možete aplikaciju koristiti iz globalne instance:

    # sails lift

Da popunite bazu podataka osnovnim menijem i s nešto narudžbi otiđite na:

http://localhost:1338/populate

i to je to. Front-end je dostupan na http://localhost:1338

Za brisanje stare baze (ponovno popunjavanje) obrišite datoteku `.tmp/dirty.db` relativno od direktorija u koji je kloniran repozitorij (`pizzabyte` directorij).

## Korištenje

**Front end** je u korijenu aplikacije. To je jednostavni čarobnjak UI, potpuno jasan za upotrebu.

**Back office** je dostupan na http://localhost:1338/bo i omogućuje odabir narudžbe iz liste, te obradu i štampanje iste. Za obradu slijedeće narudžbe (najstarije, koristi se FIFO red) može se korstiti **Enter** tipkovnička kratica.

## Kako ovo radi

Aplikacija koristi socket.io za komunikaciju između prednjeg i zadnjeg dijela. Kad se nova narudžba napravi automatski se dodaje na listu neobrađenih narudžbi (front-end "pinga" backend preko socket.io). Kad se narudžba obradi jednostavno se označi kao obrađena i više se ne pojavljuje u spisku. Dvije su SPA aplikacija (ako ne računamo popunjavanje baze):

* Front office
* Obrada narudžbe

Obije su implementrane kao jednostranične aplikacije koje se u potpunost izvršavaju na klijentu kao View-ovi (pogledi) Sails MVC-a, svaka sa svojim klijentskim MVVM kodom implementiranim u Knockout.js. Kako je upravljanje direktno serviranim datotekama drugačije u Sails nakon 0.9x (a ja nisam našao način kako da implementiram svoje riješenje) ova aplikacija koristi posljendnju 0.8 verziju.

Trenutno autentifikacija i sigurnost nisu implementirane, najvećim dijelom jer Sails čini taj dio relativno trivijalnim tako da će to u nekoj od narednih revizija aplikacije biti implementirano.

(c) 2013 Bojan Marković / Elivero
