import { ElementsIds } from '../constants.mjs';
import { APP_STATE } from '../appstate.mjs';
import { FormParser, FormValidation, FormValidationRule } from '../form-utils/index.mjs';
import { TableLoader } from './table-loader.mjs';

const tableColumnKeys = {
  country: 'country',
  numberOfCompanies: 'numberOfCompanies',
  numberOfEmployees: 'numberOfEmployees',
  totalUsers: 'totalUsers',
};

const tableColumnHeadings = {
  [tableColumnKeys.country]: 'Country',
  [tableColumnKeys.numberOfCompanies]: 'Number of Companies',
  [tableColumnKeys.numberOfEmployees]: 'Number of Employees',
  [tableColumnKeys.totalUsers]: 'Total Users',
};

const COUNTRY_SELECT_KEY = 'country-select';
const COLUMNS_SHOWN_KEY = 'columns-shown';
const MIN_TOTAL_USERS_KEY = 'min-total-users';

const DEFAULT_MIN_TOTAL_USERS = 0;
const DEFAULT_COLUMNS_SHOWN = [
  tableColumnKeys.country,
  tableColumnKeys.numberOfCompanies,
  tableColumnKeys.numberOfEmployees,
  tableColumnKeys.totalUsers,
];

const statsTable = new TableLoader(
  {
    onGetRows: data => {
      const filters = APP_STATE.getStatsTableFilters();

      return data.filter(record => {
        const minTotalUsers = Number(filters[MIN_TOTAL_USERS_KEY]) || DEFAULT_MIN_TOTAL_USERS;

        const noMatchByCountry =
          !filters[COUNTRY_SELECT_KEY] ||
          filters[COUNTRY_SELECT_KEY].toLowerCase() === record.country.toLowerCase();
        const noMatchByTotalUsersQty = record.totalUsers >= minTotalUsers;

        return noMatchByCountry && noMatchByTotalUsersQty;
      });
    },

    onGetColumns: () => {
      const filters = APP_STATE.getStatsTableFilters();

      const columns = filters[COLUMNS_SHOWN_KEY] || DEFAULT_COLUMNS_SHOWN;

      return columns.map(column => ({ value: column, label: tableColumnHeadings[column] }));
    },
    onGetUrl: () => {
      return '/stats/details';
    },
  },

  { containerId: ElementsIds.statsTableSectionId },
);

// FORM
const formValidationSchema = {
  [COUNTRY_SELECT_KEY]: new FormValidationRule(COUNTRY_SELECT_KEY)
    .string()
    .oneOf(APP_STATE.statsTableAvaliableCountries, 'Unsupported country'),
  [MIN_TOTAL_USERS_KEY]: new FormValidationRule(MIN_TOTAL_USERS_KEY)
    .number('Only numeric values are accepted')
    .min(0, 'Only positive values are accepted')
    .max(100000, 'Max value is 100000'),
};

const form = document.getElementById(ElementsIds.statsTableFormId);

form.addEventListener('submit', event => {
  event.preventDefault();

  const formValues = {
    [COUNTRY_SELECT_KEY]: FormParser.getTextValue(form, COUNTRY_SELECT_KEY).trim(),
    [COLUMNS_SHOWN_KEY]: FormParser.getCheckboxValues(form, COLUMNS_SHOWN_KEY),
    [MIN_TOTAL_USERS_KEY]: FormParser.getTextValue(form, MIN_TOTAL_USERS_KEY),
  };

  APP_STATE.setStatsTableFilters(formValues);

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

  statsTable.load();
});

const statsTableFilters = APP_STATE.getStatsTableFilters();

form.elements[COUNTRY_SELECT_KEY].value = statsTableFilters[COUNTRY_SELECT_KEY];
form.elements[MIN_TOTAL_USERS_KEY].value = statsTableFilters[MIN_TOTAL_USERS_KEY];

Array.from(form.elements[COLUMNS_SHOWN_KEY]).forEach(checkbox => {
  if (statsTableFilters[COLUMNS_SHOWN_KEY].includes(checkbox.value)) {
    checkbox.checked = true;
  }
});

statsTable.load();
