// Central place for environment-dependent settings.
// Set VITE_API_URL in a .env file (see .env.example) to point at a different backend.
const trimTrailingSlash = (value) => value.replace(/\/+$/, '');

export const API_BASE_URL = trimTrailingSlash(
  import.meta.env.VITE_API_URL || 'https://localhost:7185/api'
);

// Static files (e.g. profile images) are served from the API host, without the /api suffix.
export const FILES_BASE_URL = API_BASE_URL.replace(/\/api$/, '');
