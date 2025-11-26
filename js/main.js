// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

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
        }
    });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('.section-title, .section-description, .project-card').forEach(el => {
    observer.observe(el);
});

// Smooth scroll for anchor links (fallback for older browsers)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// 8-BIT AUDIO SYSTEM
// ============================================

const AudioSystem = {
    bgMusic: null,
    clickSound: null,
    popSound: null,
    chachingSound: null,
    isPlaying: false,
    isInitialized: false,

    init() {
        // Create audio elements
        this.bgMusic = new Audio('assets/audio/background.mp3');
        this.bgMusic.loop = true;
        this.bgMusic.volume = 0.3;

        this.clickSound = new Audio('assets/audio/click.mp3');
        this.clickSound.volume = 0.5;

        this.popSound = new Audio('assets/audio/pop.mp3');
        this.popSound.volume = 0.4;

        this.chachingSound = new Audio('assets/audio/chaching.mp3');
        this.chachingSound.volume = 0.5;

        this.isInitialized = true;
    },

    toggleMusic() {
        if (!this.isInitialized) this.init();

        if (this.isPlaying) {
            this.bgMusic.pause();
            this.isPlaying = false;
        } else {
            this.bgMusic.play().catch(() => {});
            this.isPlaying = true;
        }
        return this.isPlaying;
    },

    playClick() {
        if (!this.isInitialized) return;
        this.clickSound.currentTime = 0;
        this.clickSound.play().catch(() => {});
    },

    playPop() {
        if (!this.isInitialized) return;
        this.popSound.currentTime = 0;
        this.popSound.play().catch(() => {});
    },

    playChaching() {
        if (!this.isInitialized) return;
        this.chachingSound.currentTime = 0;
        this.chachingSound.play().catch(() => {});
    }
};

// Audio button control
const audioBtn = document.getElementById('audioBtn');
const audioControl = document.getElementById('audioControl');

audioBtn.addEventListener('click', () => {
    const isPlaying = AudioSystem.toggleMusic();
    audioBtn.classList.toggle('playing', isPlaying);
    AudioSystem.playClick();
});

// Add click sounds to buttons
document.querySelectorAll('.btn, .nav-links a, .logo').forEach(el => {
    el.addEventListener('click', () => {
        AudioSystem.playClick();
    });
});

// Add special sound to project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        AudioSystem.playPop();
    });
});

// ============================================
// FLOATING SPRITES SYSTEM
// ============================================

const FloatingSprites = {
    container: document.getElementById('floatingSprites'),
    sprites: [
        'assets/sprites/pikachu.png',
        'assets/sprites/charizard.png',
        'assets/sprites/bulbasaur.png',
        'assets/sprites/mewtwo.png',
        'assets/sprites/masterball.png',
        'assets/sprites/pokeball.png'
    ],
    asciiChars: ['@', '#', '*', '+', '=', '~', '^', '%', '&'],
    maxSprites: 15,
    activeSprites: [],

    init() {
        // Create initial sprites
        for (let i = 0; i < this.maxSprites; i++) {
            setTimeout(() => this.createSprite(), i * 800);
        }
        // Continuously spawn new sprites
        setInterval(() => this.createSprite(), 3000);
    },

    createSprite() {
        if (this.activeSprites.length >= this.maxSprites) {
            const oldSprite = this.activeSprites.shift();
            if (oldSprite && oldSprite.parentNode) {
                oldSprite.remove();
            }
        }

        const sprite = document.createElement('div');
        sprite.className = 'floating-sprite';

        // Randomly choose between image sprite or ASCII character
        if (Math.random() > 0.4) {
            // Image sprite
            const img = document.createElement('img');
            img.src = this.sprites[Math.floor(Math.random() * this.sprites.length)];
            img.alt = '';
            sprite.appendChild(img);
            sprite.classList.add('image-sprite');
        } else {
            // ASCII character
            sprite.textContent = this.asciiChars[Math.floor(Math.random() * this.asciiChars.length)];
            sprite.classList.add('ascii-sprite');
        }

        // Random position and animation
        const startX = Math.random() * 100;
        const duration = 15 + Math.random() * 20;
        const delay = Math.random() * 5;
        const size = 20 + Math.random() * 30;

        sprite.style.cssText = `
            left: ${startX}%;
            animation-duration: ${duration}s;
            animation-delay: -${delay}s;
            font-size: ${size}px;
        `;

        if (sprite.querySelector('img')) {
            sprite.querySelector('img').style.width = `${size}px`;
        }

        this.container.appendChild(sprite);
        this.activeSprites.push(sprite);

        // Remove after animation
        setTimeout(() => {
            if (sprite.parentNode) {
                sprite.remove();
                const idx = this.activeSprites.indexOf(sprite);
                if (idx > -1) this.activeSprites.splice(idx, 1);
            }
        }, duration * 1000);
    }
};

// Initialize floating sprites
FloatingSprites.init();

// ============================================
// ASCII CURSOR TRAIL
// ============================================

const CursorTrail = {
    chars: ['.', '*', '+', 'o', '~'],
    lastX: 0,
    lastY: 0,
    threshold: 50,

    init() {
        document.addEventListener('mousemove', (e) => {
            const dx = e.clientX - this.lastX;
            const dy = e.clientY - this.lastY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > this.threshold) {
                this.createParticle(e.clientX, e.clientY);
                this.lastX = e.clientX;
                this.lastY = e.clientY;
            }
        });
    },

    createParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'cursor-particle';
        particle.textContent = this.chars[Math.floor(Math.random() * this.chars.length)];
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        document.body.appendChild(particle);

        setTimeout(() => particle.remove(), 1000);
    }
};

CursorTrail.init();

// ============================================
// KONAMI CODE EASTER EGG
// ============================================

const KonamiCode = {
    sequence: ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'],
    current: 0,

    init() {
        document.addEventListener('keydown', (e) => {
            if (e.key === this.sequence[this.current]) {
                this.current++;
                if (this.current === this.sequence.length) {
                    this.activate();
                    this.current = 0;
                }
            } else {
                this.current = 0;
            }
        });
    },

    activate() {
        AudioSystem.playChaching();
        document.body.classList.add('konami-active');

        // Spawn lots of sprites
        for (let i = 0; i < 30; i++) {
            setTimeout(() => FloatingSprites.createSprite(), i * 100);
        }

        setTimeout(() => {
            document.body.classList.remove('konami-active');
        }, 5000);
    }
};

KonamiCode.init();
