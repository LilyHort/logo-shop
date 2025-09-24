function collectOrderData(form) {
// Создаем объект FormData
  const formData = new FormData(form);
  // Добавляем чекбокс опции в FormData (он находится вне формы)
  const optionCheckbox = document.querySelector('#option');
  if (optionCheckbox) {
    console.log('Состояние чекбокса option:', optionCheckbox.checked);
    formData.set('option', optionCheckbox.checked ? 'on' : 'off');
  } else {
    console.log('Чекбокс #option не найден!');
  }

  // Добавляем промокод в FormData (он тоже находится вне формы)
  const promoInput = document.querySelector('#promo');
  if (promoInput) {
    formData.set('promo', promoInput.value || '');
  }

  // Собираем данные о товарах в корзине
  const cartItems = [];
  const cardItems = document.querySelectorAll('.card__item:not(.card__item-deleted)');

  cardItems.forEach((item, index) => {
    const title = item.querySelector('.card__title')?.textContent?.trim() || '';
    const selectedSize = item.querySelector('.card__size-item--active .card__size-label')?.textContent?.trim() || '';
    const selectedColor = item.querySelector('.card__color-item--active')?.classList.toString().match(/card__color-item--(\w+)/)?.[1] || '';
    const quantity = item.querySelector('.card__price-quantity-input')?.value || '1';
    const price = item.querySelector('.card__price-total .card__price-current')?.textContent?.replace(/[^\d]/g, '') || '0';

    cartItems.push({
      id: index + 1,
      title: title,
      size: selectedSize,
      color: selectedColor,
      quantity: parseInt(quantity, 10),
      price: parseInt(price, 10)
    });
  });

  // Собираем данные о способе оплаты
  const selectedPayment = document.querySelector('.payment__input:checked');
  const paymentMethod = selectedPayment ? selectedPayment.value : '';

  // Собираем данные о промокоде
  const promoCode = document.querySelector('#promo')?.value?.trim() || '';

  // Собираем данные о дополнительной опции
  const optionChecked = document.querySelector('#option')?.checked || false;

  // Собираем итоговую сумму
  const totalAmount = document.querySelector('.total__final-value')?.textContent?.replace(/[^\d]/g, '') || '0';

  // Создаем объект с полными данными заказа
  const orderData = {
    // Контактные данные
    name: formData.get('name') || '',
    surname: formData.get('surname') || '',
    phone: formData.get('phone') || '',
    email: formData.get('email') || '',
    address: formData.get('address') || '',

    // Способ оплаты
    paymentMethod: paymentMethod,

    // Комментарий
    comment: formData.get('comment') || '',

    // Промокод
    promoCode: promoCode,

    // Дополнительная опция
    option: optionChecked,

    // Товары в корзине
    cartItems: cartItems,

    // Итоговая сумма
    totalAmount: parseInt(totalAmount, 10),

    // Метаданные
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent
  };

  // Выводим данные в консоль
  console.log('=== ДАННЫЕ ЗАКАЗА ===');
  console.log('FormData объект:', formData);

  // Выводим содержимое FormData
  console.log('Содержимое FormData:');
  for (const [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }

  console.log('Структурированные данные заказа:', orderData);
  console.log('===================');

  // Можно также вывести отдельные части
  console.log('Контактные данные:', {
    name: orderData.name,
    surname: orderData.surname,
    phone: orderData.phone,
    email: orderData.email,
    address: orderData.address
  });

  console.log('Товары в корзине:', orderData.cartItems);
  console.log('Способ оплаты:', orderData.paymentMethod);
  console.log('Дополнительная опция (со склада):', orderData.option);
  console.log('Промокод:', orderData.promoCode);
  console.log('Итоговая сумма:', orderData.totalAmount);

}

// Экспортируем функцию
export { collectOrderData };
