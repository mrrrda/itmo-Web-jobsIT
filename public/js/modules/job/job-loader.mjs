import { JobsContainer } from './job.mjs';

export class JobLoader {
  static FetchStatus = {
    pending: 0,
    success: 1,
    error: 2,
  };

  static LoaderEvent = {
    loadingStart: 'JobLoader/loadingStart',
    loadingFailed: 'JobLoader/loadingFailed',
    loadingSuccess: 'JobLoader/loadingSuccess',
  };

  constructor(options) {
    if (!options.containerId) {
      throw new Error('JobLoader is missing required parameters');
    }

    this.containerId = options.containerId;

    this._setupListeners();
  }

  async load(handlers) {
    if (!handlers.onGetJobs || !handlers.onGetUrl) {
      throw new Error('JobLoader is missing required parameters');
    }

    this.onGetJobs = handlers.onGetJobs;
    this.onGetUrl = handlers.onGetUrl;

    this._render([], JobLoader.FetchStatus.pending);

    try {
      const response = await fetch(this.onGetUrl());
      const data = await response.json();

      this._dispatch(JobLoader.LoaderEvent.loadingSuccess, { data });
    } catch (error) {
      this._dispatch(JobLoader.LoaderEvent.loadingFailed, { error });
    }
  }

  _render(data, status) {
    const isLoading = status === JobLoader.FetchStatus.pending;
    const isLoaded = status === JobLoader.FetchStatus.success;
    const isFailed = status === JobLoader.FetchStatus.error;

    const jobsContainer = new JobsContainer();
    const jobsContainerSection = document.getElementById(this.containerId);
    jobsContainerSection.textContent = '';

    if (isLoading) {
      for (let i = 0; i < 9; i++) {
        jobsContainer.addJobItemSkeleton();
      }
    } else if (isLoaded) {
      if (data.length === 0) {
        jobsContainerSection.innerHTML = this._errorMessage('No suitable vacancies found');
      } else {
        data.forEach(jobItem => {
          jobsContainer.addJobItem(jobItem);
        });
      }
    } else if (isFailed) {
      jobsContainerSection.innerHTML = this._errorMessage('An error occurred while loading data');
    }

    jobsContainer.render(jobsContainerSection);
  }

  _setupListeners() {
    window.addEventListener(
      this._getLocalEventName(JobLoader.LoaderEvent.loadingSuccess),
      event => {
        this._render(event.detail.data, JobLoader.FetchStatus.success);
      },
    );

    window.addEventListener(this._getLocalEventName(JobLoader.LoaderEvent.loadingFailed), () => {
      this._render([], JobLoader.FetchStatus.error);
    });
  }

  _dispatch(eventName, payload) {
    window.dispatchEvent(new CustomEvent(this._getLocalEventName(eventName), { detail: payload }));
  }

  _getLocalEventName(eventName) {
    return `${eventName}_${this.containerId}`;
  }

  _errorMessage(message) {
    return `
      <div class="flex flex_justify_center">
        <p class="text text_paragraph text_color_primary-light">${message}</p>
      </div>
    `;
  }
}
