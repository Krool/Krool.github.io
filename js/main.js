// ============================================
// KROOL WORLD - MINIMAL JS
// Clean, purposeful interactions only
// ============================================

// Mark JS as loaded for progressive enhancement
document.body.classList.add('js-loaded');

// Theme Toggle (dark mode default)
const themeToggle = document.getElementById('themeToggle');
const storedTheme = localStorage.getItem('theme');

// Apply stored theme or default to dark
if (storedTheme === 'light') {
    document.body.classList.add('light-mode');
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
}

// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

function closeMobileMenu() {
    navToggle.classList.remove('active');
    navLinks.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
}

if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('active');
        navToggle.classList.toggle('active');
        navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        document.body.classList.toggle('menu-open', isOpen);
    });

    // Close mobile menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => closeMobileMenu());
    });

    // Close mobile menu with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            closeMobileMenu();
            navToggle.focus();
        }
    });
}

// Navbar scroll effect
const navbar = document.querySelector('.navbar');

if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Scroll animations using Intersection Observer
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('.tank, .section-title, .project-card').forEach(el => {
    observer.observe(el);
});

// Active nav link tracking
const sections = document.querySelectorAll('.section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navAnchors.forEach(a => a.classList.remove('active'));
            const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
            if (active) active.classList.add('active');
        }
    });
}, { rootMargin: '-30% 0px -70% 0px' });

sections.forEach(s => sectionObserver.observe(s));

// CSS scroll-behavior: smooth handles anchor scrolling natively

// ============================================
// ASCII FISH TANK
// ============================================
(function() {
    const el = document.getElementById('fishTank');
    if (!el) return;

    const W = 72;
    const H = 12;
    const EMPTY = ' ';

    // Fish shapes: [body, direction]
    const FISH_R = ['><>', '><))°>', '>°>', '>=>'];
    const FISH_L = ['<><', '<°((><', '<°<', '<=<'];

    const fish = [];
    const bubbles = [];

    // Seaweed anchors along the bottom
    const weeds = [];
    for (let i = 0; i < 6; i++) {
        weeds.push({
            x: 4 + Math.floor(Math.random() * (W - 8)),
            phase: Math.random() * Math.PI * 2
        });
    }

    // Spawn fish
    for (let i = 0; i < 6; i++) {
        spawnFish();
    }

    function spawnFish() {
        const dir = Math.random() < 0.5 ? 1 : -1;
        const shapes = dir === 1 ? FISH_R : FISH_L;
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        fish.push({
            x: dir === 1 ? -shape.length : W,
            y: 1 + Math.floor(Math.random() * (H - 3)),
            dir: dir,
            speed: 0.15 + Math.random() * 0.25,
            shape: shape
        });
    }

    // Title text centered on top border
    const title = ' krool.world ';

    let tick = 0;

    function render() {
        // Build grid
        const grid = [];
        for (let r = 0; r < H; r++) {
            grid[r] = new Array(W).fill(EMPTY);
        }

        // Draw seaweed (bottom 2-3 chars, swaying)
        const t = tick * 0.04;
        weeds.forEach(w => {
            const sway = Math.sin(t + w.phase);
            const height = 2 + Math.floor(Math.abs(Math.sin(w.phase * 2)) * 2);
            for (let i = 0; i < height; i++) {
                const row = H - 2 - i;
                const offset = i > 0 ? Math.round(sway * (i * 0.5)) : 0;
                const col = w.x + offset;
                if (row >= 1 && row < H - 1 && col >= 1 && col < W - 1) {
                    grid[row][col] = i % 2 === 0 ? ')' : '(';
                }
            }
        });

        // Sand/gravel bottom
        for (let c = 1; c < W - 1; c++) {
            grid[H - 2][c] = grid[H - 2][c] !== EMPTY ? grid[H - 2][c] : ['.',',','.','_','.'][c % 5];
        }

        // Draw bubbles
        bubbles.forEach(b => {
            const col = Math.round(b.x);
            const row = Math.round(b.y);
            if (row >= 1 && row < H - 1 && col >= 1 && col < W - 1) {
                grid[row][col] = b.size > 0.5 ? 'O' : 'o';
            }
        });

        // Draw fish
        fish.forEach(f => {
            const startX = Math.round(f.x);
            for (let i = 0; i < f.shape.length; i++) {
                const col = startX + i;
                if (col >= 1 && col < W - 1 && f.y >= 1 && f.y < H - 2) {
                    grid[f.y][col] = f.shape[i];
                }
            }
        });

        // Draw border
        // Top
        const topBorder = new Array(W).fill('-');
        topBorder[0] = '+';
        topBorder[W - 1] = '+';
        // Embed title
        const titleStart = Math.floor((W - title.length) / 2);
        for (let i = 0; i < title.length; i++) {
            topBorder[titleStart + i] = title[i];
        }
        grid[0] = topBorder;

        // Bottom
        const botBorder = new Array(W).fill('-');
        botBorder[0] = '+';
        botBorder[W - 1] = '+';
        grid[H - 1] = botBorder;

        // Sides
        for (let r = 1; r < H - 1; r++) {
            grid[r][0] = '|';
            grid[r][W - 1] = '|';
        }

        el.textContent = grid.map(row => row.join('')).join('\n');
    }

    function update() {
        tick++;

        // Move fish
        for (let i = fish.length - 1; i >= 0; i--) {
            const f = fish[i];
            f.x += f.speed * f.dir;

            // Spawn bubble occasionally
            if (Math.random() < 0.01) {
                const bx = f.dir === 1 ? Math.round(f.x) : Math.round(f.x + f.shape.length - 1);
                bubbles.push({ x: bx, y: f.y - 1, size: Math.random(), drift: (Math.random() - 0.5) * 0.3 });
            }

            // Remove if off screen, respawn
            if ((f.dir === 1 && f.x > W + 2) || (f.dir === -1 && f.x < -f.shape.length - 2)) {
                fish.splice(i, 1);
                spawnFish();
            }
        }

        // Move bubbles
        for (let i = bubbles.length - 1; i >= 0; i--) {
            const b = bubbles[i];
            b.y -= 0.1 + Math.random() * 0.05;
            b.x += b.drift * 0.1;
            if (b.y < 1) {
                bubbles.splice(i, 1);
            }
        }

        render();
        requestAnimationFrame(update);
    }

    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        render();
    } else {
        update();
    }
})();
