const CARD_COUNT = 12;
const ROTATION_PER_CARD = 360 / CARD_COUNT;
const CAMERA_DISTANCE = 550;

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

const cardData = [
    { icon: 'rocket', title: 'Team Play', category: 'Dinamica' },
    { icon: 'hourglass', title: 'Challenge', category: 'Gamificacao' },
    { icon: 'mic', title: 'Melee Lab', category: 'Conteudo' },
    { icon: 'brain', title: 'Mind Lab', category: 'Simulacao' },
    { icon: 'target', title: 'Target Learn', category: 'Treinamento' },
    { icon: 'sparkles', title: 'Story Quest', category: 'Narrativa' },
    { icon: 'zap', title: 'Flash Cards', category: 'Memorizacao' },
    { icon: 'map', title: 'Explorer', category: 'Exploracao' },
    { icon: 'users', title: 'Guild Tasks', category: 'Colaborativo' },
    { icon: 'trophy', title: 'Ranking', category: 'Competicao' },
    { icon: 'lightbulb', title: 'Idea Lab', category: 'Criativo' },
    { icon: 'monitor', title: 'SimuPro', category: 'Profissional' }
];

const projectData = [
    {
        title: 'Simulacao Interativa',
        desc: 'Experiencia gamificada com foco em tomada de decisao. O usuario navega por cenarios realistas onde cada escolha influencia o desfecho, promovendo aprendizagem ativa e engajamento.'
    },
    {
        title: 'Treinamento SCORM',
        desc: 'Conteudo educacional com interacoes e feedback dinamico. Modulo compativel com LMS que rastreia progresso, pontuacao e tempo de interacao do aluno.'
    },
    {
        title: 'Jogo Educacional',
        desc: 'Estrutura baseada em mecanicas de jogo para aprendizagem. Sistema de pontos, conquistas e niveis que motivam o progresso do aluno de forma natural e divertida.'
    }
];

document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) lucide.createIcons();
    buildFxLayer();
    buildHeroCards();
    initCylinder();
    initScrollEffects();
    initNavigation();
    initModal();
    initGsapAnimations();
    initRevealFallback();
});

function buildFxLayer() {
    const fx = document.createElement('div');
    fx.className = 'bg-particles';

    for (let i = 0; i < 52; i += 1) {
        const p = document.createElement('span');
        p.style.left = `${Math.random() * 100}%`;
        p.style.top = `${Math.random() * 110 + 5}%`;
        p.style.setProperty('--dur', `${10 + Math.random() * 16}s`);
        p.style.setProperty('--delay', `${-Math.random() * 16}s`);
        p.style.opacity = (0.3 + Math.random() * 0.6).toFixed(2);
        fx.appendChild(p);
    }

    document.body.prepend(fx);
}

function buildHeroCards() {
    if (!carousel) return;
    carousel.innerHTML = '';

    cardData.forEach((card, index) => {
        const cardEl = document.createElement('div');
        cardEl.className = 'card';
        cardEl.style.transform = `rotateY(${index * ROTATION_PER_CARD}deg) translateZ(380px)`;
        cardEl.innerHTML = `
            <div class="card__icon"><i data-lucide="${card.icon}"></i></div>
            <h4 class="card__title">${card.title}</h4>
            <span class="card__category">${card.category}</span>
        `;
        carousel.appendChild(cardEl);
    });

    if (window.lucide) lucide.createIcons();
}

