# Pension Sunset Mezirolí - Webová aplikace

Moderní frontend web pro Pension Sunset Mezirolí s Firebase integrací.

## 📋 Obsah

- [Instalace](#instalace)
- [Struktura projektu](#struktura-projektu)
- [Firebase nastavení](#firebase-nastavení)
- [Použití](#použití)
- [Firestore Rules](#firestore-rules)
- [Funkce](#funkce)

## 🚀 Instalace

### 1. Nainstalujte závislosti

```bash
npm install
```

### 2. Firebase konfigurace

Firebase je již nakonfigurováno v `assets/js/firebase.js`. Pokud potřebujete změnit konfiguraci, upravte tento soubor.

### 3. Spuštění lokálního serveru

Pro vývoj můžete použít jednoduchý HTTP server:

```bash
npm run dev
```

Nebo použijte Python:

```bash
python3 -m http.server 8000
```

Pak otevřete v prohlížeči: `http://localhost:8000`

## 📁 Struktura projektu

```
pension sunset/
├── assets/
│   ├── css/
│   │   ├── main.css          # CSS pro veřejný web
│   │   └── admin.css         # CSS pro admin rozhraní
│   └── js/
│       ├── firebase.js       # Firebase konfigurace
│       ├── main.js           # JavaScript pro veřejný web
│       └── admin.js          # JavaScript pro admin rozhraní
├── fotky/                    # Složka s obrázky
├── index.html                # Hlavní stránka
├── admin.html                # Admin rozhraní
├── package.json              # NPM závislosti
├── firestore.rules           # Firestore bezpečnostní pravidla
└── README.md                 # Tento soubor
```

## 🔥 Firebase nastavení

### 1. Firestore Database

Vytvořte Firestore databázi v Firebase Console a nastavte následující kolekce:

#### Kolekce: `rooms`
Struktura dokumentu:
```json
{
  "name": "Název pokoje",
  "price": 1500,
  "capacity": 2,
  "description": "Popis pokoje...",
  "image": "178484544.jpg"
}
```

### 2. Authentication

V Firebase Console > Authentication:
- Povolte **Email/Password** autentizaci
- Vytvořte admin uživatele (email + heslo)

### 3. Firestore Rules

Zkopírujte obsah souboru `firestore.rules` do Firebase Console > Firestore Database > Rules.

Nebo použijte Firebase CLI:

```bash
firebase deploy --only firestore:rules
```

### 4. Storage (volitelné)

Pokud chcete nahrávat obrázky přes Storage:
- Vytvořte Storage bucket
- Nastavte pravidla pro upload obrázků

## 📝 Použití

### Veřejný web (`index.html`)

- Zobrazuje pokoje z Firestore
- Rezervační formulář (připraven na backend)
- Galerie obrázků
- Kontaktní formulář
- Informace o penzionu, wellness, okolí

### Admin rozhraní (`admin.html`)

1. Otevřete `admin.html` v prohlížeči
2. Přihlaste se pomocí emailu a hesla (vytvořeného v Firebase Authentication)
3. Spravujte pokoje:
   - Přidat nový pokoj
   - Editovat existující pokoj
   - Smazat pokoj

## 🔒 Firestore Rules

Soubor `firestore.rules` obsahuje bezpečnostní pravidla:

- **rooms**: Veřejné čtení, zápis pouze pro autentizované uživatele
- **bookings**: Vytvoření kdokoli, čtení/úpravy pouze autentizovaní
- **contacts**: Vytvoření kdokoli, čtení/úpravy pouze autentizovaní
- **users**: Uživatelé mohou spravovat pouze svá vlastní data

## ✨ Funkce

### Veřejný web
- ✅ Responzivní design (mobile-first)
- ✅ Hero sekce s rezervačním formulářem
- ✅ Dynamické načítání pokojů z Firestore
- ✅ Galerie s lightboxem
- ✅ Smooth scroll navigace
- ✅ Jazykový přepínač (vizuální)
- ✅ Kontaktní formulář
- ✅ Google Maps integrace

### Admin rozhraní
- ✅ Firebase Authentication
- ✅ CRUD operace pro pokoje
- ✅ Přehled pokojů v tabulce
- ✅ Validace formulářů
- ✅ Bezpečnostní pravidla

## 🔮 Budoucí vylepšení

- [ ] Backend API pro rezervace
- [ ] Real-time dostupnost pokojů
- [ ] Email notifikace
- [ ] Platební integrace
- [ ] Multi-jazyčná podpora (i18n)
- [ ] Upload obrázků přes Firebase Storage
- [ ] SEO optimalizace
- [ ] Analytics integrace

## 📞 Kontakt

Pro dotazy nebo podporu kontaktujte vývojáře.

---

**Pension Sunset Mezirolí** - Klid, harmonie a relax u Karlových Varů

