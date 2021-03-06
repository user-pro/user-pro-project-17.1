
function initBurger(burgerSelector, menuSelector) {
   const burger = document.querySelector(`${burgerSelector}`),
      menu = document.querySelector(`${menuSelector}`),
      body = document.querySelector('body');

   burger.addEventListener('click', () => {
      burger.classList.toggle('active');
      menu.classList.toggle('active');
      body.classList.toggle('lock');
   });
};
"use strict";

function DynamicAdapt(type) {
   this.type = type;
}

DynamicAdapt.prototype.init = function () {
   const _this = this;
   // массив объектов
   this.оbjects = [];
   this.daClassname = "_dynamic_adapt_";
   // массив DOM-элементов
   this.nodes = document.querySelectorAll("[data-da]");

   // наполнение оbjects объктами
   for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i];
      const data = node.dataset.da.trim();
      const dataArray = data.split(",");
      const оbject = {};
      оbject.element = node;
      оbject.parent = node.parentNode;
      оbject.destination = document.querySelector(dataArray[0].trim());
      оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
      оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
      оbject.index = this.indexInParent(оbject.parent, оbject.element);
      this.оbjects.push(оbject);
   }

   this.arraySort(this.оbjects);

   // массив уникальных медиа-запросов
   this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
      return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
   }, this);
   this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
      return Array.prototype.indexOf.call(self, item) === index;
   });

   // навешивание слушателя на медиа-запрос
   // и вызов обработчика при первом запуске
   for (let i = 0; i < this.mediaQueries.length; i++) {
      const media = this.mediaQueries[i];
      const mediaSplit = String.prototype.split.call(media, ',');
      const matchMedia = window.matchMedia(mediaSplit[0]);
      const mediaBreakpoint = mediaSplit[1];

      // массив объектов с подходящим брейкпоинтом
      const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
         return item.breakpoint === mediaBreakpoint;
      });
      matchMedia.addListener(function () {
         _this.mediaHandler(matchMedia, оbjectsFilter);
      });
      this.mediaHandler(matchMedia, оbjectsFilter);
   }
};

DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
   if (matchMedia.matches) {
      for (let i = 0; i < оbjects.length; i++) {
         const оbject = оbjects[i];
         оbject.index = this.indexInParent(оbject.parent, оbject.element);
         this.moveTo(оbject.place, оbject.element, оbject.destination);
      }
   } else {
      for (let i = 0; i < оbjects.length; i++) {
         const оbject = оbjects[i];
         if (оbject.element.classList.contains(this.daClassname)) {
            this.moveBack(оbject.parent, оbject.element, оbject.index);
         }
      }
   }
};

// Функция перемещения
DynamicAdapt.prototype.moveTo = function (place, element, destination) {
   element.classList.add(this.daClassname);
   if (place === 'last' || place >= destination.children.length) {
      destination.insertAdjacentElement('beforeend', element);
      return;
   }
   if (place === 'first') {
      destination.insertAdjacentElement('afterbegin', element);
      return;
   }
   destination.children[place].insertAdjacentElement('beforebegin', element);
}

// Функция возврата
DynamicAdapt.prototype.moveBack = function (parent, element, index) {
   element.classList.remove(this.daClassname);
   if (parent.children[index] !== undefined) {
      parent.children[index].insertAdjacentElement('beforebegin', element);
   } else {
      parent.insertAdjacentElement('beforeend', element);
   }
}

// Функция получения индекса внутри родителя
DynamicAdapt.prototype.indexInParent = function (parent, element) {
   const array = Array.prototype.slice.call(parent.children);
   return Array.prototype.indexOf.call(array, element);
};

// Функция сортировки массива по breakpoint и place 
// по возрастанию для this.type = min
// по убыванию для this.type = max
DynamicAdapt.prototype.arraySort = function (arr) {
   if (this.type === "min") {
      Array.prototype.sort.call(arr, function (a, b) {
         if (a.breakpoint === b.breakpoint) {
            if (a.place === b.place) {
               return 0;
            }

            if (a.place === "first" || b.place === "last") {
               return -1;
            }

            if (a.place === "last" || b.place === "first") {
               return 1;
            }

            return a.place - b.place;
         }

         return a.breakpoint - b.breakpoint;
      });
   } else {
      Array.prototype.sort.call(arr, function (a, b) {
         if (a.breakpoint === b.breakpoint) {
            if (a.place === b.place) {
               return 0;
            }

            if (a.place === "first" || b.place === "last") {
               return 1;
            }

            if (a.place === "last" || b.place === "first") {
               return -1;
            }

            return b.place - a.place;
         }

         return b.breakpoint - a.breakpoint;
      });
      return;
   }
};

