import { handleLocation } from './router.js';

window.addEventListener('DOMContentLoaded', handleLocation);
window.addEventListener('hashchange', handleLocation);
