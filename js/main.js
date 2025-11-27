// ============================================
// RETRO LOADING SCREEN
// ============================================

const LoadingScreen = {
    screen: document.getElementById('loadingScreen'),
    bar: document.getElementById('loadingBar'),
    progress: 0,

    init() {
        this.simulateLoading();
    },

    simulateLoading() {
        const interval = setInterval(() => {
            // Random progress increment for retro feel
            this.progress += Math.random() * 15 + 5;

            if (this.progress >= 100) {
                this.progress = 100;
                this.bar.style.width = '100%';
                clearInterval(interval);

                // Hide loading screen after a brief pause
                setTimeout(() => {
                    this.screen.classList.add('hidden');
                    // Remove from DOM after transition
                    setTimeout(() => {
                        this.screen.remove();
                    }, 500);
                }, 300);
            } else {
                this.bar.style.width = this.progress + '%';
            }
        }, 150);
    }
};

// Initialize loading screen
LoadingScreen.init();

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
        this.bgMusic.volume = 0.1;

        this.clickSound = new Audio('assets/audio/click.mp3');
        this.clickSound.volume = 0.2;

        this.popSound = new Audio('assets/audio/pop.mp3');
        this.popSound.volume = 0.17;

        this.chachingSound = new Audio('assets/audio/chaching.mp3');
        this.chachingSound.volume = 0.24;

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
        if (!this.isInitialized || !this.isPlaying) return;
        this.clickSound.currentTime = 0;
        this.clickSound.play().catch(() => {});
    },

    playPop() {
        if (!this.isInitialized || !this.isPlaying) return;
        this.popSound.currentTime = 0;
        this.popSound.play().catch(() => {});
    },

    playChaching() {
        if (!this.isInitialized || !this.isPlaying) return;
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
            pointer-events: auto;
            cursor: crosshair;
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

// ============================================
// TYPING ANIMATION
// ============================================

const TypingEffect = {
    element: document.querySelector('.typing-text'),
    sourceElement: document.querySelector('.hero-subtitle-source'),
    text: '',
    index: 0,
    speed: 40,

    init() {
        if (!this.element || !this.sourceElement) return;
        this.text = this.sourceElement.textContent;
        this.type();
    },

    type() {
        if (this.index < this.text.length) {
            this.element.textContent += this.text.charAt(this.index);
            this.index++;
            setTimeout(() => this.type(), this.speed);
        } else {
            this.element.classList.add('done');
        }
    }
};

// Start typing after a short delay
setTimeout(() => TypingEffect.init(), 800);

// ============================================
// MATRIX RAIN EFFECT
// ============================================

const MatrixRain = {
    canvas: document.getElementById('matrixCanvas'),
    ctx: null,
    columns: [],
    chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン',
    fontSize: 14,

    init() {
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.animate();
    },

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        const columnCount = Math.floor(this.canvas.width / this.fontSize);
        this.columns = Array(columnCount).fill(1);
    },

    animate() {
        // Semi-transparent black to create fade effect
        this.ctx.fillStyle = 'rgba(10, 10, 11, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = '#6366f1';
        this.ctx.font = this.fontSize + 'px monospace';

        for (let i = 0; i < this.columns.length; i++) {
            // Random character
            const char = this.chars[Math.floor(Math.random() * this.chars.length)];
            const x = i * this.fontSize;
            const y = this.columns[i] * this.fontSize;

            this.ctx.fillText(char, x, y);

            // Reset column randomly or when it goes off screen
            if (y > this.canvas.height && Math.random() > 0.975) {
                this.columns[i] = 0;
            }
            this.columns[i]++;
        }

        requestAnimationFrame(() => this.animate());
    }
};

MatrixRain.init();

// ============================================
// PARALLAX SCROLLING
// ============================================

const Parallax = {
    layers: document.querySelectorAll('.parallax-layer'),

    init() {
        window.addEventListener('scroll', () => this.update());
        this.update();
    },

    update() {
        const scrollY = window.scrollY;
        this.layers.forEach(layer => {
            const speed = parseFloat(layer.dataset.speed) || 0.5;
            const yPos = -(scrollY * speed);
            layer.style.transform = `translateY(${yPos}px)`;
        });
    }
};

