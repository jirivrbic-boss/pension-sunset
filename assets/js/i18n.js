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
                element.textContent = translation;
            }
        }
    });
    
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
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
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
