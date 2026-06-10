const STORAGE_KEY = 'guestbook_tokens';

export const getTokens = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
};

export const saveToken = (id, token) => {
  const tokens = getTokens();
  tokens[String(id)] = token;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
};

export const getToken = (id) => getTokens()[String(id)] || null;

export const removeToken = (id) => {
  const tokens = getTokens();
  delete tokens[String(id)];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
};
