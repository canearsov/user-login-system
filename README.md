# User Login System

## Opis projekta

Ta projekt predstavlja spletno aplikacijo za registracijo in prijavo uporabnikov. Razvit je bil kot del diplomskega dela.

Aplikacija omogoča:

* registracijo novih uporabnikov
* prijavo obstoječih uporabnikov
* avtentikacijo z uporabo JWT (JSON Web Token)
* upravljanje uporabniških podatkov

---

## Uporabljene tehnologije

* Node.js
* Express.js
* JavaScript
* JWT (JSON Web Token)
* Baza podatkov (MongoDB ali PostgreSQL)
* Railway (za deployment)

---

## Namestitev in zagon

### 1. Kloniranje repozitorija

```bash
git clone https://github.com/canearsov/user-login-system.git
cd user-login-system
```

### 2. Namestitev odvisnosti

```bash
npm install
```

### 3. Zagon aplikacije

```bash
npm start
```

Aplikacija bo dostopna na:

```
http://localhost:3000
```

---

## Deployment (Railway)

Aplikacija je deployana s pomočjo Railway platforme.

Postopek:

1. Povezava GitHub repozitorija z Railway
2. Samodejni build in deploy ob vsaki spremembi
3. Konfiguracija okolja na strežniku

---

## Struktura projekta

```
/config            # konfiguracija aplikacije (npr. povezava z bazo)
/middleware        # middleware funkcije (avtentikacija, preverjanje)
/models            # podatkovni modeli (npr. uporabnik)
/routes            # API poti (login, register)
/public            # statične datoteke (HTML, CSS, JS)
/node_modules      # nameščene odvisnosti (ustvari npm install)
/.env              # okoljske spremenljivke
server.js          # glavna strežniška datoteka
package.json       # seznam odvisnosti in skript
package-lock.json  # zaklenjene verzije odvisnosti
```

---

## Funkcionalnosti sistema

* preverjanje uporabniških podatkov
* varna prijava uporabnikov
* uporaba JWT za avtentikacijo

---

## Avtor

Projekt je bil razvit v okviru diplomskega dela.

---
