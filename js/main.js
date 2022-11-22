import { handleLocation } from './router.js';
import { onToggle, handleAuth, onLoginButton } from './login.js';

window.addEventListener('DOMContentLoaded', handleLocation);
window.addEventListener('hashchange', handleLocation);

//
window.onToggle = onToggle;
window.handleAuth = handleAuth;
window.onLoginButton = onLoginButton;
