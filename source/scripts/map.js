/* Синхронизация ширины карты с блоком total */

function syncMapWidthWithTotal() {
  const totalBlock = document.querySelector('.total');
  const mapBlock = document.querySelector('.contacts-personal__map');

  console.log('Синхронизация ширины карты:', { totalBlock, mapBlock, windowWidth: window.innerWidth });

  if (totalBlock && mapBlock && window.innerWidth >= 768) {
    const totalWidth = totalBlock.offsetWidth;
    mapBlock.style.setProperty('--total-width', `${totalWidth}px`);
    console.log('Установлена ширина карты:', totalWidth);
  }
}

// Вызываем при загрузке и изменении размера окна
window.addEventListener('load', syncMapWidthWithTotal);
window.addEventListener('resize', syncMapWidthWithTotal);


/* Интеграция с DaData и Яндекс.Карты */

// Конфигурация API
const DADATA_TOKEN = '11d7d340d855116e8e9aaedbaefae9c02190e5e4';

let yandexMap = null;
let mapPlacemark = null;

// Инициализация Яндекс.Карты
function initYandexMap() {
  console.log('Инициализация Яндекс.Карты...');

  window.ymaps.ready(() => {
    const mapContainer = document.querySelector('.contacts-personal__map');
    const addressInput = document.querySelector('#address');

    console.log('Элементы найдены:', { mapContainer, addressInput });

    if (!mapContainer || !addressInput){
      console.warn('Элементы карты не найдены');
      return;
    }

    // Показываем карту сразу для тестирования
    mapContainer.classList.add('contacts-personal__map--visible');
    console.log('Класс --visible добавлен к карте');

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

// Инициализация DaData автокомплита
function initDaDataSuggestions() {
  const addressInput = document.querySelector('#address');

  console.log('Инициализация DaData:', { addressInput, DADATA_TOKEN });

  if (!addressInput) {
    console.warn('Поле адреса не найдено');
    return;
  }

  if (!DADATA_TOKEN || DADATA_TOKEN === 'YOUR_DADATA_TOKEN') {
    console.warn('Токен DaData не настроен');
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
    console.log('Запрос к DaData API:', query);

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
      .then((response) => {
        console.log('Ответ от DaData API:', response.status);
        return response.json();
      })
      .then((data) => {
        console.log('Данные от DaData:', data);
        return data;
      })
      .catch((error) => {
        console.error('Ошибка запроса к DaData:', error);
        return { suggestions: [] };
      });
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

// Функция инициализации карты
function initMap() {
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
}

// Экспортируем функции
export { initMap, initDaDataSuggestions };
