import { ElementsIds } from '../constants.mjs';
import { FormParser, FormValidation, FormValidationRule } from '../form-utils/index.mjs';

// eslint-disable-next-line max-len
const EMAIL_REGEX = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/;

const form = document.getElementById(ElementsIds.signUpForm);

const FIRST_NAME_FIELD = 'first-name';
const LAST_NAME_FIELD = 'last-name';
const EMAIL_FIELD = 'email';
const PASSWORD_FIELD = 'password';
const USER_ROLE_FIELD = 'user-role';

const COMPANY_NAME_FIELD = 'company-name';
const COMPANY_LOCATION_ZIP_FIELD = 'company-location-zip';
const COMPANY_LOCATION_COUNTRY_FIELD = 'company-location-country';
const COMPANY_LOCATION_CITY_FIELD = 'company-location-city';
const COMPANY_LOCATION_ADDRESS_FIELD = 'company-location-address';

const EMPLOYER_ROLE = 'EMPLOYER';
// const APPLICANT_ROLE = 'APPLICANT';

const formValidationSchema = {
  [FIRST_NAME_FIELD]: new FormValidationRule(FIRST_NAME_FIELD)
    .string()
    .required('First name is required')
    .isAlpha('First name must be an alphabetic string'),
  [LAST_NAME_FIELD]: new FormValidationRule(LAST_NAME_FIELD)
    .string()
    .required('Last name is required')
    .isAlpha('Last name must be an alphabetic string'),
  [EMAIL_FIELD]: new FormValidationRule(EMAIL_FIELD)
    .string()
    .required('Email is required')
    .matches(EMAIL_REGEX, 'Invalid email'),
  [PASSWORD_FIELD]: new FormValidationRule(PASSWORD_FIELD)
    .string()
    .minLength(8, 'Password must contain at least 8 characters')
    .maxLength(16, 'The password length must not exceed 24 characters')
    .matches(PASSWORD_REGEX, 'Password must contain numbers and letters'),
  [USER_ROLE_FIELD]: new FormValidationRule(USER_ROLE_FIELD).required('User role is required'),
  [COMPANY_NAME_FIELD]: new FormValidationRule(COMPANY_NAME_FIELD)
    .minLength(2, 'Company name must contain at least 2 characters')
    .matches(/^[a-zA-Z\s,-]+$/, 'Only letters, hyphens, commas, and spaces are allowed'),
  [COMPANY_LOCATION_ZIP_FIELD]: new FormValidationRule(COMPANY_LOCATION_ZIP_FIELD)
    .minLength(4, 'Zip code must contain at least 4 characters')
    .number('Invalid zip code'),
  [COMPANY_LOCATION_COUNTRY_FIELD]: new FormValidationRule(COMPANY_LOCATION_COUNTRY_FIELD)
    .minLength(3, 'Country must contain at least 3 characters')
    .matches(/^[a-zA-Z\s,-]+$/, 'Invalid country'),
  [COMPANY_LOCATION_CITY_FIELD]: new FormValidationRule(COMPANY_LOCATION_CITY_FIELD)
    .minLength(2, 'City must contain at least 2 characters')
    .matches(/^[a-zA-Z\s,-]+$/, 'Invalid city'),
  [COMPANY_LOCATION_ADDRESS_FIELD]: new FormValidationRule(COMPANY_LOCATION_ADDRESS_FIELD)
    .required('Address is required')
    .matches(/^[a-zA-Z\s,-]+$/, 'Invalid address'),
};

form.addEventListener('submit', async event => {
  event.preventDefault();

  const userRole = FormParser.getRadioValue(form, USER_ROLE_FIELD);
  let currentFormValidationSchema = { ...formValidationSchema };

  if (userRole !== EMPLOYER_ROLE) {
    delete currentFormValidationSchema[COMPANY_NAME_FIELD];
    delete currentFormValidationSchema[COMPANY_LOCATION_ZIP_FIELD];
    delete currentFormValidationSchema[COMPANY_LOCATION_COUNTRY_FIELD];
    delete currentFormValidationSchema[COMPANY_LOCATION_CITY_FIELD];
    delete currentFormValidationSchema[COMPANY_LOCATION_ADDRESS_FIELD];
  }

  const formValues = {
    [FIRST_NAME_FIELD]: FormParser.getTextValue(form, FIRST_NAME_FIELD).trim(),
    [LAST_NAME_FIELD]: FormParser.getTextValue(form, LAST_NAME_FIELD).trim(),
    [EMAIL_FIELD]: FormParser.getTextValue(form, EMAIL_FIELD).trim(),
    [PASSWORD_FIELD]: FormParser.getTextValue(form, PASSWORD_FIELD).trim(),
    [USER_ROLE_FIELD]: FormParser.getRadioValue(form, USER_ROLE_FIELD),
    [COMPANY_NAME_FIELD]: FormParser.getTextValue(form, COMPANY_NAME_FIELD).trim(),
    [COMPANY_LOCATION_ZIP_FIELD]: FormParser.getTextValue(form, COMPANY_LOCATION_ZIP_FIELD).trim(),
    [COMPANY_LOCATION_COUNTRY_FIELD]: FormParser.getTextValue(
      form,
      COMPANY_LOCATION_COUNTRY_FIELD,
    ).trim(),
    [COMPANY_LOCATION_CITY_FIELD]: FormParser.getTextValue(
      form,
      COMPANY_LOCATION_CITY_FIELD,
    ).trim(),
    [COMPANY_LOCATION_ADDRESS_FIELD]: FormParser.getTextValue(
      form,
      COMPANY_LOCATION_ADDRESS_FIELD,
    ).trim(),
  };

  const validationResult = FormValidation.validate(formValues, currentFormValidationSchema);

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

  if (data.status === 'FIELD_ERROR') {
    const errorMessageBox = document.querySelector(
      `[data-input-name=sign-up-form] > .input__error-message`,
    );
    errorMessageBox.textContent = 'Account already exists';
    errorMessageBox.classList.remove('input__error-message_hidden');
  }

  if (data.status !== 'OK') {
    return;
  }

  const userCreateEnpoint =
    formValues[USER_ROLE_FIELD] === EMPLOYER_ROLE ? 'companyStaffs' : 'applicants';

  await fetch(`/api/${userCreateEnpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      firstName: formValues[FIRST_NAME_FIELD],
      lastName: formValues[LAST_NAME_FIELD],
      authId: data.user.id,
      email: formValues[EMAIL_FIELD],
      password: formValues[PASSWORD_FIELD],
    }),
  });

  window.location = '/';
});
