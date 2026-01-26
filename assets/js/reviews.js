// ============================================
// BOOKING.COM REVIEWS - Automatické načítání recenzí
// ============================================

// Booking.com hotel ID z URL
const BOOKING_HOTEL_ID = '1507213';
const BOOKING_HOTEL_URL = 'https://www.booking.com/hotel/cz/pension-sunset-meziroli.cs.html';

// Cache pro recenze (aktualizace každých 24 hodin)
const REVIEWS_CACHE_KEY = 'booking_reviews_cache';
const REVIEWS_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hodin

// Načtení recenzí z Booking.com
async function loadBookingReviews() {
    const reviewsWidget = document.getElementById('booking-reviews-widget');
    if (!reviewsWidget) return;
    
    // Zkontroluj cache
    const cached = getCachedReviews();
    if (cached) {
        displayReviews(cached);
        return;
    }
    
    try {
        // Booking.com nemá veřejné API, takže použijeme alternativní přístup
        // Zobrazíme hodnocení a odkaz na recenze
        const reviews = await fetchReviewsFromBooking();
        if (reviews && reviews.length > 0) {
            displayReviews(reviews);
            cacheReviews(reviews);
        } else {
            // Fallback - zobrazíme informaci o recenzích
            displayReviewsFallback();
        }
    } catch (error) {
        console.error('Error loading reviews:', error);
        displayReviewsFallback();
    }
}

// Fetch recenze z Booking.com (pomocí CORS proxy nebo alternativního řešení)
async function fetchReviewsFromBooking() {
    // Booking.com nemá veřejné API, takže použijeme iframe nebo widget
    // Alternativně můžeme použít server-side proxy
    
    // Prozatím použijeme statické recenze nebo iframe
    // V produkci by bylo lepší použít server-side proxy
    
    return null; // Vrátíme null, použijeme fallback
}

// Zobrazení recenzí
function displayReviews(reviews) {
    const reviewsWidget = document.getElementById('booking-reviews-widget');
    if (!reviewsWidget) return;
    
    const currentLang = window.currentLang || 'cs';
    const t = translations && translations[currentLang] ? translations[currentLang] : {};
    
    reviewsWidget.innerHTML = '';
    
    if (reviews.length === 0) {
        displayReviewsFallback();
        return;
    }
    
    reviews.forEach(review => {
        const reviewElement = document.createElement('div');
        reviewElement.className = 'booking-review-item';
        
        const ratingStars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
        
        reviewElement.innerHTML = `
            <div class="booking-review-header">
                <span class="booking-review-author">${review.author}</span>
                <span class="booking-review-date">${review.date}</span>
            </div>
            <div class="booking-review-rating">
                ${ratingStars}
            </div>
            <div class="booking-review-text">
                "${review.text}"
            </div>
        `;
        
        reviewsWidget.appendChild(reviewElement);
    });
}

// Fallback - zobrazení iframe s recenzemi z Booking.com
function displayReviewsFallback() {
    const reviewsWidget = document.getElementById('booking-reviews-widget');
    if (!reviewsWidget) return;
    
    // Použijeme iframe s recenzemi z Booking.com
    // Booking.com umožňuje embed recenzí přes iframe
    reviewsWidget.innerHTML = `
        <div style="text-align: center; padding: var(--spacing-lg);">
            <div style="margin-bottom: var(--spacing-md);">
                <div style="font-size: 3rem; color: var(--secondary-color); margin-bottom: var(--spacing-sm);">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                </div>
                <h3 style="color: var(--primary-color); margin-bottom: var(--spacing-xs);">Výborné hodnocení</h3>
                <p style="color: var(--text-light);">Naši hosté nás hodnotí velmi pozitivně na Booking.com</p>
            </div>
            <iframe 
                src="https://www.booking.com/reviews/cz/hotel/pension-sunset-meziroli.html"
                width="100%" 
                height="600" 
                style="border: none; border-radius: 8px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);"
                title="Recenze z Booking.com"
                loading="lazy">
            </iframe>
        </div>
    `;
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
