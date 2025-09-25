/* Выбор цвета*/

const cardColorItem = document.querySelectorAll('.card__color-item');

function toggleCardColorItem() {
  // Находим все цвета в той же карточке товара
  const currentCard = this.closest('.card__item');
  const cardColorItemsInCurrentCard = currentCard.querySelectorAll('.card__color-item');

  // Убираем активный класс со всех цветов в текущей карточке
  cardColorItemsInCurrentCard.forEach((item) => {
    item.classList.remove('card__color-item--active');
    const colorLabel = item.querySelector('.card__color-label');
    if (colorLabel) {
      colorLabel.classList.remove('card__color-label--active');
    }
  });

  // Добавляем активный класс к выбранному цвету
  this.classList.add('card__color-item--active');
  const selectedColorLabel = this.querySelector('.card__color-label');
  if (selectedColorLabel) {
    selectedColorLabel.classList.add('card__color-label--active');
  }
}

function initColorSelection() {
  cardColorItem.forEach((item) => {
    item.addEventListener('click', toggleCardColorItem);
  });
}

// Экспортируем функцию
export { initColorSelection };
