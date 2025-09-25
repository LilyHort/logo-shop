
// Инициализация кнопки "Наверх"
export function initScrollToTop() {
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
