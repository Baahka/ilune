/**
 * ILUNE STUDIO - PORTFOLIO WEBSITE
 * Vanilla JavaScript - Interactive Features
 */

// ============================================
// GLOBAL VARIABLES
// ============================================
const CARD_COUNT = 12;
const ROTATION_PER_CARD = 360 / CARD_COUNT;
const CAMERA_DISTANCE = 550;

// ============================================
// DOM ELEMENTS
// ============================================
const header = document.getElementById('header');
const nav = document.querySelector('.nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelectorAll('.nav__link');
const carousel = document.getElementById('carousel');
const scene = document.getElementById('scene');
const modal = document.getElementById('modal');
const modalBackdrop = document.getElementById('modalBackdrop');
const modalClose = document.getElementById('modalClose');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');

// ============================================
// HERO CARD DATA (for 3D cylinder)
// ============================================
const cardData = [
    { icon: 'gamepad-2', title: 'Quiz Show', category: 'Quiz' },
    { icon: 'puzzle', title: 'Puzzle Master', category: 'Puzzle' },
    { icon: 'brain', title: 'Mind Lab', category: 'Simulacao' },
    { icon: 'target', title: 'Target Learn', category: 'Treinamento' },
    { icon: 'sparkles', title: 'Story Quest', category: 'Narrativa' },
    { icon: 'zap', title: 'Flash Cards', category: 'Memorizacao' },
    { icon: 'map', title: 'Explorer', category: 'Exploracao' },
    { icon: 'users', title: 'Team Play', category: 'Colaborativo' },
    { icon: 'trophy', title: 'Challenge', category: 'Competicao' },
    { icon: 'lightbulb', title: 'Idea Lab', category: 'Criativo' },
    { icon: 'monitor', title: 'SimuPro', category: 'Profissional' },
    { icon: 'rocket', title: 'Launch Pad', category: 'Onboarding' }
];

// ============================================
// PROJECT DATA (for modal)
// ============================================
const projectData = [
    {
        title: 'Simulacao Interativa',
        desc: 'Experiencia gamificada com foco em tomada de decisao. O usuario navega por cenarios realistas onde cada escolha influencia o desfecho, promovendo aprendizagem ativa e engajamento.',
        iframeUrl: null
    },
    {
        title: 'Treinamento SCORM',
        desc: 'Conteudo educacional com interacoes e feedback dinamico. Modulo compativel com LMS que rastreia progresso, pontuacao e tempo de interacao do aluno.',
        iframeUrl: null
    },
    {
        title: 'Jogo Educacional',
        desc: 'Estrutura baseada em mecanicas de jogo para aprendizagem. Sistema de pontos, conquistas e niveis que motivam o progresso do aluno de forma natural e divertida.',
        iframeUrl: null
    }
];

// ============================================
// INIT - Run when DOM is ready
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    lucide.createIcons();

    // Build hero 3D cards
    buildHeroCards();

    // Initialize 3D cylinder
    initCylinder();

    // Initialize scroll effects
    initScrollEffects();

    // Initialize navigation
    initNavigation();

    // Initialize modal
    initModal();

    // Initialize GSAP animations
    initGsapAnimations();
});

// ============================================
// BUILD HERO 3D CARDS
// ============================================
function buildHeroCards() {
    if (!carousel) return;

    carousel.innerHTML = '';

    cardData.forEach((card, index) => {
        const cardEl = document.createElement('div');
        cardEl.className = 'card';

        const angle = index * ROTATION_PER_CARD;
        cardEl.style.transform = `rotateY(${angle}deg) translateZ(380px)`;

        cardEl.innerHTML = `
            <div class="card__icon">
                <i data-lucide="${card.icon}"></i>
            </div>
            <h4 class="card__title">${card.title}</h4>
            <span class="card__category">${card.category}</span>
        `;

        carousel.appendChild(cardEl);
    });

    // Re-initialize Lucide for new icons
    lucide.createIcons();
}

