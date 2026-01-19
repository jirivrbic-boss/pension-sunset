// ============================================
// TRIPS PAGE - Výlety do okolí
// ============================================

// Helper function to convert hex color to rgba
function hexToRgba(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) {
        return (alpha) => `rgba(139, 115, 85, ${alpha})`;
    }
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    return (alpha) => `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Funkce pro generování map URL
function getMapsUrl(placeName, city) {
    const query = encodeURIComponent(`${placeName} ${city}`);
    return `https://maps.app.goo.gl/search/${query}`;
}

// Data o výletech - kompletní seznam z kudyznudy.cz
const tripsData = [
    // Příroda
    {
        id: 1,
        name: 'Národní přírodní rezervace Soos – český Yellowstone nedaleko Františkových Lázní',
        city: 'skalna',
        type: 'priroda',
        description: 'Unikátní rezervace s bahenními sopkami a minerálními prameny. Český Yellowstone s naučnou stezkou.',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
        color: '#4a6741',
        mapsUrl: getMapsUrl('Národní přírodní rezervace Soos', 'Skalná')
    },
    {
        id: 2,
        name: 'Krušné hory – tajemné Rudohoří',
        city: 'bozi-dar',
        type: 'priroda',
        description: 'Malebná horská krajina s bohatou historií těžby. Ideální pro turistiku a poznávání přírody.',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&h=800&fit=crop',
        color: '#4a6741',
        mapsUrl: getMapsUrl('Krušné hory', 'Boží Dar')
    },
    {
        id: 3,
        name: 'Sopka Komorní hůrka – nejmladší sopka v České republice',
        city: 'frantiskovy-lazne',
        type: 'priroda',
        description: 'Unikátní geologická památka – nejmladší sopka v ČR s naučnou stezkou a výhledem do okolí.',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
        color: '#4a6741',
        mapsUrl: getMapsUrl('Komorní hůrka', 'Františkovy Lázně')
    },
    {
        id: 4,
        name: 'Svatošské skály u Lokte – zkamenělá svatba',
        city: 'loket',
        type: 'priroda',
        description: 'Přírodní skalní útvary připomínající svatební procesí. Romantické místo v údolí Ohře.',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop',
        color: '#4a6741',
        mapsUrl: getMapsUrl('Svatošské skály', 'Loket')
    },
    {
        id: 5,
        name: 'Rozhledna Hamelika u Mariánských Lázní',
        city: 'marianske-lazne',
        type: 'priroda',
        description: 'Kamenná rozhledna z roku 1876 s krásným výhledem na Mariánské Lázně a okolní krajinu.',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
        color: '#4a6741',
        mapsUrl: getMapsUrl('Rozhledna Hamelika', 'Mariánské Lázně')
    },
    {
        id: 6,
        name: 'Jezero Medard na Sokolovsku',
        city: 'svatava',
        type: 'priroda',
        description: 'Umělé jezero vzniklé zatopením hnědouhelného dolu. Skvělé pro koupání, vodní sporty a relaxaci.',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
        color: '#2c7dd6',
        mapsUrl: getMapsUrl('Jezero Medard', 'Svatava')
    },
    {
        id: 7,
        name: 'Vlčí jámy u Horní Blatné',
        city: 'horni-blatna',
        type: 'priroda',
        description: 'Přírodní zajímavost – propadlina vzniklá po těžbě cínu. Tajuplné místo obklopené lesy.',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop',
        color: '#5a5a5a',
        mapsUrl: getMapsUrl('Vlčí jámy', 'Horní Blatná')
    },
    {
        id: 8,
        name: 'Rozhledna Háj u Aše',
        city: 'as',
        type: 'priroda',
        description: 'Nejzápadnější rozhledna v ČR s výhledem do Německa. Kamenná věž z roku 1904.',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
        color: '#4a6741',
        mapsUrl: getMapsUrl('Rozhledna Háj', 'Aš')
    },
    {
        id: 9,
        name: 'Rozhledna na Krásenském Vrchu',
        city: 'krasno',
        type: 'priroda',
        description: 'Unikátní spirálová rozhledna s kamenným schodištěm venku. Nádherný výhled do okolí.',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
        color: '#4a6741',
        mapsUrl: getMapsUrl('Rozhledna Krásno', 'Krásno')
    },
    {
        id: 10,
        name: 'Božídarské rašeliniště s naučnou stezkou',
        city: 'bozi-dar',
        type: 'priroda',
        description: 'Rozsáhlé rašeliniště s naučnou stezkou a vyhlídkou. Vzácné rostliny a živočichové.',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop',
        color: '#4a6741',
        mapsUrl: getMapsUrl('Božídarské rašeliniště', 'Boží Dar')
    },
    {
        id: 11,
        name: 'CHKO Slavkovský les – ostrov zeleně v lázeňském trojúhelníku',
        city: 'marianske-lazne',
        type: 'priroda',
        description: 'Chráněná krajinná oblast s čistou přírodou, prameny a vzácnými druhy. Ideální pro turistiku.',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop',
        color: '#4a6741',
        mapsUrl: getMapsUrl('CHKO Slavkovský les', 'Mariánské Lázně')
    },
    {
        id: 12,
        name: 'Vrchol Plešivec v Krušných horách',
        city: 'aberamy',
        type: 'priroda',
        description: 'Horský vrchol s krásným výhledem a naučnou stezkou s mýtickými postavami z krušnohorských pověstí.',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&h=800&fit=crop',
        color: '#4a6741',
        mapsUrl: getMapsUrl('Plešivec', 'Abertamy')
    },
    {
        id: 13,
        name: 'Ježíškova cesta na Božím Daru',
        city: 'bozi-dar',
        type: 'priroda',
        description: 'Naučná stezka pro děti i dospělé s 12 zastávkami. Kouzelné místo s vánoční atmosférou po celý rok.',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop',
        color: '#4a6741',
        mapsUrl: getMapsUrl('Ježíškova cesta', 'Boží Dar')
    },
    {
        id: 14,
        name: 'Motýlí dům Papilonia v komplexu Diana v Karlových Varech',
        city: 'karlovy-vary',
        type: 'priroda',
        description: 'Tropický skleník s živými motýly z celého světa. Uklidňující prostředí s exotickými rostlinami.',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop',
        color: '#4a6741',
        mapsUrl: getMapsUrl('Papilonia', 'Karlovy Vary')
    },
    {
        id: 15,
        name: 'Vřídlo Karlovy Vary',
        city: 'karlovy-vary',
        type: 'priroda',
        description: 'Nejznámější a nejsilnější pramen v Karlových Varech tryskající do výšky 12 metrů.',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&h=800&fit=crop',
        color: '#8B7355',
        mapsUrl: getMapsUrl('Vřídlo', 'Karlovy Vary')
    },
    {
        id: 16,
        name: 'Bismarckova rozhledna u Chebu',
        city: 'cheb',
        type: 'priroda',
        description: 'Historická rozhledna z roku 1909 s výhledem na Cheb, Krušné hory a Smrčiny.',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
        color: '#4a6741',
        mapsUrl: getMapsUrl('Bismarckova rozhledna', 'Cheb')
    },
    {
        id: 17,
        name: 'Nejzápadnější bod České republiky',
        city: 'krasna',
        type: 'priroda',
        description: 'Symbolické místo na hranici s Německem. Turistický bod nejzápadnějšího místa ČR.',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop',
        color: '#4a6741',
        mapsUrl: getMapsUrl('Nejzápadnější bod', 'Krásná')
    },
    {
        id: 18,
        name: 'Přírodní rezervace Smraďoch',
        city: 'marianske-lazne',
        type: 'priroda',
        description: 'Rašeliniště s vývěry sirovodíkových pramenů a bahenními sopkami. Unikátní přírodní úkaz.',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop',
        color: '#4a6741',
        mapsUrl: getMapsUrl('Smraďoch', 'Mariánské Lázně')
    },
    {
        id: 19,
        name: 'Goethova vyhlídka v Karlových Varech',
        city: 'karlovy-vary',
        type: 'priroda',
        description: 'Romantická vyhlídka pojmenovaná po J.W. Goethovi s výhledem na město a údolí řeky Teplé.',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
        color: '#4a6741',
        mapsUrl: getMapsUrl('Goethova vyhlídka', 'Karlovy Vary')
    },
    {
        id: 20,
        name: 'Podzemí vřídelní kolonády – místo, kde vznikají kamenné růže',
        city: 'karlovy-vary',
        type: 'priroda',
        description: 'Podzemní prohlídka míst, kde se formují minerální útvary a kamenné růže z pramenů.',
        image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=1200&h=800&fit=crop',
        color: '#8B7355',
        mapsUrl: getMapsUrl('Podzemí vřídelní kolonády', 'Karlovy Vary')
    },
    {
        id: 21,
        name: 'Lesopark a rybník Amerika u Františkových Lázní s ptačí pozorovatelnou',
        city: 'frantiskovy-lazne',
        type: 'priroda',
        description: 'Klidný lesopark s rybníkem a ptačí pozorovatelnou. Ideální místo pro procházky a pozorování ptactva.',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop',
        color: '#4a6741',
        mapsUrl: getMapsUrl('Lesopark Amerika', 'Františkovy Lázně')
    },
    {
        id: 22,
        name: 'Přírodní park u Prelátova pramene v Mariánských Lázních',
        city: 'marianske-lazne',
        type: 'priroda',
        description: 'Krásný park s léčivým pramenem a naučnou stezkou. Klidné místo k relaxaci.',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop',
        color: '#4a6741',
        mapsUrl: getMapsUrl('Prelátův pramen', 'Mariánské Lázně')
    },
    {
        id: 23,
        name: 'Přírodní památka Vysoký kámen u Kraslic',
        city: 'kraslice',
        type: 'priroda',
        description: 'Skalní útvar s vyhlídkou a naučnou stezkou. Malebný výhled do okolní krajiny.',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop',
        color: '#4a6741',
        mapsUrl: getMapsUrl('Vysoký kámen', 'Kraslice')
    },
    {
        id: 24,
        name: 'Štola Johannes u Božího Daru',
        city: 'bozi-dar',
        type: 'priroda',
        description: 'Historická těžební štola s prohlídkami. Fascinující podzemní svět Krušných hor.',
        image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=1200&h=800&fit=crop',
        color: '#5a5a5a',
        mapsUrl: getMapsUrl('Štola Johannes', 'Boží Dar')
    },
    {
        id: 25,
        name: 'Mýtická krušnohorská stezka na Plešivci – stezka krušnohorských pověstí',
        city: 'aberamy',
        type: 'priroda',
        description: 'Naučná stezka s dřevěnými sochami postav z krušnohorských legend a pověstí.',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop',
        color: '#4a6741',
        mapsUrl: getMapsUrl('Mýtická stezka', 'Abertamy')
    },
    {
        id: 26,
        name: 'Botanická zahrada v Bečově nad Teplou',
        city: 'becov-nad-teplou',
        type: 'priroda',
        description: 'Půvabná botanická zahrada s vzácnými rostlinami a klidným prostředím k relaxaci.',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop',
        color: '#4a6741',
        mapsUrl: getMapsUrl('Botanická zahrada', 'Bečov nad Teplou')
    },
    {
        id: 27,
        name: 'Medvědí stezka v Jáchymově',
        city: 'jachymov',
        type: 'priroda',
        description: 'Naučná stezka s dřevěnými sochami medvědů a informacemi o přírodě Krušných hor.',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop',
        color: '#4a6741',
        mapsUrl: getMapsUrl('Medvědí stezka', 'Jáchymov')
    },
    {
        id: 28,
        name: 'Otevřené dveře v Krušných horách',
        city: 'stribrna',
        type: 'priroda',
        description: 'Symbolické umělecké dílo v krajině – otevřené dveře s výhledem do přírody.',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop',
        color: '#4a6741',
        mapsUrl: getMapsUrl('Otevřené dveře', 'Stříbrná')
    },
    {
        id: 29,
        name: 'Zatopený čedičový lom v Rotavě',
        city: 'rotava',
        type: 'priroda',
        description: 'Krásné modrozelené jezírko v bývalém lomu. Ideální místo pro koupání a relaxaci.',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
        color: '#2c7dd6',
        mapsUrl: getMapsUrl('Zatopený lom', 'Rotava')
    },
    {
        id: 30,
        name: 'Vyhlídka Jelení skok nad Karlovými Vary – Mayerův gloriet',
        city: 'karlovy-vary',
        type: 'priroda',
        description: 'Romantická vyhlídka s glorietem a sochou kamzíka. Nádherný výhled na město.',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
        color: '#4a6741',
        mapsUrl: getMapsUrl('Jelení skok', 'Karlovy Vary')
    },
    {
        id: 31,
        name: 'Rozhledna Salingburg ve Františkových Lázních',
        city: 'frantiskovy-lazne',
        type: 'priroda',
        description: 'Romantická pseudogotická rozhledna z 19. století s výhledem na lázeňské město.',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
        color: '#4a6741',
        mapsUrl: getMapsUrl('Rozhledna Salingburg', 'Františkovy Lázně')
    },
    {
        id: 32,
        name: 'Údolí mlýnků u Jáchymova',
        city: 'jachymov',
        type: 'priroda',
        description: 'Romantické údolí s mlýnky a potůčky. Klidné místo pro procházky v přírodě.',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop',
        color: '#4a6741',
        mapsUrl: getMapsUrl('Údolí mlýnků', 'Jáchymov')
    },
    {
        id: 33,
        name: 'Via Czechia – dálkové stezky napříč Českem',
        city: 'as',
        type: 'priroda',
        description: 'Dálková turistická trasa vedoucí celou republikou. Ideální pro dlouhé túry a poznávání přírody.',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop',
        color: '#4a6741',
        mapsUrl: getMapsUrl('Via Czechia', 'Aš')
    },
    {
        id: 34,
        name: 'Skalní útvar Rotavské varhany',
        city: 'rotava',
        type: 'priroda',
        description: 'Přírodní skalní útvar připomínající varhany. Geologická zajímavost v Krušných horách.',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop',
        color: '#4a6741',
        mapsUrl: getMapsUrl('Rotavské varhany', 'Rotava')
    },
    {
        id: 35,
        name: 'Obora svatý Linhart v Karlových Varech s visutými můstky',
        city: 'karlovy-vary',
        type: 'priroda',
        description: 'Obora s daňky a srnci, visutými můstky a naučnou stezkou. Skvělé pro rodiny s dětmi.',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop',
        color: '#4a6741',
        mapsUrl: getMapsUrl('Obora svatý Linhart', 'Karlovy Vary')
    },

    // Památky
    {
        id: 36,
        name: 'Zřícenina hradu Andělská Hora – oblíbené karlovarské poutní místo',
        city: 'andelska-hora',
        type: 'pamatka',
        description: 'Romantická zřícenina gotického hradu s krásným výhledem. Poutní místo s bohatou historií.',
        image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a15?w=1200&h=800&fit=crop',
        color: '#8B7355',
        mapsUrl: getMapsUrl('Hrad Andělská Hora', 'Andělská Hora')
    },
    {
        id: 37,
        name: 'Zámek Chyše – sídlo rodu Lažanských',
        city: 'chyse',
        type: 'pamatka',
        description: 'Renesanční zámek s krásnými interiéry a anglickým parkem. Sídlo významného šlechtického rodu.',
        image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a15?w=1200&h=800&fit=crop',
        color: '#8B7355',
        mapsUrl: getMapsUrl('Zámek Chyše', 'Chyše')
    },
    {
        id: 38,
        name: 'Zámek Valeč a barokní skvosty Matyáše Bernarda Brauna',
        city: 'valec',
        type: 'pamatka',
        description: 'Barokní zámek s nádhernými sochami od M.B. Brauna. Unikátní barokní park a kašny.',
        image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a15?w=1200&h=800&fit=crop',
        color: '#8B7355',
        mapsUrl: getMapsUrl('Zámek Valeč', 'Valeč')
    },
    {
        id: 39,
        name: 'Lanová dráha Diana v Karlových Varech',
        city: 'karlovy-vary',
        type: 'pamatka',
        description: 'Historická lanovka z roku 1912. Vede k vyhlídkové věži Diana s krásným výhledem na město.',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&h=800&fit=crop',
        color: '#8B7355',
        mapsUrl: getMapsUrl('Lanovka Diana', 'Karlovy Vary')
    },
    {
        id: 40,
        name: 'Relikviář svatého Maura v Bečově nad Teplou',
        city: 'becov-nad-teplou',
        type: 'pamatka',
        description: 'Jeden z nejcennějších pokladů České republiky. Gotický relikviář s bohatou výzdobou.',
        image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a15?w=1200&h=800&fit=crop',
        color: '#d4af37',
        mapsUrl: getMapsUrl('Relikviář svatého Maura', 'Bečov nad Teplou')
    },
    {
        id: 41,
        name: 'Hrad Seeberg – Ostroh u Františkových Lázní',
        city: 'poustka',
        type: 'pamatka',
        description: 'Romantický hrad z 12. století s expozicí nábytku a keramiky. Krásný výhled do okolí.',
        image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a15?w=1200&h=800&fit=crop',
        color: '#8B7355',
        mapsUrl: getMapsUrl('Hrad Seeberg', 'Poustka')
    },
    {
        id: 42,
        name: 'Lázeňská kolonáda v Mariánských Lázních',
        city: 'marianske-lazne',
        type: 'pamatka',
        description: 'Nejkrásnější kolonáda v ČR s vývěry léčivých pramenů. Elegantní litinová stavba z 19. století.',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=800&fit=crop',
        color: '#8B7355',
        mapsUrl: getMapsUrl('Kolonáda', 'Mariánské Lázně')
    },
    {
        id: 43,
        name: 'Klášter Teplá',
        city: 'tepla',
        type: 'pamatka',
        description: 'Premonstrátský klášter s knihovnou a historickými sbírkami. Duchovní centrum regionu.',
        image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a15?w=1200&h=800&fit=crop',
        color: '#8B7355',
        mapsUrl: getMapsUrl('Klášter Teplá', 'Teplá')
    },
    {
        id: 44,
        name: 'Hrad Vildštejn ve Skalné u Chebu',
        city: 'skalna',
        type: 'pamatka',
        description: 'Románský hrad s restaurací a muzeem. Nejstarší románský hrad v Čechách.',
        image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a15?w=1200&h=800&fit=crop',
        color: '#8B7355',
        mapsUrl: getMapsUrl('Hrad Vildštejn', 'Skalná')
    },
    {
        id: 45,
        name: 'Poutní místo Skoky u Žlutic – poutní kostel Navštívení Panny Marie ve Skocích',
        city: 'zlutice',
        type: 'pamatka',
        description: 'Barokní poutní areál s kostelem a křížovou cestou. Místo s působivou atmosférou.',
        image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a15?w=1200&h=800&fit=crop',
        color: '#8B7355',
        mapsUrl: getMapsUrl('Skoky', 'Žlutice')
    },
    {
        id: 46,
        name: 'Horní Hrad nedaleko Stráže nad Ohří',
        city: 'straz-nad-ohri',
        type: 'pamatka',
        description: 'Gotický hrad přestavěný na romantický zámek. Prohlídky interiérů a krásné výhledy.',
        image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a15?w=1200&h=800&fit=crop',
        color: '#8B7355',
        mapsUrl: getMapsUrl('Horní Hrad', 'Stráž nad Ohří')
    },
    {
        id: 47,
        name: 'Důl Svornost v Jáchymově',
        city: 'jachymov',
        type: 'pamatka',
        description: 'Historický důl s muzeem. První radonové lázně na světě vznikly právě zde.',
        image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=1200&h=800&fit=crop',
        color: '#5a5a5a',
        mapsUrl: getMapsUrl('Důl Svornost', 'Jáchymov')
    },
    {
        id: 48,
        name: 'Tři Kříže v Slavkovském lese',
        city: 'prameny',
        type: 'pamatka',
        description: 'Tři kříže na vrcholu kopce připomínající historické události. Výhled do krajiny.',
        image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a15?w=1200&h=800&fit=crop',
        color: '#8B7355',
        mapsUrl: getMapsUrl('Tři Kříže', 'Prameny')
    },
    {
        id: 49,
        name: 'Hrad Loket – impozantní prostory ukrývají zábavu i poučení',
        city: 'loket',
        type: 'pamatka',
        description: 'Gotický hrad nad meandrem řeky Ohře. Muzeum a expozice porcelánu. Jeden z nejkrásnějších hradů ČR.',
        image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a15?w=1200&h=800&fit=crop',
        color: '#8B7355',
        mapsUrl: getMapsUrl('Hrad Loket', 'Loket')
    },
    {
        id: 50,
        name: 'Zbytky cínových dolů v Krušných horách',
        city: 'prebuz',
        type: 'pamatka',
        description: 'Historické pozůstatky těžby cínu. Naučná stezka s informacemi o hornické minulosti.',
        image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=1200&h=800&fit=crop',
        color: '#5a5a5a',
        mapsUrl: getMapsUrl('Cínové doly', 'Přebuz')
    },
    {
        id: 51,
        name: 'Skanzen Doubrava – Rustlerův statek',
        city: 'lipova',
        type: 'pamatka',
        description: 'Etnografický skanzen s ukázkami života v Krušných horách. Tradiční řemesla a architektura.',
        image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a15?w=1200&h=800&fit=crop',
        color: '#8B7355',
        mapsUrl: getMapsUrl('Skanzen Doubrava', 'Lipová')
    },
    {
        id: 52,
        name: 'Hrad a zámek Bečov nad Teplou – odhalte tajemství relikviáře sv. Maura',
        city: 'becov-nad-teplou',
        type: 'pamatka',
        description: 'Gotický hrad a barokní zámek. Místo nálezu slavného relikviáře svatého Maura.',
        image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a15?w=1200&h=800&fit=crop',
        color: '#8B7355',
        mapsUrl: getMapsUrl('Hrad Bečov', 'Bečov nad Teplou')
    },
    {
        id: 53,
        name: 'Chebský Špalíček – symbol chebské architektury',
        city: 'cheb',
        type: 'pamatka',
        description: 'Unikátní komplex 11 středověkých domů. Symbol města Cheb a jeho bohaté historie.',
        image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a15?w=1200&h=800&fit=crop',
        color: '#8B7355',
        mapsUrl: getMapsUrl('Špalíček', 'Cheb')
    },
    {
        id: 54,
        name: 'Hrad a zámek Libá u Františkových Lázní',
        city: 'liba',
        type: 'pamatka',
        description: 'Romantický hrad a zámek s parkem. Prohlídky historických interiérů.',
        image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a15?w=1200&h=800&fit=crop',
        color: '#8B7355',
        mapsUrl: getMapsUrl('Zámek Libá', 'Libá')
    },
    {
        id: 55,
        name: 'Zaniklá obec Rolava',
        city: 'prebuz',
        type: 'pamatka',
        description: 'Pozůstatky zaniklé obce po odsunu německého obyvatelstva. Místo připomínající historii.',
        image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a15?w=1200&h=800&fit=crop',
        color: '#5a5a5a',
        mapsUrl: getMapsUrl('Rolava', 'Přebuz')
    },
    {
        id: 56,
        name: 'Zámek Kynžvart – sídlo Metternichů s anglickým parkem',
        city: 'lazne-kynzvart',
        type: 'pamatka',
        description: 'Klasicistní zámek s bohatými sbírkami. Nádherný anglický park a zámecká knihovna.',
        image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a15?w=1200&h=800&fit=crop',
        color: '#8B7355',
        mapsUrl: getMapsUrl('Zámek Kynžvart', 'Lázně Kynžvart')
    },
    {
        id: 57,
        name: 'Hora Klínovec s rozhlednou',
        city: 'bozi-dar',
        type: 'pamatka',
        description: 'Nejvyšší hora Krušných hor s rozhlednou a hotelem. Nádherné výhledy a lyžování v zimě.',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
        color: '#4a6741',
        mapsUrl: getMapsUrl('Klínovec', 'Boží Dar')
    },
    {
        id: 58,
        name: 'Zpívající fontána v Mariánských lázních',
        city: 'marianske-lazne',
        type: 'pamatka',
        description: 'Největší zpívající fontána v ČR s večerními hudebními a světelnými představeními.',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=800&fit=crop',
        color: '#8B7355',
        mapsUrl: getMapsUrl('Zpívající fontána', 'Mariánské Lázně')
    },
    {
        id: 59,
        name: 'Rozhledna Diana v Karlových Varech',
        city: 'karlovy-vary',
        type: 'pamatka',
        description: 'Vyhlídková věž s restaurací a motýlím domem. Přístupná lanovkou nebo pěšky.',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
        color: '#8B7355',
        mapsUrl: getMapsUrl('Rozhledna Diana', 'Karlovy Vary')
    },
    {
        id: 60,
        name: 'Štola č. 1 v Jáchymově',
        city: 'jachymov',
        type: 'pamatka',
        description: 'Historická těžební štola s prohlídkami. Seznámení s hornickou historií města.',
        image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=1200&h=800&fit=crop',
        color: '#5a5a5a',
        mapsUrl: getMapsUrl('Štola Jáchymov', 'Jáchymov')
    },
    {
        id: 61,
        name: 'Rudá věž smrti v závodu Škoda Ostrov Rekonstrukce',
        city: 'ostrov',
        type: 'pamatka',
        description: 'Památník připomínající oběti nucených prací. Místo s důležitou historickou hodnotou.',
        image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a15?w=1200&h=800&fit=crop',
        color: '#8B7355',
        mapsUrl: getMapsUrl('Rudá věž smrti', 'Ostrov')
    },
    {
        id: 62,
        name: 'Zámek Ostrov',
        city: 'ostrov',
        type: 'pamatka',
        description: 'Barokní zámek s muzeem a výstavami. Historické sídlo v centru města.',
        image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a15?w=1200&h=800&fit=crop',
        color: '#8B7355',
        mapsUrl: getMapsUrl('Zámek Ostrov', 'Ostrov')
    },
    {
        id: 63,
        name: 'Jáchymovské peklo – naučná stezka připomínající život politických vězňů',
        city: 'jachymov',
        type: 'pamatka',
        description: 'Naučná stezka věnovaná obětem komunistického režimu. Důležité místo české historie.',
        image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=1200&h=800&fit=crop',
        color: '#5a5a5a',
        mapsUrl: getMapsUrl('Jáchymovské peklo', 'Jáchymov')
    },
    {
        id: 64,
        name: 'Císařské lázně v Karlových Varech',
        city: 'karlovy-vary',
        type: 'pamatka',
        description: 'Historická lázeňská budova s nádhernou architekturou. Důležité místo lázeňské historie.',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&h=800&fit=crop',
        color: '#8B7355',
        mapsUrl: getMapsUrl('Císařské lázně', 'Karlovy Vary')
    },
    {
        id: 65,
        name: 'Čistá – Důl Jeroným na Sokolovsku',
        city: 'rovna',
        type: 'pamatka',
        description: 'Historický cínový důl s prohlídkami. Seznámení s hornickou minulostí regionu.',
        image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=1200&h=800&fit=crop',
        color: '#5a5a5a',
        mapsUrl: getMapsUrl('Důl Jeroným', 'Rovná')
    },
    {
        id: 66,
        name: 'Chebský hrad – jedinečná ukázka falce na našem území s unikátní dvojitou kaplí',
        city: 'cheb',
        type: 'pamatka',
        description: 'Románský hrad s unikátní dvojitou kaplí. Jeden z nejvýznamnějších hradů v ČR.',
        image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a15?w=1200&h=800&fit=crop',
        color: '#8B7355',
        mapsUrl: getMapsUrl('Chebský hrad', 'Cheb')
    },
    {
        id: 67,
        name: 'Důl Mauritius u Hřebečné',
        city: 'aberamy',
        type: 'pamatka',
        description: 'Historický cínový důl s prohlídkami. Skvělá ukázka hornické historie Krušných hor.',
        image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=1200&h=800&fit=crop',
        color: '#5a5a5a',
        mapsUrl: getMapsUrl('Důl Mauritius', 'Abertamy')
    },
    {
        id: 68,
        name: 'Loreta Starý Hrozňatov – poutní areál Maria Loreto',
        city: 'cheb',
        type: 'pamatka',
        description: 'Barokní poutní areál s kostelem a klášterem. Místo s působivou duchovní atmosférou.',
        image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a15?w=1200&h=800&fit=crop',
        color: '#8B7355',
        mapsUrl: getMapsUrl('Loreta', 'Cheb')
    },
    {
        id: 69,
        name: 'Zámek Sokolov – Krajské muzeum v Sokolově na zámku rodu Nosticů',
        city: 'sokolov',
        type: 'pamatka',
        description: 'Renesanční zámek s muzeem. Historické sídlo významného šlechtického rodu.',
        image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a15?w=1200&h=800&fit=crop',
        color: '#8B7355',
        mapsUrl: getMapsUrl('Zámek Sokolov', 'Sokolov')
    },

    // Lázně a wellness
    {
        id: 70,
        name: 'Aquacentrum Agricola',
        city: 'jachymov',
        type: 'lazne',
        description: 'Moderní aquapark s bazény a saunami. Relaxace a zábava pro celou rodinu.',
        image: 'https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?w=1200&h=800&fit=crop',
        color: '#2c7dd6',
        mapsUrl: getMapsUrl('Aquacentrum Agricola', 'Jáchymov')
    },
    {
        id: 71,
        name: 'Bazénový a saunový resort Saunia na střeše hotelu Thermal',
        city: 'karlovy-vary',
        type: 'lazne',
        description: 'Luxusní wellness resort s bazénem na střeše. Nádherný výhled na město a okolí.',
        image: 'https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?w=1200&h=800&fit=crop',
        color: '#2c7dd6',
        mapsUrl: getMapsUrl('Saunia Thermal', 'Karlovy Vary')
    },
    {
        id: 72,
        name: 'Léčebné lázně Jáchymov – nejstarší radonové lázně na úpatí Krušných hor',
        city: 'jachymov',
        type: 'lazne',
        description: 'První radonové lázně na světě. Tradiční lázeňská léčba v krásném horském prostředí.',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=800&fit=crop',
        color: '#8B7355',
        mapsUrl: getMapsUrl('Lázně Jáchymov', 'Jáchymov')
    },
    {
        id: 73,
        name: 'Aquaforum Františkovy Lázně',
        city: 'frantiskovy-lazne',
        type: 'lazne',
        description: 'Moderní aquapark s bazény, tobogány a wellness zónou. Skvělé pro celou rodinu.',
        image: 'https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?w=1200&h=800&fit=crop',
        color: '#2c7dd6',
        mapsUrl: getMapsUrl('Aquaforum', 'Františkovy Lázně')
    },
    {
        id: 74,
        name: 'Mattoniho lázně Kyselka',
        city: 'kyselka',
        type: 'lazne',
        description: 'Obnovené lázně s historickou atmosférou. Místo spojené se známou minerální vodou.',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=800&fit=crop',
        color: '#8B7355',
        mapsUrl: getMapsUrl('Mattoniho lázně', 'Kyselka')
    },
    {
        id: 75,
        name: 'Bazénové centrum v KV Areně v Karlových Varech',
        city: 'karlovy-vary',
        type: 'lazne',
        description: 'Moderní bazénové centrum s plaveckými drahami a rekreačním bazénem.',
        image: 'https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?w=1200&h=800&fit=crop',
        color: '#2c7dd6',
        mapsUrl: getMapsUrl('KV Arena bazén', 'Karlovy Vary')
    },
    {
        id: 76,
        name: 'Chlapec s rybou – symbol Františkových Lázní',
        city: 'frantiskovy-lazne',
        type: 'lazne',
        description: 'Symbolický pomník mladého chlapce s rybou. Známý symbol lázeňského města.',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=800&fit=crop',
        color: '#8B7355',
        mapsUrl: getMapsUrl('Chlapec s rybou', 'Františkovy Lázně')
    },

    // Letní sporty
    {
        id: 77,
        name: 'Naučná stezka Kladská v Národní přírodní rezervaci Kladské rašeliny',
        city: 'marianske-lazne',
        type: 'letni-sporty',
        description: 'Krásná naučná stezka přes rašeliniště. Ideální pro turistiku a poznávání přírody.',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop',
        color: '#4a6741',
        mapsUrl: getMapsUrl('Kladská', 'Mariánské Lázně')
    },
    {
        id: 78,
        name: 'Kabinková lanová dráha Mariánské Lázně',
        city: 'marianske-lazne',
        type: 'letni-sporty',
        description: 'Lanovka vedoucí k vyhlídce. Nádherný výhled na lázeňské město a okolní krajinu.',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop',
        color: '#4a6741',
        mapsUrl: getMapsUrl('Lanovka Mariánské Lázně', 'Mariánské Lázně')
    },
    {
        id: 79,
        name: 'Lanovka z Jáchymova na Klínovec',
        city: 'jachymov',
        type: 'letni-sporty',
        description: 'Lanovka na nejvyšší horu Krušných hor. Skvělý způsob, jak se dostat na vrchol.',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&h=800&fit=crop',
        color: '#4a6741',
        mapsUrl: getMapsUrl('Lanovka Klínovec', 'Jáchymov')
    },
    {
        id: 80,
        name: 'Vodní nádrž Jesenice u Chebu',
        city: 'cheb',
        type: 'letni-sporty',
        description: 'Přehrada ideální pro koupání, rybaření a vodní sporty. Krásné okolí s možností turistiky.',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
        color: '#2c7dd6',
        mapsUrl: getMapsUrl('Jesenice', 'Cheb')
    },
    {
        id: 81,
        name: 'Přírodní koupaliště Jezero Michal – Sokolovské moře',
        city: 'sokolov',
        type: 'letni-sporty',
        description: 'Velké přírodní koupaliště s písečnými plážemi. Skvělé místo pro letní relaxaci.',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
        color: '#2c7dd6',
        mapsUrl: getMapsUrl('Jezero Michal', 'Sokolov')
    },
    {
        id: 82,
        name: 'Plovárna Dřenice u přehrady Jesenice',
        city: 'cheb',
        type: 'letni-sporty',
        description: 'Přírodní plovárna s písečnou pláží. Ideální místo pro rodiny s dětmi.',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
        color: '#2c7dd6',
        mapsUrl: getMapsUrl('Plovárna Dřenice', 'Cheb')
    },
    {
        id: 83,
        name: 'Zatopený lom Jimlíkov',
        city: 'bozicany',
        type: 'letni-sporty',
        description: 'Krásné modrozelené jezírko v bývalém lomu. Ideální pro koupání a potápění.',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
        color: '#2c7dd6',
        mapsUrl: getMapsUrl('Jimlíkov', 'Božičany')
    },
    {
        id: 84,
        name: 'Velký rybník a bývalé lomy u Hroznětína',
        city: 'hroznetin',
        type: 'letni-sporty',
        description: 'Přírodní koupaliště v bývalém lomu. Krásné místo pro letní aktivity.',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
        color: '#2c7dd6',
        mapsUrl: getMapsUrl('Rybník Hroznětín', 'Hroznětín')
    },
    {
        id: 85,
        name: 'Přírodní koupaliště Lido u Mariánských Lázní',
        city: 'marianske-lazne',
        type: 'letni-sporty',
        description: 'Krásné přírodní koupaliště v lesoparku. Ideální místo pro letní relaxaci.',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
        color: '#2c7dd6',
        mapsUrl: getMapsUrl('Lido', 'Mariánské Lázně')
    },
    {
        id: 86,
        name: 'Koupaliště Rolava',
        city: 'karlovy-vary',
        type: 'letni-sporty',
        description: 'Moderní koupaliště s tobogány a atrakcemi. Skvělé pro rodiny s dětmi.',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
        color: '#2c7dd6',
        mapsUrl: getMapsUrl('Koupaliště Rolava', 'Karlovy Vary')
    },
    {
        id: 87,
        name: 'Přírodní koupaliště Bílá voda u Chodova',
        city: 'chodov',
        type: 'letni-sporty',
        description: 'Krásné přírodní koupaliště s čistou vodou. Klidné místo pro letní odpočinek.',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
        color: '#2c7dd6',
        mapsUrl: getMapsUrl('Bílá voda', 'Chodov')
    },
    {
        id: 88,
        name: 'Cyklostezka po bývalé železnici mezi Loktem a Horním Slavkovem',
        city: 'loket',
        type: 'letni-sporty',
        description: 'Krásná cyklostezka vedoucí po bývalé železniční trati. Ideální pro cyklisty všech úrovní.',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop',
        color: '#4a6741',
        mapsUrl: getMapsUrl('Cyklostezka Loket', 'Loket')
    },
    {
        id: 89,
        name: 'Seifertova via ferrata Nové Hamry',
        city: 'nove-hamry',
        type: 'letni-sporty',
        description: 'Via ferrata s krásnými výhledy. Náročná trasa pro zkušené horolezce.',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop',
        color: '#4a6741',
        mapsUrl: getMapsUrl('Via ferrata', 'Nové Hamry')
    },
    {
        id: 90,
        name: 'Národní cyklostezka Ohře – na kole z Bavorska do Čech',
        city: 'karlovy-vary',
        type: 'letni-sporty',
        description: 'Dálková cyklostezka podél řeky Ohře. Krásná trasa vedoucí z Německa do Čech.',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop',
        color: '#4a6741',
        mapsUrl: getMapsUrl('Cyklostezka Ohře', 'Karlovy Vary')
    },
    {
        id: 91,
        name: 'Koupaliště Ostrov',
        city: 'ostrov',
        type: 'letni-sporty',
        description: 'Moderní koupaliště s atrakcemi. Skvělé místo pro letní zábavu.',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
        color: '#2c7dd6',
        mapsUrl: getMapsUrl('Koupaliště Ostrov', 'Ostrov')
    },
    {
        id: 92,
        name: 'Stezka Českem – jižní část 1000 kilometrů dlouhé trasy celou republikou',
        city: 'krasna',
        type: 'letni-sporty',
        description: 'Dálková turistická trasa vedoucí celou republikou. Náročná, ale krásná túra.',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop',
        color: '#4a6741',
        mapsUrl: getMapsUrl('Stezka Českem', 'Krásná')
    },
    {
        id: 93,
        name: 'Zatopený lom Dasnice na Sokolovsku',
        city: 'dasnice',
        type: 'letni-sporty',
        description: 'Krásné jezírko v bývalém lomu. Ideální pro koupání a relaxaci.',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
        color: '#2c7dd6',
        mapsUrl: getMapsUrl('Lom Dasnice', 'Dasnice')
    },
    {
        id: 94,
        name: 'Krajinka – parkový areál pod Chebským hradem',
        city: 'cheb',
        type: 'letni-sporty',
        description: 'Park s cyklostezkami a možnostmi sportovního vyžití. Krásné místo pod hradem.',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop',
        color: '#4a6741',
        mapsUrl: getMapsUrl('Krajinka', 'Cheb')
    },

    // Zážitky
    {
        id: 95,
        name: 'Boheminium – miniatury z celého Česka v Mariánských Lázních',
        city: 'marianske-lazne',
        type: 'zazitky',
        description: 'Park s miniaturami nejznámějších českých památek. Skvělé pro rodiny s dětmi.',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=800&fit=crop',
        color: '#d4af37',
        mapsUrl: getMapsUrl('Boheminium', 'Mariánské Lázně')
    },
    {
        id: 96,
        name: 'Návštěvnické centrum Moser v Karlových Varech',
        city: 'karlovy-vary',
        type: 'zazitky',
        description: 'Prohlídky sklárny Moser s možností výroby vlastního skla. Unikátní zážitek.',
        image: 'https://images.unsplash.com/photo-1580584126903-c17d41830450?w=1200&h=800&fit=crop',
        color: '#d4af37',
        mapsUrl: getMapsUrl('Moser', 'Karlovy Vary')
    },
    {
        id: 97,
        name: 'Malý zoopark Amerika u Františkových Lázní',
        city: 'frantiskovy-lazne',
        type: 'zazitky',
        description: 'Zoopark s domácími i exotickými zvířaty. Skvělé místo pro rodiny s dětmi.',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop',
        color: '#4a6741',
        mapsUrl: getMapsUrl('Zoopark Amerika', 'Františkovy Lázně')
    },
    {
        id: 98,
        name: 'Návštěvnické centrum The Home of Becherovka',
        city: 'karlovy-vary',
        type: 'zazitky',
        description: 'Muzeum a prohlídky výroby známého likéru. Degustace a nákup suvenýrů.',
        image: 'https://images.unsplash.com/photo-1580584126903-c17d41830450?w=1200&h=800&fit=crop',
        color: '#8B7355',
        mapsUrl: getMapsUrl('Becherovka', 'Karlovy Vary')
    },
    {
        id: 99,
        name: 'Prohlídková štola Astoria v Lázních Jáchymov',
        city: 'jachymov',
        type: 'zazitky',
        description: 'Prohlídka historické štoly s ukázkami těžby. Fascinující podzemní svět.',
        image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=1200&h=800&fit=crop',
        color: '#5a5a5a',
        mapsUrl: getMapsUrl('Štola Astoria', 'Jáchymov')
    },
    {
        id: 100,
        name: 'Zrcadlový labyrint v Mariánských Lázních',
        city: 'marianske-lazne',
        type: 'zazitky',
        description: 'Zábavní labyrint se zrcadly. Skvělá zábava pro celou rodinu.',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=800&fit=crop',
        color: '#d4af37',
        mapsUrl: getMapsUrl('Zrcadlový labyrint', 'Mariánské Lázně')
    },
    {
        id: 101,
        name: 'Pekelné sklepy Žlutice',
        city: 'zlutice',
        type: 'zazitky',
        description: 'Historické sklepy s expozicí připomínající historii města. Zajímavé místo pro návštěvu.',
        image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=1200&h=800&fit=crop',
        color: '#5a5a5a',
        mapsUrl: getMapsUrl('Pekelné sklepy', 'Žlutice')
    },
    {
        id: 102,
        name: '3D bludiště a dětské hřiště v Aši',
        city: 'as',
        type: 'zazitky',
        description: 'Zábavní park s 3D bludištěm a hřištěm pro děti. Skvělé místo pro rodinný výlet.',
        image: 'https://images.unsplash.com/photo-1580584126903-c17d41830450?w=1200&h=800&fit=crop',
        color: '#d4af37',
        mapsUrl: getMapsUrl('Bludiště Aš', 'Aš')
    },
    {
        id: 103,
        name: 'Kuličková dráha v Chebu',
        city: 'cheb',
        type: 'zazitky',
        description: 'Unikátní kuličková dráha v centru města. Zábavné místo pro děti i dospělé.',
        image: 'https://images.unsplash.com/photo-1580584126903-c17d41830450?w=1200&h=800&fit=crop',
        color: '#d4af37',
        mapsUrl: getMapsUrl('Kuličková dráha', 'Cheb')
    },
    {
        id: 104,
        name: 'Muzeum iluzí ve Františkových Lázních',
        city: 'cheb',
        type: 'zazitky',
        description: 'Interaktivní muzeum s optickými iluzemi. Zábavné a poučné pro všechny věkové kategorie.',
        image: 'https://images.unsplash.com/photo-1580584126903-c17d41830450?w=1200&h=800&fit=crop',
        color: '#d4af37',
        mapsUrl: getMapsUrl('Muzeum iluzí', 'Františkovy Lázně')
    },
    {
        id: 105,
        name: 'Úzkorozchodná dráha Kateřina v rezervaci Soos',
        city: 'frantiskovy-lazne',
        type: 'zazitky',
        description: 'Historická úzkorozchodná dráha s projížďkami. Romantická cesta přírodou.',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop',
        color: '#4a6741',
        mapsUrl: getMapsUrl('Dráha Kateřina', 'Františkovy Lázně')
    },

    // Kultura
    {
        id: 106,
        name: 'Hrad Seeberg – Ostroh u Františkových Lázní',
        city: 'poustka',
        type: 'kultura',
        description: 'Romantický hrad s expozicí nábytku a keramiky. Kulturní akce a výstavy.',
        image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a15?w=1200&h=800&fit=crop',
        color: '#8B7355',
        mapsUrl: getMapsUrl('Hrad Seeberg', 'Poustka')
    },
    {
        id: 107,
        name: 'Prohlídky porcelánky Thun Nová Role',
        city: 'nova-role',
        type: 'kultura',
        description: 'Prohlídky tradiční výroby porcelánu. Ukázky ruční práce a historie porcelánky.',
        image: 'https://images.unsplash.com/photo-1580584126903-c17d41830450?w=1200&h=800&fit=crop',
        color: '#8B7355',
        mapsUrl: getMapsUrl('Porcelánka Thun', 'Nová Role')
    },
    {
        id: 108,
        name: 'Muzeum Karlovy Vary',
        city: 'karlovy-vary',
        type: 'kultura',
        description: 'Muzeum s expozicemi o historii města, lázeňství a regionální kultuře.',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&h=800&fit=crop',
        color: '#8B7355',
        mapsUrl: getMapsUrl('Muzeum Karlovy Vary', 'Karlovy Vary')
    },
    {
        id: 109,
        name: 'Statek Bernard',
        city: 'kralovske-porici',
        type: 'kultura',
        description: 'Ekofarma s prohlídkami a vzdělávacími programy. Tradiční řemesla a živá zvířata.',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop',
        color: '#4a6741',
        mapsUrl: getMapsUrl('Statek Bernard', 'Královské Poříčí')
    },

    // Gurmánská turistika
    {
        id: 110,
        name: 'Parisienne – kavárna s cukrárnou v Karlových Varech',
        city: 'karlovy-vary',
        type: 'gurmanska',
        description: 'Elegantní kavárna s výbornou kávou a domácími zákusky. Atmosféra starých časů.',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&h=800&fit=crop',
        color: '#d4af37',
        mapsUrl: getMapsUrl('Parisienne', 'Karlovy Vary')
    },
    {
        id: 111,
        name: 'Chaloupka U Červené jámy v Krušných Horách',
        city: 'pernink',
        type: 'gurmanska',
        description: 'Tradiční horská hospůdka s výbornou kuchyní. Autentická atmosféra Krušných hor.',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&h=800&fit=crop',
        color: '#8B7355',
        mapsUrl: getMapsUrl('Chaloupka', 'Pernink')
    }
];

