import { APP_STATE } from '../appstate.mjs';
import { ElementsIds } from '../constants.mjs';
import { FormParser, FormValidation, FormValidationRule } from '../form-utils/index.mjs';
import { JobLoader } from './job-loader.mjs';

const form = document.getElementById(ElementsIds.jobsSearchForm);
const isHomePage = location.pathname === '/';

const jobsContainer = new JobLoader({ containerId: ElementsIds.jobsContainerSectionId });

const TITLE_FIELD = 'title';
const LOCATION_FIELD = 'location';

const jobSearchFormValues = APP_STATE.getJobSearchFormValues();

form.title.value = (jobSearchFormValues && jobSearchFormValues[TITLE_FIELD]) || '';
form.location.value = (jobSearchFormValues && jobSearchFormValues[LOCATION_FIELD]) || '';

const filters = {
  [TITLE_FIELD]: 'contains',
  [LOCATION_FIELD]: 'contains',
};

const formValidationSchema = {
  [TITLE_FIELD]: new FormValidationRule(TITLE_FIELD)
    .string()
    .matches(/^[a-zA-Z\s,-]+$/, 'Only letters, hyphens, commas, and spaces are allowed'),
  [LOCATION_FIELD]: new FormValidationRule(LOCATION_FIELD)
    .string()
    .matches(/^[a-zA-Z\s,-]+$/, 'Only letters, hyphens, commas, and spaces are allowed'),
};

form.addEventListener('submit', event => {
  event.preventDefault();

  const formValues = {
    [TITLE_FIELD]: FormParser.getTextValue(form, TITLE_FIELD).trim(),
    [LOCATION_FIELD]: FormParser.getTextValue(form, LOCATION_FIELD).trim(),
  };

  const validationResult = FormValidation.validate(formValues, formValidationSchema);

  for (const formKey in formValues) {
    const errors = validationResult[formKey];
    const errorMessageBox = document.querySelector(
      `.input[name=${formKey}] + .input__error-message`,
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

  APP_STATE.setJobSearchFormValues(formValues);

  const urlSearchParams = new URLSearchParams();

  Object.keys(formValues).forEach(key => {
    const paramsSize = urlSearchParams.size;
    const filter = filters[key];

    if (formValues[key]) {
      urlSearchParams.append(`filter[and][${paramsSize / 2}][key]`, key);
      urlSearchParams.append(`filter[and][${paramsSize / 2}][${filter}]`, formValues[key]);
    }
  });

  if (isHomePage) {
    location.replace(`${location.origin}/jobs-search?${urlSearchParams.toString()}`);
  } else {
    jobsContainer.load({
      onGetJobs: data => data,
      onGetUrl: () => `${location.origin}/api/jobs?${urlSearchParams.toString()}`,
    });
  }
});
