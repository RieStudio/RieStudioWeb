/* RieStudio Shared JavaScript Functions */

// Theme Initialization (Instant execution in head to prevent FOUC)
(function () {
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme ? (savedTheme === 'dark') : true;
    if (isDark) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
})();

// Tailwind Configuration
if (typeof tailwind !== 'undefined') {
    tailwind.config = {
        darkMode: 'class',
        theme: {
            extend: {
                fontFamily: {
                    sans: ['Inter', 'sans-serif'],
                },
                colors: {
                    primary: {
                        600: '#2563eb',
                    },
                    gray: {
                        50: '#f9fafb',
                        100: '#f3f4f6',
                        200: '#e5e7eb',
                        300: '#d1d5db',
                        400: '#9ca3af',
                        500: '#6b7280',
                        600: '#4b5563',
                        700: '#374151',
                        800: '#1f2937',
                        900: '#111827',
                    }
                }
            }
        }
    };
}

// Theme Toggle Functionality
function toggleTheme() {
    const html = document.documentElement;
    const isDark = html.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeUI(isDark);
}

function updateThemeUI(isDark) {
    const navbarLogo = document.getElementById('navbarLogo');
    const footerLogo = document.getElementById('footerLogo');
    const sunIcon = document.getElementById('sunIcon');
    const moonIcon = document.getElementById('moonIcon');

    const pathPrefix = window.location.pathname.includes('/privacy/') ? '../assets/' : 'assets/';

    if (isDark) {
        if (navbarLogo) navbarLogo.src = pathPrefix + 'hedef.png';
        if (footerLogo) footerLogo.src = pathPrefix + 'hedef.png';
        if (sunIcon) sunIcon.classList.remove('hidden');
        if (moonIcon) moonIcon.classList.add('hidden');
    } else {
        if (navbarLogo) navbarLogo.src = pathPrefix + 'beyazrs.png';
        if (footerLogo) footerLogo.src = pathPrefix + 'beyazrs.png';
        if (sunIcon) sunIcon.classList.add('hidden');
        if (moonIcon) moonIcon.classList.remove('hidden');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const isDark = document.documentElement.classList.contains('dark');
    updateThemeUI(isDark);
});

// Mobile Menu Control
function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');
    const overlay = document.getElementById('overlay');

    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
        if (menuIcon) menuIcon.classList.remove('hidden');
        if (closeIcon) closeIcon.classList.add('hidden');
        if (overlay) overlay.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const overlay = document.getElementById('overlay');
    const nav = document.querySelector('nav');
    const menuIcon = document.getElementById('menu-icon');

    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
        if (mobileMenuButton) mobileMenuButton.classList.remove('is-active');
        if (overlay) overlay.classList.add('hidden');
        if (nav) nav.classList.remove('mobile-menu-open');
        if (menuIcon) {
            menuIcon.style.transform = 'rotate(0deg)';
            setTimeout(() => menuIcon.style.transform = '', 300);
        }
        document.body.style.overflow = 'auto';
    }
}
window.closeMobileMenu = closeMobileMenu;

function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const overlay = document.getElementById('overlay');
    const nav = document.querySelector('nav');
    const menuIcon = document.getElementById('menu-icon');

    if (!mobileMenuButton || !mobileMenu) return;

    function toggleMobileMenu() {
        const isHidden = mobileMenu.classList.toggle('hidden');
        mobileMenuButton.classList.toggle('is-active', !isHidden);
        if (overlay) overlay.classList.toggle('hidden', isHidden);
        if (nav) nav.classList.toggle('mobile-menu-open', !isHidden);
        if (menuIcon) menuIcon.style.transform = isHidden ? 'rotate(0deg)' : 'rotate(90deg)';
        document.body.style.overflow = isHidden ? 'auto' : 'hidden';
    }

    mobileMenuButton.onclick = function (e) {
        e.stopPropagation();
        toggleMobileMenu();
    };

    if (overlay) {
        overlay.onclick = closeMobileMenu;
    }

    document.addEventListener('click', function (e) {
        if (!mobileMenu.classList.contains('hidden') &&
            !mobileMenu.contains(e.target) &&
            !mobileMenuButton.contains(e.target)) {
            closeMobileMenu();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768 && !mobileMenu.classList.contains('hidden')) {
            closeMobileMenu();
        }
    });
}

