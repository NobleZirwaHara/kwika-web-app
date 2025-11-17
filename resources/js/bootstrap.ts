// This file can be used to configure any third-party libraries
// or global configurations needed for your application

// Configure Axios for CSRF protection and Inertia
import axios from 'axios';

declare global {
  interface Window {
    axios: typeof axios;
  }
}

window.axios = axios;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Configure Axios for Laravel web authentication (session-based)
window.axios.defaults.withCredentials = true;

// Set CSRF token from meta tag for axios requests (not Inertia - it handles its own CSRF)
// This runs after DOM is loaded to ensure meta tag exists
if (typeof document !== 'undefined') {
  const setupAxiosCsrf = () => {
    const token = document.head.querySelector<HTMLMetaElement>('meta[name="csrf-token"]');
    if (token) {
      window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
    }
  };

  // Run immediately if DOM is ready, otherwise wait
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupAxiosCsrf);
  } else {
    setupAxiosCsrf();
  }
}
