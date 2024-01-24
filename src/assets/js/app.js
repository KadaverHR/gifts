$(document).ready(function () {

  //год
  // document.getElementById("year").innerHTML = new Date().getFullYear();
  /// svg


  AOS.init()

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



  new Swiper(".reviews__box", {
    navigation: {
      nextEl: ".reviews__swiper-button-next",
      prevEl: ".reviews__swiper-button-prev",
    },
    spaceBetween: 24,
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
        slidesPerView: 6,
      },
    },
  });



  // Бургер
  // let burger = document.querySelector('.burger');
  // let menu = document.querySelector('.header__list-mobile');
  // let menuLinks = menu.querySelectorAll('.header__link');


  // burger.addEventListener('click', function () {
  //   burger.classList.toggle('burger--active');
  //   menu.classList.toggle('header__list-mobile--active');
  //   document.body.classList.toggle('stop-scroll');
  // });

  // menuLinks.forEach(function (el) {
  //   el.addEventListener('click', function () {
  //     burger.classList.remove('burger--active');
  //     menu.classList.remove('header__list-mobile--active');
  //     document.body.classList.remove('stop-scroll')
  //   })
  // });









  /////плеер

  new Playerjs({
    id: "reviews1",
    file: "assets/img/video/1.mp4",
    poster: "assets/img/video1.jpg",
  })
  new Playerjs({
    id: "reviews2",
    file: "assets/img/video/2.mp4",
    poster: "assets/img/video2.jpg"
  })
  new Playerjs({
    id: "reviews3",
    file: "assets/img/video/3.mp4",
    poster: "assets/img/video3.jpg"
  })
  new Playerjs({
    id: "reviews4",
    file: "assets/img/video/4.mp4",
    poster: "assets/img/video4.jpg"
  })
  new Playerjs({
    id: "reviews5",
    file: "assets/img/video/5.mp4",
    poster: "assets/img/video5.jpg"
  });
  new Playerjs({
    id: "reviews6",
    file: "assets/img/video/1.mp4",
    poster: "assets/img/video6.jpg"
  });
  new Playerjs({
    id: "reviews7",
    file: "assets/img/video/2.mp4",
    poster: "assets/img/video1.jpg"
  });




  ///map

  ymaps.ready(init);

  function init() {
    // в этой версии координаты просто элементы массива (и они поменяны местами)
    if (document.getElementById('map') === null) return

    let destinations = {
      'OR': [52.973583, 36.096968], //орел
      'KOM': [52.937419, 36.041649], //Магазин на Комсомольской, 270
      'MIX': [52.993878, 36.114596], //Магазин на Михалицына, 10
      'LOM': [52.981875, 36.069292], //Магазин на Ломоносова, 6Б
    }
    // let destinations = {
    //   'OR': [53.014796, 36.15], //орел
    // },

    // Создание экземпляра карты и его привязка к контейнеру с
    // заданным id ("map").
    myMap = new ymaps.Map('map', {
      // При инициализации карты обязательно нужно указать
      // её центр и коэффициент масштабирования.
      center: destinations['OR'], // Московское шоссе, д.173
      zoom: 13.5
    });

    // Добавление метки
    // https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/Placemark-docpage/
    // let myPlacemark = new ymaps.Placemark([53.014796, 36.156400], {}, {
    //   //опции
    //   iconLayout: 'default#image',
    //   iconImageHref: '../assets/img/icon-map.svg',
    //   iconImageSize: [54, 77],
    //   iconImageOffset: [-27, -54],
    // });

    // После того как метка была создана, добавляем её на карту.
    // myMap.geoObjects.add(myPlacemark);


    let myPlacemark = new ymaps.Placemark(destinations['KOM'], {}, {
      //опции
      iconLayout: 'default#image',
      iconImageHref: '../assets/img/icon-map.svg',
      iconImageSize: [35, 45],
      iconImageOffset: [-20, -50],
    });
    let myPlacemark1 = new ymaps.Placemark(destinations['MIX'], {}, {
      //опции
      iconLayout: 'default#image',
      iconImageHref: '../assets/img/icon-map.svg',
      iconImageSize: [35, 45],
      iconImageOffset: [-20, -50],
    });
    let myPlacemark2 = new ymaps.Placemark(destinations['LOM'], {}, {
      //опции
      iconLayout: 'default#image',
      iconImageHref: '../assets/img/icon-map.svg',
      iconImageSize: [35, 45],
      iconImageOffset: [-20, -50],
    });
    // После того как метка была создана, добавляем её на карту.
    myMap.geoObjects.add(myPlacemark);
    myMap.geoObjects.add(myPlacemark1);
    myMap.geoObjects.add(myPlacemark2);
  }


  ///select

  class Select {
    constructor(el, placeholder) {
      this.el = el;
      this.placeholder = placeholder;
    }
    init() {
      $(this.el)
        .select2({
          theme: "select-filter__theme",
          dropdownCssClass: "select-filter__drop",
          selectionCssClass: "select-filter__selection",
          allowClear: false,
          closeOnSelect: true,
          dropdownAutoWidth: false,
          placeholder: this.placeholder,
          language: {
            noResults: function (params) {
              return "Нет результатов";
            },
          },
        })
        .on("select2:open", function (e) {
          $(".select2-search__field").attr("placeholder", "Поиск");
        });
    }
  }
  // let select = new Select();

  // let popoverTriggerList = [].slice.call(
  //   document.querySelectorAll('[data-bs-toggle="popover"]')
  // );

  // popoverTriggerList.map(function (popoverTriggerEl) {
  //   return new bootstrap.Popover(popoverTriggerEl);
  // });

 


  const selectCity = new Select($(".city"), "Город");
  const selectAdvice = new Select($(".advice"), "Как вы узнали о ярмарке");

  selectCity.init();
  selectAdvice.init();










})