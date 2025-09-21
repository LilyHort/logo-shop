/* Синхронизация ширины карты с блоком total */
function syncMapWidthWithTotal() {
  const totalBlock = document.querySelector('.total');
  const mapBlock = document.querySelector('.contacts-personal__map');

  if (totalBlock && mapBlock && window.innerWidth >= 768) {
    const totalWidth = totalBlock.offsetWidth;
    mapBlock.style.setProperty('--total-width', `${totalWidth}px`);
  }
}

// Вызываем при загрузке и изменении размера окна
window.addEventListener('load', syncMapWidthWithTotal);
window.addEventListener('resize', syncMapWidthWithTotal);

/* Валидация форм только при отправке */
function validateInput(input) {
  const value = input.value.trim();
  const type = input.type;
  const required = input.hasAttribute('required');

  // Убираем предыдущие ошибки
  input.classList.remove('error');
  const existingError = input.parentNode.querySelector('.contacts-personal__error, .total__error, .footer__error');
  if (existingError) {
    existingError.remove();
  }

  let isValid = true;
  let errorMessage = '';

  // Проверка обязательных полей
  if (required && !value) {
    isValid = false;
    errorMessage = 'Это поле обязательно для заполнения';
  }

  // Проверка email
  if (type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      isValid = false;
      errorMessage = 'Введите корректный email адрес';
    }
  }

  // Проверка телефона
  if (input.name === 'phone' && value) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(value)) {
      isValid = false;
      errorMessage = 'Введите корректный номер телефона';
    }
  }

  // Показываем ошибку если есть
  if (!isValid) {
    input.classList.add('error');
    showErrorMessage(input, errorMessage);
  }

  return isValid;
}

function showErrorMessage(input, message) {
  const errorDiv = document.createElement('div');

  // Определяем класс ошибки в зависимости от родительского элемента
  if (input.closest('.contacts-personal')) {
    errorDiv.className = 'contacts-personal__error show';
  } else if (input.closest('.total')) {
    errorDiv.className = 'total__error show';
  } else if (input.closest('.footer')) {
    errorDiv.className = 'footer__error show';
  }

  errorDiv.textContent = message;
  input.parentNode.appendChild(errorDiv);
}

function showSuccessMessage(input, message) {
  const successDiv = document.createElement('div');
  successDiv.className = 'total__success show';
  successDiv.innerHTML = message;
  input.parentNode.appendChild(successDiv);
}

// Валидация купона
function validatePromoCode(promoInput) {
  const promoValue = promoInput.value.trim().toUpperCase();

  // Убираем предыдущие сообщения
  const existingError = promoInput.parentNode.querySelector('.total__error');
  const existingSuccess = promoInput.parentNode.querySelector('.total__success');
  if (existingError) {
    existingError.remove();
  }
  if (existingSuccess) {
    existingSuccess.remove();
  }

  // Список валидных купонов
  const validPromoCodes = ['1B6D9FC', 'DISCOUNT10', 'SAVE20', 'WELCOME'];

  if (promoValue && validPromoCodes.includes(promoValue)) {
    // Купон валиден
    promoInput.classList.remove('error');
    showSuccessMessage(promoInput, `<span class="valid-ok">${promoValue}</span> - купон применен`);
    return true;
  } else if (promoValue) {
    // Купон невалиден
    promoInput.classList.add('error');
    showErrorMessage(promoInput, 'Неверный промокод');
    return false;
  }

  // Поле пустое - убираем все сообщения
  promoInput.classList.remove('error');
  return true;
}

