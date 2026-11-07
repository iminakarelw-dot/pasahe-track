import View from './View.js';

class RideFormView extends View {
  _parentElement = document.querySelector('.ride-form');

  // data: { modes, ride, editing } where ride is undefined for a blank form
  _generateMarkup() {
    const { modes, ride = {}, editing = false } = this._data;
    const { date = this._today(), mode = '', from = '', to = '', fare = '' } = ride;

    return `
      <form class="form" novalidate>
        <div class="form__row">
          <label>Date
            <input name="date" type="date" value="${date}" />
          </label>
          <label>Mode
            <select name="mode">
              <option value="">Choose…</option>
              ${modes.map(m => `<option value="${m}" ${m === mode ? 'selected' : ''}>${m}</option>`).join('')}
            </select>
          </label>
        </div>
        <div class="form__row">
          <label>From
            <input name="from" type="text" value="${this._escape(from)}" placeholder="e.g. Boarding house" />
          </label>
          <label>To
            <input name="to" type="text" value="${this._escape(to)}" placeholder="e.g. DOrSU" />
          </label>
        </div>
        <label>Fare (₱)
          <input name="fare" type="number" step="0.5" value="${fare}" placeholder="20" />
        </label>
        <p class="error-message" role="alert"></p>
        <div class="form__actions">
          <button type="submit" class="btn btn--primary">${editing ? 'Save changes' : 'Add ride'}</button>
          ${editing ? '<button type="button" class="btn" data-action="cancel">Cancel</button>' : ''}
        </div>
      </form>`;
  }

  // Today's date in the user's local time, formatted YYYY-MM-DD
  _today() {
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  }

  addHandlerSubmit(handler) {
    this._parentElement.addEventListener('submit', e => {
      e.preventDefault();
      handler(Object.fromEntries(new FormData(e.target.closest('form'))));
    });
  }

  addHandlerCancel(handler) {
    this._parentElement.addEventListener('click', e => {
      if (e.target.closest('[data-action="cancel"]')) handler();
    });
  }
}

export default new RideFormView();