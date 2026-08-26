// KRS LABS / PLAYBOOK INTERACTION SCRIPT

document.addEventListener('DOMContentLoaded', () => {
    // Scroll to top button
    const scrollToTopButton = document.getElementById('scrollToTop');
    if (scrollToTopButton) {
        scrollToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
