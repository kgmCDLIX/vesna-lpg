document.addEventListener('DOMContentLoaded', () => {
    const DESKTOP_BREAK = 1024;
    // находим все наши «До/После»-свайперы
    const containers = Array.from(document.querySelectorAll('.services-swiper'));

    containers.forEach(container => {
        const track  = container.querySelector('.swiper-wrapper');
        const slides = Array.from(track.children);
        const pagers = container.querySelector('.swiper-pagination');

        let slideWidth, gap, maxTranslate, minTranslate, threshold;
        let idx = 0, startX = 0, currentTranslate = 0, prevTranslate = 0, isDragging = false;

        function calculateBounds() {
            slideWidth   = slides[0].getBoundingClientRect().width;
            gap          = parseInt(getComputedStyle(track).gap, 10) || 0;
            maxTranslate = 0;
            minTranslate = - (slideWidth + gap) * (slides.length - 1);
            threshold    = slideWidth / 3;
        }

        function isMobile() {
            return window.innerWidth < DESKTOP_BREAK;
        }

        function init() {
            calculateBounds();

            // создаём буллеты
            slides.forEach((_, i) => {
                const dot = document.createElement('span');
                dot.className = 'swiper-pagination-bullet';
                dot.addEventListener('click', () => {
                    idx = i;
                    update();
                });
                pagers.append(dot);
            });
            update();

            // навешиваем события на каждый слайд
            slides.forEach((slide, i) => {
                slide.addEventListener('pointerdown',   onDown(i));
                slide.addEventListener('pointermove',   onMove);
                slide.addEventListener('pointerup',     onUp);
                slide.addEventListener('pointerleave',  onUp);
                slide.addEventListener('pointercancel', onUp);
            });
            track.addEventListener('dragstart', e => e.preventDefault());
        }

        function destroy() {
            track.style.transform  = '';
            track.style.transition = '';
            pagers.innerHTML       = '';
        }

        function onDown(i) {
            return e => {
                idx = i;
                startX = e.clientX;
                isDragging = true;
                track.style.transition = 'none';
            };
        }

        function onMove(e) {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            let next = prevTranslate + dx;
            next = Math.min(maxTranslate, Math.max(minTranslate, next));
            currentTranslate = Math.round(next);
            track.style.transform = `translate3d(${currentTranslate}px,0,0)`;
        }

        function onUp() {
            if (!isDragging) return;
            isDragging = false;
            const moved = currentTranslate - prevTranslate;
            if (moved < -threshold && idx < slides.length - 1) idx++;
            if (moved >  threshold && idx > 0)                 idx--;
            update();
        }

        function update() {
            calculateBounds();
            let offset = (slideWidth + gap) * idx * -1
                + (container.clientWidth - slideWidth) / 2;
            offset = Math.round(Math.min(maxTranslate, Math.max(minTranslate, offset)));

            prevTranslate    = offset;
            currentTranslate = offset;

            track.style.transition = 'transform .3s ease';
            track.style.transform  = `translate3d(${offset}px,0,0)`;

            pagers.querySelectorAll('.swiper-pagination-bullet')
                .forEach((dot, i) => {
                    dot.classList.toggle('swiper-pagination-bullet-active', i === idx);
                });
        }

        function onResize() {
            if (isMobile()) {
                if (!pagers.hasChildNodes()) init();
                else update();
            } else {
                destroy();
            }
        }

        window.addEventListener('resize', onResize);
        onResize();
    });
});