// ============================================
// 3D CARD CYLINDER ANIMATION
// ============================================
function initCylinder() {
    if (!carousel || !scene) return;

    let baseRotation = 0;
    let velocity = 0.3;
    let targetVelocity = 0.3;
    let isHovering = false;
    let animationFrameId;

    // Animation loop
    function animate() {
        if (isHovering) {
            targetVelocity += (1.2 - targetVelocity) * 0.05;
        } else {
            targetVelocity += (0.3 - targetVelocity) * 0.05;
        }

        velocity += (targetVelocity - velocity) * 0.05;
        baseRotation += velocity;

        carousel.style.transform = `translateZ(-${CAMERA_DISTANCE}px) rotateY(${baseRotation}deg)`;

        animationFrameId = requestAnimationFrame(animate);
    }

    // Wheel event for scroll acceleration
    window.addEventListener('wheel', (e) => {
        const delta = e.deltaY || e.detail;
        baseRotation += (delta * 0.1) + velocity;
    }, { passive: true });

    // Hover events
    scene.addEventListener('mouseenter', () => { isHovering = true; });
    scene.addEventListener('mouseleave', () => { isHovering = false; });

    // Touch events for mobile
    let touchStartY = 0;
    scene.addEventListener('touchstart', (e) => {
        isHovering = true;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    scene.addEventListener('touchmove', (e) => {
        const touchY = e.touches[0].clientY;
        const delta = touchStartY - touchY;
        baseRotation += delta * 0.3;
        touchStartY = touchY;
    }, { passive: true });

    scene.addEventListener('touchend', () => { isHovering = false; }, { passive: true });

    // Start animation
    animate();
}

// ============================================
// HEADER SCROLL EFFECTS
// ============================================
function initScrollEffects() {
    let ticking = false;

    function updateHeader() {
        const scrollY = window.scrollY;

        if (scrollY > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }

        updateActiveNavLink(scrollY);
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }, { passive: true });

    // Initial check
    updateHeader();
}

// ============================================
// NAVIGATION
// ============================================
function initNavigation() {
    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        nav.classList.toggle('nav--open');
    });

    // Close mobile menu on link click + smooth scroll
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            nav.classList.remove('nav--open');

            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(targetId);
                if (target) {
                    const offset = 100;
                    const top = target.getBoundingClientRect().top + window.scrollY - offset;
                    window.scrollTo({ top: top, behavior: 'smooth' });
                }
            }
        });
    });

    // CTA button
    const navCta = document.getElementById('navCta');
    if (navCta) {
        navCta.addEventListener('click', () => {
            const contato = document.getElementById('contato');
            if (contato) {
                const offset = 100;
                const top = contato.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    }
}

// ============================================
// UPDATE ACTIVE NAV LINK
// ============================================
function updateActiveNavLink(scrollY) {
    const sections = document.querySelectorAll('section[id]');
    const headerOffset = 150;

    sections.forEach(section => {
        const sectionTop = section.offsetTop - headerOffset;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ============================================
// GSAP ANIMATIONS
// ============================================
function initGsapAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Hero entrance animations
    gsap.from('.hero__badge', {
        opacity: 0, y: 30, duration: 0.8, delay: 0.2, ease: 'back.out(1.7)'
    });

    gsap.from('.hero__title-line', {
        opacity: 0, y: 40, duration: 0.8, stagger: 0.15, delay: 0.4, ease: 'back.out(1.7)'
    });

    gsap.from('.hero__subtitle', {
        opacity: 0, y: 30, duration: 0.8, delay: 0.8, ease: 'power2.out'
    });

    gsap.from('.hero__cta', {
        opacity: 0, y: 20, duration: 0.6, delay: 1, ease: 'back.out(1.7)'
    });

    // Sobre paragraphs - staggered fade in
    gsap.from('.sobre__paragraph', {
        scrollTrigger: { trigger: '.sobre__text', start: 'top 85%', toggleActions: 'play none none none' },
        opacity: 0, y: 40, duration: 0.7, stagger: 0.12, ease: 'power2.out'
    });

    // Skills card
    gsap.from('.sobre__skills-card', {
        scrollTrigger: { trigger: '.sobre__skills', start: 'top 85%', toggleActions: 'play none none none' },
        opacity: 0, y: 50, scale: 0.95, duration: 0.8, ease: 'back.out(1.4)'
    });

    // Section headers
    document.querySelectorAll('.sobre__header, .projetos__header, .solucoes__header, .destaques__header, .contato__title').forEach(hdr => {
        gsap.from(hdr, {
            scrollTrigger: { trigger: hdr, start: 'top 90%', toggleActions: 'play none none none' },
            opacity: 0, y: 30, duration: 0.6, ease: 'power2.out'
        });
    });

    // Projects cards - THE KEY FIX: ensure opacity starts at 0 and animates to 1
    gsap.fromTo('.projetos__card',
        { opacity: 0, y: 60, scale: 0.95 },
        {
            scrollTrigger: { trigger: '.projetos__cards', start: 'top 85%', toggleActions: 'play none none none' },
            opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.15, ease: 'back.out(1.4)'
        }
    );

    // Solutions items
    gsap.fromTo('.solucoes__item',
        { opacity: 0, y: 50 },
        {
            scrollTrigger: { trigger: '.solucoes__grid', start: 'top 85%', toggleActions: 'play none none none' },
            opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'back.out(1.4)'
        }
    );

    // Destaques items
    document.querySelectorAll('.destaques__item').forEach((item, index) => {
        const fromX = index % 2 === 0 ? -60 : 60;
        gsap.fromTo(item,
            { opacity: 0, x: fromX },
            {
                scrollTrigger: { trigger: item, start: 'top 85%', toggleActions: 'play none none none' },
                opacity: 1, x: 0, duration: 0.9, ease: 'power2.out'
            }
        );
    });

    // Contact cards
    gsap.fromTo('.contato__card',
        { opacity: 0, y: 40, scale: 0.95 },
        {
            scrollTrigger: { trigger: '.contato__grid', start: 'top 85%', toggleActions: 'play none none none' },
            opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.1, ease: 'back.out(1.4)'
        }
    );

    // Project titles cycling effect
    const titleItems = document.querySelectorAll('.projetos__title-item');
    if (titleItems.length > 0) {
        ScrollTrigger.create({
            trigger: '.projetos',
            start: 'top center',
            end: 'bottom center',
            onUpdate: (self) => {
                const progress = self.progress;
                const activeIndex = Math.min(Math.floor(progress * titleItems.length), titleItems.length - 1);
                titleItems.forEach((item, index) => {
                    item.classList.toggle('active', index === activeIndex);
                });
            }
        });
    }
}

// ============================================
// MODAL
// ============================================
function initModal() {
    const projectBtns = document.querySelectorAll('.projetos__card-btn');

    projectBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const projectIndex = parseInt(btn.dataset.project);
            openModal(projectIndex);
        });
    });

    modalBackdrop.addEventListener('click', closeModal);
    modalClose.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

function openModal(projectIndex) {
    const project = projectData[projectIndex];
    if (!project) return;

    modalTitle.textContent = project.title;
    modalDesc.textContent = project.desc;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (!targetId || targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            const offset = 100;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: top, behavior: 'smooth' });
        }
    });
});

// ============================================
// PARALLAX EFFECT ON HERO GLOW ELEMENTS
// ============================================
window.addEventListener('mousemove', (e) => {
    const glow1 = document.querySelector('.hero__glow--1');
    const glow2 = document.querySelector('.hero__glow--2');

    if (!glow1 || !glow2) return;
    if (window.innerWidth < 768) return;

    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;

    glow1.style.transform = `translate(${x * 30}px, ${y * 20}px)`;
    glow2.style.transform = `translate(${x * -20}px, ${y * -15}px)`;
});

// ============================================
// HERO SCROLL HINT FADE OUT
// ============================================
window.addEventListener('scroll', () => {
    const scrollHint = document.querySelector('.hero__scroll-hint');
    if (!scrollHint) return;

    const scrollY = window.scrollY;
    scrollHint.style.opacity = Math.max(0, 1 - scrollY / 200);
}, { passive: true });
