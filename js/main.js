<<<<<<< HEAD
// import { authService } from "./firebase.js";
import { handleLocation, routes } from "./router.js";
import { postUpload, onFileChange } from "./pages/script-create-post.js";

window.addEventListener("hashchange", handleLocation);
window.addEventListener("DOMContentLoaded", handleLocation);

window.route = routes;
window.postUpload = postUpload;
window.onFileChange = onFileChange;
=======
import { handleLocation } from './router.js';
import { onToggle, handleAuth, onLoginButton } from './login.js';

window.addEventListener('DOMContentLoaded', handleLocation);
window.addEventListener('hashchange', handleLocation);

//
window.onToggle = onToggle;
window.handleAuth = handleAuth;
window.onLoginButton = onLoginButton;
>>>>>>> d8473eb8f10e6784954d08999d9a4215bf509cb1
