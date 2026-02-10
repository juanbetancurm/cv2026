// Language and Theme Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    const langToggle = document.getElementById('lang-toggle');
    const themeToggle = document.getElementById('theme-toggle');
    const langText = document.querySelector('.lang-text');
    let currentLang = 'es';
    let currentTheme = 'dark';

    // MODIFICATION: Sidebar toggle functionality
    const sidebarToggle = document.getElementById('sidebarToggle');
    const pageContainer = document.querySelector('.page-container');
    const sidebar = document.getElementById('sidebar');
    
    // Load saved sidebar state
    const savedSidebarState = localStorage.getItem('sidebarCollapsed');
    if (savedSidebarState === 'true' && window.innerWidth > 800) {
        pageContainer.classList.add('sidebar-collapsed');
    }
    
    // MODIFICATION: Sidebar toggle event - only works on desktop
    sidebarToggle.addEventListener('click', function() {
        if (window.innerWidth > 800) {
            pageContainer.classList.toggle('sidebar-collapsed');
            const isCollapsed = pageContainer.classList.contains('sidebar-collapsed');
            localStorage.setItem('sidebarCollapsed', isCollapsed);
        }
    });
    
    // MODIFICATION: Handle window resize - remove collapsed class on mobile
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth <= 800) {
                pageContainer.classList.remove('sidebar-collapsed');
            } else {
                // Restore saved state on desktop
                const savedState = localStorage.getItem('sidebarCollapsed');
                if (savedState === 'true') {
                    pageContainer.classList.add('sidebar-collapsed');
                } else {
                    pageContainer.classList.remove('sidebar-collapsed');
                }
            }
        }, 250);
    });
    
    // MODIFICATION: Active navigation link highlighting on scroll
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section[id]');
    
    function highlightNavigation() {
        let current = '';
        const scrollOffset = window.innerWidth <= 800 ? 150 : 100; // Larger offset for mobile
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= (sectionTop - scrollOffset)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
                
                // MODIFICATION: Auto-scroll nav item into view on mobile
                if (window.innerWidth <= 800) {
                    link.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                }
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavigation);
    
    // MODIFICATION: Smooth scroll to sections when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const isMobile = window.innerWidth <= 800;
                const offset = isMobile ? 100 : 20; // Account for bottom nav on mobile
                const targetPosition = targetSection.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Load saved preferences
    const savedLang = localStorage.getItem('preferredLanguage');
    const savedTheme = localStorage.getItem('preferredTheme');
    
    if (savedLang) {
        currentLang = savedLang;
        if (currentLang === 'es') {
            switchLanguage('es');
        } else {
            switchLanguage('en');
        }
    } else {
        // Default to Spanish
        switchLanguage('es');
    }

    if (savedTheme) {
        currentTheme = savedTheme;
        applyTheme(currentTheme);
    } else {
        // Default to dark theme
        applyTheme('dark');
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
                element.innerHTML = text;

                /* if (element.children.length === 0) {
                    element.textContent = text;
                } else {
                    updateTextContent(element, text);
                } */
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
        // Alt + L to toggle language
        if (e.altKey && e.key === 'l') {
            e.preventDefault();
            langToggle.click();
        }
        // Alt + T to toggle theme
        if (e.altKey && e.key === 't') {
            e.preventDefault();
            themeToggle.click();
        }
        // MODIFICATION: Alt + S to toggle sidebar (desktop only)
        if (e.altKey && e.key === 's' && window.innerWidth > 800) {
            e.preventDefault();
            sidebarToggle.click();
        }
    });
});