export function initCarousel() {
    
    const carousel = document.querySelector(".carousel");
    const slides = Array.from(document.querySelectorAll(".slide"));
    
    if (!carousel || slides.length === 0) return;

    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[slides.length - 1].cloneNode(true);
    firstClone.classList.add("clone");
    lastClone.classList.add("clone");

    carousel.appendChild(firstClone);
    carousel.insertBefore(lastClone, slides[0]);

    const allSlides = carousel.querySelectorAll(".slide");
    const totalSlides = allSlides.length;

    let dotsContainer = document.querySelector(".carousel-dots");

    if (!dotsContainer) {
        dotsContainer = document.createElement("div");
        dotsContainer.className = "carousel-dots";
        carousel.parentElement.appendChild(dotsContainer);
    }

    slides.forEach((_, i) => {
        const dot = document.createElement("span");
        dot.className ="dot" + (i === 0 ? " active" : "");
        dot.addEventListener("click", () => goToSlide(i + 1));
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll(".dot");

    let currentIndex = 1;
    let intervalId = null;
    const autoplayDelay = 4000;
    const baseDuration = 500;
    const maxDuration =1500;

    function getSlideWidth() {
        return allSlides[0]?.offsetWidth || carousel.offsetWidth;
    }

    function goToSlide(index, skipTransition = false) {
        if (index >= totalSlides) index = 1;
        if (index < 0) index = totalSlides - 2;

        const distance = Math.abs(index - currentIndex);
        const duration = Math.min(baseDuration * distance, maxDuration);

        carousel.style.transition = skipTransition ? "none" : `transform ${duration}ms ease-in-out`;

        currentIndex = index;
        const slideWidth = getSlideWidth();
        carousel.style.transform = `translateX(-${index * slideWidth}px)`;

        if (dots && dots.length) {
            const dotIndex = ((index - 1) % dots.length + dots.length) % dots.length;
            dots.forEach((d, i) => {
                const isActive = i === dotIndex;
                d.classList.toggle("active", isActive);
                d.setAttribute("aria-current", isActive ? "true" : "false");
            });
        }
    }

    function startAutoplay() {
        stopAutoplay();
        intervalId = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, autoplayDelay);
    }

    function stopAutoplay() {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }

    carousel.addEventListener("mouseenter", stopAutoplay);
    carousel.addEventListener("mouseleave", startAutoplay);

    dots.forEach(d => {
       d.addEventListener("mouseenter", stopAutoplay);
       d.addEventListener("mouseleave", startAutoplay);
    });

    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID;

    carousel.addEventListener("dragstart", e => e.preventDefault());

    carousel.addEventListener("mousedown", dragStart);
    carousel.addEventListener("touchstart", dragStart);

    carousel.addEventListener("mouseup", dragEnd);
    carousel.addEventListener("mouseleave", () => { if (isDragging) dragEnd(); });
    carousel.addEventListener("touchend", dragEnd);

    carousel.addEventListener("mousemove", dragMove);
    carousel.addEventListener("touchmove", dragMove);

    let previousUserSelect = "";

    function disableSelection() {
        previousUserSelect = document.body.style.userSelect;
        document.body.style.userSelect = "none";
        document.body.style.MozUserSelect = "none";
    }
    
    function restoreSelection() {
        document.body.style.userSelect = previousUserSelect || "";
        document.body.style.MozUserSelect = "";
    }

    function dragStart(e) {
        stopAutoplay();
        isDragging = true;

        const slideWidth = getSlideWidth();
        prevTranslate = -currentIndex * slideWidth;
        currentTranslate = prevTranslate;

        startPos = getPositionX(e);
        animationID = requestAnimationFrame(animation);
        carousel.style.transition = `none`;

        disableSelection();
    }

    function dragMove(e) {
        if (!isDragging) return;
        const currentPosition= getPositionX(e);
        currentTranslate = prevTranslate + currentPosition - startPos;
    }

    function dragEnd() {
        cancelAnimationFrame(animationID);
        if (!isDragging) return;
        isDragging = false;

        const movedBy = currentTranslate - prevTranslate;
        const slideWidth = getSlideWidth();

        if (movedBy < -50) {
            currentIndex += 1;
        } else if (movedBy > 50) {
            currentIndex -= 1;
        }

        const targetTranslate = -currentIndex * slideWidth;
        carousel.style.transition = `transform 500ms ease-in-out`;
        carousel.style.transform = `translateX(${targetTranslate}px)`;

        prevTranslate = targetTranslate;
        currentTranslate = targetTranslate;

        restoreSelection();
        startAutoplay();
    }  
    
    function getPositionX(e) {
        return e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
    }

    function animation() {
        setCarouselPosition();
        if (isDragging) requestAnimationFrame(animation);
    }

    function setCarouselPosition() {
        carousel.style.transform = `translateX(${currentTranslate}px)`;
    }

    carousel.addEventListener("transitionend", () => {
        const slideWidth = getSlideWidth();

        if (allSlides[currentIndex].classList.contains("clone")) {
            if (currentIndex === totalSlides - 1) {
                currentIndex = 1;
            } else if (currentIndex === 0) {
                currentIndex = totalSlides - 2;
            }

            carousel.style.transition = "none";
            carousel.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

            prevTranslate = -currentIndex * slideWidth;
            currentTranslate = prevTranslate;
        }

        dots.forEach((dot, i) => {
            const isActive = i === (currentIndex - 1) % dots.length;
            dot.classList.toggle("active", isActive);
            dot.setAttribute("aria-current", isActive ? "true" : "false");
        });
    });

    window.addEventListener('resize', () => {
        const slideWidth = getSlideWidth();
        carousel.style.transition = 'none';
        prevTranslate = -currentIndex * slideWidth;
        currentTranslate = prevTranslate;
        carousel.style.transform = `translateX(${currentTranslate}px)`;
    });

    goToSlide(1, true);
    startAutoplay();
}