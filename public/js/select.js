(function () {
  const selects = document.querySelectorAll('.select');
  const hiddenClassName = 'select__options_hidden';

  selects.forEach(function (select) {
    const selected = select.querySelector('.select__option_selected');
    const options = select.querySelector('.select__options');

    selected.addEventListener('click', function () {
      options.classList.toggle(hiddenClassName);
    });

    options.querySelectorAll('.select__option').forEach(function (option) {
      option.addEventListener('click', function () {
        selected.textContent = option.textContent;
        options.classList.toggle(hiddenClassName);
        selected.dataset.value = option.dataset.value || '';
      });
    });
  });

  document.addEventListener('click', function (event) {
    selects.forEach(function (select) {
      const options = select.querySelector('.select__options');
      if (!select.contains(event.target)) {
        options.classList.add(hiddenClassName);
      }
    });
  });
})();