// Валидация только при отправке формы
document.addEventListener('DOMContentLoaded', () => {
  const forms = document.querySelectorAll('form');
  forms.forEach((form) => {
    form.addEventListener('submit', (event) => {
      let isFormValid = true;
      const formInputs = form.querySelectorAll('input[required]');

      // Очищаем предыдущие ошибки
      formInputs.forEach((input) => {
        input.classList.remove('error');
        const existingError = input.parentNode.querySelector('.contacts-personal__error, .total__error, .footer__error');
        if (existingError) {
          existingError.remove();
        }
      });

      // Валидируем все поля
      formInputs.forEach(input => {
        if (!validateInput(input)) {
          isFormValid = false;
        }
      });

      if (!isFormValid) {
        event.preventDefault();
      } else {
      // Если форма валидна, собираем данные в FormData
      const formData = collectFormData();

      // Выводим данные в console.log
      console.log('=== ДАННЫЕ ЗАКАЗА ===');
      console.log('FormData объект:', formData);

      // Выводим данные в удобном формате
      console.log('=== КОНТАКТНЫЕ ДАННЫЕ ===');
      console.log('Имя:', formData.get('name'));
      console.log('Фамилия:', formData.get('surname'));
      console.log('Телефон:', formData.get('phone'));
      console.log('Email:', formData.get('email'));
      console.log('Адрес:', formData.get('address'));

      console.log('=== СПОСОБ ОПЛАТЫ ===');
      console.log('Оплата:', formData.get('payment'));

      console.log('=== ДОПОЛНИТЕЛЬНО ===');
      console.log('Комментарий:', formData.get('comment') || 'Не указан');
      console.log('Промокод:', formData.get('promo') || 'Не указан');
      console.log('Получить со склада:', formData.get('getFromWarehouse') === 'true' ? 'Да' : 'Нет');

      console.log('=== ТОВАРЫ В КОРЗИНЕ ===');
      const cartItems = JSON.parse(formData.get('cartItems'));
      cartItems.forEach((item, index) => {
        console.log(`Товар ${index + 1}:`, item);
      });

      console.log('=== ИТОГОВЫЕ СУММЫ ===');
      const totals = JSON.parse(formData.get('totals'));
      console.log('Суммы:', totals);

      console.log('=== КОНЕЦ ДАННЫХ ЗАКАЗА ===');
    }
  });

  // Валидация промокода при вводе
  const promoInput = document.querySelector('#promo');
  if (promoInput) {
    promoInput.addEventListener('input', function() {
      // Небольшая задержка для валидации
      clearTimeout(this.validationTimeout);
      this.validationTimeout = setTimeout(() => {
        validatePromoCode(this);
      }, 500);
    });

    promoInput.addEventListener('blur', function() {
      validatePromoCode(this);
    });
  }
});

/* Открытие и закрытие меню */
const menuButton = document.querySelector('.header__nav-main-button');
const navMainList = document.querySelector('.header__nav-main-list');

// Инициализируем кнопку в состоянии "открыть"
menuButton.classList.add('header__nav-main-button--open');

function toggleMenu() {
  navMainList.classList.toggle('header__nav-main-list--open');

  // Проверяем текущее состояние и переключаем
  if (menuButton.classList.contains('header__nav-main-button--open')) {
    menuButton.classList.remove('header__nav-main-button--open');
    menuButton.classList.add('header__nav-main-button--close');
  } else {
    menuButton.classList.remove('header__nav-main-button--close');
    menuButton.classList.add('header__nav-main-button--open');
  }
}

menuButton.addEventListener('click', toggleMenu);

/* Выбор размера*/

const cardSizeItem = document.querySelectorAll('.card__size-item');

function toggleCardSizeItem() {
  cardSizeItem.forEach((item) => {
    item.classList.remove('card__size-item--active');
  });
  this.classList.add('card__size-item--active');
}

cardSizeItem.forEach((item) => {
  item.addEventListener('click', toggleCardSizeItem);
});

/* Выбор цвета*/

const cardColorItem = document.querySelectorAll('.card__color-item');

function toggleCardColorItem() {
  cardColorItem.forEach((item) => {
    item.classList.remove('card__color-item--active');
  });
  this.classList.add('card__color-item--active');
}

cardColorItem.forEach((item) => {
  item.addEventListener('click', toggleCardColorItem);
});

/* Изменение количества товара */

const quantityInputs = document.querySelectorAll('.card__price-quantity-input');
const minusButtons = document.querySelectorAll('.card__price-quantity-button--minus');
const plusButtons = document.querySelectorAll('.card__price-quantity-button--plus');

function updatePrice(cardItem) {
  const quantityInput = cardItem.querySelector('.card__price-quantity-input');
  const priceUnit = cardItem.querySelector('.card__price-unit .card__price-current');
  const priceTotal = cardItem.querySelector('.card__price-total .card__price-current');
  const priceTotalOld = cardItem.querySelector('.card__price-total .card__price-old');

  if (!quantityInput || !priceUnit || !priceTotal) {
    return;
  }

  const quantity = parseInt(quantityInput.value, 10);

  // Получаем базовую цену за единицу (сохраняем в data-атрибуте при первом запуске)
  let baseUnitPrice = parseInt(cardItem.dataset.basePrice, 10);
  if (!baseUnitPrice) {
    baseUnitPrice = parseInt(priceUnit.textContent.replace(/[^\d]/g, ''), 10);
    cardItem.dataset.basePrice = baseUnitPrice;
  }

  // .card__price-unit НЕ пересчитываем - это цена за единицу
  // Пересчитываем только общую цену в блоке total
  const totalPrice = baseUnitPrice * quantity;
  priceTotal.textContent = `${totalPrice.toLocaleString('ru-RU')} ₽`;

  // Обновляем старую общую цену, если она есть
  if (priceTotalOld && !priceTotalOld.classList.contains('card__price-old--none')) {
    let baseOldPrice = parseInt(cardItem.dataset.baseOldPrice, 10);
    if (!baseOldPrice) {
      // Если базовая старая цена не сохранена, берем из элемента
      baseOldPrice = parseInt(priceTotalOld.textContent.replace(/[^\d]/g, ''), 10);
      cardItem.dataset.baseOldPrice = baseOldPrice;
    }
    if (baseOldPrice) {
      const oldTotalPrice = baseOldPrice * quantity;
      priceTotalOld.textContent = `${oldTotalPrice.toLocaleString('ru-RU')} ₽`;
    }
  }

  updateCartSummary();
}

function updateCartSummary() {
  const activeItems = document.querySelectorAll('.card__item:not(.card__item-deleted)');
  const basketCount = document.querySelector('.basket__count');
  const basketTotal = document.querySelector('.basket__total');
  const totalFinalValue = document.querySelector('.total__final-value');

  // Счетчики в header
  const headerCartCount = document.querySelector('.header__nav-user-item:not(.header__nav-user-item--mobile) .header__nav-user-item-count');
  const headerFavoriteCount = document.querySelector('.header__nav-user-item--mobile .header__nav-user-item-count');

  // Элементы блока total
  const totalProductsPrice = document.querySelector('.total__item--products .total__price');
  const totalDiscountPrice = document.querySelector('.total__item--discount .total__price');

  let totalItems = 0;
  let totalPrice = 0;
  let totalOldPrice = 0;

  activeItems.forEach((item) => {
    const quantityInput = item.querySelector('.card__price-quantity-input');
    const priceTotal = item.querySelector('.card__price-total .card__price-current');
    const priceTotalOld = item.querySelector('.card__price-total .card__price-old');

    if (quantityInput && priceTotal) {
      const quantity = parseInt(quantityInput.value, 10);
      const price = parseInt(priceTotal.textContent.replace(/[^\d]/g, ''), 10);

      // Считаем старую цену, если есть
      let oldPrice = 0;
      if (priceTotalOld && !priceTotalOld.classList.contains('card__price-old--none')) {
        oldPrice = parseInt(priceTotalOld.textContent.replace(/[^\d]/g, ''), 10);
      }

      totalItems += quantity;
      totalPrice += price;
      totalOldPrice += oldPrice;
    }
  });

  // Обновляем корзину в header
  if (basketCount) {
    basketCount.textContent = totalItems;
  }

  if (basketTotal) {
    basketTotal.textContent = totalPrice.toLocaleString('ru-RU');
  }

  // Обновляем сумму товаров в блоке total
  if (totalProductsPrice) {
    const rubleSpan = totalProductsPrice.querySelector('.ruble--total');
    if (rubleSpan) {
      totalProductsPrice.innerHTML = `${totalPrice.toLocaleString('ru-RU')}&nbsp;${rubleSpan.outerHTML}`;
    } else {
      totalProductsPrice.textContent = `${totalPrice.toLocaleString('ru-RU')} ₽`;
    }
  }

  // Обновляем скидку в блоке total
  if (totalDiscountPrice && totalOldPrice > 0) {
    const discount = totalOldPrice - totalPrice;
    const rubleSpan = totalDiscountPrice.querySelector('.ruble--discount');
    if (rubleSpan) {
      totalDiscountPrice.innerHTML = `-&nbsp;${discount.toLocaleString('ru-RU')}&nbsp;${rubleSpan.outerHTML}`;
    } else {
      totalDiscountPrice.textContent = `- ${discount.toLocaleString('ru-RU')} ₽`;
    }
  }

  // Обновляем итоговую сумму в блоке total
  if (totalFinalValue) {
    const rubleSpan = totalFinalValue.querySelector('.ruble--total-price');
    if (rubleSpan) {
      totalFinalValue.innerHTML = `${totalPrice.toLocaleString('ru-RU')}&nbsp;${rubleSpan.outerHTML}`;
    } else {
      totalFinalValue.textContent = `${totalPrice.toLocaleString('ru-RU')} ₽`;
    }
  }

  // Обновляем счетчик корзины в header
  if (headerCartCount) {
    headerCartCount.textContent = totalItems;
  }

  // Обновляем счетчик избранного в header
  updateFavoriteCount();
}

function updateFavoriteCount() {
  const headerFavoriteCount = document.querySelector('.header__nav-user-item--mobile .header__nav-user-item-count');

  // Пока статичное значение, можно расширить логикой избранного
  const favoriteItems = 8; // Можно получать из localStorage или API

  if (headerFavoriteCount) {
    headerFavoriteCount.textContent = favoriteItems;
  }
}

function changeQuantity(cardItem, change) {
  const quantityInput = cardItem.querySelector('.card__price-quantity-input');
  if (!quantityInput){
    return;
  }

  const currentValue = parseInt(quantityInput.value, 10);
  let newValue = currentValue + change;

  // Ограничиваем минимум 1, максимум 100
  if (newValue < 1){
    newValue = 1;
  }

  if (newValue > 100){
    newValue = 100;
  }

  quantityInput.value = newValue;
  updatePrice(cardItem);
}

// Обработчики для кнопок минус
minusButtons.forEach((button) => {
  button.addEventListener('click', function() {
    const cardItem = this.closest('.card__item');
    changeQuantity(cardItem, -1);
  });
});

// Обработчики для кнопок плюс
plusButtons.forEach((button)=> {
  button.addEventListener('click', function() {
    const cardItem = this.closest('.card__item');
    changeQuantity(cardItem, 1);
  });
});

// Обработчики для прямого ввода в поле количества
quantityInputs.forEach((input) => {
  input.addEventListener('input', function() {
    const value = parseInt(this.value, 10);

    // Проверяем корректность значения
    if (isNaN(value) || value < 1) {
      this.value = 1;
    } else if (value > 100) {
      this.value = 100;
    }

    const cardItem = this.closest('.card__item');
    updatePrice(cardItem);
  });

  input.addEventListener('blur', function() {
    // При потере фокуса проверяем еще раз
    if (this.value === '' || parseInt(this.value, 10) < 1) {
      this.value = 1;
      const cardItem = this.closest('.card__item');
      updatePrice(cardItem);
    }
  });
});

// Инициализируем цены при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  const cardItems = document.querySelectorAll('.card__item:not(.card__item-deleted)');
  cardItems.forEach((item) => {
    const priceUnit = item.querySelector('.card__price-unit .card__price-current');
    const priceUnitOld = item.querySelector('.card__price-unit .card__price-old');
    const priceTotalOld = item.querySelector('.card__price-total .card__price-old');

    if (priceUnit) {
      const basePrice = parseInt(priceUnit.textContent.replace(/[^\d]/g, ''), 10);
      item.dataset.basePrice = basePrice;
    }

    // Сохраняем базовую старую цену за единицу (берем из unit блока)
    if (priceUnitOld && !priceUnitOld.classList.contains('card__price-old--none')) {
      const baseOldPrice = parseInt(priceUnitOld.textContent.replace(/[^\d]/g, ''), 10);
      item.dataset.baseOldPrice = baseOldPrice;
    } else if (priceTotalOld && !priceTotalOld.classList.contains('card__price-old--none')) {
      // Если в unit нет старой цены, а в total есть - значит это уже общая цена
      // Вычисляем цену за единицу из общей цены
      const quantityInput = item.querySelector('.card__price-quantity-input');
      const quantity = quantityInput ? parseInt(quantityInput.value, 10) : 1;
      const totalOldPrice = parseInt(priceTotalOld.textContent.replace(/[^\d]/g, ''), 10);
      const baseOldPrice = Math.round(totalOldPrice / quantity);
      item.dataset.baseOldPrice = baseOldPrice;
    }

    updatePrice(item);
  });

  // Обновляем счетчик избранного
  updateFavoriteCount();
});