function initCylinder() {
    if (!carousel || !scene) return;

    let baseRotation = 0;
    let velocity = 0.28;
    let targetVelocity = 0.28;
    let isHovering = false;

    const animate = () => {
        targetVelocity += ((isHovering ? 0.92 : 0.28) - targetVelocity) * 0.05;
        velocity += (targetVelocity - velocity) * 0.05;
        baseRotation += velocity;
        carousel.style.transform = `translateZ(-${CAMERA_DISTANCE}px) rotateY(${baseRotation}deg)`;
        requestAnimationFrame(animate);
    };

    window.addEventListener('wheel', (e) => {
        const delta = e.deltaY || e.detail;
        baseRotation += (delta * 0.08) + velocity;
    }, { passive: true });

    scene.addEventListener('mouseenter', () => { isHovering = true; });
    scene.addEventListener('mouseleave', () => { isHovering = false; });

    let touchStartY = 0;
    scene.addEventListener('touchstart', (e) => {
        isHovering = true;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    scene.addEventListener('touchmove', (e) => {
        const touchY = e.touches[0].clientY;
        baseRotation += (touchStartY - touchY) * 0.3;
        touchStartY = touchY;
    }, { passive: true });

    scene.addEventListener('touchend', () => { isHovering = false; }, { passive: true });
    animate();
}

function initScrollEffects() {
    if (!header) return;
    let ticking = false;

    const updateHeader = () => {
        const scrollY = window.scrollY;
        header.classList.toggle('header--scrolled', scrollY > 40);
        updateActiveNavLink(scrollY);
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }, { passive: true });

    updateHeader();
}

function initNavigation() {
    if (navToggle && nav) {
        navToggle.addEventListener('click', () => {
            nav.classList.toggle('nav--open');
        });
    }

    navLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            if (nav) nav.classList.remove('nav--open');

            const targetId = link.getAttribute('href');
            if (!targetId || !targetId.startsWith('#')) return;

            const target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();
            const top = target.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

    const navCta = document.getElementById('navCta');
    if (navCta) {
        navCta.addEventListener('click', () => {
            const contato = document.getElementById('contato');
            if (!contato) return;
            const top = contato.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    }
}

function updateActiveNavLink(scrollY) {
    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => {
        const sectionTop = section.offsetTop - 160;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`));
        }
    });
}

function initGsapAnimations() {
    if (!window.gsap || !window.ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);

    gsap.from('.hero__badge', { opacity: 0, y: 30, duration: 0.8, delay: 0.1, ease: 'power3.out' });
    gsap.from('.hero__title-line', { opacity: 0, y: 34, duration: 0.8, stagger: 0.14, delay: 0.2, ease: 'power3.out' });
    gsap.from('.hero__subtitle', { opacity: 0, y: 22, duration: 0.6, delay: 0.7, ease: 'power3.out' });
    gsap.from('.hero__cta', { opacity: 0, y: 18, duration: 0.6, delay: 0.84, ease: 'power3.out' });

    gsap.utils.toArray('.sobre__paragraph, .sobre__skills-card, .projetos__card, .solucoes__item, .destaques__item, .contato__card').forEach((el) => {
        gsap.from(el, {
            scrollTrigger: { trigger: el, start: 'top 90%' },
            opacity: 0,
            y: 34,
            duration: 0.72,
            ease: 'power2.out'
        });
    });

    const titleItems = document.querySelectorAll('.projetos__title-item');
    if (titleItems.length > 0) {
        ScrollTrigger.create({
            trigger: '.projetos',
            start: 'top center',
            end: 'bottom center',
            onUpdate: (self) => {
                const activeIndex = Math.min(Math.floor(self.progress * titleItems.length), titleItems.length - 1);
                titleItems.forEach((item, index) => item.classList.toggle('active', index === activeIndex));
            }
        });
    }
}

function initRevealFallback() {
    const revealItems = document.querySelectorAll('.sobre__paragraph, .sobre__skills-card, .projetos__card, .solucoes__item, .destaques__item, .contato__card');
    revealItems.forEach((el) => el.classList.add('reveal-on-scroll'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.14 });

    revealItems.forEach((el) => observer.observe(el));
}

function initModal() {
    if (!modal || !modalBackdrop || !modalClose || !modalTitle || !modalDesc) return;

    const projectBtns = document.querySelectorAll('.projetos__card-btn');
    projectBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const projectIndex = parseInt(btn.dataset.project, 10);
            openModal(projectIndex);
        });
    });

    modalBackdrop.addEventListener('click', closeModal);
    modalClose.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });
}

function openModal(projectIndex) {
    const project = projectData[projectIndex];
    if (!project || !modal || !modalTitle || !modalDesc) return;
    modalTitle.textContent = project.title;
    modalDesc.textContent = project.desc;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (!targetId || targetId === '#') return;
        const target = document.querySelector(targetId);
        if (!target) return;
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});

window.addEventListener('mousemove', (e) => {
    const glow1 = document.querySelector('.hero__glow--1');
    const glow2 = document.querySelector('.hero__glow--2');
    if (!glow1 || !glow2 || window.innerWidth < 768) return;

    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    glow1.style.transform = `translate(${x * 24}px, ${y * 18}px)`;
    glow2.style.transform = `translate(${x * -18}px, ${y * -12}px)`;
});

window.addEventListener('scroll', () => {
    const scrollHint = document.querySelector('.hero__scroll-hint');
    if (!scrollHint) return;
    scrollHint.style.opacity = String(Math.max(0, 1 - window.scrollY / 220));
}, { passive: true });
