document.addEventListener('DOMContentLoaded', () => {

  let tl = gsap.timeline();

  tl.from(".hero__title, .hero__btn", {duration: 1, opacity:0, y: 75});
  tl.from('.hero__descr', {duration: 1, opacity: 0});
  tl.from('.photos-wrap-1', {duration: .5, opacity: 0, scale: 0.5}, "-=0.7");
  tl.from('.photos-wrap-2', {duration: .5, opacity: 0, scale: 0.5}, "-=0.4");
  tl.from('.photos-wrap-3', {duration: .5, opacity: 0, scale: 0.5}, "-=0.1");
  tl.from('.photos__author', {duration: 1, opacity: 0});

  let tlBurger;

  document.querySelector('.burger').addEventListener('click', () => {

    if (!tlBurger) {

      tlBurger = gsap.timeline();
      document.querySelector('.menu').style.display = "block";

      tlBurger.from('.menu', {duration: .5, opacity: 0},);
      tlBurger.from('.menu__top', {duration: .5, opacity: 0, y: -100});
      tlBurger.from('.menu__nav', {duration: .5, opacity: 0, y: 50},);
      tlBurger.from('.social, .menu__right', {duration: .5, opacity: 0, y: 50},);
    } else {

      document.querySelector('.menu').style.display = "block";
      tlBurger.play();
    }

  })

  document.querySelector('.close').addEventListener('click', () => {

    tlBurger.reverse();

    setTimeout( () => {

      document.querySelector('.menu').style.display = "none";
    }, 2000);
  })

})
