// import { authService } from './firebase.js';

// export const route = event => {
//   // 사용자 정보 없으면 a tag의 href 이동 비활성화
//   const user = authService.currentUser;
//   if (!user) {
//     event.preventDefault();
//   }
// };

const routes = {
  "/": "/pages/main.html",
  "/main": "/pages/main.html",
  "/create-post": "/pages/create-post.html",
  "/mypage": "/pages/mypage.html",
  "/login": "/pages/login.html",
  "/bookmark": "/pages/bookmark.html",
  "/view-post": "/pages/view-post.html",
  404: "/pages/404.html",
};

export const handleLocation = async () => {
  let path = window.location.hash.replace("#", "/");
  if (path.length === 0) {
    path = "/";
  }
  console.log("handleLocation:", path);

  const route = routes[path] || routes[404];
  const html = await fetch(route).then((data) => data.text());

  const mainPage = document.querySelector("#main-page");
  mainPage.innerHTML = html;

  document.getElementById("root"), innerHTML = html;
  // mypage 화면 렌더링 되자마자 DOM 조작 처리
  if (path === "fanLog") {
    //로그인한 회원의 프로필사진과 닉네임을 화면에 표시해줌.
    console. log ("authService.currentUser:", authService. currentUser); document. getElementById ("nickname"), textContent = authService.currentUser.displayName?? "4 8";
    document. getElementById("profileImg").sc =
    authService.currentUser.photoURL??"../assets/blankProfile.webp"
    getCommentList();
    }
    if (path === "profile") {
    //프로필 관리 화면 일 때 현재 프로필• 사진과 닉네임 할당
    document. getElementById("profileview").sc = authService.currentUser.photoURL ?? "/assets/blankProfile.webp" document. getElementById("profileNickname").placeholder authService.currentUser.displayName 7? "48 8";
    }
};

export const goToProfile = () => {
  window. location.hash = "#profile";
};