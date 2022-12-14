import { handleLocation } from "./router.js";
import { onToggle, handleAuth, onLoginButton, socialLogin } from "./login.js";
import { postUpload, onFileChange } from "./create-post.js";
import { changeProfile, onFileChangeProfile } from "./mypage.js";
import { getpostList } from "./all-post.js";
import { deletePost, onEditing, updatePost } from "./view-post.js";
import { updateComment, modifyComment, deleteComment } from "./comments.js";
// ! 작업 중 : 북마크 기능
import { handleBookmark } from "./update-bookmark.js";

window.addEventListener("DOMContentLoaded", handleLocation);
window.addEventListener("hashchange", handleLocation);

// login.js
window.onToggle = onToggle;
window.handleAuth = handleAuth;
window.onLoginButton = onLoginButton;
window.socialLogin = socialLogin;
// create-post.js
window.postUpload = postUpload;
window.onFileChange = onFileChange;
// mypage.js
window.changeProfile = changeProfile;
window.onFileChangeProfile = onFileChangeProfile;
// all-post.js
window.getpostList = getpostList;
// view-post.js
window.deletePost = deletePost;
window.onEditing = onEditing;
window.updatePost = updatePost;
window.updatePost = updatePost;
window.updateComment = updateComment;
window.deleteComment = deleteComment;
window.modifyComment = modifyComment;

// ! 작업 중 : 북마크 기능
window.handleBookmark = handleBookmark;
