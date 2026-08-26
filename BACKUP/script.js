const buttons = document.querySelectorAll('.button-work');

buttons.forEach(button => {
    const img = button.querySelector('img');
    const originalSrc = '/img/button-arrow-img.svg';
    const hoverSrc = '/img/button-arrow-img-hover.svg';

    button.addEventListener('mouseenter', () => {
        img.style.opacity = '0';
        setTimeout(() => {
            img.src = hoverSrc;
            img.style.opacity = '1';
        }, 50);
    });

    button.addEventListener('mouseleave', () => {
        img.style.opacity = '0';
        setTimeout(() => {
            img.src = originalSrc;
            img.style.opacity = '1';
        }, 50);
    });
});



// FADE ANIMATION

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            entry.target.classList.remove('hidden'); // Animate IN

            // Extra check just for the button
            if(entry.target.classList.contains('works-bottom-button')) {
                entry.target.classList.add('bounce-show');
            }
        } else {
            entry.target.classList.add('hidden');   // Animate OUT

            // Remove bounce when out of view
            if(entry.target.classList.contains('works-bottom-button')) {
                entry.target.classList.remove('bounce-show');
            }
        }
    });
}, { threshold: 0.5 });

const elementsToAnimate = document.querySelectorAll('.hero-text, .about-me-inner-wrap, .works-bottom-button');

elementsToAnimate.forEach(el => {
    el.classList.add('fade-scale', 'hidden'); // Start hidden
    observer.observe(el);
});


// SCROLL ANIMATION FOR HERO TEXT

const heroSection = document.querySelector('.hero-text');

const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            heroSection.classList.remove('hidden'); // Fade + scale in
        } else {
            heroSection.classList.add('hidden');    // Fade + scale out
        }
    });
}, { threshold: 0.8 }); // triggers when 20% of hero is visible

heroObserver.observe(heroSection);



// SCROLL ANIMATION FOR ABOUT ME TEXT
const scrollDownArrow = document.getElementById('scroll-down-arrow');
const aboutSection = document.getElementById('about');

scrollDownArrow.addEventListener('click', () => {
    aboutSection.scrollIntoView({ behavior: 'smooth' });
});


// CAROUSEL ANIMATION

const track = document.querySelector('.carousel-track');
const cards = Array.from(track.children);

cards.forEach(card => {
  const clone = card.cloneNode(true);
  track.appendChild(clone);
});




const hamburger = document.getElementById('hamburger');
const navbarRight = document.querySelector('.navbar-right');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navbarRight.classList.toggle('show');
});




// MUSIC PLAYER SCRIPT

