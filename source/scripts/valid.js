/* Валидация форм */

// Импортируем функцию сбора данных
import { collectOrderData } from './form-data.js';

function validateInput(input) {
  const value = input.value.trim();
  const type = input.type;
  const required = input.hasAttribute('required');

  // Убираем предыдущие ошибки
  input.classList.remove('error');
  const existingError = input.parentNode.querySelector('.contacts-personal__error');
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

  // Проверка имени (только буквы и пробелы)
  if (input.name === 'name' && value) {
    const nameRegex = /^[а-яё\s]+$/i;
    if (!nameRegex.test(value)) {
      isValid = false;
      errorMessage = 'Используйте только буквы';
    }
  }

  // Проверка фамилии (только буквы и пробелы)
  if (input.name === 'surname' && value) {
    const nameRegex = /^[а-яё\s]+$/i;
    if (!nameRegex.test(value)) {
      isValid = false;
      errorMessage = 'Используйте только буквы';
    }
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
  errorDiv.className = 'contacts-personal__error show';
  errorDiv.textContent = message;
  input.parentNode.appendChild(errorDiv);
}

function initFormValidation() {
  const formInputs = document.querySelectorAll('.contacts-personal__input');

  formInputs.forEach((input) => {
    // Валидация при потере фокуса
    input.addEventListener('blur', function() {
      validateInput(this);
    });

    // Валидация при вводе (с задержкой)
    input.addEventListener('input', function() {
      clearTimeout(this.validationTimeout);
      this.validationTimeout = setTimeout(() => {
        validateInput(this);
      }, 500);
    });
  });
}


function validateForm(form) {
  const requiredFields = [
    { name: 'name', label: 'Имя' },
    { name: 'surname', label: 'Фамилия' },
    { name: 'phone', label: 'Телефон' },
    { name: 'email', label: 'Email' },
    { name: 'address', label: 'Адрес доставки' }
  ];

  const errors = [];

  // Убираем все предыдущие ошибки
  const allInputs = form.querySelectorAll('.contacts-personal__input');
  allInputs.forEach((input) => {
    input.classList.remove('error');
  });

  // Проверяем обязательные поля
  requiredFields.forEach((field) => {
    const input = form.querySelector(`[name="${field.name}"]`);
    if (!input || !input.value.trim()) {
      errors.push(`${field.label} обязательно для заполнения`);
      if (input) {
        input.classList.add('error');
      }
    }
  });

  // Проверяем способ оплаты
  const selectedPayment = document.querySelector('.payment__input:checked');
  if (!selectedPayment) {
    errors.push('Выберите способ оплаты');
  }

  // Проверяем email формат
  const emailInput = form.querySelector('[name="email"]');
  if (emailInput && emailInput.value.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      errors.push('Введите корректный email адрес');
      emailInput.classList.add('error');
    }
  }

  // Проверяем телефон
  const phoneInput = form.querySelector('[name="phone"]');
  if (phoneInput && phoneInput.value.trim()) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(phoneInput.value.trim())) {
      errors.push('Введите корректный номер телефона');
      phoneInput.classList.add('error');
    }
  }

  return errors;
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

// Функция для показа ошибок валидации
function showValidationErrors(errors) {
  // Проверяем входные данные
  if (!Array.isArray(errors) || errors.length === 0) {
    return;
  }

  // Удаляем предыдущие уведомления
  const existingContainer = document.querySelector('.validation-errors');
  if (existingContainer) {
    existingContainer.remove();
  }

  // Создаем контейнер для ошибок
  const errorContainer = document.createElement('div');
  errorContainer.className = 'validation-errors';
  errorContainer.setAttribute('role', 'alert');
  errorContainer.setAttribute('aria-live', 'polite');

  // Создаем заголовок
  const title = document.createElement('div');
  title.className = 'validation-errors__title';
  title.textContent = 'Ошибки валидации:';

  // Создаем список ошибок
  const list = document.createElement('ul');
  list.className = 'validation-errors__list';

  errors.forEach(error => {
    if (typeof error === 'string' && error.trim()) {
      const listItem = document.createElement('li');
      listItem.className = 'validation-errors__item';
      listItem.textContent = error.trim();
      list.appendChild(listItem);
    }
  });

  errorContainer.appendChild(title);
  errorContainer.appendChild(list);
  document.body.appendChild(errorContainer);

  // Автоматически скрываем через 5 секунд
  setTimeout(() => {
    if (errorContainer && errorContainer.parentNode) {
      errorContainer.remove();
    }
  }, 5000);
}

// Функция инициализации формы заказа
function initOrderForm() {
  try {
    const form = document.querySelector('.form');
    const submitButton = document.querySelector('.total__button');

    if (!form || !submitButton) {
      console.warn('Форма или кнопка отправки не найдены');
      return;
    }

    // Проверяем, что функции валидации доступны
    if (typeof validateForm !== 'function' || typeof collectOrderData !== 'function') {
      console.error('Функции валидации или сбора данных недоступны');
      return;
    }

    // Добавляем обработчики для очистки ошибок при вводе
    const inputs = form.querySelectorAll('.contacts-personal__input');
    inputs.forEach((input) => {
      if (input && typeof input.addEventListener === 'function') {
        input.addEventListener('input', function() {
          try {
            this.classList.remove('error');
            // Убираем сообщение об ошибках при вводе
            const errorContainer = document.querySelector('.validation-errors');
            if (errorContainer && errorContainer.parentNode) {
              errorContainer.remove();
            }
          } catch (error) {
            console.warn('Ошибка при очистке ошибок:', error);
          }
        });
      }
    });

    // Обработчик клика на кнопку "Оформить заказ"
    submitButton.addEventListener('click', (e) => {
      try {
        e.preventDefault();

        // Валидируем форму
        const validationErrors = validateForm(form);

        if (Array.isArray(validationErrors) && validationErrors.length > 0) {
          // Показываем ошибки пользователю
          showValidationErrors(validationErrors);
          return; // Останавливаем отправку формы
        }

        // Если валидация прошла успешно, собираем данные
        collectOrderData(form);
      } catch (error) {
        console.error('Ошибка при обработке клика на кнопку:', error);
        showValidationErrors(['Произошла ошибка при отправке формы. Попробуйте еще раз.']);
      }
    });

    // Обработчик отправки формы
    form.addEventListener('submit', (e) => {
      try {
        e.preventDefault();

        // Валидируем форму
        const validationErrors = validateForm(form);

        if (Array.isArray(validationErrors) && validationErrors.length > 0) {
          // Показываем ошибки пользователю
          showValidationErrors(validationErrors);
          return; // Останавливаем отправку формы
        }

        // Если валидация прошла успешно, собираем данные
        collectOrderData(form);
      } catch (error) {
        console.error('Ошибка при отправке формы:', error);
        showValidationErrors(['Произошла ошибка при отправке формы. Попробуйте еще раз.']);
      }
    });

  } catch (error) {
    console.error('Ошибка при инициализации формы заказа:', error);
  }
}

// Экспортируем функции
export { validateForm, initFormValidation, initCommentValidation, showValidationErrors, initOrderForm };