/* Показ/скрытие лейблов в форме контактов */

const contactsInputs = document.querySelectorAll('.contacts-personal__input');

contactsInputs.forEach((input) => {
  const label = input.parentElement.querySelector('.contacts-personal__label');

  if (!label){
    return;
  }

  // Сохраняем оригинальный placeholder
  const originalPlaceholder = input.placeholder;

  // Проверяем при загрузке, если поле уже заполнено
  if (input.value.trim() !== '') {
    label.classList.add('contacts-personal__label--visible');
    input.placeholder = '';
  }

  // Показываем лейбл и скрываем placeholder при фокусе
  input.addEventListener('focus', () => {
    label.classList.add('contacts-personal__label--visible');
    input.placeholder = '';
  });

  input.addEventListener('input', () => {
    if (input.value.trim() !== '') {
      label.classList.add('contacts-personal__label--visible');
      input.placeholder = '';
    } else {
      label.classList.remove('contacts-personal__label--visible');
    }
  });

  // Восстанавливаем placeholder при потере фокуса, если поле пустое
  input.addEventListener('blur', () => {
    if (input.value.trim() === '') {
      label.classList.remove('contacts-personal__label--visible');
      input.placeholder = originalPlaceholder;
    }
  });
});

/* Интеграция с DaData и Яндекс.Карты */

