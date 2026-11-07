import View from './View.js';

class BudgetView extends View {
  _parentElement = document.querySelector('.budget-form');

  // data: the monthly budget number
  _generateMarkup() {
    return `
      <label>How much can you spend on pasahe each month? (₱)
        <input name="budget" type="number" step="50" value="${this._data}" />
      </label>
      <p class="error-message" role="alert"></p>`;
  }

  addHandlerChange(handler) {
    this._parentElement.addEventListener('input', e => {
      if (e.target.name === 'budget') handler(e.target.value);
    });
  }
}

export default new BudgetView();