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

  let totalItems = 0;
  let totalPrice = 0;

  activeItems.forEach((item) => {
    const quantityInput = item.querySelector('.card__price-quantity-input');
    const priceTotal = item.querySelector('.card__price-total .card__price-current');

    if (quantityInput && priceTotal) {
      const quantity = parseInt(quantityInput.value, 10);
      const price = parseInt(priceTotal.textContent.replace(/[^\d]/g, ''), 10);

      totalItems += quantity;
      totalPrice += price;
    }
  });

  if (basketCount) {
    basketCount.textContent = totalItems;
  }

  if (basketTotal) {
    basketTotal.textContent = totalPrice.toLocaleString('ru-RU');
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
      controls: ['zoomControl', 'searchControl']
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
    // Вариант 1: Кастомная SVG иконка
    iconLayout: 'default#image',
    iconImageHref: `data:image/svg+xml;base64,${btoa(`
      <svg width="27" height="39" viewBox="0 0 27 39" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M26.4283 13.1881C26.4283 20.4716 20.3428 32.1025 13.2141 38.6965C6.70158 32.7642 0 20.4716 0 13.1881C0 5.9045 5.91617 0 13.2141 0C20.5121 0 26.4283 5.9045 26.4283 13.1881Z" fill="black"/>
<circle cx="13.2141" cy="13.1881" r="8" fill="white"/>
</svg>
    `)}`,

    iconImageSize: [32, 32],
    iconImageOffset: [-16, -16]
  });

  yandexMap.geoObjects.add(mapPlacemark);
  yandexMap.setCenter(coords, 15);

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

    if (query.length < 3) {
      suggestionsList.classList.remove('address-suggestions--visible');
      return;
    }

    debounceTimer = setTimeout(() => {
      fetchSuggestions(query).then((data) => {
        showSuggestions(data.suggestions || []);
      });
    }, 300);
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

  // Инициализируем форму подписки
  initNewsletterForm();
});

/* Toggle переключатели */

function initToggleSwitches() {
  const toggles = document.querySelectorAll('.total__option-toggle-icon');

  toggles.forEach((toggle) => {
    toggle.addEventListener('click', function() {
      this.classList.toggle('total__option-toggle-icon--checked');
    });
  });
}

/* Форма подписки на новости */
/*

function initNewsletterForm() {
  const form = document.querySelector('.footer__discount-form');
  const input = document.querySelector('.footer__discount-input');
  const button = document.querySelector('.footer__discount-button');

  if (!form || !input || !button) {
    return;
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const email = input.value.trim();

    // Простая валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      alert('Пожалуйста, введите email адрес');
      return;
    }

    if (!emailRegex.test(email)) {
      alert('Пожалуйста, введите корректный email адрес');
      return;
    }

    // Имитация отправки
    button.textContent = '✓';
    button.style.backgroundColor = '#28a745';
    input.value = '';
    input.placeholder = 'Спасибо за подписку!';

    // Возвращаем исходное состояние через 3 секунды
    setTimeout(() => {
      button.textContent = '→';
      button.style.backgroundColor = '';
      input.placeholder = 'Введите ваш email';
    }, 3000);
  });
}

*/
