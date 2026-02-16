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

// Video card hover-to-play
document.querySelectorAll('.has-video').forEach(card => {
    const video = card.querySelector('.project-video');
    if (!video) return;

    card.addEventListener('mouseenter', () => {
        video.play().catch(() => {});
    });
    card.addEventListener('mouseleave', () => {
        video.pause();
        video.currentTime = 0;
    });

    // Touch support: tap to toggle play
    card.addEventListener('touchstart', (e) => {
        if (card.classList.contains('touch-play')) {
            card.classList.remove('touch-play');
            video.pause();
            video.currentTime = 0;
        } else {
            card.classList.add('touch-play');
            video.play().catch(() => {});
        }
    }, { passive: true });
});

// ============================================
// ASCII FISH TANK (with color)
// ============================================
(function() {
    const el = document.getElementById('fishTank');
    if (!el) return;

    // Measure character width to compute columns
    function getWidth() {
        const span = document.createElement('span');
        span.style.cssText = 'font:inherit;visibility:hidden;position:absolute;white-space:pre;';
        span.textContent = 'MMMMMMMMMM';
        el.appendChild(span);
        const cw = span.getBoundingClientRect().width / 10;
        span.remove();
        // Use container width minus the container's horizontal padding
        const style = getComputedStyle(el.parentElement);
        const pad = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
        const pw = el.parentElement.clientWidth - pad;
        return Math.floor(pw / cw) - 1;
    }

    let W, H;
    const SP = ' ';
    const title = ' krool.world ';

    // Color tags for spans
    const C = {
        border: 't-border',
        title:  't-title',
        fish1:  't-fish1',
        fish2:  't-fish2',
        fish3:  't-fish3',
        shark:  't-shark',
        crab:   't-crab',
        jelly:  't-jelly',
        eel:    't-eel',
        weed:   't-weed',
        sand:   't-sand',
        star:   't-star',
        chest:  't-chest',
        bubble: 't-bubble'
    };

    const FISH_COLORS = [C.fish1, C.fish2, C.fish3];

    // Fish shapes
    const FISH_R = ['><>', '><))°>', '>°>', '=>>'];
    const FISH_L = ['<><', '<°((><', '<°<', '<<='];
    const JELLY_A = [' oo', '/||\\'];
    const JELLY_B = [' oo', '\\||/'];
    const SHARK_R = '|\\><))))))>';
    const SHARK_L = '<((((((><|/';

    const creatures = [];
    const bubbles = [];
    const weeds = [];
    const stars = [];
    const chest = { x: 0 };

    function init() {
        creatures.length = 0;
        bubbles.length = 0;
        weeds.length = 0;
        stars.length = 0;

        W = Math.max(30, Math.min(getWidth(), 120));
        H = W < 40 ? 11 : 14;

        const numWeeds = Math.max(3, Math.floor(W / 14));
        for (let i = 0; i < numWeeds; i++) {
            weeds.push({
                x: 3 + Math.floor(Math.random() * (W - 6)),
                height: 2 + Math.floor(Math.random() * 3),
                phase: Math.random() * Math.PI * 2
            });
        }

        const numStars = Math.max(1, Math.floor(W / 25));
        for (let i = 0; i < numStars; i++) {
            stars.push({ x: 5 + Math.floor(Math.random() * (W - 10)) });
        }

        chest.x = Math.floor(W * 0.65);

        const numFish = Math.max(2, Math.floor(W / 18));
        for (let i = 0; i < numFish; i++) spawnFish(true);

        spawnCrab();
        spawnJelly(true);
        if (W >= 50) spawnShark(true);
        if (W >= 35) spawnEel(true);
    }

    function randRow(top, bot) {
        return top + Math.floor(Math.random() * Math.max(1, bot - top));
    }

    function spawnFish(scatter) {
        const dir = Math.random() < 0.5 ? 1 : -1;
        const shapes = dir === 1 ? FISH_R : FISH_L;
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        creatures.push({
            type: 'fish', shape, dir,
            color: FISH_COLORS[Math.floor(Math.random() * FISH_COLORS.length)],
            x: scatter ? Math.floor(Math.random() * W) : (dir === 1 ? -shape.length : W),
            y: randRow(1, H - 4),
            speed: 0.03 + Math.random() * 0.05
        });
    }

    function spawnCrab() {
        creatures.push({
            type: 'crab',
            x: Math.floor(W * 0.3),
            y: H - 3, dir: 1, speed: 0.02
        });
    }

    function spawnJelly(scatter) {
        creatures.push({
            type: 'jelly',
            x: scatter ? 5 + Math.floor(Math.random() * (W - 10)) : 5 + Math.floor(Math.random() * (W - 10)),
            y: randRow(2, Math.max(3, H - 6)),
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
            y: randRow(1, Math.min(3, H - 4)),
            speed: 0.04 + Math.random() * 0.02
        });
    }

    function spawnEel(scatter) {
        const dir = Math.random() < 0.5 ? 1 : -1;
        creatures.push({
            type: 'eel', dir,
            x: scatter ? Math.floor(Math.random() * W) : (dir === 1 ? -12 : W),
            y: randRow(Math.max(1, H - 5), H - 3),
            speed: 0.02 + Math.random() * 0.02,
            phase: Math.random() * Math.PI * 2
        });
    }

    let tick = 0;

    // Grid stores {ch, cls} per cell
    function makeGrid() {
        const grid = [];
        for (let r = 0; r < H; r++) {
            grid[r] = [];
            for (let c = 0; c < W; c++) {
                grid[r][c] = { ch: SP, cls: '' };
            }
        }
        return grid;
    }

    function stamp(grid, row, col, str, cls) {
        for (let i = 0; i < str.length; i++) {
            const c = col + i;
            if (c >= 1 && c < W - 1 && row >= 1 && row < H - 1) {
                grid[row][c] = { ch: str[i], cls: cls };
            }
        }
    }

    function setCell(grid, row, col, ch, cls) {
        if (col >= 1 && col < W - 1 && row >= 1 && row < H - 1) {
            grid[row][col] = { ch, cls };
        }
    }

    // HTML-escape for safety
    const esc = (s) => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

    function render() {
        const grid = makeGrid();
        const t = tick * 0.015;

        // Sand
        for (let c = 1; c < W - 1; c++) {
            grid[H - 2][c] = { ch: ['.',',',' ','.',',','_','.'][c % 7], cls: C.sand };
        }

        // Seaweed
        weeds.forEach(w => {
            const sway = Math.sin(t * 2 + w.phase);
            for (let i = 0; i < w.height; i++) {
                const row = H - 3 - i;
                const offset = i > 0 ? Math.round(sway * (i * 0.4)) : 0;
                const col = w.x + offset;
                setCell(grid, row, col, i % 2 === 0 ? ')' : '(', C.weed);
            }
        });

        // Starfish
        stars.forEach(s => {
            setCell(grid, H - 3, s.x, '*', C.star);
        });

        // Treasure chest
        if (chest.x + 4 < W - 1 && chest.x >= 1) {
            stamp(grid, H - 4, chest.x, '____', C.chest);
            stamp(grid, H - 3, chest.x, '|$$|', C.chest);
        }

        // Bubbles
        bubbles.forEach(b => {
            setCell(grid, Math.round(b.y), Math.round(b.x), b.big ? 'O' : 'o', C.bubble);
        });

        // Creatures
        creatures.forEach(c => {
            const cx = Math.round(c.x);

            if (c.type === 'fish') {
                stamp(grid, c.y, cx, c.shape, c.color);
            }

            if (c.type === 'shark') {
                stamp(grid, c.y, cx, c.shape, C.shark);
            }

            if (c.type === 'crab') {
                const frame = Math.floor(tick * 0.03) % 2;
                stamp(grid, c.y, cx, frame === 0 ? 'V(..)V' : 'v(..)v', C.crab);
            }

            if (c.type === 'jelly') {
                const frame = Math.floor(tick * 0.02) % 2;
                const lines = frame === 0 ? JELLY_A : JELLY_B;
                lines.forEach((ln, i) => stamp(grid, Math.round(c.y) + i, cx, ln, C.jelly));
            }

            if (c.type === 'eel') {
                const len = W < 40 ? 6 : 10;
                for (let i = 0; i < len; i++) {
                    const wobble = Math.round(Math.sin(t * 3 + i * 0.8 + c.phase) * 0.6);
                    const col = cx + (c.dir === 1 ? i : -i);
                    const row = c.y + wobble;
                    setCell(grid, row, col, '~', C.eel);
                }
                const headX = c.dir === 1 ? cx + len : cx - len;
                stamp(grid, c.y, headX, c.dir === 1 ? ':>' : '<:', C.eel);
            }
        });

        // Border - top
        for (let c = 0; c < W; c++) {
            grid[0][c] = { ch: c === 0 || c === W - 1 ? '+' : '~', cls: C.border };
        }
        // Title
        const ts = Math.floor((W - title.length) / 2);
        for (let i = 0; i < title.length; i++) {
            if (ts + i >= 0 && ts + i < W) {
                grid[0][ts + i] = { ch: title[i], cls: C.title };
            }
        }
        // Border - bottom
        for (let c = 0; c < W; c++) {
            grid[H - 1][c] = { ch: c === 0 || c === W - 1 ? '+' : '~', cls: C.border };
        }
        // Sides
        for (let r = 1; r < H - 1; r++) {
            grid[r][0] = { ch: '|', cls: C.border };
            grid[r][W - 1] = { ch: '|', cls: C.border };
        }

        // Build HTML — group consecutive same-class cells into spans
        const lines = [];
        for (let r = 0; r < H; r++) {
            let line = '';
            let runCls = null;
            let runChars = '';
            for (let c = 0; c < W; c++) {
                const cell = grid[r][c];
                if (cell.cls === runCls) {
                    runChars += cell.ch;
                } else {
                    if (runChars) {
                        line += runCls ? `<span class="${runCls}">${esc(runChars)}</span>` : esc(runChars);
                    }
                    runCls = cell.cls;
                    runChars = cell.ch;
                }
            }
            if (runChars) {
                line += runCls ? `<span class="${runCls}">${esc(runChars)}</span>` : esc(runChars);
            }
            lines.push(line);
        }

        el.innerHTML = lines.join('\n');
    }

    function update() {
        tick++;

        creatures.forEach(c => {
            if (c.type === 'fish' || c.type === 'shark') {
                c.x += c.speed * c.dir;
            }
            if (c.type === 'crab') {
                c.x += c.speed * c.dir;
                if (c.x <= 2 || c.x >= W - 8) c.dir *= -1;
            }
            if (c.type === 'jelly') {
                c.y += Math.sin(tick * 0.008 + c.phase) * 0.02;
                c.x += c.drift;
                if (c.x <= 2 || c.x >= W - 6) c.drift *= -1;
                if (c.y < 1) c.y = 1;
                if (c.y > H - 5) c.y = H - 5;
            }
            if (c.type === 'eel') {
                c.x += c.speed * c.dir;
            }
        });

        creatures.forEach(c => {
            if ((c.type === 'fish' || c.type === 'shark') && Math.random() < 0.004) {
                const bx = c.dir === 1 ? Math.round(c.x) : Math.round(c.x + (c.shape ? c.shape.length : 3));
                bubbles.push({ x: bx, y: c.y - 1, big: Math.random() > 0.6, drift: (Math.random() - 0.5) * 0.2 });
            }
        });

        if (Math.random() < 0.008) {
            bubbles.push({ x: chest.x + 2, y: H - 5, big: false, drift: (Math.random() - 0.5) * 0.1 });
        }

        for (let i = bubbles.length - 1; i >= 0; i--) {
            const b = bubbles[i];
            b.y -= 0.03 + Math.random() * 0.02;
            b.x += b.drift * 0.05;
            if (b.y < 1) bubbles.splice(i, 1);
        }

        for (let i = creatures.length - 1; i >= 0; i--) {
            const c = creatures[i];
            if (c.type === 'fish') {
                if ((c.dir === 1 && c.x > W + 5) || (c.dir === -1 && c.x < -(c.shape.length + 5))) {
                    creatures.splice(i, 1); spawnFish(false);
                }
            }
            if (c.type === 'shark') {
                if ((c.dir === 1 && c.x > W + 5) || (c.dir === -1 && c.x < -(c.shape.length + 5))) {
                    creatures.splice(i, 1); spawnShark(false);
                }
            }
            if (c.type === 'eel') {
                if ((c.dir === 1 && c.x > W + 15) || (c.dir === -1 && c.x < -15)) {
                    creatures.splice(i, 1); spawnEel(false);
                }
            }
        }

        render();
        requestAnimationFrame(update);
    }

    init();

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => init(), 200);
    });

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        render();
    } else {
        update();
    }
})();
