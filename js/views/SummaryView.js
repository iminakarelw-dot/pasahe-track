import View from './View.js';

class SummaryView extends View {
  _parentElement = document.querySelector('.summary');

  // data: { monthLabel, rideCount, total, average, budget, remaining, percentUsed, overBudget, perMode }
  _generateMarkup() {
    const { monthLabel, rideCount, total, average, budget, remaining, percentUsed, overBudget, perMode } =
      this._data;

    return `
      <div class="ticket">
        <div class="ticket__main">
          <h2>Spent on pasahe in ${monthLabel}</h2>
          <p class="total">${this._formatPeso(total)}</p>
          <div class="bar" aria-hidden="true">
            <div class="bar__fill ${overBudget ? 'bar__fill--over' : ''}" style="width: ${percentUsed}%"></div>
          </div>
          <p class="status ${overBudget ? 'status--over' : 'status--ok'}">
            ${
              overBudget
                ? `${this._formatPeso(-remaining)} over your ${this._formatPeso(budget)} budget`
                : `${this._formatPeso(remaining)} left of your ${this._formatPeso(budget)} budget`
            }
          </p>
        </div>
        <div class="ticket__stub">
          <p class="stub__stat"><strong>${rideCount}</strong> ride${rideCount === 1 ? '' : 's'}</p>
          <p class="stub__stat"><strong>${this._formatPeso(average)}</strong> average fare</p>
          ${
            perMode.length
              ? `<ul class="modes">${perMode
                  .map(([mode, amount]) => `<li><span>${mode}</span><span>${this._formatPeso(amount)}</span></li>`)
                  .join('')}</ul>`
              : '<p class="stub__note">No rides logged this month yet.</p>'
          }
        </div>
      </div>`;
  }
}

export default new SummaryView();