/* Открытие и закрытие меню */
const menuButton = document.querySelector(".header__nav-main-button");
const navMainList = document.querySelector(".header__nav-main-list");

// Инициализируем кнопку в состоянии "открыть"
menuButton.classList.add("header__nav-main-button--open");

function toggleMenu() {
  navMainList.classList.toggle("header__nav-main-list--open");
  
  // Проверяем текущее состояние и переключаем
  if (menuButton.classList.contains("header__nav-main-button--open")) {
    menuButton.classList.remove("header__nav-main-button--open");
    menuButton.classList.add("header__nav-main-button--close");
  } else {
    menuButton.classList.remove("header__nav-main-button--close");
    menuButton.classList.add("header__nav-main-button--open");
  }
}

menuButton.addEventListener("click", toggleMenu);