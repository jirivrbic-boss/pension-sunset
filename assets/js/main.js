// ============================================
// MAIN JAVASCRIPT - PUBLIC WEBSITE
// ============================================

// Firebase will be loaded asynchronously
let db = null;
let firestore = null;

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    // Always initialize menu first (critical - must work even without Firebase)
    initSideMenu();
    
    // Initialize other features that don't need Firebase
    initNavigation();
    initGallery();
    initLanguageSwitcher();
    initScrollAnimations();
    
    // Load rooms from Booking.com data (no longer needs Firebase)
    loadRooms();
    
    // Try to load Firebase modules for other features (if needed)
    try {
        const firebaseModule = await import('./firebase.js');
        db = firebaseModule.db;
        const firestoreModule = await import('firebase/firestore');
        firestore = {
            collection: firestoreModule.collection,
            getDocs: firestoreModule.getDocs,
            query: firestoreModule.query,
            orderBy: firestoreModule.orderBy
        };
    } catch (error) {
        console.warn('Firebase modules not available, continuing without Firebase:', error);
    }
});

// ============================================
// 3D OFF-CANVAS MENU
// ============================================

function initSideMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const menu = document.getElementById('sideMenu');
    const backdrop = document.getElementById('backdrop');
    const body = document.body;
    const menuLinks = document.querySelectorAll('.menu-link');
    
    if (!menuToggle || !menu || !backdrop) {
        console.warn('Menu elements not found');
        return;
    }
    
    let isMenuOpen = false;
    let previousFocus = null;
    let savedScrollPosition = 0;
    
    // Focus trap elements
    const focusableElements = menu.querySelectorAll(
        'a, button, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    function openMenu(e) {
        // Prevent default behavior (if called from link/button)
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        // Don't open if already open
        if (isMenuOpen) {
            return;
        }
        
        isMenuOpen = true;
        
        // Save current scroll position BEFORE any changes
        // Always get fresh scroll position to ensure accuracy
        const currentScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
        savedScrollPosition = currentScrollY;
        
        // Store scroll position in dataset for later use
        body.dataset.scrollY = savedScrollPosition.toString();
        
        // CRITICAL: Lock scroll position SYNCHRONOUSLY before ANY DOM changes
        const scrollY = savedScrollPosition;
        
        const app = document.getElementById('app');
        
        // IMPORTANT: Apply inline styles FIRST, before any classes
        // This prevents CSS from applying position:fixed and causing scroll jump
        body.style.cssText = `
            position: fixed !important;
            top: -${scrollY}px !important;
            width: 100% !important;
            overflow: hidden !important;
            left: 0 !important;
            right: 0 !important;
        `;
        
        if (app) {
            // Clear any previous transform or top styles that might interfere
            app.style.transform = '';
            app.style.top = '';
            // Reset app scroll to 0 first to ensure clean state
            app.scrollTop = 0;
        }
        
        // Force a reflow to ensure styles are applied
        void body.offsetHeight;
        
        // Now add classes (this won't cause scroll jump because body is already fixed via inline style)
        document.documentElement.classList.add('menu-open');
        body.classList.add('menu-open');
        
        // Set scroll position inside the app element AFTER classes are applied
        // This ensures the app element has the correct CSS (position: fixed, height: 100vh, etc.)
        if (app) {
            // Wait for CSS to apply and element to be ready
            requestAnimationFrame(() => {
                // Set scroll position inside the app element
                // This will show the correct part of the content
                app.scrollTop = scrollY;
                
                // Double-check after another frame to ensure scroll is set correctly
                requestAnimationFrame(() => {
                    // Verify the scroll position is correct
                    if (Math.abs(app.scrollTop - scrollY) > 1) {
                        app.scrollTop = scrollY;
                    }
                    
                    // Final check after CSS transition might have started
                    setTimeout(() => {
                        if (isMenuOpen && Math.abs(app.scrollTop - scrollY) > 1) {
                            app.scrollTop = scrollY;
                        }
                    }, 50);
                });
            });
        }
        
        menuToggle.setAttribute('aria-expanded', 'true');
        backdrop.setAttribute('aria-hidden', 'false');
        
        // Save current focus
        previousFocus = document.activeElement;
        
        // DON'T focus first menu item to avoid any scroll jumps
        // User can manually navigate menu if needed
        
        // Double-check after a frame to ensure position is maintained
        requestAnimationFrame(() => {
            const checkScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
            if (Math.abs(checkScrollY) > 1) {
                // Force scroll to 0 if it jumped
                window.scrollTo(0, 0);
            }
            const bodyTop = parseFloat(body.style.top.replace('px', '')) || 0;
            if (Math.abs(Math.abs(bodyTop) - scrollY) > 1) {
                body.style.top = `-${scrollY}px`;
            }
        });
    }
    
    function closeMenu(e) {
        // Prevent default behavior (if called from link/button)
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        isMenuOpen = false;
        
        // Get saved scroll position from dataset (always use the saved value)
        const savedY = parseInt(body.dataset.scrollY || savedScrollPosition.toString(), 10) || 0;
        
        const app = document.getElementById('app');
        
        // CRITICAL: Remove classes FIRST to trigger CSS transition BACK
        // The CSS transition will animate transform back to normal (scale(1) rotateY(0deg))
        // We keep the inline styles (body fixed, app top) until AFTER the transition completes
        document.documentElement.classList.remove('menu-open');
        body.classList.remove('menu-open');
        
        // Function to restore scroll position - called AFTER CSS transition completes
        const restoreScroll = () => {
            // Get current scroll position from app element if user scrolled it
            let finalScrollY = savedY;
            if (app && app.scrollTop !== undefined && app.scrollTop > 0) {
                // If user scrolled inside the app, use that position
                finalScrollY = app.scrollTop;
            }
            
            // No scroll sync listener needed anymore - we removed it from openMenu
            
            // CRITICAL: Remove inline styles from app FIRST
            if (app) {
                app.style.top = '';
                app.style.transform = '';
                // Reset app scroll
                app.scrollTop = 0;
            }
            
            // CRITICAL: Remove body fixed position BUT keep the top value
            // Remove inline styles one by one to avoid layout shift
            body.style.position = '';
            body.style.width = '';
            body.style.overflow = '';
            body.style.left = '';
            body.style.right = '';
            body.style.height = '';
            
            // Remove top last, but only after we've set the scroll position
            // First, restore scroll position while body is still positioned
            requestAnimationFrame(() => {
                // Set scroll position BEFORE removing body.style.top
                // This prevents the "refresh" effect
                document.documentElement.scrollTop = finalScrollY;
                document.body.scrollTop = finalScrollY;
                
                // Now remove the top style
                body.style.top = '';
                
                // Force scroll to position using window.scrollTo
                window.scrollTo({
                    top: finalScrollY,
                    left: 0,
                    behavior: 'auto'
                });
                
                // Double-check after a frame
                requestAnimationFrame(() => {
                    const currentY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
                    if (Math.abs(currentY - finalScrollY) > 1) {
                        window.scrollTo({
                            top: finalScrollY,
                            left: 0,
                            behavior: 'auto'
                        });
                        document.documentElement.scrollTop = finalScrollY;
                        document.body.scrollTop = finalScrollY;
                    }
                    
                    // Update saved scroll position to match the restored position
                    // This ensures next menu open will use the correct position
                    savedScrollPosition = finalScrollY;
                    body.dataset.scrollY = finalScrollY.toString();
                });
            });
        };
        
        // Listen for transition end on app element
        // This ensures the CSS transform animation completes BEFORE we restore scroll
        if (app) {
            let transitionEnded = false;
            
            const onTransitionEnd = function(event) {
                // Listen for transform, width, or max-width transitions ending
                // These are the properties that change when menu closes
                if (event.target === app && 
                    (event.propertyName === 'transform' || 
                     event.propertyName === 'width' || 
                     event.propertyName === 'max-width' ||
                     event.propertyName === 'all')) {
                    if (!transitionEnded) {
                        transitionEnded = true;
                        app.removeEventListener('transitionend', onTransitionEnd);
                        // Now that animation is complete, restore scroll
                        restoreScroll();
                    }
                }
            };
            
            app.addEventListener('transitionend', onTransitionEnd, { once: false });
            
            // Fallback timeout in case transitionend doesn't fire
            // Use a timeout slightly longer than the CSS transition duration
            setTimeout(() => {
                if (!transitionEnded) {
                    transitionEnded = true;
                    app.removeEventListener('transitionend', onTransitionEnd);
                    restoreScroll();
                }
            }, 650); // Slightly longer than transition duration (500ms + buffer)
        } else {
            // Fallback if app element not found
            setTimeout(restoreScroll, 600);
        }
        
        menuToggle.setAttribute('aria-expanded', 'false');
        backdrop.setAttribute('aria-hidden', 'true');
        
        // Return focus to previous element or hamburger button WITHOUT scrolling
        // Use setTimeout to ensure scroll is restored first
        setTimeout(() => {
            const targetFocus = previousFocus || menuToggle;
            if (targetFocus && targetFocus.focus) {
                try {
                    targetFocus.focus({ preventScroll: true });
                } catch (err) {
                    // Fallback: don't focus if it causes scroll jump
                }
            }
        }, 100);
    }
    
    function toggleMenu(e) {
        // Always prevent default to avoid any navigation
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        if (isMenuOpen) {
            closeMenu(e);
        } else {
            openMenu(e);
        }
    }
    
    // Hamburger button click - prevent default to avoid any navigation
    menuToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Don't allow bubbling to prevent any parent handlers
        e.stopImmediatePropagation();
        toggleMenu(e);
        return false;
    });
    
    // Menu close button (X) click
    const menuCloseBtn = document.getElementById('menuCloseBtn');
    if (menuCloseBtn) {
        menuCloseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeMenu(e);
        });
    }
    
    // Backdrop click - prevent default
    backdrop.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeMenu(e);
    });
    
    // ESC key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            closeMenu();
        }
        
        // Focus trap - Tab key handling
        if (e.key === 'Tab' && isMenuOpen) {
            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                // Tab
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        }
    });
    
    // Handle menu link clicks - scroll to section or navigate to page
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            const target = link.getAttribute('target');
            
            // Always prevent default first to avoid any navigation
            e.preventDefault();
            e.stopPropagation();
            
            // If it's an anchor link (starts with #)
            if (href && href.startsWith('#')) {
                const targetId = href.substring(1);
                
                // Close menu first - this will handle the animation
                closeMenu(e);
                
                // Wait for menu close animation to complete AND scroll to be restored
                setTimeout(() => {
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        // Use scrollIntoView with smooth behavior
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                        
                        // After smooth scroll completes, update saved scroll position
                        // Smooth scroll takes ~500ms, so wait for it to complete
                        setTimeout(() => {
                            const finalScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
                            savedScrollPosition = finalScrollY;
                            body.dataset.scrollY = finalScrollY.toString();
                        }, 600); // Wait for smooth scroll animation to complete
                    } else if (targetId === 'uvod' || targetId === '') {
                        // Special case for home - scroll to top smoothly
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        });
                        
                        // Update saved scroll position after scroll completes
                        setTimeout(() => {
                            savedScrollPosition = 0;
                            body.dataset.scrollY = '0';
                        }, 600);
                    }
                }, 700); // Wait for menu close animation (500ms) + scroll restore buffer (200ms)
            } else if (href && !href.startsWith('#')) {
                // External link or different page
                // Close menu first
                closeMenu(e);
                
                if (target === '_blank') {
                    // Open in new tab - don't wait for menu animation
                    window.open(href, '_blank', 'noopener,noreferrer');
                } else {
                    // Navigate in same window - wait for menu to close
                    setTimeout(() => {
                        window.location.href = href;
                    }, 650); // Wait for menu close animation
                }
            }
        });
    });
}

