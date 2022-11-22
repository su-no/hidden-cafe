// import { authService } from './firebase.js';

// export const route = event => {
//   // 사용자 정보 없으면 a tag의 href 이동 비활성화
//   const user = authService.currentUser;
//   if (!user) {
//     event.preventDefault();
//   }
// };

<<<<<<< HEAD
export const routes = {
  "/": "/pages/main.html",
  "/main": "/pages/main.html",
  "/create-post": "/pages/create-post.html",
  "/mypage": "/pages/mypage.html",
  "/login": "/pages/login.html",
  "/bookmark": "/pages/bookmark.html",
  404: "/pages/404.html",
=======
const routes = {
  '/': '/pages/main.html',
  '/main': '/pages/main.html',
  '/create-post': '/pages/create-post.html',
  '/mypage': '/pages/mypage.html',
  '/login': '/pages/login.html',
  '/bookmark': '/pages/bookmark.html',
  '/view-post': '/pages/view-post.html',
  404: '/pages/404.html',
>>>>>>> d8473eb8f10e6784954d08999d9a4215bf509cb1
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

  //글 쓰기 화면 렌더링 되자마자 DOM조작 처리(날짜, 아이디 띄우기)
  if (path == "/create-post") {
    const date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    document.getElementById("date").innerHTML = `${year}. ${month}. ${day}`;
  }
};
