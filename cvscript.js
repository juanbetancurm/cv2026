// Language and Theme Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    const langToggle = document.getElementById('lang-toggle');
    const themeToggle = document.getElementById('theme-toggle');
    const langText = document.querySelector('.lang-text');
    let currentLang = 'es';
    let currentTheme = 'dark';

    // Load saved preferences
    const savedLang = localStorage.getItem('preferredLanguage');
    const savedTheme = localStorage.getItem('preferredTheme');
    
    if (savedLang) {
        currentLang = savedLang;
        if (currentLang === 'es') {
            switchLanguage('es');
        }
    }

    if (savedTheme) {
        currentTheme = savedTheme;
        applyTheme(currentTheme);
    }

    // Theme toggle event
    themeToggle.addEventListener('click', function() {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(currentTheme);
        localStorage.setItem('preferredTheme', currentTheme);
    });

    function applyTheme(theme) {
        const icon = themeToggle.querySelector('i');
        
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            document.documentElement.removeAttribute('data-theme');
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }

    // Language toggle event
    langToggle.addEventListener('click', function() {
        currentLang = currentLang === 'es' ? 'en' : 'es';
        switchLanguage(currentLang);
        localStorage.setItem('preferredLanguage', currentLang);
    });

    function switchLanguage(lang) {
        langText.textContent = lang === 'en' ? 'ES' : 'EN';
        
        const elements = document.querySelectorAll('[data-en][data-es]');
        
        elements.forEach(element => {
            const text = element.getAttribute('data-' + lang);
            if (text) {
                if (element.children.length === 0) {
                    element.textContent = text;
                } else {
                    updateTextContent(element, text);
                }
            }
        });

        elements.forEach(element => {
            element.classList.add('fade-in');
            setTimeout(() => {
                element.classList.remove('fade-in');
            }, 500);
        });

        document.documentElement.lang = lang;
    }

    function updateTextContent(element, newText) {
        const childNodes = Array.from(element.childNodes);
        const textNode = childNodes.find(node => node.nodeType === Node.TEXT_NODE);
        
        if (textNode) {
            textNode.textContent = newText;
        } else {
            element.textContent = newText;
        }
    }

    // Scroll animation for sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // External link security
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
        link.setAttribute('rel', 'noopener noreferrer');
    });

    // Print functionality
    window.addEventListener('beforeprint', function() {
        sections.forEach(section => {
            section.style.opacity = '1';
            section.style.transform = 'none';
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.altKey && e.key === 'l') {
            e.preventDefault();
            langToggle.click();
        }
        if (e.altKey && e.key === 't') {
            e.preventDefault();
            themeToggle.click();
        }
    });
});