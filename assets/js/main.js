// ============================================
// MAIN JAVASCRIPT - PUBLIC WEBSITE
// ============================================

import { db } from './firebase.js';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initSideMenu();
    initNavigation();
    initGallery();
    loadRooms();
    initLanguageSwitcher();
    initScrollAnimations();
});

// ============================================
// HEADER SCROLL EFFECT
// ============================================

function initSideMenu() {
    const header = document.querySelector('.header-static');
    
    if (header) {
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                header.style.backgroundColor = 'rgba(26, 26, 26, 0.98)';
                header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
            } else {
                header.style.backgroundColor = 'rgba(26, 26, 26, 0.95)';
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
            }
            
            lastScroll = currentScroll;
        });
    }
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
// LOAD ROOMS FROM FIRESTORE
// ============================================

async function loadRooms() {
    const roomsGrid = document.getElementById('roomsGrid');
    if (!roomsGrid) return;
    
    try {
        const roomsRef = collection(db, 'rooms');
        const q = query(roomsRef, orderBy('name', 'asc'));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            roomsGrid.innerHTML = '<p class="text-center">Zatím nejsou k dispozici žádné pokoje.</p>';
            return;
        }
        
        roomsGrid.innerHTML = '';
        
        querySnapshot.forEach((doc) => {
            const room = doc.data();
            const roomCard = createRoomCard(room, doc.id);
            roomsGrid.appendChild(roomCard);
        });
    } catch (error) {
        console.error('Error loading rooms:', error);
        roomsGrid.innerHTML = '<p class="text-center" style="color: red;">Chyba při načítání pokojů. Zkuste to prosím později.</p>';
    }
}

function createRoomCard(room, roomId) {
    const card = document.createElement('div');
    card.className = 'room-card fade-in';
    
    const imageUrl = room.image ? `fotky/${room.image}` : 'fotky/178484544.jpg';
    
    card.innerHTML = `
        <img src="${imageUrl}" alt="${room.name}" class="room-image" onerror="this.src='fotky/178484544.jpg'">
        <div class="room-content">
            <h3 class="room-name">${room.name}</h3>
            <p class="room-description">${room.description || ''}</p>
            <div class="room-details">
                <div class="room-capacity">
                    <i class="fas fa-users"></i>
                    <span>${room.capacity || 2} osob</span>
                </div>
                <div class="room-price">
                    ${room.price || 0} Kč<span>/noc</span>
                </div>
            </div>
            <a href="https://www.booking.com/Share-26creP" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="width: 100%; margin-top: 1rem; text-decoration: none; display: inline-flex; justify-content: center; align-items: center; gap: 0.5rem;">
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

