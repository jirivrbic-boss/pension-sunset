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
        
        isMenuOpen = true;
        
        // Save current scroll position BEFORE any changes
        savedScrollPosition = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
        
        // Store scroll position in dataset for later use
        body.dataset.scrollY = savedScrollPosition.toString();
        
        // CRITICAL: Lock scroll position SYNCHRONOUSLY before ANY DOM changes
        // This MUST happen in the same synchronous block to prevent scroll jump
        const scrollY = savedScrollPosition;
        
        // Lock scroll position BEFORE adding classes to prevent jump
        body.style.position = 'fixed';
        body.style.top = `-${scrollY}px`;
        body.style.width = '100%';
        body.style.overflow = 'hidden';
        body.style.left = '0';
        body.style.right = '0';
        
        const app = document.getElementById('app');
        if (app) {
            // Set app top to negative scroll to maintain viewport position
            app.style.top = `-${scrollY}px`;
        }
        
        // Now add classes (this won't cause scroll jump because body is already fixed)
        document.documentElement.classList.add('menu-open');
        body.classList.add('menu-open');
        
        menuToggle.setAttribute('aria-expanded', 'true');
        backdrop.setAttribute('aria-hidden', 'false');
        
        // Save current focus
        previousFocus = document.activeElement;
        
        // DON'T focus first menu item to avoid any scroll jumps
        // User can manually navigate menu if needed
        
        // Double-check after a frame to ensure position is maintained
        requestAnimationFrame(() => {
            // Verify scroll didn't jump
            if (app && Math.abs(parseFloat(app.style.top) + scrollY) > 1) {
                app.style.top = `-${scrollY}px`;
            }
            if (Math.abs(parseFloat(body.style.top) + scrollY) > 1) {
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
        
        // Get saved scroll position from dataset
        const savedY = parseInt(body.dataset.scrollY || savedScrollPosition.toString(), 10);
        
        // Remove classes first (CSS transition will handle animation)
        document.documentElement.classList.remove('menu-open');
        body.classList.remove('menu-open');
        
        // Wait for CSS transition to complete before restoring scroll
        const app = document.getElementById('app');
        
        // Function to restore scroll position
        const restoreScroll = () => {
            // Remove inline styles that lock scroll
            body.style.position = '';
            body.style.top = '';
            body.style.width = '';
            body.style.overflow = '';
            body.style.left = '';
            body.style.right = '';
            
            if (app) {
                app.style.top = '';
            }
            
            // Force scroll position restoration
            // Use multiple requestAnimationFrame to ensure it happens after layout
            requestAnimationFrame(() => {
                // First, ensure we're at the top
                window.scrollTo(0, 0);
                requestAnimationFrame(() => {
                    // Then restore saved position
                    window.scrollTo(0, savedY);
                    requestAnimationFrame(() => {
                        // Double-check and force if needed
                        const currentY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
                        if (Math.abs(currentY - savedY) > 1) {
                            window.scrollTo(0, savedY);
                            // Force one more time
                            document.documentElement.scrollTop = savedY;
                            document.body.scrollTop = savedY;
                        }
                    });
                });
            });
        };
        
        // Listen for transition end on app element
        if (app) {
            let transitionEnded = false;
            
            const onTransitionEnd = function(event) {
                // Only restore if this is the transform transition (not a child element)
                if (event.target === app && (event.propertyName === 'transform' || event.propertyName === 'all')) {
                    if (!transitionEnded) {
                        transitionEnded = true;
                        app.removeEventListener('transitionend', onTransitionEnd);
                        restoreScroll();
                    }
                }
            };
            
            app.addEventListener('transitionend', onTransitionEnd, { once: true });
            
            // Fallback timeout in case transitionend doesn't fire
            setTimeout(() => {
                if (!transitionEnded) {
                    transitionEnded = true;
                    restoreScroll();
                }
            }, 600); // Slightly longer than transition duration
        } else {
            // Fallback if app element not found
            setTimeout(restoreScroll, 500);
        }
        
        menuToggle.setAttribute('aria-expanded', 'false');
        backdrop.setAttribute('aria-hidden', 'true');
        
        // Return focus to previous element or hamburger button WITHOUT scrolling
        // Use requestAnimationFrame to ensure scroll is restored first
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                const targetFocus = previousFocus || menuToggle;
                if (targetFocus && targetFocus.focus) {
                    try {
                        targetFocus.focus({ preventScroll: true });
                    } catch (err) {
                        // Fallback: don't focus if it causes scroll jump
                        // Just update tabindex if needed
                    }
                }
            });
        });
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
        toggleMenu(e);
    });
    
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
            
            // Always prevent default first to avoid any navigation
            e.preventDefault();
            e.stopPropagation();
            
            // If it's an anchor link (starts with #)
            if (href && href.startsWith('#')) {
                const targetId = href.substring(1);
                
                // Close menu first (this will restore scroll position)
                closeMenu(e);
                
                // Wait for menu to close and scroll to be restored, then scroll to target
                setTimeout(() => {
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        // Use scrollIntoView with smooth behavior
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    } else if (targetId === 'uvod' || targetId === '') {
                        // Special case for home - scroll to top smoothly
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        });
                    }
                }, 350); // Wait for menu close animation + scroll restore
            } else if (href && !href.startsWith('#')) {
                // External link or different page - close menu first, then navigate
                closeMenu(e);
                
                // Small delay to allow menu to close, then navigate
                setTimeout(() => {
                    window.location.href = href;
                }, 100);
            }
        });
    });
}

