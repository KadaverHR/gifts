import Splide from "@splidejs/splide";

$(document).ready(function () {
  //год
  document.getElementById("year").innerHTML = new Date().getFullYear();

  // scroll
  const anchors = document.querySelectorAll('a[href*="#"]');
  for (let anchor of anchors) {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const blockID = anchor.getAttribute("href").substr(1);

      document.getElementById(blockID).scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }

  // Загрузка SVG спрайта
  async function loadSvgSprite() {
    const spriteContainer = document.getElementById("svg-sprite-container");
    if (!spriteContainer) return;

    try {
      const response = await fetch("assets/img/sprite.svg");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const svgText = await response.text();
      spriteContainer.innerHTML = svgText;
      console.log("SVG спрайт успешно загружен");
    } catch (error) {
      console.error("Ошибка загрузки SVG спрайта:", error);
    }
  }

  // Инициализация dropdown с сортировкой
  function initSortDropdown() {
    const sortContainers = document.querySelectorAll(".sort-container");

    sortContainers.forEach((container) => {
      const sortToggle = container.querySelector(".sort-toggle");
      const sortMenu = container.querySelector(".sort-menu");
      const selectedText = container.querySelector(".selected-text");
      const currentIcon = container.querySelector(".icon-current use");
      const menuItems = sortMenu.querySelectorAll("li");

      // Открытие/закрытие dropdown
      sortToggle.addEventListener("click", function (e) {
        e.stopPropagation();

        // Закрываем все открытые dropdown'ы
        closeAllSortDropdowns();

        // Открываем текущий
        sortToggle.classList.toggle("active");
        sortMenu.classList.toggle("active");
      });

      // Обработка выбора элемента
      menuItems.forEach((item) => {
        item.addEventListener("click", function (e) {
          e.stopPropagation();

          const sortType = this.dataset.sort;
          const iconName = this.dataset.icon;
          const text = this.querySelector("span").textContent.trim();

          // Убираем активный класс со всех элементов
          menuItems.forEach((el) => el.classList.remove("active"));

          // Добавляем активный класс выбранному элементу
          this.classList.add("active");

          // Обновляем текст в кнопке
          if (selectedText) {
            selectedText.textContent = text;
          }

          // Обновляем иконку в кнопке
          if (currentIcon && iconName) {
            currentIcon.setAttribute("xlink:href", `#${iconName}`);
          }

          // Закрываем dropdown
          sortToggle.classList.remove("active");
          sortMenu.classList.remove("active");

          // Здесь можно вызвать функцию сортировки
          console.log(`Выбрана сортировка: ${sortType}`);
          applySorting(sortType);
        });
      });
    });

    // Закрытие dropdown при клике вне его
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".sort-container")) {
        closeAllSortDropdowns();
      }
    });

    // Функция для закрытия всех dropdown'ов
    function closeAllSortDropdowns() {
      const activeToggles = document.querySelectorAll(".sort-toggle.active");
      const activeMenus = document.querySelectorAll(".sort-menu.active");

      activeToggles.forEach((toggle) => toggle.classList.remove("active"));
      activeMenus.forEach((menu) => menu.classList.remove("active"));
    }

    // Функция сортировки (пример)
    function applySorting(sortType) {
      // Ваша логика сортировки здесь
      switch (sortType) {
        case "popularity":
          console.log("Сортировка по популярности");
          break;
        case "price_asc":
          console.log("Сортировка по возрастанию цены");
          break;
        case "price_desc":
          console.log("Сортировка по убыванию цены");
          break;
        case "newest":
          console.log("Сначала новинки");
          break;
        case "discount":
          console.log("Сначала со скидкой");
          break;
        default:
          console.log("Неизвестный тип сортировки:", sortType);
      }
    }
  }

  // Инициализация после загрузки спрайта

  // Загружаем SVG спрайт
  loadSvgSprite().then(() => {
    // Небольшая задержка для уверенности, что спрайт загрузился
    setTimeout(initSortDropdown, 100);
  });

  AOS.init();

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

  // Бургер
  let burger = document.querySelector(".burger");
  let menu = document.querySelector(".header__list-mobile");
  let menuLinks = menu.querySelectorAll(".header__link");

  burger.addEventListener("click", function () {
    burger.classList.toggle("burger--active");
    menu.classList.toggle("header__list-mobile--active");
    document.body.classList.toggle("stop-scroll");
  });

  menuLinks.forEach(function (el) {
    el.addEventListener("click", function () {
      burger.classList.remove("burger--active");
      menu.classList.remove("header__list-mobile--active");
      document.body.classList.remove("stop-scroll");
    });
  });

  /////плеер

  let videoBox = document.querySelectorAll(".reviews__video-box");

  videoBox.forEach((elem) => {
    console.log(elem);

    const videoElem = elem.querySelector(".reviews__video");
    const dataVideo = videoElem.getAttribute("data-video");
    const dataImg = videoElem.getAttribute("data-image");
    const dataId = videoElem.getAttribute("id");

    console.log(dataVideo, dataImg, dataId);

    new Playerjs({
      id: dataId,
      file: dataVideo,
      poster: dataImg,
    });
  });

  ///map

  // ymaps.ready(init);

  // function init() {
  //   // в этой версии координаты просто элементы массива (и они поменяны местами)
  //   if (document.getElementById('map') === null) return

  //   let destinations = {
  //     'OR': [52.973583, 36.096968], //орел
  //     'KOM': [52.937419, 36.041649], //Магазин на Комсомольской, 270
  //     'MIX': [52.993878, 36.114596], //Магазин на Михалицына, 10
  //     'LOM': [52.981875, 36.069292], //Магазин на Ломоносова, 6Б
  //   }

  //   myMap = new ymaps.Map('map', {
  //     // При инициализации карты обязательно нужно указать
  //     // её центр и коэффициент масштабирования.
  //     center: destinations['OR'], // Московское шоссе, д.173
  //     zoom: 13.5
  //   });

  //   let myPlacemark = new ymaps.Placemark(destinations['KOM'], {}, {
  //     //опции
  //     iconLayout: 'default#image',
  //     iconImageHref: '/assets/img/icon-map.svg',
  //     iconImageSize: [35, 45],
  //     iconImageOffset: [-20, -50],
  //   });
  //   let myPlacemark1 = new ymaps.Placemark(destinations['MIX'], {}, {
  //     //опции
  //     iconLayout: 'default#image',
  //     iconImageHref: '/assets/img/icon-map.svg',
  //     iconImageSize: [35, 45],
  //     iconImageOffset: [-20, -50],
  //   });
  //   let myPlacemark2 = new ymaps.Placemark(destinations['LOM'], {}, {
  //     //опции
  //     iconLayout: 'default#image',
  //     iconImageHref: '/assets/img/icon-map.svg',
  //     iconImageSize: [35, 45],
  //     iconImageOffset: [-20, -50],
  //   });
  //   // После того как метка была создана, добавляем её на карту.
  //   myMap.geoObjects.add(myPlacemark);
  //   myMap.geoObjects.add(myPlacemark1);
  //   myMap.geoObjects.add(myPlacemark2);
  // }

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

  if (window.screen.availWidth >= 960) {
    const selectCity = new Select($(".city"), "");
    const selectAdvice = new Select($(".advice"), "");

    selectCity.init();
    selectAdvice.init();
  }

  ////label сверху input

  let inputBlock = document.querySelectorAll(".input_block");

  inputBlock.forEach((elem) => {
    let input = elem.querySelector(".form__input");
    let labelInput = elem.querySelector(".label-input");
    input.addEventListener("input", () => {
      labelInput.classList.add("active");
    });
    input.addEventListener("blur", () => {
      console.log(input.value);
      if (input.value === "") {
        labelInput.classList.remove("active");
      }
    });
  });

  ////label сверху select мобильный
  console.log(window.screen.availWidth);
  if (window.screen.availWidth < 960) {
    let selectBlock = document.querySelectorAll(".select_block");

    selectBlock.forEach((elem) => {
      let selectMob = elem.querySelector("select");
      console.log(selectMob);
      let labelSelect = elem.querySelector(".label-input-select");
      selectMob.addEventListener("click", () => {
        labelSelect.classList.add("active");
      });
      document.addEventListener("click", (e) => {
        const withinBoundaries = e.composedPath().includes(selectMob);
        console.log(selectMob.value);
        if (!withinBoundaries && selectMob.value == "") {
          labelSelect.classList.remove("active");
        }
      });
    });
  } else {
    ////label сверху select

    let selectBlock = document.querySelectorAll(".select_block");

    selectBlock.forEach((elem) => {
      let select = elem.querySelector(".select2-selection__rendered");
      let labelSelect = elem.querySelector(".label-input-select");
      select.addEventListener("click", () => {
        labelSelect.classList.add("active");
      });
      document.addEventListener("click", (e) => {
        const withinBoundaries = e.composedPath().includes(select);
        if (
          !withinBoundaries &&
          select.innerHTML ===
            '<span class="select2-selection__placeholder"></span>'
        ) {
          labelSelect.classList.remove("active");
        }
      });
    });
  }

  ////валидация

  if (document.querySelector("#form")) {
    const validation = new JustValidate("#form", {
      errorFieldCssClass: "is-invalid",
      errorLabelStyle: {
        fontSize: "12px",
        color: "#F65252",
      },
      focusInvalidField: true,
      lockForm: true,
    });
    validation
      .addField("#name_input", [
        {
          rule: "required",
          errorMessage: "Вы не ввели имя",
        },
        {
          rule: "minLength",
          value: 3,
          errorMessage: "Слишком короткое имя",
        },
        {
          rule: "maxLength",
          value: 30,
          errorMessage: "Слишком длинное имя",
        },
      ])
      .addField("#tel_input", [
        {
          rule: "required",
          errorMessage: "Вы не ввели телефон",
        },
      ]);
  }

  ///каталог

  let allBtn = document.querySelector(".catalog__all-btn");
  let allCatalog = document.querySelectorAll(".catalog__item--hidden");

  if (allBtn) {
    allBtn.addEventListener("click", () => {
      allBtn.classList.add("d-n");
      allCatalog.forEach((element) => {
        element.classList.toggle("hidden");
      });
    });
  }

  /// новый слайдер

  if (document.querySelector(".slider")) {
    const splide = new Splide(".slider", {
      perPage: 5,
      arrows: false,
      pagination: false,
    });

    splide.mount();

    document
      .querySelector(".slider-nav--prev")
      .addEventListener("click", function () {
        splide.go("<");
      });

    document
      .querySelector(".slider-nav--next")
      .addEventListener("click", function () {
        splide.go(">");
      });
  }

  /// открытие категорий

  const catalogNavBtn = document.querySelectorAll(".category-nav__btn");
  if (catalogNavBtn) {
    catalogNavBtn.forEach((el) => {
      el.addEventListener("click", () => {
        const catalogNavItem = el.closest(".category-nav__item");
        catalogNavItem.classList.toggle("active");
      });
    });
  }

  //// кнопка "в корзину"

  // Функционал для карточек товаров
  function initProductCards() {
    // Обработчик для кнопок "В корзину"
    const addToCartButtons = document.querySelectorAll(
      ".card__button[data-count]"
    );

    addToCartButtons.forEach((button) => {
      button.addEventListener("click", function (e) {
        e.preventDefault();

        const buttonBox = this.closest(".card__button-box");
        const addToCartBtn = buttonBox.querySelector(".card__button");
        const countBox = buttonBox.querySelector(".card__button-count");
        const countText = countBox.querySelector(".card__button-count-text");

        // Скрываем кнопку "В корзину" и показываем счетчик
        addToCartBtn.classList.add("is-hidden");
        countBox.classList.remove("is-hidden");

        // Сбрасываем счетчик на 1
        countText.textContent = "1";
      });
    });

    // Обработчики для кнопок + и -
    document.addEventListener("click", function (e) {
      // Кнопка "+"
      if (e.target.classList.contains("card__button-count--plus")) {
        e.preventDefault();

        const countBox = e.target.closest(".card__button-count");
        const countText = countBox.querySelector(".card__button-count-text");
        let count = parseInt(countText.textContent) || 1;

        count++;
        countText.textContent = count;
      }

      // Кнопка "-"
      if (e.target.classList.contains("card__button-count--minus")) {
        e.preventDefault();

        const countBox = e.target.closest(".card__button-count");
        const countText = countBox.querySelector(".card__button-count-text");
        let count = parseInt(countText.textContent) || 1;

        if (count > 1) {
          count--;
          countText.textContent = count;
        } else {
          // Если счетчик стал 1, возвращаем кнопку "В корзину"
          const buttonBox = e.target.closest(".card__button-box");
          const addToCartBtn = buttonBox.querySelector(".card__button");
          const countBox = buttonBox.querySelector(".card__button-count");

          addToCartBtn.classList.remove("is-hidden");
          countBox.classList.add("is-hidden");
        }
      }
    });
  }

  // Инициализация после загрузки DOM

  initProductCards();
});
