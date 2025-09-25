// Импортируем все функции
import { initFormLabels } from './form-labels.js';
import { initMobileMenu } from './mobile-menu.js';
import { initToggleSwitches } from './toggle.js';
import { initColorSelection } from './change-color.js';
import { initSizeSelection } from './change-size.js';
import { initGoodsChanging } from './changing-goods.js';
import { initFormValidation, initCommentValidation, initOrderForm } from './valid.js';
import { initMap, initDaDataSuggestions } from './map.js';

// Инициализация кнопки "Наверх"
function initScrollToTop() {
  const scrollButton = document.querySelector('.footer__button');

  if (scrollButton) {
    scrollButton.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  initFormLabels();
  initMobileMenu();
  initToggleSwitches();
  initColorSelection();
  initSizeSelection();
  initGoodsChanging();
  initFormValidation();
  initOrderForm();
  initCommentValidation();
  initMap();
  initDaDataSuggestions();
  initScrollToTop();
});
