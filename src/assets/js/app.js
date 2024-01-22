$(document).ready(function () {

  //год
  document.getElementById("year").innerHTML = new Date().getFullYear();
  /// svg

  const Svg = () => {
    let x = [".svg"];
    x.forEach((item) => {
      $(item).each(function () {
        let $img = $(this);
        let imgClass = $img.attr("class");
        let imgURL = $img.attr("src");
        $.get(
          imgURL,
          function (data) {
            let $svg = $(data).find("svg");
            if (typeof imgClass !== "undefined") {
              $svg = $svg.attr("class", imgClass + " replaced-svg");
            }
            $svg = $svg.removeAttr("xmlns:a");
            if (
              !$svg.attr("viewBox") &&
              $svg.attr("height") &&
              $svg.attr("width")
            ) {
              $svg.attr(
                "viewBox",
                "0 0 " + $svg.attr("height") + " " + $svg.attr("width")
              );
            }
            $img.replaceWith($svg);
          },
          ""
        );
      });
    });
  };
  Svg();



  //слайдер баннер 


  new Swiper(".swiper-main-big", {
    navigation: {
      nextEl: ".swiper-main-big__swiper-button-next",
      prevEl: ".swiper-main-big__swiper-button-prev",
    },
    spaceBetween: 8,
    breakpoints: {
      0: {
        slidesPerView: 1,
        grid: {
          rows: 2,
        },
      },
      576: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 2,
      },
      891: {
        slidesPerView: 2,
      },
      1920: {
        slidesPerView: 2,
      },
    },
  });




  new Swiper(".swiper-main-saintly", {
    navigation: {
      nextEl: ".swiper-main-saintly__swiper-button-next",
      prevEl: ".swiper-main-saintly__swiper-button-prev",
    },
    spaceBetween: 8,
    breakpoints: {
      0: {
        slidesPerView: 2,
      },
      576: {
        slidesPerView: 3,
      },
      768: {
        slidesPerView: 3,
      },
      891: {
        slidesPerView: 4,
      },
      1920: {
        slidesPerView: 4,
      },
    },
  });



  // Бургер
  let burger = document.querySelector('.burger');
  let menu = document.querySelector('.header__list-mobile');
  let menuLinks = menu.querySelectorAll('.header__link');


  burger.addEventListener('click', function () {
    burger.classList.toggle('burger--active');
    menu.classList.toggle('header__list-mobile--active');
    document.body.classList.toggle('stop-scroll');
  });

  menuLinks.forEach(function (el) {
    el.addEventListener('click', function () {
      burger.classList.remove('burger--active');
      menu.classList.remove('header__list-mobile--active');
      document.body.classList.remove('stop-scroll')
    })
  });


  
})