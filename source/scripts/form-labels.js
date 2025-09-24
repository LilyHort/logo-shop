
function initFormLabels() {
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
}

// Экспортируем функцию
export { initFormLabels };
