import { HTMLTable, HTMLTableRow } from './table.mjs';

export class TableLoader {
  static FetchStatus = {
    pending: 0,
    success: 1,
    error: 2,
  };

  static LoaderEvent = {
    loadingStart: 'TableLoader/loadingStart',
    loadingFailed: 'TableLoader/loadingFailed',
    loadingSuccess: 'TableLoader/loadingSuccess',
  };

  constructor(handlers, options) {
    this.onGetRows = handlers.onGetRows;
    this.onGetColumns = handlers.onGetColumns;
    this.onGetUrl = handlers.onGetUrl;

    this.containerId = options.containerId;

    if (!this.onGetRows || !this.onGetColumns || !this.onGetUrl || !this.containerId) {
      throw new Error('TableLoader is missing required parameters');
    }

    this._setupListeners();
  }

  load() {
    this._dispatch(TableLoader.LoaderEvent.loadingStart);
  }

  _render(data, status) {
    const columns = this.onGetColumns(data) || [];
    const rows = this.onGetRows(data) || [];

    const isLoading = status === TableLoader.FetchStatus.pending;
    const isLoaded = status === TableLoader.FetchStatus.success;
    const isFailed = status === TableLoader.FetchStatus.error;

    const columnsNumber = isFailed ? 1 : columns.length;

    const table = new HTMLTable([
      `table_cols_${columnsNumber}`,
      'table_fullwidth',
      'table_spacing_xl',
      'table_gap-y_xl',
      'table_height_s',
      ...(isLoading ? ['table_skeleton'] : []),
      ...(isLoaded ? ['table_dark', 'table_sticky-header'] : []),
      ...(isFailed ? ['table_dark'] : []),
    ]);

    const tableHeaderRow = new HTMLTableRow(
      columnsNumber,
      status === TableLoader.FetchStatus.pending ? ['table__row_empty'] : [],
      true,
    );

    if (isLoading) {
      table.addHeaderRow(tableHeaderRow);

      [0, 0, 0].forEach(() => {
        const tableRow = new HTMLTableRow(columnsNumber, 'table__row_empty');
        table.addRow(tableRow);
      });
    } else if (isLoaded) {
      columns.forEach(({ label }, i) => {
        tableHeaderRow.getCol(i).textContent = label;
      });

      table.addHeaderRow(tableHeaderRow);

      rows.forEach(record => {
        const tableRow = new HTMLTableRow(columnsNumber, []);

        columns.forEach(({ value }, i) => {
          tableRow.getCol(i).textContent = record[value];
        });

        table.addRow(tableRow);
      });
    } else if (isFailed) {
      table.addHeaderRow(tableHeaderRow);

      const tableRow = new HTMLTableRow(columnsNumber, ['table__row_error']);
      tableRow.getCol(0).textContent = 'An error occurred while loading data';

      table.addRow(tableRow);
    }

    const tableContainer = document.getElementById(this.containerId);

    tableContainer.textContent = '';
    table.render(tableContainer);
  }

  _setupListeners() {
    window.addEventListener(
      this._getLocalEventName(TableLoader.LoaderEvent.loadingStart),
      async () => {
        this._render([], TableLoader.FetchStatus.pending);

        try {
          const response = await fetch(this.onGetUrl());
          const data = await response.json();

          this._dispatch(TableLoader.LoaderEvent.loadingSuccess, { data });
        } catch (error) {
          this._dispatch(TableLoader.LoaderEvent.loadingFailed, { error });
        }
      },
    );

    window.addEventListener(
      this._getLocalEventName(TableLoader.LoaderEvent.loadingSuccess),
      event => {
        this._render(event.detail.data, TableLoader.FetchStatus.success);
      },
    );

    window.addEventListener(this._getLocalEventName(TableLoader.LoaderEvent.loadingFailed), () => {
      this._render([], TableLoader.FetchStatus.error);
    });
  }

  _dispatch(eventName, payload) {
    window.dispatchEvent(new CustomEvent(this._getLocalEventName(eventName), { detail: payload }));
  }

  _getLocalEventName(eventName) {
    return `${eventName}_${this.containerId}`;
  }
}
