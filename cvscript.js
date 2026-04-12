document.addEventListener('DOMContentLoaded', function () {

    // ── Elements ──
    const themeToggle = document.getElementById('theme-toggle');
    const langToggle  = document.getElementById('lang-toggle');
    const langText    = document.querySelector('.lang-text');
    const pdfBtn      = document.getElementById('pdf-btn');
    const navLinks    = document.querySelectorAll('.topnav .nav-link');
    const sections    = document.querySelectorAll('section[id], header[id]');

    let currentLang  = localStorage.getItem('preferredLanguage') || 'es';
    let currentTheme = localStorage.getItem('preferredTheme')    || 'dark';

    // ── Theme ──
    function applyTheme(theme) {
        const icon = themeToggle.querySelector('i');
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            icon.classList.replace('fa-moon', 'fa-sun') || icon.classList.add('fa-sun');
            icon.classList.remove('fa-moon');
        } else {
            document.documentElement.removeAttribute('data-theme');
            icon.classList.replace('fa-sun', 'fa-moon') || icon.classList.add('fa-moon');
            icon.classList.remove('fa-sun');
        }
    }
    applyTheme(currentTheme);

    themeToggle.addEventListener('click', function () {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(currentTheme);
        localStorage.setItem('preferredTheme', currentTheme);
    });

    // ── Language ──
    function switchLanguage(lang) {
        langText.textContent = lang === 'en' ? 'ES' : 'EN';

        document.querySelectorAll('[data-en][data-es]').forEach(function (el) {
            var text = el.getAttribute('data-' + lang);
            if (text) {
                el.innerHTML = text;
                el.classList.add('fade-in');
                setTimeout(function () { el.classList.remove('fade-in'); }, 400);
            }
        });

        document.documentElement.lang = lang;
    }
    switchLanguage(currentLang);

    langToggle.addEventListener('click', function () {
        currentLang = currentLang === 'es' ? 'en' : 'es';
        switchLanguage(currentLang);
        localStorage.setItem('preferredLanguage', currentLang);
    });

    // ── Active Nav Highlighting ──
    function highlightNav() {
        var scrollPos = window.pageYOffset || document.documentElement.scrollTop;
        var current = '';

        sections.forEach(function (section) {
            if (scrollPos >= section.offsetTop - 100) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(function (link) {
            link.classList.toggle('active', link.getAttribute('href') === '#' + current);
        });
    }

    var scrollTimer;
    window.addEventListener('scroll', function () {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(highlightNav, 50);
    }, { passive: true });

    // ── Smooth Scroll Nav ──
    navLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ── PDF Download ──
    pdfBtn.addEventListener('click', function () {
        // Open all progressive disclosure sections before printing
        document.querySelectorAll('.expand-detail').forEach(function (el) {
            el.setAttribute('open', '');
        });

        // Small delay to let DOM update
        setTimeout(function () {
            window.print();
        }, 100);
    });

    // ── Scroll Reveal ──
    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

        document.querySelectorAll('.section, .exp-item, .edu-item').forEach(function (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(15px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(el);
        });
    }

    // ── External Link Security ──
    document.querySelectorAll('a[target="_blank"]').forEach(function (link) {
        link.setAttribute('rel', 'noopener noreferrer');
    });

    // ── Keyboard Shortcuts ──
    document.addEventListener('keydown', function (e) {
        if (e.altKey && e.key === 'l') { e.preventDefault(); langToggle.click(); }
        if (e.altKey && e.key === 't') { e.preventDefault(); themeToggle.click(); }
        if (e.altKey && e.key === 'p') { e.preventDefault(); pdfBtn.click(); }
    });

    // ── Print: ensure sections visible ──
    window.addEventListener('beforeprint', function () {
        document.querySelectorAll('.section, .exp-item, .edu-item').forEach(function (el) {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
    });
});