Parallax.init();

// ============================================
// 3D CARD TILT EFFECT (disabled)
// ============================================

// const CardTilt = {
//     cards: document.querySelectorAll('.project-card'),
//     maxTilt: 10,
//
//     init() {
//         this.cards.forEach(card => {
//             card.addEventListener('mousemove', (e) => this.tilt(e, card));
//             card.addEventListener('mouseleave', (e) => this.reset(card));
//             card.addEventListener('mouseenter', () => card.classList.add('tilting'));
//         });
//     },
//
//     tilt(e, card) {
//         const rect = card.getBoundingClientRect();
//         const x = e.clientX - rect.left;
//         const y = e.clientY - rect.top;
//         const centerX = rect.width / 2;
//         const centerY = rect.height / 2;
//
//         const tiltX = ((y - centerY) / centerY) * this.maxTilt;
//         const tiltY = ((centerX - x) / centerX) * this.maxTilt;
//
//         card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
//     },
//
//     reset(card) {
//         card.classList.remove('tilting');
//         card.style.transform = '';
//     }
// };
//
// CardTilt.init();

// ============================================
// CLICK RIPPLE EFFECT
// ============================================

const RippleEffect = {
    init() {
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.create(e, btn));
        });
    },

    create(e, btn) {
        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'ripple';

        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';

        btn.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }
};

RippleEffect.init();

// ============================================
// MOUSE GLOW EFFECT ON HERO
// ============================================

const MouseGlow = {
    hero: document.querySelector('.hero'),

    init() {
        if (!this.hero) return;
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;
            this.hero.style.setProperty('--mouse-x', x + '%');
            this.hero.style.setProperty('--mouse-y', y + '%');
        });
    }
};

MouseGlow.init();

// ============================================
// ANIMATED STATS COUNTER
// ============================================

const StatsCounter = {
    stats: document.querySelectorAll('.stat-number'),
    observed: false,

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.observed) {
                    this.observed = true;
                    this.animateAll();
                }
            });
        }, { threshold: 0.5 });

        const statsGrid = document.querySelector('.stats-grid');
        if (statsGrid) observer.observe(statsGrid);
    },

    animateAll() {
        this.stats.forEach(stat => this.animate(stat));
    },

    animate(element) {
        const target = parseInt(element.dataset.target);
        const duration = 2000;
        const start = performance.now();

        const update = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth animation
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);

            // Format large numbers with commas
            element.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = target.toLocaleString();
            }
        };

        requestAnimationFrame(update);
    }
};

StatsCounter.init();

// ============================================
// CLICKABLE EXPLODING SPRITES MINI-GAME
// ============================================

