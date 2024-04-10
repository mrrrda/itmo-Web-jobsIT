import { ElementsIds } from '../constants.mjs';
import { TableLoader } from './table-loader.mjs';

const tableColumnKeys = {
  name: 'name',
  username: 'username',
  email: 'email',
  website: 'website',
};

const tableColumnHeadings = {
  [tableColumnKeys.name]: 'Name',
  [tableColumnKeys.username]: 'Username',
  [tableColumnKeys.email]: 'Email',
  [tableColumnKeys.website]: 'Website',
};

const tableColumns = [
  tableColumnKeys.name,
  tableColumnKeys.username,
  tableColumnKeys.email,
  tableColumnKeys.website,
];

const usersTable = new TableLoader(
  {
    onGetRows: data => data,
    onGetColumns: () =>
      tableColumns.map(column => ({ value: column, label: tableColumnHeadings[column] })),
    onGetUrl: () =>
      `https://jsonplaceholder.typicode.com/users?id_lte=${Math.floor(Math.random() * 20) + 1}`,
  },
  { containerId: ElementsIds.usersTableSectionId },
);

const updateButton = document.getElementById('users-update');

updateButton.addEventListener('click', () => {
  usersTable.load();
});
