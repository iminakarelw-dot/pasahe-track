import View from './View.js';

class RideListView extends View {
  _parentElement = document.querySelector('.ride-list');

  
  _generateMarkup() {
    if (!this._data.length)
      return '<p class="empty">No rides logged yet. Add your first ride using the form.</p>';

    return `
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr><th>Date</th><th>Route</th><th>Mode</th><th class="num">Fare</th><th><span class="sr-only">Actions</span></th></tr>
          </thead>
          <tbody>${this._data.map(ride => this._generateRow(ride)).join('')}</tbody>
        </table>
      </div>`;
  }

  _generateRow({ id, date, mode, from, to, fare }) {
    return `
      <tr data-id="${id}">
        <td>${this._formatDate(date)}</td>
        <td>${this._escape(from)} to ${this._escape(to)}</td>
        <td>${mode}</td>
        <td class="num">${this._formatPeso(fare)}</td>
        <td class="table__actions">
          <button class="btn btn--small" data-action="edit">Edit</button>
          <button class="btn btn--small btn--danger" data-action="delete">Delete</button>
        </td>
      </tr>`;
  }

  // Builds the date from its parts so the timezone cannot shift the day
  _formatDate(isoDate) {
    const [year, month, day] = isoDate.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' });
  }

  addHandlerEdit(handler) {
    this._parentElement.addEventListener('click', e => {
      if (!e.target.closest('[data-action="edit"]')) return;
      handler(e.target.closest('tr').dataset.id);
    });
  }

  addHandlerDelete(handler) {
    this._parentElement.addEventListener('click', e => {
      if (!e.target.closest('[data-action="delete"]')) return;
      handler(e.target.closest('tr').dataset.id);
    });
  }
}

export default new RideListView();