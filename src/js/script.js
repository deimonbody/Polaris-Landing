@@include('navbar.js');

var swiper = new Swiper(".mySwiper", {
    slidesPerView: 'auto',
    spaceBetween: 20,
    grabCursor: true,
    clickable: true,
    breakpoints:{
        320:{
            centeredSlides: false,
        },
        767:{
            centeredSlides: true,
        },
        1200:{
            centeredSlides: false,
        }
    }
});