/* Выбор размера*/

const cardSizeItems = document.querySelectorAll('.card__size-item');

function toggleCardSizeItem() {
  // Проверяем, не является ли размер недоступным для выбора
  if (this.classList.contains('card__size-item--none')) {
    return; // Не выполняем выбор, если размер недоступен
  }

  // Находим все размеры в той же карточке товара
  const currentCard = this.closest('.card__item');
  const cardSizeItemsInCurrentCard = currentCard.querySelectorAll('.card__size-item');

  // Убираем активный класс и clicked класс со всех размеров в текущей карточке
  cardSizeItemsInCurrentCard.forEach((item) => {
    item.classList.remove('card__size-item--active', 'card__size-item--clicked');
    const sizeLabel = item.querySelector('.card__size-label');
    if (sizeLabel) {
      sizeLabel.classList.remove('card__size-label--active');
    }
  });

  // Добавляем активный класс и clicked класс к выбранному размеру
  this.classList.add('card__size-item--active', 'card__size-item--clicked');
  const selectedSizeLabel = this.querySelector('.card__size-label');
  if (selectedSizeLabel) {
    selectedSizeLabel.classList.add('card__size-label--active');
  }
}

function initSizeSelection() {
  cardSizeItems.forEach((item) => {
    item.addEventListener('click', toggleCardSizeItem);
  });
}

// Экспортируем функцию
export { initSizeSelection };
