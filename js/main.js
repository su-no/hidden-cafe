import { handleLocation } from "./router.js";
//
import { onToggle, handleAuth, socialLogin } from "./login.js";

window.addEventListener("DOMContentLoaded", handleLocation);
window.addEventListener("hashchange", handleLocation);

//
window.onToggle = onToggle;
window.handleAuth = handleAuth;
window.socialLogin = socialLogin;