// ============================================
// NAVIGATION
// ============================================

function initNavigation() {
    // Smooth scroll for anchor links (but NOT menu links - they are handled separately)
    document.querySelectorAll('a[href^="#"]:not(.menu-link)').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') {
                e.preventDefault();
                const hero = document.getElementById('uvod');
                if (hero) {
                    hero.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                return;
            }
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const targetPosition = target.offsetTop;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// LOAD ROOMS FROM BOOKING.COM DATA
// ============================================

async function loadRooms() {
    const roomsGrid = document.getElementById('roomsGrid');
    if (!roomsGrid) return;
    
    // Wait for translations to be available
    if (typeof translations === 'undefined') {
        setTimeout(loadRooms, 100);
        return;
    }
    
    // Statická data pokojů z Booking.com
    const rooms = [
        {
            id: 'RD150721301',
            name: 'Dvoulůžkový pokoj Standard',
            size: '25 m²',
            beds: '1 manželská postel',
            capacity: 2,
            bookingUrl: 'https://www.booking.com/hotel/cz/pension-sunset-meziroli.cs.html?aid=304142&label=gen173nr-10CAEoggI46AdIM1gEaDqIAQGYATO4AQfIAQ3YAQPoAQH4AQGIAgGoAgG4AoelussGwAIB0gIkMDA2YzM3NjAtMGVmOS00Y2E1LWJhODgtMjhkMjQzZTBkMWNm2AIB4AIB&sid=8367012984e9b7276db77b2de7af6b66&dest_id=1507213&dest_type=hotel&dist=0&group_adults=2&group_children=0&hapos=1&hpos=1&no_rooms=1&req_adults=2&req_children=0&room1=A%2CA&sb_price_type=total&sr_order=popularity&srepoch=1768854167&srpvid=0ef28f492aa70b43&type=total&ucfs=1&#RD150721301',
            features: [
                'Výhled do zahrady',
                'Výhled na hory',
                'Výhled na město',
                'TV s plochou obrazovkou',
                'Zvuková izolace',
                'Wi-Fi zdarma'
            ],
            description: 'Dvoulůžkový pokoj nabízí soukromý vchod, zvukově izolované stěny, rychlovarnou konvici, TV s plochou obrazovkou s kabelovými programy a výhled do zahrady. Pokoje obsahují sdílenou koupelnu se sprchou, fénem a pantoflemi zdarma.',
            amenities: [
                'Vířivka',
                'Povlečení',
                'Zásuvka u postele',
                'Posezení',
                'Zvuková izolace',
                'Soukromý vchod',
                'TV',
                'Lednička',
                'Satelitní programy',
                'Příslušenství na přípravu čaje a kávy',
                'Rádio',
                'Mikrovlnná trouba',
                'Topení',
                'TV s plochou obrazovkou',
                'Kuchyňské potřeby',
                'Šatna',
                'Služba buzení/Budík',
                'Koberec',
                'Rychlovarná konvice',
                'Venkovní nábytek',
                'Venkovní jídelní kout',
                'Kabelové programy'
            ],
            rating: '8,8',
            ratingCount: '25',
            image: '/fotky/178478261.jpg'
        },
        {
            id: 'RD150721302',
            name: 'Třílůžkový pokoj Standard',
            size: '30 m²',
            beds: '3 jednolůžkové postele',
            capacity: 3,
            bookingUrl: 'https://www.booking.com/hotel/cz/pension-sunset-meziroli.cs.html?aid=304142&label=gen173nr-10CAEoggI46AdIM1gEaDqIAQGYATO4AQfIAQ3YAQPoAQH4AQGIAgGoAgG4AoelussGwAIB0gIkMDA2YzM3NjAtMGVmOS00Y2E1LWJhODgtMjhkMjQzZTBkMWNm2AIB4AIB&sid=8367012984e9b7276db77b2de7af6b66&dest_id=1507213&dest_type=hotel&dist=0&group_adults=2&group_children=0&hapos=1&hpos=1&no_rooms=1&req_adults=2&req_children=0&room1=A%2CA&sb_price_type=total&sr_order=popularity&srepoch=1768854167&srpvid=0ef28f492aa70b43&type=total&ucfs=1&#RD150721302',
            features: [
                'Výhled do zahrady',
                'Výhled na hory',
                'Výhled na město',
                'TV s plochou obrazovkou',
                'Zvuková izolace',
                'Wi-Fi zdarma'
            ],
            description: 'Třílůžkový pokoj nabízí TV s plochou obrazovkou s kabelovými programy, soukromý vchod, zvukově izolované stěny, rychlovarnou konvici a výhled do zahrady. Pokoje obsahují sdílenou koupelnu se sprchou, fénem a pantoflemi zdarma.',
            amenities: [
                'Vířivka',
                'Povlečení',
                'Zásuvka u postele',
                'Posezení',
                'Zvuková izolace',
                'Soukromý vchod',
                'TV',
                'Lednička',
                'Satelitní programy',
                'Příslušenství na přípravu čaje a kávy',
                'Rádio',
                'Mikrovlnná trouba',
                'Topení',
                'TV s plochou obrazovkou',
                'Kuchyňské potřeby',
                'Šatna',
                'Služba buzení/Budík',
                'Koberec',
                'Rychlovarná konvice',
                'Venkovní nábytek',
                'Venkovní jídelní kout',
                'Kabelové programy'
            ],
            rating: '8,8',
            ratingCount: '25',
            image: '/fotky/178482126.jpg'
        }
    ];
    
    try {
        roomsGrid.innerHTML = '';
        
        rooms.forEach((room) => {
            const roomCard = createRoomCard(room);
            roomsGrid.appendChild(roomCard);
        });
    } catch (error) {
        console.error('Error loading rooms:', error);
        roomsGrid.innerHTML = '<p class="text-center" style="color: red;">Chyba při načítání pokojů. Zkuste to prosím později.</p>';
    }
}

function createRoomCard(room) {
    const card = document.createElement('div');
    card.className = 'room-card fade-in';
    
    // Použij lokální fotku - každý pokoj má svou vlastní fotku v lokálních souborech
    const cacheBuster = new Date().getTime();
    const imageUrl = (room.image || '/fotky/178484544.jpg') + '?v=' + cacheBuster;
    
    // Get current language
    const currentLang = window.currentLang || 'cs';
    const t = translations[currentLang] || translations.cs;
    
    // Get room name translation
    let roomName = room.name;
    if (room.id === 'RD150721301') {
        roomName = t['rooms.roomDouble'] || room.name;
    } else if (room.id === 'RD150721302') {
        roomName = t['rooms.roomTriple'] || room.name;
    }
    
    // Get size and beds translation
    let roomSize = room.size;
    let roomBeds = room.beds;
    if (room.id === 'RD150721301') {
        roomSize = room.size.replace('m²', t['rooms.size'] || 'm²');
        roomBeds = t['rooms.bedDouble'] || room.beds;
    } else if (room.id === 'RD150721302') {
        roomSize = room.size.replace('m²', t['rooms.size'] || 'm²');
        roomBeds = t['rooms.bedTriple'] || room.beds;
    }
    
    const bookButtonText = t['rooms.bookButton'] || 'Rezervovat na Booking.com';
    
    card.innerHTML = `
        <img src="${imageUrl}" alt="${roomName}" class="room-image" onerror="this.src='/fotky/178484544.jpg'">
        <div class="room-content">
            <h3 class="room-name" data-i18n-room-name="${room.id}">${roomName}</h3>
            <div class="room-specs">
                <span class="room-size" data-i18n-room-size="${room.id}"><i class="fas fa-expand-arrows-alt"></i> ${roomSize}</span>
                <span class="room-beds" data-i18n-room-beds="${room.id}"><i class="fas fa-bed"></i> ${roomBeds}</span>
            </div>
            <a href="${room.bookingUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="width: 100%; margin-top: 1rem; text-decoration: none; display: inline-flex; justify-content: center; align-items: center; gap: 0.5rem;" data-i18n="rooms.bookButton">
                <span>${bookButtonText}</span>
                <i class="fas fa-external-link-alt"></i>
            </a>
        </div>
    `;
    
    return card;
}

// Room booking redirects to Booking.com (no longer needed as links are direct)

// ============================================
// GALLERY
// ============================================

// Proměnné pro galerii (globální, aby byly dostupné pro resize listener)
// Pouze fotky označené čísly
const allGalleryImages = [
    '107276708.jpg',
    '119300806.jpg',
    '129898529.jpg',
    '129898757.jpg',
    '129899039.jpg',
    '130644941.jpg',
    '130645994.jpg',
    '130646422.jpg',
    '144696148.jpg',
    '144696484.jpg',
    '144699058.jpg',
    '178478261.jpg',
    '178479648.jpg',
    '178479759.jpg',
    '178480294.jpg',
    '178480560.jpg',
    '178481221.jpg',
    '178482126.jpg',
    '178484544.jpg',
    '53954045.jpg',
    '61598806.jpg',
    '73269680.jpg',
    '73269716.jpg',
    '73269987.jpg',
    '74401789.jpg',
    '88051428.jpg',
    '88282651.jpg',
    '96204493.jpg'
];

// Vyznačené fotky pro mobil (12 kusů)
const mobileGalleryImages = [
    '73269680.jpg',
    '130645994.jpg',
    '129898529.jpg',
    '178478261.jpg',
    '178479648.jpg',
    '178479759.jpg',
    '178480294.jpg',
    '178480560.jpg',
    '178481221.jpg',
    '178482126.jpg',
    '178484544.jpg',
    '107276708.jpg'
];

function initGallery() {
    // Get all images from fotky folder (seřazeno podle názvu)
    // Pro PC: všechny fotky kromě posledních 3
    
    // Pro PC: odeber poslední 3 fotky
    const desktopImages = allGalleryImages.slice(0, -3);
    
    // Detekce mobilu (šířka menší než 768px)
    const isMobile = window.innerWidth < 768;
    const imageFiles = isMobile ? mobileGalleryImages : desktopImages;
    
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) {
        console.error('Gallery grid element not found!');
        return;
    }
    
    // Clear any existing content
    galleryGrid.innerHTML = '';
    
    console.log('Initializing gallery with', imageFiles.length, 'images', isMobile ? '(mobile)' : '(desktop)');
    
    imageFiles.forEach((imageFile, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.dataset.index = index;
        
        const img = document.createElement('img');
        // Use path relative to root (works on both local and Vercel)
        // Add cache busting timestamp
        const cacheBuster = new Date().getTime();
        img.src = `/fotky/${imageFile}?v=${cacheBuster}`;
        img.alt = `Galerie ${index + 1}`;
        img.loading = 'lazy';
        
        // Error handling for images
        img.onerror = function() {
            console.error('Failed to load image:', img.src);
            this.style.display = 'none';
        };
        
        img.onload = function() {
            console.log('Image loaded:', img.src);
        };
        
        item.appendChild(img);
        // Pro lightbox použijeme aktuální seznam obrázků
        item.addEventListener('click', () => openLightbox(index, imageFiles));
        
        galleryGrid.appendChild(item);
    });
    
    console.log('Gallery initialized with', galleryGrid.children.length, 'items');
}