// Contact Modal & Webhook Handler
function initContactModal() {
    const modal = document.getElementById('contactModal');
    const contactBtn = document.getElementById('contactBtn');
    const mobileContactBtn = document.getElementById('mobileContactBtn');
    const closeBtn = document.getElementById('closeModal');

    const step1 = document.getElementById('modalStep1');
    const step2 = document.getElementById('modalStep2');
    const step3 = document.getElementById('modalStep3');

    const startProjectBtn = document.getElementById('startProjectBtn');
    const backToStep1Btn = document.getElementById('backToStep1Btn');
    const closeSuccessModalBtn = document.getElementById('closeSuccessModalBtn');
    const projectForm = document.getElementById('projectForm');

    if (!modal) return;

    function resetModalSteps() {
        if (step1) step1.classList.remove('hidden');
        if (step2) step2.classList.add('hidden');
        if (step3) step3.classList.add('hidden');
        if (projectForm) projectForm.reset();
        const projectDetails = document.getElementById('projectDetails');
        if (projectDetails) projectDetails.value = '';
    }

    function openModal() {
        resetModalSteps();
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    // Expose openContactModal globally on window
    window.openContactModal = openModal;

    if (contactBtn) contactBtn.addEventListener('click', openModal);

    const openContactModalBtn = document.getElementById('openContactModalBtn');
    if (openContactModalBtn) openContactModalBtn.addEventListener('click', openModal);

    document.querySelectorAll('.btn-get-started').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    });

    function closeModal() {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    if (mobileContactBtn) {
        mobileContactBtn.addEventListener('click', (e) => {
            e.preventDefault();
            closeMobileMenu();
            openModal();
        });
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (closeSuccessModalBtn) closeSuccessModalBtn.addEventListener('click', closeModal);

    if (startProjectBtn) {
        startProjectBtn.addEventListener('click', () => {
            if (step1) step1.classList.add('hidden');
            if (step2) step2.classList.remove('hidden');
        });
    }

    if (backToStep1Btn) {
        backToStep1Btn.addEventListener('click', () => {
            if (step2) step2.classList.add('hidden');
            if (step1) step1.classList.remove('hidden');
        });
    }

    const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbzbUvHSAW_cb1s3kJ9UDQq1Zk-B21DeBGZ0NUKe0qSwqnUZGV_nCInrlK0XKbM59DpoZA/exec";

    if (projectForm) {
        projectForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('projectEmail').value.trim();
            const category = document.getElementById('projectCategory').value;
            const details = document.getElementById('projectDetails').value.trim();
            const page = window.location.pathname.split('/').pop() || 'index.html';

            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!email || !emailRegex.test(email) || email.length > 150) {
                alert("Lütfen geçerli bir e-posta adresi giriniz.");
                return;
            }

            if (!details || details.length > 5000) {
                alert("Lütfen geçerli bir açıklama giriniz (en fazla 5000 karakter).");
                return;
            }

            const sanitizeHTML = (str) => {
                return str
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;")
                    .replace(/'/g, "&#039;")
                    .replace(/\//g, "&#x2F;");
            };

            const sanitizedEmail = sanitizeHTML(email);
            const sanitizedCategory = sanitizeHTML(category);
            const sanitizedDetails = sanitizeHTML(details);
            const sanitizedPage = sanitizeHTML(page);

            const submitBtn = projectForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<svg class="w-5 h-5 animate-spin mx-auto" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>';

            try {
                const res = await fetch(WEBHOOK_URL, {
                    method: "POST",
                    body: JSON.stringify({
                        email: sanitizedEmail,
                        category: sanitizedCategory,
                        details: sanitizedDetails,
                        page: sanitizedPage
                    }),
                });

                const json = await res.json();
                if (json.status === "ok") {
                    if (step2) step2.classList.add('hidden');
                    if (step3) step3.classList.remove('hidden');
                    if (projectForm) projectForm.reset();
                } else {
                    throw new Error(json.message || "Sunucu hatası");
                }
            } catch (err) {
                console.error("Form gönderme hatası:", err);
                alert("Gönderilirken bir hata oluştu. Lütfen tekrar deneyin.");
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
}

// Update Active State of Language Selectors
function updateLanguageSelectors(lang) {
    const selectors = document.querySelectorAll('#languageDropdown [data-lang], #mobileLanguageDropdown [data-lang]');
    selectors.forEach(item => {
        if (item.getAttribute('data-lang') === lang) {
            item.classList.add('active-lang-option');
        } else {
            item.classList.remove('active-lang-option');
        }
    });
}

// Initialize Language Selectors Dropdown Event Listeners
function initLanguageSelector() {
    const languageButton = document.getElementById('languageButton');
    const languageDropdown = document.getElementById('languageDropdown');
    const mobileLanguageButton = document.getElementById('mobileLanguageButton');
    const mobileLanguageDropdown = document.getElementById('mobileLanguageDropdown');

    if (languageButton && languageDropdown) {
        languageButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const isHidden = languageDropdown.classList.toggle('hidden');
            const arrow = languageButton.querySelector('svg');
            if (arrow) {
                if (isHidden) {
                    arrow.classList.remove('rotate-180');
                } else {
                    arrow.classList.add('rotate-180');
                }
            }
            if (mobileLanguageDropdown) {
                mobileLanguageDropdown.classList.add('hidden');
                const mobileArrow = mobileLanguageButton ? mobileLanguageButton.querySelector('svg') : null;
                if (mobileArrow) mobileArrow.classList.remove('rotate-180');
            }
        });
    }

    if (mobileLanguageButton && mobileLanguageDropdown) {
        mobileLanguageButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const isHidden = mobileLanguageDropdown.classList.toggle('hidden');
            const mobileArrow = mobileLanguageButton.querySelector('svg');
            if (mobileArrow) {
                if (isHidden) {
                    mobileArrow.classList.remove('rotate-180');
                } else {
                    mobileArrow.classList.add('rotate-180');
                }
            }
            if (languageDropdown) {
                languageDropdown.classList.add('hidden');
                const arrow = languageButton ? languageButton.querySelector('svg') : null;
                if (arrow) arrow.classList.remove('rotate-180');
            }
        });
    }

    document.addEventListener('click', (e) => {
        if (languageDropdown && !languageDropdown.contains(e.target) &&
            languageButton && !languageButton.contains(e.target)) {
            languageDropdown.classList.add('hidden');
            const arrow = languageButton ? languageButton.querySelector('svg') : null;
            if (arrow) arrow.classList.remove('rotate-180');
        }

        if (mobileLanguageDropdown && !mobileLanguageDropdown.contains(e.target) &&
            mobileLanguageButton && !mobileLanguageButton.contains(e.target)) {
            mobileLanguageDropdown.classList.add('hidden');
            const mobileArrow = mobileLanguageButton.querySelector('svg');
            if (mobileArrow) mobileArrow.classList.remove('rotate-180');
        }
    });

    document.querySelectorAll('[data-lang]').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = button.getAttribute('data-lang');
            if (typeof setLanguage === 'function') {
                setLanguage(lang);
            }
            if (languageDropdown) {
                languageDropdown.classList.add('hidden');
                const arrow = languageButton ? languageButton.querySelector('svg') : null;
                if (arrow) arrow.classList.remove('rotate-180');
            }
            if (mobileLanguageDropdown) {
                mobileLanguageDropdown.classList.add('hidden');
                const mobileArrow = mobileLanguageButton ? mobileLanguageButton.querySelector('svg') : null;
                if (mobileArrow) mobileArrow.classList.remove('rotate-180');
            }
        });
    });
}

