import { dbService, authService } from "./firebase.js";
import {
  query,
  collection,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";

export const viewPost = async path => {
  // 비어 있는 view-post.html 페이지를 불러온다.
  // 게시글 정보를 저장한 tempHtml을 생성하고 view-post.html 페이지에 추가한다.

  const html = await fetch("/pages/view-post.html").then(data => data.text());
  const mainPage = document.querySelector("#main-page");
  mainPage.innerHTML = html;

  // 게시글 번호 저장
  const postId = path.replace("/view-post-", "");
  console.log("postId :", postId);

  // Firebase에서 게시글 번호와 일치하는 글 불러오기
  const q = query(collection(dbService, "post"), where("postId", "==", postId));
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach(doc => {
    const data = doc.data();
    const nickname = data["nickname"] ?? data["email"].split("@")[0];
    const profileImg = data["profileImg"] ?? "img/profile-img.png";
    const date = data["createdAt"];
    const bookmarks = data["bookmark"];
    const postImg = data["postImg"];
    const title = data["title"];
    const description = data["contents"];

    const tempHtml = `
    <div class="post-header">
      <div class="post-user">
        <img class="post-profile-img" src=${profileImg} alt="profile-img"/>
        <div class="post-user-name">${nickname}</div>
      </div>
      <div class="post-create-date">${date}</div>
    </div>
    <div class="post-box">
      <div class="bookmark"><i class="fas fa-mug-hot"></i>${bookmarks}</div>
      <div class="post-container">
        <img class="post-img" src=${postImg} alt="post-img" />
        <div class="post-content">
          <div class="title">${title}</div>
          <div class="description">${description}</div>
        </div>
      </div>
      <div class="post-buttons">
        <button class="post-modify-btn">수정</button>
        <button class="post-delete-btn">삭제</button>
      </div>
    </div>`;

    // article 태그에 담아서 container에 추가
    const article = document.createElement("article");
    article.classList.add("post");
    article.innerHTML = tempHtml;

    const container = document.querySelector(".container");
    container.appendChild(article);
  });
};
