export function cookiePopup() {
    const overlay = document.getElementById('cookie-overlay');
    const acceptButton = document.querySelector('.accept-cookies');

    if (!overlay || !acceptButton) return;

    const cookiesAccepted = localStorage.getItem('cookiesAccepted');

    if (!cookiesAccepted) {
        overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    } else {
        overlay.style.display = 'none';
    }

    acceptButton.addEventListener('click', (e) => {
        e.preventDefault();
        overlay.style.display = 'none';
        document.body.style.overflow = '';
        localStorage.setItem('cookiesAccepted', 'true');
    });
}