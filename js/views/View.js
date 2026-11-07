// Base View class. Every view extends this.
// A view builds markup from the data it is given. It never imports the model.

export default class View {
  _data;
  _parentElement;

  render(data) {
    this._data = data;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', this._generateMarkup());
  }

  renderError(message) {
    const errorElement = this._parentElement.querySelector('.error-message');
    if (errorElement) errorElement.textContent = message;
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  // Stops text like "<b>" from being treated as HTML.
  _escape(text) {
    return String(text)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;');
  }

  _formatPeso(amount) {
    return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  _generateMarkup() {
    return '';
  }
}