import { handleLocation } from "./router.js";
import { onToggle, handleAuth, onLoginButton, socialLogin } from "./login.js";
import { postUpload, onFileChange } from "./create-post.js";
import { getpostList } from "./all-post.js";
import { deletePost, onEditing } from "./view-post.js";
import { changeProfile } from "./mypage.js";

window.addEventListener("DOMContentLoaded", handleLocation);
window.addEventListener("hashchange", handleLocation);

window.onToggle = onToggle;
window.handleAuth = handleAuth;
window.socialLogin = socialLogin;
window.postUpload = postUpload;
window.onFileChange = onFileChange;
window.onLoginButton = onLoginButton;
window.getpostList = getpostList;
window.changeProfile = changeProfile;
window.deletePost = deletePost;
window.onEditing = onEditing;
