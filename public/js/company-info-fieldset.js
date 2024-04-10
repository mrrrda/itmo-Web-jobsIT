(function () {
  const radioButtons = document.querySelectorAll('input[name="user-role"]');
  const companyInfoFieldset = document.querySelector('fieldset[data-input-name="company-info"]');
  const hiddenClassName = 'company-info_hidden';

  radioButtons.forEach(function (radioButton) {
    radioButton.addEventListener('change', function () {
      if (this.value === 'EMPLOYER' && this.checked) {
        companyInfoFieldset.classList.remove(hiddenClassName);
      } else {
        companyInfoFieldset.classList.add(hiddenClassName);
      }
    });
  });
})();