// Current filters
let currentFilters = {
    city: '',
    type: ''
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initTripsPage();
});

function initTripsPage() {
    const cityFilter = document.getElementById('cityFilter');
    const typeFilter = document.getElementById('typeFilter');
    const resetBtn = document.getElementById('resetFilters');
    
    // Set up filter listeners
    if (cityFilter) {
        cityFilter.addEventListener('change', (e) => {
            currentFilters.city = e.target.value;
            filterTrips();
        });
    }
    
    if (typeFilter) {
        typeFilter.addEventListener('change', (e) => {
            currentFilters.type = e.target.value;
            filterTrips();
        });
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            currentFilters.city = '';
            currentFilters.type = '';
            if (cityFilter) cityFilter.value = '';
            if (typeFilter) typeFilter.value = '';
            filterTrips();
        });
    }
    
    // Initial render
    renderTrips(tripsData);
}

function filterTrips() {
    let filtered = tripsData.filter(trip => {
        const cityMatch = !currentFilters.city || trip.city === currentFilters.city;
        const typeMatch = !currentFilters.type || trip.type === currentFilters.type;
        return cityMatch && typeMatch;
    });
    
    renderTrips(filtered);
}

function renderTrips(trips) {
    const tripsGrid = document.getElementById('tripsGrid');
    if (!tripsGrid) return;
    
    if (trips.length === 0) {
        tripsGrid.innerHTML = '<p class="no-results">Nebyly nalezeny žádné výlety odpovídající zvoleným filtrům.</p>';
        return;
    }
    
    tripsGrid.innerHTML = trips.map(trip => createTripCard(trip)).join('');
}

function createTripCard(trip) {
    const gradientColor = trip.color || '#8B7355';
    const rgbaColor = hexToRgba(gradientColor);
    
    // Kompaktní karta s obrázkem nahoře a obsahem dole
    return `
        <div class="trip-card" data-city="${trip.city}" data-type="${trip.type}">
            <div class="trip-card-inner">
                <div class="trip-image-side">
                    <div class="trip-image-wrapper">
                        <img src="${trip.image}" alt="${trip.name}" loading="lazy">
                        <div class="trip-image-gradient" style="background: linear-gradient(to bottom, transparent 0%, transparent 30%, ${rgbaColor(0.3)} 50%, ${rgbaColor(0.8)} 80%, ${rgbaColor(1)} 100%);"></div>
                    </div>
                </div>
                <div class="trip-content-side" style="background-color: ${gradientColor};">
                    <div class="trip-content-wrapper">
                        <h2 class="trip-name">${trip.name}</h2>
                        <p class="trip-description">${trip.description}</p>
                        <a href="${trip.mapsUrl}" target="_blank" rel="noopener noreferrer" class="trip-maps-link">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>Otevřít v Mapách</span>
                            <i class="fas fa-external-link-alt"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

