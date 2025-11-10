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