// ============================================
// NAVIGATION
// ============================================

function initNavigation() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
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
            description: 'Bazén s výhledem a vířivka jsou speciálními prvky tohoto dvoulůžkového pokoje. Pokoje obsahují sdílenou koupelnu se sprchou, fénem a pantoflemi zdarma. Dvoulůžkový pokoj nabízí soukromý vchod, zvukově izolované stěny, rychlovarnou konvici, TV s plochou obrazovkou s kabelovými programy a výhled do zahrady.',
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
            image: 'fotky/178484544.jpg'
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
            description: 'Hosté zažijí výjimečný zážitek, protože tento třílůžkový pokoj nabízí bazén s výhledem a vířivku. Pokoje obsahují sdílenou koupelnu se sprchou, fénem a pantoflemi zdarma. Třílůžkový pokoj nabízí TV s plochou obrazovkou s kabelovými programy, soukromý vchod, zvukově izolované stěny, rychlovarnou konvici a výhled do zahrady.',
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
            image: 'fotky/178484544.jpg'
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
    
    const imageUrl = room.image || 'fotky/178484544.jpg';
    
    card.innerHTML = `
        <img src="${imageUrl}" alt="${room.name}" class="room-image" onerror="this.src='fotky/178484544.jpg'">
        <div class="room-content">
            <h3 class="room-name">${room.name}</h3>
            <div class="room-specs">
                <span class="room-size"><i class="fas fa-expand-arrows-alt"></i> ${room.size}</span>
                <span class="room-beds"><i class="fas fa-bed"></i> ${room.beds}</span>
            </div>
            <a href="${room.bookingUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="width: 100%; margin-top: 1rem; text-decoration: none; display: inline-flex; justify-content: center; align-items: center; gap: 0.5rem;">
                <span>Rezervovat na Booking.com</span>
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

function initGallery() {
    // Get all images from fotky folder (seřazeno podle názvu)
    const imageFiles = [
        '107276708.jpg',
        '119300806.jpg',
        '129898529.jpg',
        '129898757.jpg',
        '129899039.jpg',
        '130040998.jpg',
        '130644941.jpg',
        '130645994.jpg',
        '130646422.jpg',
        '143146327.jpg',
        '143147259.jpg',
        '143148468.jpg',
        '144696148.jpg',
        '144696484.jpg',
        '144699058.jpg',
        '178478261.jpg',
        '178479648.jpg',
        '178479759.jpg',
        '178480294.jpg',
        '178480560.jpg',
        '178480866.jpg',
        '178481221.jpg',
        '178482126.jpg',
        '178482932.jpg',
        '178483119.jpg',
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
    
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) {
        console.error('Gallery grid element not found!');
        return;
    }
    
    // Clear any existing content
    galleryGrid.innerHTML = '';
    
    console.log('Initializing gallery with', imageFiles.length, 'images');
    
    imageFiles.forEach((imageFile, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.dataset.index = index;
        
        const img = document.createElement('img');
        // Use path relative to root (works on both local and Vercel)
        img.src = `/fotky/${imageFile}`;
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
        item.addEventListener('click', () => openLightbox(index, imageFiles));
        
        galleryGrid.appendChild(item);
    });
    
    console.log('Gallery initialized with', galleryGrid.children.length, 'items');
}

function openLightbox(index, imageFiles) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    
    if (!lightbox || !lightboxImage) return;
    
    let currentIndex = index;
    
    function showImage() {
        lightboxImage.src = `/fotky/${imageFiles[currentIndex]}`;
        lightboxImage.alt = `Galerie ${currentIndex + 1}`;
    }
    
    function nextImage() {
        currentIndex = (currentIndex + 1) % imageFiles.length;
        showImage();
    }
    
    function prevImage() {
        currentIndex = (currentIndex - 1 + imageFiles.length) % imageFiles.length;
        showImage();
    }
    
    showImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Event listeners
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };
    
    lightboxClose.onclick = closeLightbox;
    lightboxNext.onclick = nextImage;
    lightboxPrev.onclick = prevImage;
    
    lightbox.onclick = (e) => {
        if (e.target === lightbox) closeLightbox();
    };
    
    // Keyboard navigation
    const handleKeyPress = (e) => {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
    };
    
    document.addEventListener('keydown', handleKeyPress);
    
    // Cleanup on close
    lightboxClose.addEventListener('click', () => {
        document.removeEventListener('keydown', handleKeyPress);
    }, { once: true });
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

