
/* Toggle переключатели */

function initToggleSwitches() {
  const toggles = document.querySelectorAll('.total__option-toggle-icon');

  toggles.forEach((toggle) => {
    // Синхронизируем начальное состояние
    const toggleContainer = toggle.closest('.total__option-toggle');
    const checkbox = toggleContainer.querySelector('.total__option-toggle-input');

    if (checkbox && checkbox.checked) {
      toggle.classList.add('total__option-toggle-icon--checked');
    }

    toggle.addEventListener('click', function() {
      if (checkbox) {
        // Переключаем состояние чекбокса
        checkbox.checked = !checkbox.checked;
        console.log('Чекбокс переключен:', checkbox.checked);
      }

      // Переключаем визуальное состояние
      this.classList.toggle('total__option-toggle-icon--checked');
    });
  });
}