// Конфигурация API (замените на ваши ключи)
const DADATA_TOKEN = '11d7d340d855116e8e9aaedbaefae9c02190e5e4';
//const YANDEX_API_KEY = 'f744a2c0-e2ea-421d-a839-f13515eb267e';

let yandexMap = null;
let mapPlacemark = null;

// Инициализация Яндекс.Карты
function initYandexMap() {
  window.ymaps.ready(() => {
    const mapContainer = document.querySelector('.contacts-personal__map');
    const addressInput = document.querySelector('#address');

    if (!mapContainer || !addressInput){
      return;
    }

    // Показываем карту сразу для тестирования
    mapContainer.classList.add('contacts-personal__map--visible');

    // Создаем карту с центром в Москве
    yandexMap = new window.ymaps.Map(mapContainer, {
      center: [55.751574, 37.573856], // Москва
      zoom: 10,
      controls: ['zoomControl']
    });

    // Обработчик изменения размера окна для адаптации карты
    let resizeTimeout;
    let previousWidth = window.innerWidth;

    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const currentWidth = window.innerWidth;

        if (yandexMap && Math.abs(currentWidth - previousWidth) > 50) {
          // Сохраняем текущее состояние карты
          const currentCenter = yandexMap.getCenter();
          const currentZoom = yandexMap.getZoom();
          const currentPlacemarks = [];

          // Сохраняем маркеры
          yandexMap.geoObjects.each((geoObject) => {
            if (geoObject.geometry.getType() === 'Point') {
              currentPlacemarks.push({
                coords: geoObject.geometry.getCoordinates(),
                properties: geoObject.properties.getAll()
              });
            }
          });

          // Уничтожаем старую карту
          yandexMap.destroy();

          // Создаем новую карту
          yandexMap = new window.ymaps.Map(mapContainer, {
            center: currentCenter,
            zoom: currentZoom,
            controls: ['zoomControl']
          });

          // Восстанавливаем маркеры
          currentPlacemarks.forEach((placemarkData) => {
            const placemark = new window.ymaps.Placemark(placemarkData.coords, placemarkData.properties, {
              preset: 'islands#blackDotIcon'
            });
            yandexMap.geoObjects.add(placemark);
            mapPlacemark = placemark;
          });

          // Добавляем обработчик клика заново
          yandexMap.events.add('click', (e) => {
            const coords = e.get('coords');
            addPlacemark(coords);

            window.ymaps.geocode(coords).then((res) => {
              const firstGeoObject = res.geoObjects.get(0);
              const address = firstGeoObject.getAddressLine();
              addressInput.value = address;

              const label = addressInput.parentElement.querySelector('.contacts-personal__label');
              if (label) {
                label.classList.add('contacts-personal__label--visible');
                addressInput.placeholder = '';
              }
            });
          });

          previousWidth = currentWidth;
        }
      }, 220);
    });

    // Обработчик клика по карте
    yandexMap.events.add('click', (e) => {
      const coords = e.get('coords');
      addPlacemark(coords);

      // Обратное геокодирование (координаты -> адрес)
      window.ymaps.geocode(coords).then((res) => {
        const firstGeoObject = res.geoObjects.get(0);
        const address = firstGeoObject.getAddressLine();

        addressInput.value = address;

        // Показываем лейбл
        const label = addressInput.parentElement.querySelector('.contacts-personal__label');
        if (label) {
          label.classList.add('contacts-personal__label--visible');
          addressInput.placeholder = '';
        }
      });
    });
  });
}

