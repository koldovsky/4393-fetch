const slides = [
  '<div><img src="img/baby-yoda.svg" alt="Baby Yoda"></div>',
  '<div><img src="img/banana.svg" alt="Banana"></div>',
  '<div><img src="img/viking.svg" alt="Viking"></div>',
  '<div><img src="img/girl.svg" alt="Girl"></div>',
];

let currentSlideIndex = 0;

function renderSlides() {
  const slidesContainer = document.querySelector(".product-carousel__slides");
  slidesContainer.innerHTML = slides[currentSlideIndex];
  if (window.matchMedia("(min-width: 760px)").matches) {
    const secondSlideIndex = (currentSlideIndex + 1) % slides.length;
    slidesContainer.innerHTML += slides[secondSlideIndex];
    if (window.matchMedia("(min-width: 960px)").matches) {
      const thirdSlideIndex = (currentSlideIndex + 2) % slides.length;
      slidesContainer.innerHTML += slides[thirdSlideIndex];
    }
  }
}

function showNextSlide() {
  currentSlideIndex = (currentSlideIndex + 1) % slides.length;
  renderSlides();
}

function showPrevSlide() {
  currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
  renderSlides();
}

renderSlides();

const btnNext = document.querySelector(".product-carousel__button--next");
btnNext.addEventListener("click", showNextSlide);

const btnPrev = document.querySelector(".product-carousel__button--prev");
btnPrev.addEventListener("click", showPrevSlide);

// setInterval(showNextSlide, 3000);

window.addEventListener("resize", renderSlides);
