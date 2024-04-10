/* eslint-disable max-len */
export class JobsContainer {
  constructor(classNames = []) {
    this.container = document.createElement('section');
    this.container.classList.add('jobs-container', ...classNames);
  }

  addJobItem(jobItemData) {
    const jobItem = document.createElement('article');
    jobItem.classList.add('job-item');

    jobItem.innerHTML = JobItem(jobItemData);

    this.container.appendChild(jobItem);
  }

  addJobItemSkeleton() {
    const jobItem = document.createElement('article');
    jobItem.classList.add('job-item', 'job-item_skeleton', 'job-item_empty');

    this.container.appendChild(jobItem);
  }

  getElement() {
    return this.container;
  }

  render(node) {
    node.append(this.getElement());
  }
}

export const JobItem = jobItem => {
  const logo = jobItem.location.company.logo;
  const companyName = jobItem.location.company.name;
  const locationCountry = jobItem.location.address.country;
  const locationCity = jobItem.location.address.city;
  const { title, experience, workSchedule, workPlace, minSalary, maxSalary } = jobItem;

  return `
    <div class="job-item__logo-section">
      <div class="avatar avatar_size_s avatar_circular">
        <img class="avatar__image" src="${logo}" alt="Logo">
      </div>
    </div>
    <div class="job-item__content-section flex flex_column flex_gap_xl">
      <div>
        <p class="text text_paragraph text_color_primary-light text_font-size_l text_font-weight_medium">
          ${companyName}
        </p>
        <p class="text text_paragraph text_color_secondary-dark text_font-size_s text_font-weight_light text_overlined">
          ${locationCountry}, ${locationCity}
        </p>
      </div>
      <div class="flex flex_column flex_gap_xl">
          <div>
            <h4 class="text text_heading_4 text_color_secondary-light">${title}</h4>
            <p class="text text_paragraph text_color_secondary-light">${experience}</p>
          </div>
          <p class="text text_paragraph text_color_primary-light">
            ${maxSalary ? `$${minSalary} - $${maxSalary}` : `$${minSalary}`}
          </p>
      </div>
      <div class="flex flex_gap_xl">
        <p class="text text_paragraph text_color_primary-light text_font-size_s">${workSchedule}</p>
        <p class="text text_paragraph text_color_primary-light text_font-size_s">${workPlace}</p>
      </div>
    </div>
  `;
};