// Добавление маркера на карту
function addPlacemark(coords, address = '') {
  if (!yandexMap){
    return;
  }


  // Удаляем предыдущий маркер
  if (mapPlacemark) {
    yandexMap.geoObjects.remove(mapPlacemark);
  }

  // Создаем новый маркер с кастомной иконкой
  mapPlacemark = new window.ymaps.Placemark(coords, {
    hintContent: address || 'Выбранный адрес',
    balloonContent: address || 'Местоположение'
  }, {
    iconLayout: 'default#image',
    iconImageHref: `data:image/svg+xml;base64,${btoa(`
      <svg width="27" height="39" viewBox="0 0 27 39" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M26.4283 13.1881C26.4283 20.4716 20.3428 32.1025 13.2141 38.6965C6.70158 32.7642 0 20.4716 0 13.1881C0 5.9045 5.91617 0 13.2141 0C20.5121 0 26.4283 5.9045 26.4283 13.1881Z" fill="black"/>
<circle cx="13.2141" cy="13.1881" r="8" fill="white"/>
</svg>
    `)}`,

    iconImageSize: [27, 38],
    iconImageOffset: [-16, -16]
  });

  yandexMap.geoObjects.add(mapPlacemark);

  // Улучшенное центрирование карты на маркере
  if (coords && coords.length === 2 &&
      typeof coords[0] === 'number' &&
      typeof coords[1] === 'number') {
    yandexMap.setCenter(coords);
    yandexMap.setZoom(15);
  }

  // Показываем карту
  const mapContainer = document.querySelector('.contacts-personal__map');
  if (mapContainer) {
    mapContainer.classList.add('contacts-personal__map--visible');
  }
}

