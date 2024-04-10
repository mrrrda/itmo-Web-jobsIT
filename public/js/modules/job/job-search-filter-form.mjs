import { ElementsIds } from '../constants.mjs';
import { FormParser, FormValidation, FormValidationRule } from '../form-utils/index.mjs';
import { JobLoader } from './job-loader.mjs';

const form = document.getElementById(ElementsIds.jobsSearchForm);
const filterForm = document.getElementById(ElementsIds.jobsFilterForm);

const jobsContainer = new JobLoader({ containerId: ElementsIds.jobsContainerSectionId });

const TITLE_FIELD = 'title';
const LOCATION_FIELD = 'location';
const EXPERIENCE_FIELD = 'experience';
const EDUCATION_FIELD = 'education';
const MIN_SALARY_FIELD = 'minSalary';
const MAX_SALARY_FIELD = 'maxSalary';
const WORK_SCHEDULE_FIELD = 'workSchedule';
const WORK_PLACE_FIELD = 'workPlace';

const filters = {
  [TITLE_FIELD]: 'contains',
  [LOCATION_FIELD]: 'contains',
  [EXPERIENCE_FIELD]: 'equals',
  [EDUCATION_FIELD]: 'equals',
  [MIN_SALARY_FIELD]: 'gte',
  [MAX_SALARY_FIELD]: 'lte',
  [WORK_SCHEDULE_FIELD]: 'equals',
  [WORK_PLACE_FIELD]: 'equals',
};

const formValidationSchema = {
  [TITLE_FIELD]: new FormValidationRule(TITLE_FIELD)
    .string()
    .matches(/^[a-zA-Z\s,-]+$/, 'Only letters, hyphens, commas, and spaces are allowed'),
  [LOCATION_FIELD]: new FormValidationRule(LOCATION_FIELD)
    .string()
    .matches(/^[a-zA-Z\s,-]+$/, 'Only letters, hyphens, commas, and spaces are allowed'),
  [MIN_SALARY_FIELD]: new FormValidationRule(MIN_SALARY_FIELD)
    .number('Only numeric values are accepted')
    .min(0, 'Only positive values are accepted'),
  [MAX_SALARY_FIELD]: new FormValidationRule(MAX_SALARY_FIELD)
    .number('Only numeric values are accepted')
    .min(0, 'Only positive values are accepted'),
};

filterForm.addEventListener('submit', event => {
  event.preventDefault();

  const formValues = {
    [TITLE_FIELD]: FormParser.getTextValue(form, TITLE_FIELD).trim(),
    [LOCATION_FIELD]: FormParser.getTextValue(form, LOCATION_FIELD).trim(),
    [EXPERIENCE_FIELD]: FormParser.getSelectValue(filterForm, EXPERIENCE_FIELD),
    [EDUCATION_FIELD]: FormParser.getSelectValue(filterForm, EDUCATION_FIELD),
    [MIN_SALARY_FIELD]: FormParser.getTextValue(filterForm, MIN_SALARY_FIELD).trim(),
    [MAX_SALARY_FIELD]: FormParser.getTextValue(filterForm, MAX_SALARY_FIELD).trim(),
    [WORK_SCHEDULE_FIELD]: FormParser.getSelectValue(filterForm, WORK_SCHEDULE_FIELD),
    [WORK_PLACE_FIELD]: FormParser.getSelectValue(filterForm, WORK_PLACE_FIELD),
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

  const urlSearchParams = new URLSearchParams();

  Object.keys(formValues).forEach(key => {
    const paramsSize = urlSearchParams.size;
    const filter = filters[key];

    if (formValues[key]) {
      urlSearchParams.append(`filter[and][${paramsSize / 2}][key]`, key);
      urlSearchParams.append(`filter[and][${paramsSize / 2}][${filter}]`, formValues[key]);
    }
  });

  jobsContainer.load({
    onGetJobs: data => data,
    onGetUrl: () => `${location.origin}/api/jobs?${urlSearchParams.toString()}`,
  });
});
