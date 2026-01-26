// ============================================
// I18N - Internationalization System
// ============================================

let currentLang = 'cs';

// Load language from localStorage or default to Czech
function initLanguage() {
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang && translations[savedLang]) {
        currentLang = savedLang;
    } else {
        currentLang = 'cs';
    }
    applyLanguage(currentLang);
}

// Apply language to all elements with data-i18n attribute
function applyLanguage(lang) {
    currentLang = lang;
    window.currentLang = lang; // Make it globally available
    localStorage.setItem('preferredLanguage', lang);
    
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            const translation = translations[lang][key];
            
            // Handle HTML content (for elements with <strong> tags, etc.)
            if (element.innerHTML.includes('<')) {
                // Preserve HTML structure
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = translation;
                element.innerHTML = tempDiv.innerHTML;
            } else {
                // For buttons/links, update inner span if exists, otherwise textContent
                const span = element.querySelector('span');
                if (span && element.tagName === 'A') {
                    span.textContent = translation;
                } else {
                    element.textContent = translation;
                }
            }
        }
    });
    
    // Update room cards if they exist
    updateRoomCards(lang);
    
    // Update active language button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Update active language link in footer
    document.querySelectorAll('.lang-link').forEach(link => {
        if (link.getAttribute('data-lang') === lang) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Update aria-label attributes
    document.querySelectorAll('[aria-label]').forEach(element => {
        const ariaKey = element.getAttribute('data-i18n-aria');
        if (ariaKey && translations[lang] && translations[lang][ariaKey]) {
            element.setAttribute('aria-label', translations[lang][ariaKey]);
        }
    });
    
    // Update title attributes
    document.querySelectorAll('[title]').forEach(element => {
        const titleKey = element.getAttribute('data-i18n-title');
        if (titleKey && translations[lang] && translations[lang][titleKey]) {
            element.setAttribute('title', translations[lang][titleKey]);
        }
    });
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
}

// Update room cards with translations
function updateRoomCards(lang) {
    const t = translations[lang] || translations.cs;
    
    // Update room names
    document.querySelectorAll('[data-i18n-room-name="RD150721301"]').forEach(el => {
        el.textContent = t['rooms.roomDouble'] || 'Dvoulůžkový pokoj Standard';
    });
    document.querySelectorAll('[data-i18n-room-name="RD150721302"]').forEach(el => {
        el.textContent = t['rooms.roomTriple'] || 'Třílůžkový pokoj Standard';
    });
    
    // Update room sizes
    document.querySelectorAll('[data-i18n-room-size="RD150721301"]').forEach(el => {
        const size = '25 ' + (t['rooms.size'] || 'm²');
        el.innerHTML = `<i class="fas fa-expand-arrows-alt"></i> ${size}`;
    });
    document.querySelectorAll('[data-i18n-room-size="RD150721302"]').forEach(el => {
        const size = '30 ' + (t['rooms.size'] || 'm²');
        el.innerHTML = `<i class="fas fa-expand-arrows-alt"></i> ${size}`;
    });
    
    // Update room beds
    document.querySelectorAll('[data-i18n-room-beds="RD150721301"]').forEach(el => {
        el.innerHTML = `<i class="fas fa-bed"></i> ${t['rooms.bedDouble'] || '1 manželská postel'}`;
    });
    document.querySelectorAll('[data-i18n-room-beds="RD150721302"]').forEach(el => {
        el.innerHTML = `<i class="fas fa-bed"></i> ${t['rooms.bedTriple'] || '3 jednolůžkové postele'}`;
    });
}

// Initialize language system when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLanguage);
} else {
    initLanguage();
}

// Language switcher event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Menu language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = btn.getAttribute('data-lang');
            if (lang && translations[lang]) {
                applyLanguage(lang);
            }
        });
    });
    
    // Footer language links
    document.querySelectorAll('.lang-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = link.getAttribute('data-lang');
            if (lang && translations[lang]) {
                applyLanguage(lang);
            }
        });
    });
});