const SpriteGame = {
    score: 0,
    container: document.getElementById('floatingSprites'),
    explosionSound: null,

    init() {
        // Load saved score
        this.score = parseInt(localStorage.getItem('spriteScore') || '0');

        // Create explosion sound
        this.explosionSound = new Audio('assets/audio/pop.mp3');
        this.explosionSound.volume = 0.4;

        // Make floating sprites clickable
        this.container.addEventListener('click', (e) => {
            const sprite = e.target.closest('.floating-sprite');
            if (sprite) {
                this.explodeSprite(sprite, e.clientX, e.clientY);
            }
        });

        // Spawn special target sprites periodically
        setInterval(() => this.spawnTarget(), 8000);

        // Create score display
        this.createScoreDisplay();
    },

    createScoreDisplay() {
        const scoreDiv = document.createElement('div');
        scoreDiv.className = 'sprite-score';
        scoreDiv.id = 'spriteScore';
        scoreDiv.innerHTML = '<span class="score-icon">★</span> <span class="score-value">' + this.score + '</span>';
        document.body.appendChild(scoreDiv);
    },

    saveScore() {
        localStorage.setItem('spriteScore', this.score.toString());
    },

    spawnTarget() {
        const target = document.createElement('div');
        target.className = 'floating-sprite target-sprite';
        target.innerHTML = '◆';
        target.style.cssText = `
            left: ${Math.random() * 80 + 10}%;
            animation-duration: ${10 + Math.random() * 5}s;
            font-size: 40px;
            color: #ffd700;
            text-shadow: 0 0 20px #ffd700, 0 0 40px #ff6b00;
            cursor: pointer;
            pointer-events: auto;
        `;
        this.container.appendChild(target);

        // Remove after animation
        setTimeout(() => {
            if (target.parentNode) target.remove();
        }, 15000);
    },

    explodeSprite(sprite, x, y) {
        // Play sound
        if (AudioSystem.isInitialized) {
            this.explosionSound.currentTime = 0;
            this.explosionSound.play().catch(() => {});
        }

        // Add points
        const isTarget = sprite.classList.contains('target-sprite');
        const points = isTarget ? 100 : 10;
        this.score += points;
        this.updateScore();

        // Show points popup
        this.showPoints(x, y, points);

        // Create particle explosion
        this.createExplosion(x, y, isTarget);

        // Remove sprite
        sprite.style.pointerEvents = 'none';
        sprite.style.transition = 'transform 0.2s, opacity 0.2s';
        sprite.style.transform = 'scale(1.5)';
        sprite.style.opacity = '0';
        setTimeout(() => sprite.remove(), 200);
    },

    updateScore() {
        const scoreEl = document.querySelector('.score-value');
        if (scoreEl) scoreEl.textContent = this.score;
        this.saveScore();
    },

    showPoints(x, y, points) {
        const popup = document.createElement('div');
        popup.className = 'points-popup';
        popup.textContent = `+${points}`;
        popup.style.left = x + 'px';
        popup.style.top = y + 'px';
        document.body.appendChild(popup);
        setTimeout(() => popup.remove(), 1000);
    },

    createExplosion(x, y, isBig) {
        const particleCount = isBig ? 20 : 12;
        const colors = isBig
            ? ['#ffd700', '#ff6b00', '#ff0000', '#ffff00']
            : ['#6366f1', '#a855f7', '#818cf8', '#c084fc'];

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'explosion-particle';

            const angle = (Math.PI * 2 * i) / particleCount;
            const velocity = 50 + Math.random() * 100;
            const size = isBig ? 8 + Math.random() * 8 : 4 + Math.random() * 6;

            particle.style.cssText = `
                left: ${x}px;
                top: ${y}px;
                width: ${size}px;
                height: ${size}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                --dx: ${Math.cos(angle) * velocity}px;
                --dy: ${Math.sin(angle) * velocity}px;
            `;

            document.body.appendChild(particle);
            setTimeout(() => particle.remove(), 800);
        }
    }
};

// Initialize game after a delay to let sprites populate
setTimeout(() => SpriteGame.init(), 2000);

// ============================================
// ASCII RAIN EFFECT
// ============================================

const AsciiRain = {
    container: document.getElementById('asciiRain'),
    chars: ['0', '1', '@', '#', '$', '%', '&', '*', '+', '=', '~', '^', '/', '\\', '|', '-', '_', '.', ':', ';'],
    maxDrops: 30,

    init() {
        if (!this.container) return;

        // Create initial drops
        for (let i = 0; i < this.maxDrops; i++) {
            setTimeout(() => this.createDrop(), i * 200);
        }

        // Continuously spawn new drops
        setInterval(() => this.createDrop(), 500);
    },

    createDrop() {
        const drop = document.createElement('div');
        drop.className = 'ascii-drop';

        // Generate random string of ASCII chars
        const length = 5 + Math.floor(Math.random() * 15);
        let text = '';
        for (let i = 0; i < length; i++) {
            text += this.chars[Math.floor(Math.random() * this.chars.length)];
        }
        drop.textContent = text;

        // Random position and timing
        const startX = Math.random() * 100;
        const duration = 8 + Math.random() * 12;
        const delay = Math.random() * 2;

        drop.style.cssText = `
            left: ${startX}%;
            animation-duration: ${duration}s;
            animation-delay: -${delay}s;
            font-size: ${10 + Math.random() * 6}px;
        `;

        this.container.appendChild(drop);

        // Remove after animation
        setTimeout(() => {
            if (drop.parentNode) drop.remove();
        }, duration * 1000);
    }
};

AsciiRain.init();
