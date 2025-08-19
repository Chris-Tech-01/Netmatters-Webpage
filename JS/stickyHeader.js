export function stickyHeader() {
    
    const header = document.querySelector('.sticky-header');

    if (!header) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {

        const currentScroll = window.scrollY;
        const headerHeight = header.offsetHeight;

        if (currentScroll > lastScroll && currentScroll > headerHeight) {
            header.style.transform = `translateY(-${headerHeight}px)`;
        } else {
            header.style.transform = `translateY(0)`;
        }

        lastScroll = currentScroll;
    });
}
