export function initCarousel() {
    
    const carousel = document.querySelector(".carousel");
    const slides = document.querySelectorAll(".slide");
    
    if (!carousel || !slides || slides.length === 0) return;

    let dotsContainer = document.querySelector(".carousel-dots");

    if (!dotsContainer) {
        dotsContainer = document.createElement("div");
        dotsContainer.className = "carousel-dots";
        carousel.parentElement.appendChild(dotsContainer);
    }

    const slideCount = slides.length;
    let currentIndex = 0;
    let intervalId = null;
    const Autoplay = 4000;

    for (let i = 0; i < slideCount; i++) {
        const dot = document.createElement("span");
        dot.className = "dot" + (i === 0 ? " active" : "");
        dot.addEventListener("click", () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }

    const dots = dotsContainer.querySelectorAll(".dot");

    function goToSlide(index) {
        const distance = Math.abs(index - currentIndex);
        const baseDuration = 500;
        const maxDuration = 1500;
        const duration = Math.min(baseDuration * distance, maxDuration);

        carousel.style.transition = `transform ${duration}ms ease-in-out`;
        currentIndex = index;
        carousel.style.transform = `translateX(-${index * 100}%)`;
        
        dots.forEach((d, idx) => {
            d.classList.toggle("active", idx === index);
            d.setAttribute("aria-current", idx === index ? "true" : "false");
        });
    }

    function startAutoplay() {
        stopAutoplay();
        intervalId = setInterval(() => {
            const nextIndex = (currentIndex + 1) % slideCount;
            goToSlide(nextIndex);
        }, Autoplay);
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

    carousel.addEventListener("mousedown", dragStart);
    carousel.addEventListener("touchstart", dragStart,{ passive: true });

    carousel.addEventListener("mouseup", dragEnd);
    carousel.addEventListener("mouseleave", dragEnd);
    carousel.addEventListener("touchend", dragEnd);

    carousel.addEventListener("mousemove", dragMove);
    carousel.addEventListener("touchmove", dragMove);

    function dragStart(e) {
        stopAutoplay();
        isDragging = true;
        startPos = getPositionX(e);
        animationID = requestAnimationFrame(animation);
        carousel.style.transition = `none`;
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

        if (movedBy < -50 && currentIndex < slideCount - 1) {
            goToSlide(currentIndex + 1);
        } else if (movedBy > 50 && currentIndex > 0) {
            goToSlide(currentIndex - 1);
        } else {
            goToSlide(currentIndex);
        }

        prevTranslate = - currentIndex * carousel.offsetWidth;
        currentTranslate = prevTranslate;
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

    goToSlide(0);
    startAutoplay();
}