const da = new DynamicAdapt("max");
da.init();;
; (function () {
   const companiesSection = document.querySelector(`.companies`);

   function closestItemsByClass(item, className) {
      let node = item;
      while (node) {
         if (node.classList.contains(className)) {
            return node;
         }
         node = node.parentElement;
      }
      return null;
   }

   function removeChildren(item) {
      while (item.firstChild) {
         item.removeChild(item.firstChild);
      }

   }
   function updateChildren(item, children) {
      removeChildren(item);

      children.forEach((elem) => {
         item.appendChild(elem);
      });
   }

   if (!companiesSection) {
      return;
   }

   const companiesBlock = companiesSection.querySelector(`.companies-wrapper`),
      companiesFilter = companiesSection.querySelector(`.companies-filter`),
      companiesItems = companiesSection.querySelectorAll(`.company-wrapper-js`);


   companiesFilter.addEventListener(`click`, e => {
      let target = e.target,
         item = closestItemsByClass(target, `companies-filter__button`);

      if (!item || item.classList.contains(`active`)) {
         return;
      }

      e.preventDefault();
      let filterValue = item.getAttribute(`data-filter`),
         activeButton = companiesFilter.querySelector(`.companies-filter__button.active`);

      activeButton.classList.remove(`active`);
      item.classList.add(`active`);


      if (filterValue === `all`) {
         updateChildren(companiesBlock, companiesItems);
         return;
      }

      let filteredItems = [];

      companiesItems.forEach((item) => {
         if (item.getAttribute(`data-category`) === filterValue) {
            filteredItems.push(item);
         }
      });

      updateChildren(companiesBlock, filteredItems);
   });


})();;
function testWebP(callback) {

   var webP = new Image();
   webP.onload = webP.onerror = function () {
      callback(webP.height == 2);
   };
   webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}

testWebP(function (support) {

   if (support == true) {
      document.querySelector('body').classList.add('webp');
   } else {
      document.querySelector('body').classList.add('no-webp');
   }
});;



initBurger('.header__burger', '.header__menu');
const partnersSlider = new Swiper(`.partners-slider`, {
   navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
   },
   loop: true,
   spaceBetween: 150,
   pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
   },
   sliderPerView: 1,
});

const footer = document.querySelector(`.footer`),
   phoneButton = document.querySelector(`.phone-button`),
   accordeons = document.querySelectorAll(`.accordeon`);


const accordTimeOut = 200;
accordeons.forEach((accordeon) => {
   accordeon.classList.add(`hide`);
   setTimeout(() => {
      const accodeonButton = accordeon.querySelector(`.accordeon__button`),
         accordeonContent = accordeon.querySelector(`.accordeon__content`);
      let accContentHeight = accordeonContent.querySelector(`.accordeon-content-js`).clientHeight;

      document.querySelectorAll(`.accordeon__content`).forEach(item => item.style.cssText = `max-height: 0px;margin-top: 0px;`);

      accordeon.addEventListener(`click`, () => {
         accContentHeight = accordeonContent.querySelector(`.accordeon-content-js`).clientHeight;
         console.log(accContentHeight);

         accordeon.classList.toggle(`open`);
         if (accordeon.classList.contains(`open`)) {
            accordeonContent.style.cssText = `
               max-height: ${accContentHeight}px;
               margin-top: 10px;
            `;
            accodeonButton.classList.remove(`on`);
            accodeonButton.classList.add(`off`);

         } else {
            accordeonContent.style.cssText = `
               max-height: 0px;
               margin-top: 0px;
            `;
            accodeonButton.classList.add(`on`);
            accodeonButton.classList.remove(`off`);
         }
      });
   }, accordTimeOut);
});


document.addEventListener('scroll', () => {
   if (footer && (footer.getBoundingClientRect().y <= 0) && document.documentElement.clientWidth < 496) {
      phoneButton.style.left = `75%`;
   }
});