// Přepočítání galerie při změně velikosti okna
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        const galleryGrid = document.getElementById('galleryGrid');
        if (galleryGrid && galleryGrid.children.length > 0) {
            const currentIsMobile = window.innerWidth < 768;
            const galleryItems = galleryGrid.querySelectorAll('.gallery-item');
            const firstImage = galleryItems[0]?.querySelector('img');
            if (firstImage) {
                const currentSrc = firstImage.src.split('/').pop();
                const wasMobile = mobileGalleryImages.includes(currentSrc);
                
                // Pokud se změnila kategorie (mobile/desktop), reinicializuj galerii
                if (currentIsMobile !== wasMobile) {
                    initGallery();
                }
            }
        }
    }, 250); // Debounce 250ms
});

// Globální proměnné pro lightbox
let lightboxState = {
    currentIndex: 0,
    imageFiles: [],
    handleKeyPress: null
};

function openLightbox(index, imageFiles) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    
    if (!lightbox || !lightboxImage || !imageFiles || imageFiles.length === 0) {
        console.error('Lightbox elements or images not found');
        return;
    }
    
    // Ulož stav
    lightboxState.currentIndex = index;
    lightboxState.imageFiles = imageFiles;
    
    // Odstraň starý event listener, pokud existuje
    if (lightboxState.handleKeyPress) {
        document.removeEventListener('keydown', lightboxState.handleKeyPress);
    }
    
    function showImage() {
        if (lightboxState.imageFiles.length === 0) return;
        
        const cacheBuster = new Date().getTime();
        const imagePath = `/fotky/${lightboxState.imageFiles[lightboxState.currentIndex]}?v=${cacheBuster}`;
        
        // Přidej loading třídu
        lightboxImage.classList.add('loading');
        lightboxImage.style.opacity = '0';
        
        // Preload obrázek
        const img = new Image();
        img.onload = () => {
            lightboxImage.src = imagePath;
            lightboxImage.alt = `Galerie ${lightboxState.currentIndex + 1} / ${lightboxState.imageFiles.length}`;
            lightboxImage.style.opacity = '1';
            lightboxImage.classList.remove('loading');
        };
        img.onerror = () => {
            console.error('Failed to load image:', imagePath);
            lightboxImage.classList.remove('loading');
            lightboxImage.style.opacity = '1';
        };
        img.src = imagePath;
    }
    
    function nextImage() {
        if (lightboxState.imageFiles.length === 0) return;
        lightboxState.currentIndex = (lightboxState.currentIndex + 1) % lightboxState.imageFiles.length;
        showImage();
    }
    
    function prevImage() {
        if (lightboxState.imageFiles.length === 0) return;
        lightboxState.currentIndex = (lightboxState.currentIndex - 1 + lightboxState.imageFiles.length) % lightboxState.imageFiles.length;
        showImage();
    }
    
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        if (lightboxState.handleKeyPress) {
            document.removeEventListener('keydown', lightboxState.handleKeyPress);
            lightboxState.handleKeyPress = null;
        }
    };
    
    // Keyboard navigation
    lightboxState.handleKeyPress = (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextImage();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevImage();
        }
    };
    
    // Odeber staré event listenery a přidej nové
    // Použijeme once: true, aby se listenery automaticky odstranily po použití
    lightboxClose.onclick = closeLightbox;
    lightboxNext.onclick = (e) => {
        e.stopPropagation();
        nextImage();
    };
    lightboxPrev.onclick = (e) => {
        e.stopPropagation();
        prevImage();
    };
    
    lightbox.onclick = (e) => {
        if (e.target === lightbox) closeLightbox();
    };
    
    document.addEventListener('keydown', lightboxState.handleKeyPress);
    
    // Zobraz první obrázek
    showImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ============================================
// LANGUAGE SWITCHER
// ============================================

function initLanguageSwitcher() {
    const langButtons = document.querySelectorAll('.lang-btn');
    
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            
            // Remove active class from all buttons
            langButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            // TODO: Implement actual language switching
            console.log('Language switched to:', lang);
        });
    });
}

// ============================================
// CONTACT FORM
// ============================================

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('contactName').value,
            email: document.getElementById('contactEmail').value,
            subject: document.getElementById('contactSubject').value,
            message: document.getElementById('contactMessage').value
        };
        
        // TODO: Connect to backend/API
        console.log('Contact form submitted:', formData);
        
        alert('Děkujeme za vaši zprávu! Brzy se vám ozveme.');
        contactForm.reset();
    });
}

// ============================================
// SCROLL ANIMATIONS
// ============================================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

