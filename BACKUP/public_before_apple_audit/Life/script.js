// Hamburger, custom cursor, and page-transition logic all live in the shared /script.js.
// Everything below is unique to the Life page.

// MUSIC PLAYER SCRIPT
const audio = document.getElementById('audio');
audio.volume = 0.3; // 30% volume
window.addEventListener('click', () => {
  audio.muted = false;
  audio.volume = 0.5;
  audio.play();
}, { once: true });

const playPauseBtn = document.getElementById('play-pause');
const playIcon = document.getElementById('play-icon');
const progressRing = document.querySelector('.progress-ring__progress');
const pulseRing = document.querySelector('.pulse-ring');

const radius = 50;
const circumference = 2 * Math.PI * radius;

progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
progressRing.style.strokeDashoffset = circumference;

function setProgress(percent) {
  const offset = circumference - (percent / 100) * circumference;
  progressRing.style.strokeDashoffset = offset;
}

playPauseBtn.addEventListener('click', () => {
  if(audio.paused){
    audio.play();
    playIcon.src = '/img/pause.svg';
    pulseRing.style.animationPlayState = 'running';
  } else {
    audio.pause();
    playIcon.src = '/img/play.svg';
    pulseRing.style.animationPlayState = 'paused';
  }
});

audio.addEventListener('timeupdate', () => {
  const progressPercent = (audio.currentTime / audio.duration) * 100;
  setProgress(progressPercent);
});

window.addEventListener('load', () => {
  pulseRing.style.animationPlayState = 'running';
});


// TEXT FADE IN LIFE PAGE HERO

window.addEventListener('load', () => {
  // Named .hero-fade-in, not .fade-in — the shared /script.js adds a
  // same-named "fade-in" class to <body> for its own page-transition
  // effect, and this used to collide with it (body would also match a
  // plain `.fade-in` query and pick up `transform: translateY(0)`, which
  // is visually a no-op but still creates a new containing block for
  // position:fixed descendants — silently detaching the fixed navbar from
  // the viewport and sending it scrolling away with the page).
  const fadeElements = document.querySelectorAll('.hero-fade-in');
  fadeElements.forEach(el => {
    el.classList.add('visible');
  });
});


// SCROLL FADE SLAVE SECTION

window.addEventListener('scroll', () => {
  const element = document.querySelector('.scroll-animate');
  if (!element) return;
  const position = element.getBoundingClientRect().top;
  const windowHeight = window.innerHeight;

  if (position < windowHeight && position > 0) {
    element.classList.remove('scrolled');
  } else {
    element.classList.add('scrolled');
  }
});


//  SCROLL FADE JOURNEY SECTION

const journeyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const images = entry.target.querySelectorAll('img');

    if(entry.isIntersecting){
      entry.target.classList.remove('hide');
      entry.target.classList.add('visible');
    } else {
      entry.target.classList.remove('visible');
      entry.target.classList.add('hide');
    }

    images.forEach((img, index) => {
      img.style.transitionDelay = `${index * 0.1}s`;
    });
  });
}, { threshold: 0.175 });

const journeySections = document.querySelectorAll('.journey-section');
journeySections.forEach(section => {
  journeyObserver.observe(section);
});


window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});
