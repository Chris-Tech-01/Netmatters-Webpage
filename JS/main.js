import {
    sidebarToggle,
    stickyHeader,
    logoSlider,
    initCarousel,
    cookiePopup
} from './index.js';

document.addEventListener('DOMContentLoaded', () => {
    
    sidebarToggle();
    stickyHeader();
    logoSlider();
    initCarousel();
    cookiePopup();
});
