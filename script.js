// Drive Size Pro ランディングページ用スクリプト

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initCarousel();
    initFaqAccordion();
    initHeroStatCounters();
});

/**
 * モバイル向けハンバーガーメニューの開閉制御
 */
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileNav = document.getElementById('mobile-nav');
    if (!menuBtn || !mobileNav) return;

    menuBtn.addEventListener('click', () => {
        const isOpen = mobileNav.classList.toggle('active');
        menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // メニュー内リンクをクリックしたら自動で閉じる
    mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            menuBtn.setAttribute('aria-expanded', 'false');
        });
    });
}

/**
 * スクリーンショットカルーセルのスライド切り替え制御
 */
function initCarousel() {
    const track = document.getElementById('carousel-track');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const dotsWrap = document.getElementById('carousel-dots');
    if (!track) return;

    const slides = Array.from(track.querySelectorAll('.carousel-slide'));
    if (slides.length === 0) return;

    let currentIndex = slides.findIndex(slide => slide.classList.contains('active'));
    if (currentIndex < 0) currentIndex = 0;

    // ドットナビゲーションを生成
    const dots = [];
    if (dotsWrap) {
        dotsWrap.innerHTML = '';
        slides.forEach((_, idx) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'carousel-dot' + (idx === currentIndex ? ' active' : '');
            dot.setAttribute('aria-label', `スライド ${idx + 1}`);
            dot.addEventListener('click', () => showSlide(idx));
            dotsWrap.appendChild(dot);
            dots.push(dot);
        });
    }

    function showSlide(nextIdx) {
        currentIndex = (nextIdx + slides.length) % slides.length;
        slides.forEach((slide, idx) => {
            slide.classList.toggle('active', idx === currentIndex);
        });
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentIndex);
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => showSlide(currentIndex - 1));
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => showSlide(currentIndex + 1));
    }

    showSlide(currentIndex);
}

/**
 * FAQ アコーディオンの開閉制御
 */
function initFaqAccordion() {
    const questions = document.querySelectorAll('.faq-question');
    questions.forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            if (!item) return;

            const isActive = item.classList.toggle('active');
            btn.setAttribute('aria-expanded', isActive ? 'true' : 'false');
        });
    });
}

/**
 * ヒーローセクション内の統計数値カウントアップアニメーション
 */
function initHeroStatCounters() {
    const numbers = document.querySelectorAll('.stat-number[data-target]');
    numbers.forEach(el => {
        const target = parseInt(el.getAttribute('data-target'), 10);
        if (isNaN(target)) return;

        const durationMs = 700;
        const startTime = performance.now();

        function step(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / durationMs, 1);
            // イージングで滑らかに目標値へ到達させる
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = String(Math.round(target * eased));
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = String(target);
            }
        }

        requestAnimationFrame(step);
    });
}
