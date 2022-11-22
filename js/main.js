// import { authService } from "./firebase.js";
import { handleLocation, routes } from "./router.js";
import { postUpload, onFileChange } from "./pages/script-create-post.js";

window.addEventListener("hashchange", handleLocation);
window.addEventListener("DOMContentLoaded", handleLocation);

window.route = routes;
window.postUpload = postUpload;
window.onFileChange = onFileChange;
