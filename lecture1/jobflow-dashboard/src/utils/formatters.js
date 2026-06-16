export const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  return dateStr;
};

export const formatDateKorean = (dateStr) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
};

export const truncate = (str, max = 50) => {
  if (!str) return '';
  return str.length > max ? `${str.slice(0, max)}...` : str;
};
