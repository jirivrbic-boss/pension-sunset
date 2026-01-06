# Firebase Setup Guide - Pension Sunset

Tento dokument obsahuje detailní instrukce pro nastavení Firebase pro projekt Pension Sunset.

## 📋 Co je potřeba nastavit v Firebase Console

### 1. Firestore Database

#### Vytvoření databáze:
1. Jděte do [Firebase Console](https://console.firebase.google.com/)
2. Vyberte projekt `pension-sunset`
3. V levém menu klikněte na **Firestore Database**
4. Klikněte na **Create database**
5. Vyberte **Start in test mode** (nebo **Production mode** a nastavte rules)
6. Vyberte lokaci (např. `europe-west1`)

#### Vytvoření kolekce `rooms`:
1. Klikněte na **Start collection**
2. Collection ID: `rooms`
3. Document ID: nechte auto-generovat
4. Přidejte první dokument s těmito poli:
   - `name` (string): "Příklad pokoj"
   - `price` (number): 1500
   - `capacity` (number): 2
   - `description` (string): "Popis pokoje..."
   - `image` (string): "178484544.jpg"

#### Ukázkový dokument:
```json
{
  "name": "Deluxe pokoj s výhledem",
  "price": 2000,
  "capacity": 2,
  "description": "Komfortní pokoj s výhledem na okolní přírodu. Navržen podle principů Feng Shui pro maximální relaxaci.",
  "image": "178480560.jpg"
}
```

### 2. Authentication

#### Nastavení Email/Password:
1. V Firebase Console klikněte na **Authentication**
2. Klikněte na **Get started**
3. V záložce **Sign-in method** klikněte na **Email/Password**
4. Zapněte **Enable** a uložte

#### Vytvoření admin uživatele:
1. V záložce **Users** klikněte na **Add user**
2. Zadejte email (např. `admin@pensionsunset.cz`)
3. Zadejte heslo (min. 6 znaků)
4. Klikněte na **Add user**

**⚠️ DŮLEŽITÉ:** Uložte si tyto přihlašovací údaje - budete je potřebovat pro přístup do admin rozhraní!

### 3. Firestore Security Rules

#### Nastavení rules:
1. V Firebase Console > **Firestore Database** klikněte na záložku **Rules**
2. Zkopírujte obsah souboru `firestore.rules` z projektu
3. Vložte do editoru rules
4. Klikněte na **Publish**

#### Nebo použijte Firebase CLI:
```bash
# Instalace Firebase CLI (pokud ještě nemáte)
npm install -g firebase-tools

# Přihlášení
firebase login

# Inicializace projektu (pokud ještě není)
firebase init firestore

# Deploy rules
firebase deploy --only firestore:rules
```

### 4. Storage (volitelné - pro budoucí upload obrázků)

#### Nastavení Storage:
1. V Firebase Console klikněte na **Storage**
2. Klikněte na **Get started**
3. Vyberte **Start in test mode** (nebo nastavte vlastní rules)
4. Vyberte lokaci

#### Storage Rules (pro upload obrázků):
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /rooms/{roomId}/{allPaths=**} {
      // Povolit upload pouze autentizovaným uživatelům
      allow read: if true;
      allow write: if request.auth != null 
                   && request.resource.size < 5 * 1024 * 1024  // Max 5MB
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```

## 🧪 Testování

### Test veřejného webu:
1. Otevřete `index.html` v prohlížeči
2. Měly by se zobrazit pokoje z Firestore
3. Pokud nejsou žádné pokoje, přidejte je přes admin rozhraní

### Test admin rozhraní:
1. Otevřete `admin.html` v prohlížeči
2. Přihlaste se pomocí vytvořeného admin účtu
3. Zkuste přidat, editovat nebo smazat pokoj

## 🔍 Kontrolní seznam

- [ ] Firestore Database vytvořena
- [ ] Kolekce `rooms` vytvořena
- [ ] Alespoň jeden testovací pokoj přidán
- [ ] Authentication zapnuto (Email/Password)
- [ ] Admin uživatel vytvořen
- [ ] Firestore Rules nastaveny a nasazeny
- [ ] Veřejný web zobrazuje pokoje
- [ ] Admin rozhraní funguje (přihlášení + CRUD)

## ⚠️ Bezpečnostní poznámky

1. **Nikdy nesdílejte Firebase konfiguraci** - API klíče jsou veřejné, ale měly by být chráněny pomocí Firestore Rules
2. **Používejte silná hesla** pro admin účty
3. **Pravidelně kontrolujte Firestore Rules** - ujistěte se, že jsou správně nastavené
4. **V produkci použijte Production mode** místo test mode

## 📚 Další zdroje

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)

---

Pokud máte problémy s nastavením, zkontrolujte:
1. Firebase projekt je správně vytvořen
2. API klíče v `firebase.js` odpovídají vašemu projektu
3. Firestore Rules jsou správně nastavené
4. Admin uživatel má správná oprávnění

