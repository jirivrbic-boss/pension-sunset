// ============================================
// TRIPS PAGE - Výlety do okolí
// ============================================

// Data o výletech
const tripsData = [
    {
        id: 1,
        name: 'Františkovy Lázně',
        city: 'frantiskovy-lazne',
        type: 'lazne',
        description: 'Lázeňské město s klasickou architekturou a léčivými prameny. Ideální místo pro relaxaci a procházky po kolonádách.',
        image: 'https://images.unsplash.com/photo-1580584126903-c17d41830450?w=1200&h=800&fit=crop',
        color: '#8B7355',
        mapsUrl: 'https://maps.app.goo.gl/search/Františkovy+Lázně'
    },
    {
        id: 2,
        name: 'Mlýnská kolonáda',
        city: 'karlovy-vary',
        type: 'lazne',
        description: 'Nejznámější kolonáda v Karlových Varech, kde můžete ochutnat léčivou vodu z pramenů a užít si atmosféru lázeňského města.',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&h=800&fit=crop',
        color: '#d4af37',
        mapsUrl: 'https://maps.app.goo.gl/search/Mlýnská+kolonáda+Karlovy+Vary'
    },
    {
        id: 3,
        name: 'Diana',
        city: 'karlovy-vary',
        type: 'vyhled',
        description: 'Vyhlídková věž s krásným výhledem na Karlovy Vary a okolí. Přístupná lanovkou nebo pěšky.',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
        color: '#8B7355',
        mapsUrl: 'https://maps.app.goo.gl/search/Diana+vyhlídka+Karlovy+Vary'
    },
    {
        id: 4,
        name: 'Klínovec',
        city: 'ostrov',
        type: 'hory',
        description: 'Nejvyšší hora Krušných hor s rozhlednou a možností lyžování v zimě. Nádherné výhledy do okolí.',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
        color: '#4a6741',
        mapsUrl: 'https://maps.app.goo.gl/search/Klínovec'
    },
    {
        id: 5,
        name: 'Vlčí jáma',
        city: 'aberamy',
        type: 'priroda',
        description: 'Přírodní zajímavost - propadlina vzniklá po těžbě cínu. Tajuplné místo obklopené lesy.',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop',
        color: '#5a5a5a',
        mapsUrl: 'https://maps.app.goo.gl/search/Vlčí+jáma+Abertamy'
    },
    {
        id: 6,
        name: 'Abertamy',
        city: 'aberamy',
        type: 'hory',
        description: 'Malebná horská obec v Krušných horách s bohatou hornickou historií. Ideální výchozí bod pro turistiku.',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&h=800&fit=crop',
        color: '#4a6741',
        mapsUrl: 'https://maps.app.goo.gl/search/Abertamy'
    },
    {
        id: 7,
        name: 'Loket',
        city: 'loket',
        type: 'pamatka',
        description: 'Středověký hrad a malebné město nad řekou Ohře. Historické centrum a krásné výhledy.',
        image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a15?w=1200&h=800&fit=crop',
        color: '#8B7355',
        mapsUrl: 'https://maps.app.goo.gl/search/Hrad+Loket'
    },
    {
        id: 8,
        name: 'Aquaforum Františkovy Lázně',
        city: 'frantiskovy-lazne',
        type: 'bazen',
        description: 'Moderní aquapark s bazény, tobogány a wellness zónou. Skvělé pro celou rodinu.',
        image: 'https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?w=1200&h=800&fit=crop',
        color: '#2c7dd6',
        mapsUrl: 'https://maps.app.goo.gl/search/Aquaforum+Františkovy+Lázně'
    },
    {
        id: 9,
        name: 'Mariánské Lázně',
        city: 'marianske-lazne',
        type: 'lazne',
        description: 'Elegantní lázeňské město s kolonádou, prameny a nádhernými parky. Perla lázeňského trojúhelníku.',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=800&fit=crop',
        color: '#8B7355',
        mapsUrl: 'https://maps.app.goo.gl/search/Mariánské+Lázně'
    },
    {
        id: 10,
        name: 'Jáchymov',
        city: 'jachymov',
        type: 'pamatka',
        description: 'Historické město s hornickou minulostí a radioaktivními prameny. Muzeum a lázeňství.',
        image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=1200&h=800&fit=crop',
        color: '#8B7355',
        mapsUrl: 'https://maps.app.goo.gl/search/Jáchymov'
    },
    {
        id: 11,
        name: 'Goethova vyhlídka',
        city: 'karlovy-vary',
        type: 'vyhled',
        description: 'Romantická vyhlídka pojmenovaná po J.W. Goethovi s výhledem na město a údolí řeky Teplé.',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
        color: '#8B7355',
        mapsUrl: 'https://maps.app.goo.gl/search/Goethova+vyhlídka+Karlovy+Vary'
    },
    {
        id: 12,
        name: 'Ostrov',
        city: 'ostrov',
        type: 'kultura',
        description: 'Historické město s klášterem, zámkem a zajímavým centrem. Klidné místo pro procházky.',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=800&fit=crop',
        color: '#8B7355',
        mapsUrl: 'https://maps.app.goo.gl/search/Ostrov+nad+Ohří'
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

// Helper function to convert hex color to rgba
function hexToRgba(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) {
        // Default color if parsing fails
        return (alpha) => `rgba(139, 115, 85, ${alpha})`;
    }
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    return (alpha) => `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
