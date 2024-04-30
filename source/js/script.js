// JQuery Mask
$(document).ready(function () {
  $('#phone').mask('+7(000)000-00-00', {
    placeholder: '+7(_ _ _)_ _ _-_ _-_ _',
  });
});

// Swiper
const swiper = new Swiper('.swiper', {
  direction: 'horizontal',
  loop: true,

  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  slidesPerView: 4,
  autoplay: {
    delay: 3000,
  },

  speed: 1000,

  effect: 'coverflow',
  coverflowEffect: {
    modifier: 0,
    slideShadows: true,
  },
});

// Accordion
function accordion() {
  let acc = document.querySelectorAll('.answers__accordion-title');

  for (let i = 0; i < acc.length; i++) {
    acc[i].addEventListener('click', function () {
      this.classList.toggle('answers__accordion-title--active');

      let panel = this.nextElementSibling;

      if (panel.style.display === 'block') {
        panel.style.display = 'none';
      } else {
        panel.style.display = 'block';
      }
    });
  }
}

accordion();
