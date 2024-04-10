export const APP_STATE = {
  statsTableAvaliableCountries: [
    'Russia',
    'Serbia',
    'USA',
    'Poland',
    'Finland',
    'France',
    'England',
  ],
  statsTableFilters: null,
  jobSearchFormValues: null,

  setStatsTableFilters(filters) {
    this.statsTableFilters = filters;
    localStorage.setItem('statsTableFilters', JSON.stringify(filters));
  },

  getStatsTableFilters() {
    this.statsTableFilters = JSON.parse(localStorage.getItem('statsTableFilters'));
    return this.statsTableFilters;
  },

  setJobSearchFormValues(formValues) {
    this.jobSearchFormValues = formValues;
    localStorage.setItem('formValues', JSON.stringify(formValues));
  },

  getJobSearchFormValues() {
    this.jobSearchFormValues = JSON.parse(localStorage.getItem('formValues'));
    return this.jobSearchFormValues;
  },
};
