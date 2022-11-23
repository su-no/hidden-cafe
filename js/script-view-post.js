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
  // TODO: 어차피 html 파일을 불러올 거면, skeleton UI를 적용해 보자.

  const html = await fetch("/pages/view-post.html").then(data => data.text());
  const mainPage = document.querySelector("#main-page");
  mainPage.innerHTML = html;

  // 게시글 번호 저장
  const postId = path.replace("/view-post-", "");
  console.log("postId :", postId);

  // Firebase에서 게시글 번호와 일치하는 글 불러오기
  const q = query(collection(dbService, "post"), where("postId", "==", postId));
  const querySnapshot = await getDocs(q);

  let postObj = {};
  querySnapshot.forEach(doc => {
    postObj = {
      id: doc.id,
      ...doc.data(),
    };
  });

  let tempHtml = "";
    tempHtml = `
      <div class="post-header">
        <div class="post-user">
          <img class="post-profile-img" src=${
            postObj.profileImg ?? "/img/profile-img.png"
          } alt="profile-img"/>
          <div class="post-user-name">${
            postObj.nickname ?? postObj.email.split("@")[0]
          }</div>
        </div>
        <div class="post-create-date">${postObj.createdAt}</div>
      </div>
      <div class="post-box">
        <div class="bookmark"><i class="fas fa-mug-hot"></i>${
          postObj.bookmark
        }</div>
        <div class="post-container">
          <img class="post-img" src=${postObj.postImg} alt="post-img" />
          <div class="post-content">
            <div class="title">${postObj.title}</div>
            <div class="description">${postObj.contents}</div>
          </div>
        </div>
        <div class="post-buttons">
          <button class="post-modify-btn">수정</button>
          <button class="post-delete-btn">삭제</button>
        </div>
      </div>`;

  // article 태그에 담아서 container에 추가
  const post = document.querySelector(".post");
  post.innerHTML = tempHtml;
};