// Glowing Curved Tab Controller (Modern CSS Radial Glow Mask Style)
function initCurvedSegmentedTabs(containerId) {
    const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (!container) return;

    const glowIndicator = container.querySelector('.tab-glow-indicator');
    const tabBtns = Array.from(container.querySelectorAll('.tab-btn'));

    if (!glowIndicator || tabBtns.length === 0) return;

    let targetLeft = 0;
    let targetWidth = 0;
    let currentLeft = 0;
    let currentWidth = 0;
    let animFrame = null;

    function getActiveTab() {
        return container.querySelector('.tab-btn.active-tab') || tabBtns[0];
    }

    function updatePositions() {
        const activeTab = getActiveTab();
        const containerRect = container.getBoundingClientRect();
        const tabRect = activeTab.getBoundingClientRect();

        targetLeft = tabRect.left - containerRect.left;
        targetWidth = tabRect.width;

        if (currentLeft === 0 && currentWidth === 0) {
            currentLeft = targetLeft;
            currentWidth = targetWidth;
        }
    }

    function animate() {
        currentLeft += (targetLeft - currentLeft) * 0.16;
        currentWidth += (targetWidth - currentWidth) * 0.16;

        glowIndicator.style.left = `${currentLeft.toFixed(1)}px`;
        glowIndicator.style.width = `${currentWidth.toFixed(1)}px`;

        const delta = Math.abs(targetLeft - currentLeft) + Math.abs(targetWidth - currentWidth);

        if (delta > 0.02) {
            animFrame = requestAnimationFrame(animate);
        } else {
            animFrame = null;
        }
    }

    function startAnim() {
        if (!animFrame) {
            animFrame = requestAnimationFrame(animate);
        }
    }

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => {
                b.classList.remove('active-tab', 'text-white', 'font-semibold');
                b.classList.add('text-zinc-400', 'font-medium');
            });
            btn.classList.add('active-tab', 'text-white', 'font-semibold');
            btn.classList.remove('text-zinc-400', 'font-medium');

            updatePositions();
            startAnim();
        });
    });

    window.addEventListener('resize', () => {
        updatePositions();
        startAnim();
    });

    setTimeout(() => {
        updatePositions();
        startAnim();
    }, 30);
}

