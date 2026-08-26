// SCROLL TO TOP BUTTON

const scrollToTopButton = document.getElementById('scrollToTop');

if (scrollToTopButton) {
    scrollToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
