import { authService } from "./firebase.js";
import { viewPost } from "./view-post.js";
import { viewComments } from "./comments.js";
import { getPostByLocal } from "./all-post.js";
import { getDate } from "./util.js";
import { getBookmarkList } from "./view-bookmark.js";

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
  const sessionUser = sessionStorage.getItem("user");
  const sessionUserProfile = sessionStorage.getItem("userProfile");
  const sessionUserNickname = sessionStorage.getItem("userNickname");
  const sessionUserEmail = sessionStorage.getItem("userEmail");
  let path = window.location.hash.replace("#", "/");
  if (path.length === 0) {
    path = "/";
  }

  // 로그인 안 한 상태에서 페이지 이동 시 로그인 페이지로 강제 이동
  // 메인 페이지는 조회 가능
  if (!sessionUser) {
    if (!path.startsWith("/main")) {
      path = "/login";
    }
  }

  console.log("handleLocation:", path);

  if (path.startsWith("/main-")) {
    const html = await fetch("/pages/main.html").then(data => data.text());
    const mainPage = document.querySelector("#main-page");
    mainPage.innerHTML = html;
    const local = decodeURI(path.replace("/main-", ""));
    getPostByLocal(local);
    return;
  }

  if (path.startsWith("/view-post-")) {
    viewPost(path).then(() => viewComments(path));
    return;
  }

  const route = routes[path] || routes[404];
  const html = await fetch(route).then(data => data.text());

  const mainPage = document.querySelector("#main-page");
  mainPage.innerHTML = html;

  if (path === "/" || path === "/main") {
    getpostList();
    // .then(() => {
    //   handleBookmark(path);
    // });
    return;
  }

  if (path === "/bookmark") {
    getBookmarkList();
    return;
  }

  if (path === "/create-post") {
    //왜인진 모르겠으나 메인을 통해 글쓰기로 와야만 currentUser 데이터를 받아 올 수 있음
    // 따라서 email값이 없으면 메인으로 보내도록 예외처리함
    // 추후 새로고침 해도 currentUser값 받아 올 수 있도록 수정 필요 ==> sessionStorage로 해결
    // const user = sessionUser;
    document.getElementById("date").innerHTML = getDate().split(" ")[0];
    document.getElementById("member-id").innerHTML =
      `<img src="${
        sessionUserProfile ?? "/img/profile-img.png"
      }" style="width:2rem; height:2rem; margin-right:1rem; border-radius:50%;"/>` +
      sessionUserNickname;
  }

  if (path === "/mypage") {
    // const user = authService.currentUser;
    // const userProfileURL = user.photoURL ?? "/img/profile-img.png";
    const user = sessionUser;
    const userProfileURL = sessionUserProfile;
    const profileImg = document.querySelector("#profileView");
    profileImg.setAttribute("src", userProfileURL);

    const userNickname = sessionUserNickname ?? user.email.split("@")[0];
    const nickName = document.querySelector("#profileNickname");
    nickName.setAttribute("placeholder", userNickname);

    const email = document.querySelector("#profileEmail");
    email.setAttribute("placeholder", sessionUserEmail);
  }
};
