const modalOpenBtn = document.querySelectorAll('.btn--show-modal');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const modalCloseBtn = document.querySelector('.btn--close-modal');
const scrollBtn = document.querySelector('.btn--scroll-to');
const section1 = document.getElementById('section--1');
const navLink = document.querySelector('.nav__links');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const sections = document.querySelectorAll('.section');
const images = document.querySelectorAll(`img[${'data-src'}]`);
const tabBtn = document.querySelectorAll('.operations__tab');
const tabContent = document.querySelectorAll('.operations__content');
const tabContainer = document.querySelector('.operations__tab-container');
const slides = document.querySelectorAll('.slide');
const btnPrev = document.querySelector('.slider__btn--left');
const btnNext = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

// COMMENT: OPEN MODAL
const openModal = () => {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
};

const closeModal = () => {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
  document.body.style.overflow = 'auto';
};

modalOpenBtn.forEach((btn) => {
  btn.addEventListener('click', openModal);
});

modalCloseBtn.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// COMMENT: BUTTON SCROLL TO SECTION SMOOTH SCROLL
document
  .querySelector('.btn--scroll-to')
  .addEventListener('click', function () {
    section1.scrollIntoView({ behavior: 'smooth' });
  });

// COMMENT: SMOOTH SCROLL ON NAVIGATION
navLink.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    e.target.classList.contains('nav__link') &&
    !e.target.classList.contains('btn--show-modal')
  ) {
    const target = e.target.getAttribute('href');
    document.querySelector(target).scrollIntoView({ behavior: 'smooth' });
  }
});

// COMMENT: FIXED NAVIGATION THROUGH INTERSECTION OBSERVER
const navHeight = nav.getBoundingClientRect().height;

const navOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};

const fixedNav = (entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      nav.classList.add('sticky');
    } else {
      nav.classList.remove('sticky');
    }
  });
};

// nav intersection observer
let navObserver = new IntersectionObserver(fixedNav, navOptions);
navObserver.observe(header);

// COMMENT: SECTION SMOOTH SCROLL ON LOAD
const sectionOptions = {
  root: null,
  threshold: 0.15,
};

const sectionScroll = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.remove('section--hidden');
    } else {
      return;
    }

    observer.unobserve(entry.target);
  });
};

let sectionObserver = new IntersectionObserver(sectionScroll, sectionOptions);

sections.forEach((section) => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// COMMENT: LAZY LOAD IMAGES
const imgOptions = {
  root: null,
  threshold: 0.15,
};

const lazyLoad = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.src = entry.target.dataset.src;
      entry.target.classList.remove('lazy-img');
    } else {
      return;
    }

    observer.unobserve(entry.target);
  });
};

let imgObserver = new IntersectionObserver(lazyLoad, imgOptions);
images.forEach((img) => {
  imgObserver.observe(img);
});

// COMMENT: TAB CONTENT
tabContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  if (clicked) {
    const clickedTab = +clicked.dataset.tab;

    tabBtn.forEach((btn) => btn.classList.remove('operations__tab--active'));

    tabContent.forEach((content) =>
      content.classList.remove('operations__content--active')
    );

    clicked.classList.add('operations__tab--active');

    document
      .querySelector(`.operations__content--${clickedTab}`)
      .classList.add('operations__content--active');
  }
});

// COMMENT: SLIDER
let currentSlide = 0;

// creating dots
const createDots = () => {
  slides.forEach((_, i) => {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<div class="dots__dot" data-slide="${i}"></div>`
    );
  });
};

const activeDots = (cs) => {
  document
    .querySelectorAll('.dots__dot')
    .forEach((dot) => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide="${cs}"]`)
    .classList.add('dots__dot--active');
};

const activeSlide = (cs) => {
  slides.forEach((slide) => slide.classList.remove('slide--active'));

  document.querySelector(`.slide--${cs + 1}`).classList.add('slide--active');
};

const goToSlide = (cs) => {
  slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${(i - cs) * 100}%)`;
  });
};

const init = () => {
  createDots();
  goToSlide(0);
  activeDots(0);
  activeSlide(0);
};

init();

const prevSlide = () => {
  if (currentSlide === 0) {
    currentSlide = slides.length - 1;
  } else {
    currentSlide = currentSlide - 1;
  }
  goToSlide(currentSlide);
  activeDots(currentSlide);
  activeSlide(currentSlide);
};

const nextSlide = () => {
  if (currentSlide === slides.length - 1) {
    currentSlide = 0;
  } else {
    currentSlide = currentSlide + 1;
  }
  goToSlide(currentSlide);
  activeDots(currentSlide);
  activeSlide(currentSlide);
};

btnPrev.addEventListener('click', prevSlide);
btnNext.addEventListener('click', nextSlide);

// keyword left arrow and right arrow handling slide
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') {
    prevSlide();
  }

  if (e.key === 'ArrowRight') {
    nextSlide();
  }
});

// dots handler for slide
dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const slideNum = +e.target.dataset.slide;
    currentSlide = slideNum;
    goToSlide(slideNum);
    activeDots(slideNum);
    activeSlide(slideNum);
  }
});
