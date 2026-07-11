import { APPLICATION_STATUSES, PRIORITY_OPTIONS } from '../constants';

export const getStatusStyle = (status) =>
  APPLICATION_STATUSES.find((s) => s.value === status) ?? { color: '#94A3B8', bg: '#F8FAFC' };

export const getPriorityColor = (priority) => {
  const found = PRIORITY_OPTIONS.find((p) => p.value === priority);
  return found?.color ?? '#94A3B8';
};

export const calcProgress = (items = []) => {
  if (items.length === 0) return { rate: 0, done: 0, total: 0 };
  const done = items.filter((i) => i.is_done).length;
  return { rate: Math.round((done / items.length) * 100), done, total: items.length };
};
