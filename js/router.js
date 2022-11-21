// import { authService } from './firebase.js';

// export const route = event => {
//   // 사용자 정보 없으면 a tag의 href 이동 비활성화
//   const user = authService.currentUser;
//   if (!user) {
//     event.preventDefault();
//   }
// };

export const routes = {
  "/": "/pages/main.html",
  "/main": "/pages/main.html",
  "/create-post": "/pages/create-post.html",
  "/mypage": "/pages/mypage.html",
  "/login": "/pages/login.html",
  "/bookmark": "/pages/bookmark.html",
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
};
