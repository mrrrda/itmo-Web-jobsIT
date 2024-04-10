export class FormParser {
  static getCheckboxValues(form, key) {
    const checkboxEl = form[key];

    const isCheckboxSingle = checkboxEl && checkboxEl.type === 'checkbox';
    const isCheckboxMultiple = checkboxEl && checkboxEl.length && checkboxEl[0].type === 'checkbox';
    const isCheckbox = isCheckboxSingle || isCheckboxMultiple;

    if (!isCheckbox) {
      return null;
    }

    if (isCheckboxMultiple) {
      return Array.from(checkboxEl)
        .filter(option => option.checked)
        .map(option => option.value);
    }

    return checkboxEl.checked ? [checkboxEl.value] : [];
  }

  static getRadioValue(form, key) {
    const radioEls = form[key];

    const isRadio = radioEls && radioEls[0].type === 'radio';

    if (!isRadio) {
      return null;
    }

    const checkedRadio = Array.from(radioEls).find(radio => radio.checked);
    return checkedRadio ? checkedRadio.value : '';
  }

  static getTextValue(form, key) {
    const inputEl = form[key];

    const isText = inputEl && (inputEl.type === 'text' || inputEl.type === 'password');

    if (!isText) {
      return null;
    }

    return inputEl.value;
  }

  static getSelectValue(form, key) {
    const selectEl = form.querySelector(`[name="${key}"]`);
    const selectedOption = selectEl.querySelector('.select__option_selected');
    return selectedOption ? selectedOption.dataset.value || '' : '';
  }
}
