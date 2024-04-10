import { ElementsIds } from '../constants.mjs';
import { FormParser, FormValidation, FormValidationRule } from '../form-utils/index.mjs';

// eslint-disable-next-line max-len
const EMAIL_REGEX =
  /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/;

const form = document.getElementById(ElementsIds.signInForm);

const EMAIL_FIELD = 'email';
const PASSWORD_FIELD = 'password';

const formValidationSchema = {
  [EMAIL_FIELD]: new FormValidationRule(EMAIL_FIELD)
    .string()
    .required('Email is required')
    .matches(EMAIL_REGEX, 'Invalid email'),
  [PASSWORD_FIELD]: new FormValidationRule(PASSWORD_FIELD)
    .string()
    .minLength(8, 'Password must contain at least 8 characters')
    .maxLength(16, 'The password length must not exceed 24 characters')
    .matches(PASSWORD_REGEX, 'Password must contain numbers and letters'),
};

form.addEventListener('submit', async event => {
  event.preventDefault();

  const formValues = {
    [EMAIL_FIELD]: FormParser.getTextValue(form, EMAIL_FIELD).trim(),
    [PASSWORD_FIELD]: FormParser.getTextValue(form, PASSWORD_FIELD).trim(),
  };

  const validationResult = FormValidation.validate(formValues, formValidationSchema);

  for (const formKey in formValues) {
    const errors = validationResult[formKey];
    const errorMessageBox = document.querySelector(
      `[data-input-name=${formKey}] > .input__error-message`,
    );

    if (errors && errorMessageBox) {
      errorMessageBox.classList.remove('input__error-message_hidden');
      errorMessageBox.textContent = errors[errors.length - 1];
    } else if (errorMessageBox) {
      errorMessageBox.classList.add('input__error-message_hidden');
      errorMessageBox.textContent = '';
    }
  }

  if (Object.keys(validationResult).length > 0) {
    return;
  }

  const formFields = [
    {
      id: 'email',
      value: formValues[EMAIL_FIELD],
    },
    {
      id: 'password',
      value: formValues[PASSWORD_FIELD],
    },
  ];

  const response = await fetch(form.action, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ formFields }),
    credentials: 'include',
    mode: 'same-origin',
  });

  const data = await response.json();

  if (data.status === 'WRONG_CREDENTIALS_ERROR') {
    const errorMessageBox = document.querySelector(
      `[data-input-name=sign-in-form] > .input__error-message`,
    );
    errorMessageBox.textContent = 'Wrong credentials';
    errorMessageBox.classList.remove('input__error-message_hidden');
  }

  if (data.status !== 'OK') {
    return;
  }

  window.location = '/';
});
