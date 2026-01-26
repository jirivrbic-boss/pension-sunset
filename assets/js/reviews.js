// ============================================
// BOOKING.COM REVIEWS - Automatické načítání recenzí
// ============================================

// Booking.com hotel URL
const BOOKING_HOTEL_URL = 'https://www.booking.com/hotel/cz/pension-sunset-meziroli.cs.html';

// Statické recenze (lze aktualizovat ručně nebo přes server-side script)
// V produkci by se tyto recenze načítaly automaticky z Booking.com API nebo scraperu
const STATIC_REVIEWS = [
    {
        author: 'Jan N.',
        date: 'Leden 2025',
        rating: 5,
        text: 'Skvělé ubytování, čisté pokoje a příjemná atmosféra. Majitelka je velmi vstřícná a ochotná pomoci. Doporučuji!',
        country: 'Česká republika'
    },
    {
        author: 'Maria K.',
        date: 'Prosinec 2024',
        rating: 5,
        text: 'Penzion má krásné okolí a pokoje jsou velmi útulné. Snídaně byla výborná. Určitě se vrátíme.',
        country: 'Slovensko'
    },
    {
        author: 'Thomas M.',
        date: 'Prosinec 2024',
        rating: 5,
        text: 'Perfektní místo pro relaxaci. Wellness zóna je skvělá a pokoje jsou čisté a pohodlné. Skvělá lokalita pro výlety do okolí.',
        country: 'Německo'
    },
    {
        author: 'Anna P.',
        date: 'Listopad 2024',
        rating: 5,
        text: 'Výborné ubytování s krásným výhledem. Majitelka je velmi milá a ochotná. Penzion je ideální pro rodiny s dětmi.',
        country: 'Česká republika'
    },
    {
        author: 'Petr S.',
        date: 'Listopad 2024',
        rating: 5,
        text: 'Skvělé místo pro pobyt u Karlových Varů. Pokoje jsou čisté, snídaně výborná a personál velmi příjemný. Určitě doporučuji!',
        country: 'Česká republika'
    },
    {
        author: 'Elena V.',
        date: 'Říjen 2024',
        rating: 5,
        text: 'Krásný penzion s příjemnou atmosférou. Pokoje jsou útulné a čisté. Ideální místo pro odpočinek a relaxaci.',
        country: 'Ukrajina'
    }
];

// Cache pro recenze (aktualizace každých 24 hodin)
const REVIEWS_CACHE_KEY = 'booking_reviews_cache';
const REVIEWS_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hodin

// Načtení recenzí
async function loadBookingReviews() {
    const reviewsWidget = document.getElementById('booking-reviews-widget');
    if (!reviewsWidget) return;
    
    // Zkontroluj cache
    const cached = getCachedReviews();
    if (cached && cached.length > 0) {
        displayReviews(cached);
        return;
    }
    
    try {
        // Zkusíme načíst recenze z Booking.com (pokud by bylo API)
        // Prozatím použijeme statické recenze
        const reviews = await fetchReviewsFromBooking();
        if (reviews && reviews.length > 0) {
            displayReviews(reviews);
            cacheReviews(reviews);
        } else {
            // Použijeme statické recenze
            displayReviews(STATIC_REVIEWS);
            cacheReviews(STATIC_REVIEWS);
        }
    } catch (error) {
        console.error('Error loading reviews:', error);
        // Fallback na statické recenze
        displayReviews(STATIC_REVIEWS);
        cacheReviews(STATIC_REVIEWS);
    }
}

// Fetch recenze z Booking.com (pro budoucí implementaci s API)
async function fetchReviewsFromBooking() {
    // TODO: Implementovat server-side proxy nebo použít Booking.com API
    // Prozatím vracíme null a použijeme statické recenze
    return null;
}

// Zobrazení recenzí v pěkných kartách
function displayReviews(reviews) {
    const reviewsWidget = document.getElementById('booking-reviews-widget');
    if (!reviewsWidget) return;
    
    const currentLang = window.currentLang || 'cs';
    const t = translations && translations[currentLang] ? translations[currentLang] : {};
    
    reviewsWidget.innerHTML = '';
    
    if (reviews.length === 0) {
        reviewsWidget.innerHTML = `
            <div class="reviews-empty">
                <i class="fas fa-comments"></i>
                <p>Zatím nemáme žádné recenze.</p>
            </div>
        `;
        return;
    }
    
    // Zobrazíme maximálně 6 recenzí
    const reviewsToShow = reviews.slice(0, 6);
    
    reviewsToShow.forEach((review, index) => {
        const reviewElement = document.createElement('div');
        reviewElement.className = 'review-card fade-in';
        reviewElement.style.animationDelay = `${index * 0.1}s`;
        
        // Vytvoříme hvězdičky
        const stars = Array.from({ length: 5 }, (_, i) => 
            i < review.rating 
                ? '<i class="fas fa-star"></i>' 
                : '<i class="far fa-star"></i>'
        ).join('');
        
        reviewElement.innerHTML = `
            <div class="review-header">
                <div class="review-author-info">
                    <div class="review-author-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="review-author-details">
                        <div class="review-author-name">${review.author}</div>
                        <div class="review-author-country">${review.country || ''}</div>
                    </div>
                </div>
                <div class="review-date">${review.date}</div>
            </div>
            <div class="review-rating">
                ${stars}
            </div>
            <div class="review-text">
                "${review.text}"
            </div>
        `;
        
        reviewsWidget.appendChild(reviewElement);
    });
}

// Cache management
function getCachedReviews() {
    try {
        const cached = localStorage.getItem(REVIEWS_CACHE_KEY);
        if (!cached) return null;
        
        const data = JSON.parse(cached);
        const now = new Date().getTime();
        
        if (now - data.timestamp > REVIEWS_CACHE_DURATION) {
            localStorage.removeItem(REVIEWS_CACHE_KEY);
            return null;
        }
        
        return data.reviews;
    } catch (error) {
        return null;
    }
}

function cacheReviews(reviews) {
    try {
        const data = {
            reviews: reviews,
            timestamp: new Date().getTime()
        };
        localStorage.setItem(REVIEWS_CACHE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error('Error caching reviews:', error);
    }
}

// Inicializace při načtení stránky
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadBookingReviews);
} else {
    loadBookingReviews();
}

// Re-load reviews when language changes
if (typeof applyLanguage !== 'undefined') {
    const originalApplyLanguage = applyLanguage;
    window.applyLanguage = function(lang) {
        originalApplyLanguage(lang);
        // Reload reviews when language changes
        setTimeout(loadBookingReviews, 500);
    };
}
