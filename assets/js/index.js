function toggleMenu() {
  const nav = document.querySelector('.navigation');
  nav.classList.toggle('active');
}

function handleLanguageChange() {
  const selectElement = document.querySelector('.language');
  if (!selectElement) return;
  selectElement.addEventListener('change', function () {
    if (selectElement.value === 'en') window.location.href = 'indexEN.html';
    if (selectElement.value === 'es') window.location.href = 'index.html';
  });
}

function initTestimonialsCarousel() {
  if (typeof Swiper === 'undefined') return;

  new Swiper('.swiper', {
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    speed: 800,
    effect: 'slide',
  });
}

document.addEventListener('DOMContentLoaded', () => {
  handleLanguageChange();
  initTestimonialsCarousel();
});
