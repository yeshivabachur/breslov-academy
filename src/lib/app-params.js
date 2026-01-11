const isNode = typeof window === 'undefined';

const memoryStore = new Map();
const storage = isNode
  ? {
      getItem: (key) => (memoryStore.has(key) ? memoryStore.get(key) : null),
      setItem: (key, value) => memoryStore.set(key, String(value)),
      removeItem: (key) => memoryStore.delete(key),
    }
  : window.localStorage;

const STORAGE_PREFIX = 'breslov';
const LEGACY_STORAGE_PREFIX = 'base44';
const DEFAULT_API_BASE_URL = '/api';

const TOKEN_QUERY_KEYS = ['session_token', 'access_token', 'token'];
const TOKEN_STORAGE_KEYS = ['session_token', 'access_token', 'token'];

const toSnakeCase = (str) => str.replace(/([A-Z])/g, '_$1').toLowerCase();

const storageKey = (paramName, prefix = STORAGE_PREFIX) => (
  `${prefix}_${toSnakeCase(paramName)}`
);

const getStoredValue = (paramName) => {
  if (isNode) return null;
  const primaryKey = storageKey(paramName);
  const legacyKey = storageKey(paramName, LEGACY_STORAGE_PREFIX);
  const primaryValue = storage.getItem(primaryKey);
  if (primaryValue) return primaryValue;
  const legacyValue = storage.getItem(legacyKey);
  if (legacyValue) {
    storage.setItem(primaryKey, legacyValue);
    return legacyValue;
  }
  return null;
};

const setStoredValue = (paramName, value) => {
  if (isNode) return;
  storage.setItem(storageKey(paramName), value);
};

const removeStoredValue = (paramName) => {
  if (isNode) return;
  storage.removeItem(storageKey(paramName));
  storage.removeItem(storageKey(paramName, LEGACY_STORAGE_PREFIX));
};

const updateUrlParams = (urlParams) => {
  if (isNode) return;
  const newUrl = `${window.location.pathname}${urlParams.toString() ? `?${urlParams.toString()}` : ''}${window.location.hash}`;
  window.history.replaceState({}, document.title, newUrl);
};

const getTokenFromUrl = () => {
  if (isNode) return null;
  const urlParams = new URLSearchParams(window.location.search);
  let token = null;

  for (const key of TOKEN_QUERY_KEYS) {
    const value = urlParams.get(key);
    if (value) {
      token = value;
      urlParams.delete(key);
      break;
    }
  }

  if (token) {
    setStoredToken(token);
    updateUrlParams(urlParams);
  }

  return token;
};

const getAppParamValue = (paramName, { defaultValue = undefined, removeFromUrl = false } = {}) => {
  if (isNode) {
    return defaultValue;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const searchParam = urlParams.get(paramName);

  if (removeFromUrl && searchParam !== null) {
    urlParams.delete(paramName);
    updateUrlParams(urlParams);
  }

  if (searchParam) {
    setStoredValue(paramName, searchParam);
    return searchParam;
  }

  if (defaultValue !== undefined) {
    setStoredValue(paramName, defaultValue);
    return defaultValue;
  }

  return getStoredValue(paramName);
};

export const getStoredToken = () => {
  if (isNode) return null;
  for (const key of TOKEN_STORAGE_KEYS) {
    const value = getStoredValue(key);
    if (value) return value;
  }
  return null;
};

export const setStoredToken = (token) => {
  if (!token) return;
  setStoredValue('session_token', token);
};

export const clearStoredToken = () => {
  TOKEN_STORAGE_KEYS.forEach((key) => removeStoredValue(key));
};

const getAppParams = () => {
  getTokenFromUrl();

  if (getAppParamValue('clear_access_token') === 'true') {
    clearStoredToken();
  }

  return {
    appId: getAppParamValue('app_id', { defaultValue: import.meta.env.VITE_APP_ID || import.meta.env.VITE_BASE44_APP_ID }),
    token: getStoredToken(),
    fromUrl: getAppParamValue('from_url', { defaultValue: isNode ? '' : window.location.href }),
    apiBaseUrl: getAppParamValue('api_base_url', { defaultValue: import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL }),
    apiVersion: getAppParamValue('api_version', { defaultValue: import.meta.env.VITE_API_VERSION }),
    authLoginUrl: getAppParamValue('auth_login_url', { defaultValue: import.meta.env.VITE_AUTH_LOGIN_URL }),
    authLogoutUrl: getAppParamValue('auth_logout_url', { defaultValue: import.meta.env.VITE_AUTH_LOGOUT_URL }),
  };
};

export const appParams = {
  ...getAppParams(),
};
