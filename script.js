/* ═══════════════════════════════════════════════════════════════════
   BITEWARE — Bio Page JavaScript
   ═══════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    /* ── Particle Background ────────────────────────────────────────── */
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5 + 0.5;
            this.speedY = Math.random() * 0.4 + 0.1;
            this.speedX = (Math.random() - 0.5) * 0.2;
            this.opacity = Math.random() * 0.4 + 0.1;
        }

        update() {
            this.y -= this.speedY;
            this.x += this.speedX;

            if (this.y < -5) {
                this.y = canvas.height + 5;
                this.x = Math.random() * canvas.width;
            }
            if (this.x < -5) this.x = canvas.width + 5;
            if (this.x > canvas.width + 5) this.x = -5;

            if (mouse.x !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    const force = (120 - dist) / 120;
                    this.x += (dx / dist) * force * 1.5;
                    this.y += (dy / dist) * force * 1.5;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const count = Math.min(80, Math.floor(window.innerWidth / 12));
        for (let i = 0; i < count; i++) particles.push(new Particle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animateParticles);
    }

    resizeCanvas();
    initParticles();
    animateParticles();

    window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });
    window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener('mouseout',  () => { mouse.x = null;  mouse.y = null;  });

    /* ── Custom Cursor ──────────────────────────────────────────────── */
    const cursorDot  = document.getElementById('cursorDot');
    const cursorRing = document.getElementById('cursorRing');
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX  = mouseX;
    let ringY  = mouseY;

    cursorDot.style.setProperty('--x', mouseX + 'px');
    cursorDot.style.setProperty('--y', mouseY + 'px');

    window.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.setProperty('--x', mouseX + 'px');
        cursorDot.style.setProperty('--y', mouseY + 'px');
    });

    function animateCursorRing() {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        cursorRing.style.setProperty('--x', ringX + 'px');
        cursorRing.style.setProperty('--y', ringY + 'px');
        requestAnimationFrame(animateCursorRing);
    }
    animateCursorRing();

    document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
    });

    /* ── Typewriter Effect ─────────────────────────────────────────── */
    function startTypewriter() {
        const bio = document.getElementById('bio');
        const text = bio.dataset.text || '';
        let i = 0;
        bio.textContent = '';

        function type() {
            if (i < text.length) {
                bio.textContent += text.charAt(i);
                i++;
                setTimeout(type, 45);
            } else {
                setTimeout(() => bio.classList.add('done'), 1500);
            }
        }
        setTimeout(type, 600);
    }

    /* ── Music Player ──────────────────────────────────────────────── */
    const audio             = document.getElementById('audioPlayer');
    const playBtn           = document.getElementById('playBtn');
    const playIcon          = playBtn.querySelector('i');
    const progressBar       = document.getElementById('progressBar');
    const progressContainer = document.getElementById('progressContainer');
    const currentTimeEl     = document.getElementById('currentTime');
    const durationEl        = document.getElementById('durationTime');

    playBtn.addEventListener('click', () => {
        if (audio.paused) audio.play().catch(() => {});
        else              audio.pause();
    });

    audio.addEventListener('play', () => {
        playIcon.className = 'fas fa-pause';
        document.body.classList.add('music-playing');
    });
    audio.addEventListener('pause', () => {
        playIcon.className = 'fas fa-play';
        document.body.classList.remove('music-playing');
    });
    audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
            progressBar.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
            currentTimeEl.textContent = formatTime(audio.currentTime);
        }
    });
    audio.addEventListener('loadedmetadata', () => {
        durationEl.textContent = formatTime(audio.duration);
    });
    audio.addEventListener('ended', () => {
        audio.currentTime = 0;
        progressBar.style.width = '0%';
    });

    progressContainer.addEventListener('click', e => {
        const rect = progressContainer.getBoundingClientRect();
        if (audio.duration) {
            audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
        }
    });

    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    /* ── Keyboard: Spacebar toggles music ──────────────────────────── */
    document.addEventListener('keydown', e => {
        if (e.code === 'Space' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
            e.preventDefault();
            if (audio.src) {
                if (audio.paused) audio.play().catch(() => {});
                else              audio.pause();
            }
        }
    });

    /* ── Auto-trigger entrance + typewriter on load ────────────────── */
    document.body.classList.add('entered');
    startTypewriter();

    /* ── 3D Tilt on Hover ───────────────────────────────────────────── */
    const bioCard     = document.querySelector('.bio-card');
    const mainContainer = document.getElementById('main-container');
    const maxTilt = 8;

    document.addEventListener('mousemove', e => {
        const rect = bioCard.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const rangeX = rect.width * 0.9;
        const rangeY = rect.height * 0.9;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = Math.sqrt(rangeX * rangeX + rangeY * rangeY);

        if (dist < maxDist) {
            const rotateY = (dx / rangeX) * maxTilt;
            const rotateX = -(dy / rangeY) * maxTilt;
            bioCard.style.transition = 'transform 0.08s ease-out, box-shadow 0.08s ease-out';
            bioCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            bioCard.style.boxShadow = `${-rotateY * 1.5}px ${rotateX * 1.5}px 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba(255, 255, 255, 0.05)`;
        } else {
            bioCard.style.transition = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
            bioCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
            bioCard.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.4)';
        }
    });

    /* ── Apply saved config from localStorage ───────────────────────── */
    function loadConfig() {
        try {
            return JSON.parse(localStorage.getItem('biteware_config') || '{}');
        } catch { return {}; }
    }

    function applyConfig(cfg) {
        if (cfg.avatar)   document.querySelector('.avatar').src = cfg.avatar;
        if (cfg.username)  document.querySelector('.username').textContent = cfg.username;
        if (cfg.nickname)  document.querySelector('.nickname').textContent = cfg.nickname;
        if (cfg.bio)       document.getElementById('bio').dataset.text = cfg.bio;

        const socialMap = {
            youtube: 'a[title="YouTube"]',
            tiktok: 'a[title="TikTok"]',
            github: 'a[title="GitHub"]',
            steam: 'a[title="Steam"]'
        };
        Object.entries(socialMap).forEach(([key, sel]) => {
            if (cfg[key]) {
                const el = document.querySelector(sel);
                if (el) el.href = cfg[key];
            }
        });

        if (cfg.song)   document.querySelector('.track-title').textContent = cfg.song;
        if (cfg.artist) document.querySelector('.track-artist').textContent = cfg.artist;
        if (cfg.music)  document.getElementById('audioPlayer').src = cfg.music;
    }

    const savedConfig = loadConfig();
    applyConfig(savedConfig);
    if (savedConfig.bio) startTypewriter();

    /* ── Disable right-click, inspect, and view source ─────────────── */
    // Block right-click context menu
    document.addEventListener('contextmenu', e => e.preventDefault());

    // Block F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+Shift+C
    document.addEventListener('keydown', e => {
        if (e.code === 'F12' ||
            (e.ctrlKey && e.shiftKey && (e.code === 'KeyI' || e.code === 'KeyJ' || e.code === 'KeyC')) ||
            (e.ctrlKey && e.code === 'KeyU')) {
            e.preventDefault();
            return false;
        }
    });

});
