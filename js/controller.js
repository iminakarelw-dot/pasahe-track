// CONTROLLER: the only file that talks to both the model and the views.
// It never builds HTML.

import * as model from './model.js';
import rideFormView from './views/RideFormView.js';
import rideListView from './views/RideListView.js';
import summaryView from './views/SummaryView.js';
import budgetView from './views/BudgetView.js';

const refresh = function () {
  rideListView.render(model.getRides());
  summaryView.render(model.getSummary());
};

const showBlankForm = () => rideFormView.render({ modes: model.MODES });

const controlSubmit = function (data) {
  const error = model.validateRide(data);
  if (error) return rideFormView.renderError(error);

  if (model.state.editingId) model.updateRide(model.state.editingId, data);
  else model.addRide(data);

  model.setEditing(null);
  showBlankForm();
  refresh();
};

const controlEdit = function (id) {
  model.setEditing(id);
  rideFormView.render({ modes: model.MODES, ride: model.getRide(id), editing: true });
};

const controlCancel = function () {
  model.setEditing(null);
  showBlankForm();
};

const controlDelete = function (id) {
  model.deleteRide(id);
  if (model.state.editingId === id) controlCancel();
  refresh();
};

const controlBudget = function (value) {
  const error = model.validateBudget(value);
  budgetView.renderError(error);
  if (error) return;

  model.setBudget(value);
  summaryView.render(model.getSummary());
};

const init = function () {
  model.loadState();

  rideFormView.addHandlerSubmit(controlSubmit);
  rideFormView.addHandlerCancel(controlCancel);
  rideListView.addHandlerEdit(controlEdit);
  rideListView.addHandlerDelete(controlDelete);
  budgetView.addHandlerChange(controlBudget);

  showBlankForm();
  budgetView.render(model.state.monthlyBudget);
  refresh();
};

init();