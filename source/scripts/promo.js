// Инициализация кнопки промокода
export function initPromoButton() {
  const promoInput = document.querySelector('#promo');
  const promoButton = document.querySelector('.total__input-button');

  if (!promoInput || !promoButton) {
    return;
  }

  // Скрываем кнопку изначально
  promoButton.style.display = 'none';

  // Показываем/скрываем кнопку при вводе
  promoInput.addEventListener('input', function() {
    if (this.value.trim().length > 0) {
      promoButton.style.display = 'flex';
    } else {
      promoButton.style.display = 'none';
    }
  });

  // Скрываем кнопку при потере фокуса, если поле пустое
  promoInput.addEventListener('blur', function() {
    if (this.value.trim().length === 0) {
      promoButton.style.display = 'none';
    }
  });

  // Обработчик клика на кнопку "Применить"
  promoButton.addEventListener('click', () => {
    const promoCode = promoInput.value.trim();
    if (promoCode) {
      // Проверяем промокод (здесь можно добавить логику валидации)
      if (promoCode === 'VALID' || promoCode === 'TEST') {
        showPromoSuccess(promoCode);
      } else {
        showPromoError(promoCode);
      }

      // Очищаем поле и скрываем кнопку
      promoInput.value = '';
      promoButton.style.display = 'none';
    }
  });

  // Функция для показа сообщения об успешном применении промокода
  function showPromoSuccess(promoCode) {
    // Удаляем предыдущие сообщения
    const existingMessage = document.querySelector('.total__promo-success');
    if (existingMessage) {
      existingMessage.remove();
    }

    // Создаем новое сообщение
    const successMessage = document.createElement('div');
    successMessage.className = 'total__promo-success';
    successMessage.textContent = `${promoCode} - купон применен`;

    // Вставляем сообщение после input контейнера
    const inputContainer = document.querySelector('.total__input');
    if (inputContainer) {
      inputContainer.insertAdjacentElement('afterend', successMessage);
    }

    // Автоматически скрываем сообщение через 5 секунд
    setTimeout(() => {
      if (successMessage.parentNode) {
        successMessage.remove();
      }
    }, 5000);
  }

  // Функция для показа сообщения об ошибке промокода
  function showPromoError(promoCode) {
    // Удаляем предыдущие сообщения
    const existingMessage = document.querySelector('.total__promo-error');
    if (existingMessage) {
      existingMessage.remove();
    }

    // Создаем новое сообщение об ошибке
    const errorMessage = document.createElement('div');
    errorMessage.className = 'total__promo-error';
    errorMessage.textContent = `${promoCode} - купон не найден`;

    // Вставляем сообщение после input контейнера
    const inputContainer = document.querySelector('.total__input');
    if (inputContainer) {
      inputContainer.insertAdjacentElement('afterend', errorMessage);
    }

    // Автоматически скрываем сообщение через 5 секунд
    setTimeout(() => {
      if (errorMessage.parentNode) {
        errorMessage.remove();
      }
    }, 5000);
  }
}
