export function logoSlider() {

    const sliderSections = document.querySelectorAll('.slider-section');

    sliderSections.forEach(section => {

        const sliderTrack = section.querySelector('.slider-track');
        const sliderWrapper = section.querySelector('.slider-wrapper');

        if (!sliderTrack || !sliderWrapper) return;

        const pauseDuration = 3000;
        const speed = 12;
        let position = 0;
        let animationID = null;
        let timeoutID = null;
        let isPaused = false;

        function moveNextLogo () {

            if (isPaused) return;

            const firstLogo = sliderTrack.firstElementChild;
            const wrapperRect = sliderWrapper.getBoundingClientRect();
            const logoRect = firstLogo.getBoundingClientRect();
            const targetX = logoRect.right - wrapperRect.left;
            
            if (targetX > 0) {
                position -= Math.min(speed, targetX);
                sliderTrack.style.transform = `translateX(${position}px)`
                animationID = requestAnimationFrame(moveNextLogo);
            } else {
                if (timeoutID) clearTimeout(timeoutID);
                timeoutID = setTimeout(() => {
                    if (isPaused) return;
                    sliderTrack.appendChild(firstLogo);
                    const gap = parseInt(getComputedStyle(sliderTrack).gap || 0);
                    position += firstLogo.offsetWidth + gap;
                    sliderTrack.style.transform = `translateX(${position}px)`;
                    animationID = requestAnimationFrame(moveNextLogo);

                }, pauseDuration);
            }
        }


        sliderWrapper.addEventListener('mouseenter', () => {
            isPaused = true;
            if (animationID) cancelAnimationFrame(animationID);
            if (timeoutID) clearTimeout(timeoutID);
        });

        sliderWrapper.addEventListener('mouseleave', () => {
            if (!isPaused) return;
            isPaused = false;
            animationID = requestAnimationFrame(moveNextLogo);
        });

        animationID = requestAnimationFrame(moveNextLogo);
    });
}
