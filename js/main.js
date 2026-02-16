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

    // Dynamic width based on container
    function getWidth() {
        const ch = parseFloat(getComputedStyle(el).fontSize) * 0.6;
        return Math.floor(el.parentElement.clientWidth / ch);
    }

    let W = Math.max(40, Math.min(getWidth(), 120));
    const H = 14;
    const SP = ' ';

    const title = ' krool.world ';

    // --- Creature definitions ---
    // Fish
    const FISH_R = ['><>', '><))°>', '>°>', '=>>'];
    const FISH_L = ['<><', '<°((><', '<°<', '<<='];
    // Jellyfish frames (2-tall, animates tentacles)
    const JELLY_A = [' oo', '/||\\'];
    const JELLY_B = [' oo', '\\||/'];
    // Shark (right only, patrols)
    const SHARK_R = '|\\><))))))>';
    const SHARK_L = '<((((((><|/';

    // --- State arrays ---
    const creatures = [];
    const bubbles = [];
    const weeds = [];
    const stars = []; // starfish on the floor

    // Treasure chest (static decoration)
    const chest = { x: 0 };

    function init() {
        creatures.length = 0;
        bubbles.length = 0;
        weeds.length = 0;
        stars.length = 0;

        W = Math.max(40, Math.min(getWidth(), 120));

        // Seaweed
        const numWeeds = Math.max(4, Math.floor(W / 12));
        for (let i = 0; i < numWeeds; i++) {
            weeds.push({
                x: 3 + Math.floor(Math.random() * (W - 6)),
                height: 2 + Math.floor(Math.random() * 3),
                phase: Math.random() * Math.PI * 2
            });
        }

        // Starfish on floor
        const numStars = Math.max(1, Math.floor(W / 25));
        for (let i = 0; i < numStars; i++) {
            stars.push({ x: 5 + Math.floor(Math.random() * (W - 10)) });
        }

        // Treasure chest
        chest.x = Math.floor(W * 0.7);

        // Fish (swim across)
        const numFish = Math.max(3, Math.floor(W / 16));
        for (let i = 0; i < numFish; i++) spawnFish(true);

        // One crab
        spawnCrab();

        // One jellyfish
        spawnJelly(true);

        // One shark (if wide enough)
        if (W >= 60) spawnShark(true);

        // One eel
        spawnEel(true);
    }

    function randRow(top, bot) {
        return top + Math.floor(Math.random() * (bot - top));
    }

    function spawnFish(scatter) {
        const dir = Math.random() < 0.5 ? 1 : -1;
        const shapes = dir === 1 ? FISH_R : FISH_L;
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        creatures.push({
            type: 'fish', shape, dir,
            x: scatter ? Math.floor(Math.random() * W) : (dir === 1 ? -shape.length : W),
            y: randRow(1, H - 4),
            speed: 0.03 + Math.random() * 0.05
        });
    }

    function spawnCrab() {
        creatures.push({
            type: 'crab',
            x: Math.floor(W * 0.3),
            y: H - 3,
            dir: 1,
            speed: 0.02,
            frame: 0
        });
    }

    function spawnJelly(scatter) {
        creatures.push({
            type: 'jelly',
            x: scatter ? 5 + Math.floor(Math.random() * (W - 10)) : 5 + Math.floor(Math.random() * (W - 10)),
            y: randRow(2, H - 6),
            phase: Math.random() * Math.PI * 2,
            drift: (Math.random() - 0.5) * 0.01
        });
    }

    function spawnShark(scatter) {
        const dir = Math.random() < 0.5 ? 1 : -1;
        const shape = dir === 1 ? SHARK_R : SHARK_L;
        creatures.push({
            type: 'shark', shape, dir,
            x: scatter ? Math.floor(Math.random() * (W - shape.length)) : (dir === 1 ? -shape.length : W),
            y: randRow(1, 3),
            speed: 0.04 + Math.random() * 0.02
        });
    }

    function spawnEel(scatter) {
        const dir = Math.random() < 0.5 ? 1 : -1;
        creatures.push({
            type: 'eel', dir,
            x: scatter ? Math.floor(Math.random() * W) : (dir === 1 ? -12 : W),
            y: randRow(H - 5, H - 3),
            speed: 0.02 + Math.random() * 0.02,
            phase: Math.random() * Math.PI * 2
        });
    }

    let tick = 0;

    function stamp(grid, row, col, str) {
        for (let i = 0; i < str.length; i++) {
            const c = col + i;
            if (c >= 1 && c < W - 1 && row >= 1 && row < H - 1) {
                grid[row][c] = str[i];
            }
        }
    }

    function render() {
        const grid = [];
        for (let r = 0; r < H; r++) grid[r] = new Array(W).fill(SP);

        const t = tick * 0.015;

        // --- Decorations ---

        // Sand
        for (let c = 1; c < W - 1; c++) {
            grid[H - 2][c] = ['.',',',' ','.',',','_','.'][c % 7];
        }

        // Seaweed
        weeds.forEach(w => {
            const sway = Math.sin(t * 2 + w.phase);
            for (let i = 0; i < w.height; i++) {
                const row = H - 3 - i;
                const offset = i > 0 ? Math.round(sway * (i * 0.4)) : 0;
                const col = w.x + offset;
                if (row >= 1 && row < H - 1 && col >= 1 && col < W - 1) {
                    grid[row][col] = i % 2 === 0 ? ')' : '(';
                }
            }
        });

        // Starfish
        stars.forEach(s => {
            if (s.x >= 1 && s.x < W - 1) {
                grid[H - 3][s.x] = '*';
            }
        });

        // Treasure chest on the floor
        if (chest.x + 4 < W - 1 && chest.x >= 1) {
            stamp(grid, H - 4, chest.x, '____');
            stamp(grid, H - 3, chest.x, '|$$|');
        }

        // --- Bubbles ---
        bubbles.forEach(b => {
            const col = Math.round(b.x);
            const row = Math.round(b.y);
            if (row >= 1 && row < H - 2 && col >= 1 && col < W - 1) {
                grid[row][col] = b.big ? 'O' : 'o';
            }
        });

        // --- Creatures ---
        creatures.forEach(c => {
            const cx = Math.round(c.x);

            if (c.type === 'fish' || c.type === 'shark') {
                stamp(grid, c.y, cx, c.shape);
            }

            if (c.type === 'crab') {
                // Crab alternates claws
                const frame = Math.floor(tick * 0.03) % 2;
                const crab = frame === 0 ? 'V(..)V' : 'v(..)v';
                stamp(grid, c.y, cx, crab);
            }

            if (c.type === 'jelly') {
                const frame = Math.floor(tick * 0.02) % 2;
                const lines = frame === 0 ? JELLY_A : JELLY_B;
                lines.forEach((ln, i) => stamp(grid, Math.round(c.y) + i, cx, ln));
            }

            if (c.type === 'eel') {
                // Eel: sinuous body
                const len = 10;
                const eelChar = c.dir === 1 ? '~' : '~';
                const headR = ':>';
                const headL = '<:';
                for (let i = 0; i < len; i++) {
                    const wobble = Math.round(Math.sin(t * 3 + i * 0.8 + c.phase) * 0.6);
                    const col = cx + (c.dir === 1 ? i : -i);
                    const row = c.y + wobble;
                    if (col >= 1 && col < W - 1 && row >= 1 && row < H - 2) {
                        grid[row][col] = eelChar;
                    }
                }
                // Head
                const headX = c.dir === 1 ? cx + len : cx - len;
                const head = c.dir === 1 ? headR : headL;
                stamp(grid, c.y, headX, head);
            }
        });

        // --- Border ---
        const top = new Array(W).fill('~');
        top[0] = '+';
        top[W - 1] = '+';
        const ts = Math.floor((W - title.length) / 2);
        for (let i = 0; i < title.length; i++) top[ts + i] = title[i];
        grid[0] = top;

        const bot = new Array(W).fill('~');
        bot[0] = '+';
        bot[W - 1] = '+';
        grid[H - 1] = bot;

        for (let r = 1; r < H - 1; r++) {
            grid[r][0] = '|';
            grid[r][W - 1] = '|';
        }

        el.textContent = grid.map(row => row.join('')).join('\n');
    }

    function update() {
        tick++;

        creatures.forEach(c => {
            if (c.type === 'fish' || c.type === 'shark') {
                c.x += c.speed * c.dir;
            }

            if (c.type === 'crab') {
                c.x += c.speed * c.dir;
                // Bounce off walls
                if (c.x <= 2 || c.x >= W - 8) c.dir *= -1;
            }

            if (c.type === 'jelly') {
                // Slow bob up and down, gentle horizontal drift
                c.y += Math.sin(tick * 0.008 + c.phase) * 0.02;
                c.x += c.drift;
                // Gentle bounce
                if (c.x <= 2 || c.x >= W - 6) c.drift *= -1;
                if (c.y < 1) c.y = 1;
                if (c.y > H - 5) c.y = H - 5;
            }

            if (c.type === 'eel') {
                c.x += c.speed * c.dir;
            }
        });

        // Spawn bubbles from fish/shark occasionally
        creatures.forEach(c => {
            if ((c.type === 'fish' || c.type === 'shark') && Math.random() < 0.004) {
                const bx = c.dir === 1 ? Math.round(c.x) : Math.round(c.x + (c.shape ? c.shape.length : 3));
                bubbles.push({ x: bx, y: c.y - 1, big: Math.random() > 0.6, drift: (Math.random() - 0.5) * 0.2 });
            }
        });

        // Treasure chest bubbles
        if (Math.random() < 0.008) {
            bubbles.push({ x: chest.x + 2, y: H - 5, big: false, drift: (Math.random() - 0.5) * 0.1 });
        }

        // Move bubbles
        for (let i = bubbles.length - 1; i >= 0; i--) {
            const b = bubbles[i];
            b.y -= 0.03 + Math.random() * 0.02;
            b.x += b.drift * 0.05;
            if (b.y < 1) bubbles.splice(i, 1);
        }

        // Respawn creatures that leave the screen
        for (let i = creatures.length - 1; i >= 0; i--) {
            const c = creatures[i];
            if (c.type === 'fish') {
                if ((c.dir === 1 && c.x > W + 5) || (c.dir === -1 && c.x < -(c.shape.length + 5))) {
                    creatures.splice(i, 1);
                    spawnFish(false);
                }
            }
            if (c.type === 'shark') {
                if ((c.dir === 1 && c.x > W + 5) || (c.dir === -1 && c.x < -(c.shape.length + 5))) {
                    creatures.splice(i, 1);
                    spawnShark(false);
                }
            }
            if (c.type === 'eel') {
                if ((c.dir === 1 && c.x > W + 15) || (c.dir === -1 && c.x < -15)) {
                    creatures.splice(i, 1);
                    spawnEel(false);
                }
            }
        }

        render();
        requestAnimationFrame(update);
    }

    init();

    // Resize handler
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => init(), 200);
    });

    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        render();
    } else {
        update();
    }
})();