// Создаем выпадающий список для подсказок
function createSuggestionsList() {
  const suggestionsList = document.createElement('ul');
  suggestionsList.className = 'address-suggestions';
  return suggestionsList;
}

// Инициализация DaData автокомплита (собственная реализация)
function initDaDataSuggestions() {
  const addressInput = document.querySelector('#address');

  if (!addressInput || !DADATA_TOKEN || DADATA_TOKEN === 'YOUR_DADATA_TOKEN') {
    return;
  }

  // Создаем контейнер для подсказок
  const inputContainer = addressInput.parentElement;
  inputContainer.style.position = 'relative';

  const suggestionsList = createSuggestionsList();
  inputContainer.appendChild(suggestionsList);

  let debounceTimer;
  let geocodeTimer;

  // Функция для запроса к DaData API
  function fetchSuggestions(query) {
    return fetch('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Token ${DADATA_TOKEN}`
      },
      body: JSON.stringify({
        query: query,
        count: 5
      })
    })
      .then((response) => response.json())
      .catch(() => ({ suggestions: [] }));
  }

  // Показываем подсказки
  function showSuggestions(suggestions) {
    suggestionsList.innerHTML = '';

    if (suggestions.length === 0) {
      suggestionsList.classList.remove('address-suggestions--visible');
      return;
    }

    suggestions.forEach((suggestion) => {
      const li = document.createElement('li');
      li.className = 'address-suggestions__item';
      li.textContent = suggestion.value;

      li.addEventListener('click', () => {
        selectSuggestion(suggestion);
      });

      suggestionsList.appendChild(li);
    });

    suggestionsList.classList.add('address-suggestions--visible');
  }

  // Выбираем подсказку
  function selectSuggestion(suggestion) {
    addressInput.value = suggestion.value;
    suggestionsList.classList.remove('address-suggestions--visible');

    // Получаем координаты
    const coords = [
      parseFloat(suggestion.data.geo_lat),
      parseFloat(suggestion.data.geo_lon)
    ];

    // Добавляем маркер на карту
    if (coords[0] && coords[1]) {
      addPlacemark(coords, suggestion.value);
    }

    // Показываем лейбл
    const label = addressInput.parentElement.querySelector('.contacts-personal__label');
    if (label) {
      label.classList.add('contacts-personal__label--visible');
      addressInput.placeholder = '';
    }
  }

  // Обработчик ввода
  addressInput.addEventListener('input', function() {
    const query = this.value.trim();

    clearTimeout(debounceTimer);
    clearTimeout(geocodeTimer);

    if (query.length < 3) {
      suggestionsList.classList.remove('address-suggestions--visible');
      return;
    }

    // Показываем подсказки DaData
    debounceTimer = setTimeout(() => {
      fetchSuggestions(query).then((data) => {
        showSuggestions(data.suggestions || []);
      });
    }, 300);

    // Автоматическое геокодирование введенного адреса
    geocodeTimer = setTimeout(() => {
      if (window.ymaps) {
        window.ymaps.geocode(query).then((res) => {
          const firstGeoObject = res.geoObjects.get(0);
          if (firstGeoObject) {
            const coords = firstGeoObject.geometry.getCoordinates();
            const address = firstGeoObject.getAddressLine();

            // Добавляем маркер на карту
            addPlacemark(coords, address);
          }
        }).catch(() => {
          // Игнорируем ошибки геокодирования
        });
      }
    }, 1000); // Геокодируем через 1 секунду после ввода
  });

  // Обработчик для геокодирования введенного адреса
  addressInput.addEventListener('blur', function() {
    const query = this.value.trim();

    if (query.length >= 3) {
      // Геокодируем введенный адрес через Яндекс.Карты
      window.ymaps.geocode(query).then((res) => {
        const firstGeoObject = res.geoObjects.get(0);
        if (firstGeoObject) {
          const coords = firstGeoObject.geometry.getCoordinates();
          const address = firstGeoObject.getAddressLine();

          // Добавляем маркер на карту
          addPlacemark(coords, address);

          // Показываем лейбл
          const label = addressInput.parentElement.querySelector('.contacts-personal__label');
          if (label) {
            label.classList.add('contacts-personal__label--visible');
            addressInput.placeholder = '';
          }
        }
      }).catch(() => {
        // Игнорируем ошибки геокодирования
      });
    }
  });

  // Обработчик для Enter
  addressInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.blur(); // Вызываем blur для геокодирования
    }
  });

  // Скрываем подсказки при клике вне поля
  document.addEventListener('click', (event) => {
    if (!inputContainer.contains(event.target)) {
      suggestionsList.classList.remove('address-suggestions--visible');
    }
  });
}

