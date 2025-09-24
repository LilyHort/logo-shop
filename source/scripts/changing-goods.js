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
