// MODEL: holds all data. No DOM code and no view imports here.

const STORAGE_KEY = 'pasahe-tracker';

export const MODES = ['Tricycle', 'Bao-Bao', 'Jeepney', 'Bus', 'Van', 'Other'];

export const state = {
  rides: [], // [{ id, date: 'YYYY-MM-DD', mode, from, to, fare }]
  monthlyBudget: 1000, // pesos the user plans to spend on pasahe each month
  editingId: null, // id of the ride being edited, or null
};

const persist = function () {
  const { rides, monthlyBudget } = state;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ rides, monthlyBudget }));
};

export const loadState = function () {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return;
  const { rides, monthlyBudget } = JSON.parse(stored);
  state.rides = rides;
  state.monthlyBudget = monthlyBudget;
};

// Validation returns an error message, or '' when the input is fine.
export const validateRide = function ({ date, mode, from, to, fare }) {
  if (!date) return 'Pick the date of the ride.';
  if (!MODES.includes(mode)) return 'Choose how you traveled.';
  if (!from.trim() || !to.trim()) return 'Enter where you rode from and where you went.';
  if (from.trim().length > 30 || to.trim().length > 30)
    return 'Place names must be 30 characters or fewer.';
  if (fare === '' || Number(fare) <= 0 || Number(fare) > 5000)
    return 'Fare must be more than ₱0 and not more than ₱5,000.';
  return '';
};

export const validateBudget = function (value) {
  if (value === '' || Number(value) < 1 || Number(value) > 100000)
    return 'Budget must be from ₱1 to ₱100,000.';
  return '';
};

const clean = ({ date, mode, from, to, fare }) => ({
  date,
  mode,
  from: from.trim(),
  to: to.trim(),
  fare: Number(fare),
});

export const getRide = id => state.rides.find(ride => ride.id === id);

// Newest ride first
export const getRides = () => [...state.rides].sort((a, b) => b.date.localeCompare(a.date));

export const addRide = function (data) {
  state.rides.push({ id: Date.now().toString(), ...clean(data) });
  persist();
};

export const updateRide = function (id, data) {
  const index = state.rides.findIndex(ride => ride.id === id);
  state.rides[index] = { id, ...clean(data) };
  persist();
};

export const deleteRide = function (id) {
  state.rides = state.rides.filter(ride => ride.id !== id);
  persist();
};

export const setEditing = function (id) {
  state.editingId = id;
};

export const setBudget = function (value) {
  state.monthlyBudget = Number(value);
  persist();
};

const pad = n => String(n).padStart(2, '0');
const monthKey = date => `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;

// Derived values for the current month: total, average, remaining budget, spending per mode
export const getSummary = function () {
  const now = new Date();
  const thisMonth = state.rides.filter(ride => ride.date.startsWith(monthKey(now)));
  const total = thisMonth.reduce((sum, { fare }) => sum + fare, 0);

  const perMode = {};
  thisMonth.forEach(({ mode, fare }) => {
    perMode[mode] = (perMode[mode] ?? 0) + fare;
  });

  const { monthlyBudget } = state;
  return {
    monthLabel: now.toLocaleDateString('en-PH', { month: 'long', year: 'numeric' }),
    rideCount: thisMonth.length,
    total,
    average: thisMonth.length ? total / thisMonth.length : 0,
    budget: monthlyBudget,
    remaining: monthlyBudget - total,
    percentUsed: Math.min(100, (total / monthlyBudget) * 100),
    overBudget: total > monthlyBudget,
    perMode: Object.entries(perMode).sort(([, a], [, b]) => b - a), // [[mode, amount], ...]
  };
};