/* Валидация комментария */

function initCommentValidation() {
  const commentInput = document.querySelector('.comment__input');
  const validationSpan = document.querySelector('.comment__validation');
  const countSpan = document.querySelector('.comment__validation-count');

  if (!commentInput || !validationSpan || !countSpan) {
    return;
  }

  const maxLength = 142;

  function updateValidation() {
    const currentLength = commentInput.value.length;
    countSpan.textContent = currentLength;

    // Сброс классов
    commentInput.classList.remove('comment__input--error', 'comment__input--warning');
    validationSpan.classList.remove('comment__validation--error', 'comment__validation--warning');

    if (currentLength > maxLength) {
      // Превышен лимит
      commentInput.classList.add('comment__input--error');
      validationSpan.classList.add('comment__validation--error');
    } else if (currentLength > maxLength - 20) {
      // Предупреждение (осталось менее 20 символов)
      commentInput.classList.add('comment__input--warning');
      validationSpan.classList.add('comment__validation--warning');
    }
  }

  // Обновляем при вводе
  commentInput.addEventListener('input', updateValidation);

  // Инициализируем при загрузке
  updateValidation();
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  // Ждем загрузки Яндекс.Карт
  const checkYandexMaps = () => {
    if (typeof window.ymaps !== 'undefined') {
      initYandexMap();
    } else {
      // Повторяем проверку через 500мс
      setTimeout(checkYandexMaps, 500);
    }
  };

  checkYandexMaps();

  // Инициализируем DaData сразу (без jQuery)
  initDaDataSuggestions();

  // Инициализируем валидацию комментария
  initCommentValidation();

  // Инициализируем toggle переключатели
  initToggleSwitches();
});