// Interactive Card Cursor Spotlight Glow Controller
function initCardSpotlightGlow() {
    const updateSpotlight = (e) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    };

    const attachListeners = () => {
        const cards = document.querySelectorAll('.product-card, .service-card, .spotlight-card, .opsbare-showcase-box');
        cards.forEach(card => {
            if (!card.dataset.spotlightBound) {
                card.dataset.spotlightBound = 'true';
                card.addEventListener('mousemove', updateSpotlight);
            }
        });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', attachListeners);
    } else {
        attachListeners();
    }
}

initCardSpotlightGlow();

// Animated Parallelogram (-15deg) Navbar Sliding Active Indicator Controller
function initNavSlidingIndicator() {
    const container = document.getElementById('navTabsContainer');
    const indicator = document.getElementById('navSlidingIndicator');
    if (!container || !indicator) return;

    const links = container.querySelectorAll('.nav-link-item:not(#contactBtn):not([data-nav="contact"])');
    let activeLink = container.querySelector('.active-nav-item') || links[0];

    const bgBeam = document.getElementById('navBgBeam');

    function moveIndicatorTo(el) {
        if (!el) return;
        const containerRect = container.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();

        const insetLeft = 10;
        const insetRight = 4;
        const localLeft = (elRect.left - containerRect.left) + insetLeft;
        const width = Math.max(elRect.width - insetLeft - insetRight, 20);

        indicator.style.left = `${localLeft}px`;
        indicator.style.width = `${width}px`;
        indicator.style.opacity = '1';

        if (bgBeam) {
            const tan15 = Math.tan(15 * Math.PI / 180);
            const beamLeftAtTop = (elRect.left + insetLeft) + (elRect.top * tan15);

            bgBeam.style.left = `${beamLeftAtTop}px`;
            bgBeam.style.width = `${width}px`;
            bgBeam.style.opacity = '1';
        }
    }

    const updatePosition = () => moveIndicatorTo(activeLink);

    // Initial triggers to ensure DOM measurements are accurate
    updatePosition();
    setTimeout(updatePosition, 50);
    setTimeout(updatePosition, 250);

    links.forEach(link => {
        link.addEventListener('click', () => {
            activeLink = link;
            links.forEach(l => l.classList.remove('active-nav-item'));
            link.classList.add('active-nav-item');
            moveIndicatorTo(link);
        });
    });

    window.updateNavSlidingIndicator = updatePosition;
    window.addEventListener('resize', updatePosition);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initMobileMenu();
        initNavSlidingIndicator();
    });
} else {
    initMobileMenu();
    initNavSlidingIndicator();
}

