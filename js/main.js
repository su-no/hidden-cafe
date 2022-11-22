import { handleLocation } from "./router.js";
import { onToggle, handleAuth, onLoginButton, socialLogin } from "./login.js";
import { postUpload, onFileChange } from "./script-create-post.js";
import { changeProfile } from './mypage.js';

window.addEventListener("DOMContentLoaded", handleLocation);
window.addEventListener("hashchange", handleLocation);

window.onToggle = onToggle;
window.handleAuth = handleAuth;
window.socialLogin = socialLogin;
window.postUpload = postUpload;
window.onFileChange = onFileChange;
window.onLoginButton = onLoginButton;
window.changeProfile = changeProfile;