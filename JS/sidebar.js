export function sidebarToggle() {
    const sidebar = document.querySelector('#sidebar');
    const wrapper = document.querySelector('.sidebar-animation-wrapper');
    const toggleBtn = document.querySelector('.header-btn');
    const overlay = document.querySelector('.darken-overlay');

    if (!sidebar || !wrapper || !toggleBtn || !overlay) return;

    function toggleSidebar () {
        
        const isOpen = overlay.classList.toggle('active');
        
        if (isOpen) {
            wrapper.style.transform = `translateX(-${sidebar.offsetWidth}px)`;
            toggleBtn.classList.add('open');
        } else {
            wrapper.style.transform = `translateX(0)`;
            toggleBtn.classList.remove('open');
        }
    };

    function handleResize() {
        if (overlay.classList.contains('active')) {
            wrapper.style.transform = `translateX(-${sidebar.offsetWidth}px)`;
        }
    }

    toggleBtn.addEventListener('click', toggleSidebar);
    overlay.addEventListener('click', toggleSidebar);
    window.addEventListener('resize', handleResize);
}