// Функция для сбора данных о товарах в корзине
function collectCartItems() {
  const cartItems = [];
  const cardItems = document.querySelectorAll('.card__item:not(.card__item-deleted)');

  cardItems.forEach((item, index) => {
    const itemData = {
      id: index + 1,
      title: item.querySelector('.card__title').textContent.trim(),
      image: item.querySelector('.card__image').src,
      size: item.querySelector('input[name*="size"]:checked')?.value || '',
      color: item.querySelector('input[name*="color"]:checked')?.value || '',
      quantity: parseInt(item.querySelector('.card__price-quantity-input').value) || 1,
      price: {
        old: item.querySelector('.card__price-old')?.textContent.replace(/[^\d]/g, '') || '0',
        current: item.querySelector('.card__price-current').textContent.replace(/[^\d]/g, '') || '0'
      }
    };

    cartItems.push(itemData);
  });

  return cartItems;
}

// Функция для сбора итоговых сумм
function collectTotals() {
  const totals = {
    products: document.querySelector('.total__item--products .total__price').textContent.replace(/[^\d]/g, '') || '0',
    discount: {
      total: document.querySelector('.total__item--discount .total__price').textContent.replace(/[^\d]/g, '') || '0',
      promotions: document.querySelector('.total__sub-item:first-child .total__subprice').textContent.replace(/[^\d]/g, '') || '0',
      promo: document.querySelector('.total__sub-item:last-child .total__subprice').textContent.replace(/[^\d]/g, '') || '0'
    },
    delivery: document.querySelector('.total__item--delivery .total__price').textContent.replace(/[^\d]/g, '') || '0',
    final: document.querySelector('.total__final-value').textContent.replace(/[^\d]/g, '') || '0'
  };

  return totals;
}

// Функция для сбора всех данных заказа в FormData
function collectFormData() {
  const formData = new FormData();

  // 1. Контактные данные
  const name = document.querySelector('#name').value;
  const surname = document.querySelector('#surname').value;
  const phone = document.querySelector('#phone').value;
  const email = document.querySelector('#email').value;
  const address = document.querySelector('#address').value;

  formData.append('name', name);
  formData.append('surname', surname);
  formData.append('phone', phone);
  formData.append('email', email);
  formData.append('address', address);

  // 2. Способ оплаты
  const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
  formData.append('payment', paymentMethod);

  // 3. Комментарий к заказу
  const comment = document.querySelector('#comment').value;
  if (comment) {
    formData.append('comment', comment);
  }

  // 4. Промокод
  const promoCode = document.querySelector('#promo').value;
  if (promoCode) {
    formData.append('promo', promoCode);
  }

  // 5. Опция "Получить товар со склада"
  const getFromWarehouse = document.querySelector('#option').checked;
  formData.append('getFromWarehouse', getFromWarehouse);

  // 6. Данные о товарах в корзине
  const cartItems = collectCartItems();
  formData.append('cartItems', JSON.stringify(cartItems));

  // 7. Итоговые суммы
  const totals = collectTotals();
  formData.append('totals', JSON.stringify(totals));

  return formData;
}

/* Toggle переключатели */

function initToggleSwitches() {
  const toggles = document.querySelectorAll('.total__option-toggle-icon');

  toggles.forEach((toggle) => {
    toggle.addEventListener('click', function() {
      this.classList.toggle('total__option-toggle-icon--checked');
    });
  });
}
