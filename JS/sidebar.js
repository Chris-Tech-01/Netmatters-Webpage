export function sidebarToggle() {
    const sidebar = document.querySelector('#sidebar');
    const wrapper = document.querySelector('.sidebar-animation-wrapper');
    const toggleBtn = document.querySelector('.header-btn');
    const overlay = document.querySelector('.darken-overlay');

    if (!sidebar || !wrapper || !toggleBtn || !overlay) return;

    const toggleSidebar = () => {
        const isOpen = overlay.classList.toggle('active');
        wrapper.style.transform = isOpen ? `translateX(-${sidebar.offsetWidth}px)` : 'translateX(0)';
    };

    toggleBtn.addEventListener('click', toggleSidebar);
    overlay.addEventListener('click', toggleSidebar);

    window.addEventListener('resize', () => {
        if (overlay.classList.contains('active')) {
            wrapper.style.transform = `translateX(-${sidebar.offsetWidth}px)`;
        }
    });
}
