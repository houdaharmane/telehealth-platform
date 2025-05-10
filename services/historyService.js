let history = [];
let cancelled = [];

export const getHistory = () => history;
export const getCancelled = () => cancelled;

export function addHistory(entry) {
  history.unshift(entry);
}

export function addCancelled(entry) {
  cancelled.unshift(entry);
}