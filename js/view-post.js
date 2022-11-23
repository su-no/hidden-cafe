import { dbService, authService } from "./firebase.js";
import {
  query,
  collection,
  where,
  doc,
  getDocs,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";

export const viewPost = async (path) => {
  // 비어 있는 view-post.html 페이지를 불러온다.
  // 게시글 정보를 저장한 tempHtml을 생성하고 view-post.html 페이지에 추가한다.

  const html = await fetch("/pages/view-post.html").then((data) => data.text());
  const mainPage = document.querySelector("#main-page");
  mainPage.innerHTML = html;

  // 게시글 번호 저장
  const postId = path.replace("/view-post-", "");
  console.log("postId :", postId);

  // Firebase에서 게시글 번호와 일치하는 글 불러오기
  const q = query(collection(dbService, "post"), where("postId", "==", postId));
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const nickname = data["nickname"] ?? data["email"].split("@")[0];
    const profileImg = data["profileImg"] ?? "img/profile-img.png";
    const date = data["createdAt"];
    const bookmarks = data["bookmark"];
    const postImg = data["postImg"];
    const title = data["title"];
    const description = data["contents"];
    const id = doc.id;
    const currentUid = authService.currentUser.uid;
    const isOwner = currentUid === data["creatorId"];
    console.log(isOwner);

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
      <div class="${isOwner ? "post-buttons" : "noDisplay"}">
      <button class="post-modify-btn">수정</button>
      <button name="${id}" onclick="deletePost(event)" class="post-delete-btn">삭제</button>
    </div>`;

    // article 태그에 담아서 container에 추가
    const article = document.createElement("article");
    article.classList.add("post");
    article.innerHTML = tempHtml;

    const container = document.querySelector(".container");
    container.appendChild(article);
  });
};

export const deletePost = async (event) => {
  event.preventDefault();
  console.log(event.target.name);
  const id = event.target.name;
  const ok = window.confirm("정말 삭제하시겠습니까?");
  if (ok) {
    try {
      await deleteDoc(doc(dbService, "post", id));
      alert("삭제완료");
      window.location.hash = "#main";
      getpostList();
    } catch (error) {
      alert(error);
    }
  }
};

export const onEditing = (event) => {
  // 수정버튼 클릭
  event.preventDefault();
  const udBtns = document.querySelectorAll(
    ".post-modify-btn, .post-delete-btn"
  );
  udBtns.forEach((udBtn) => (udBtn.disabled = "true"));

  const cardBody = event.target.parentNode.parentNode;
  const postText = cardBody.children[0].children[0];
  const postInputP = cardBody.children[0].children[1];

  postText.classList.add("noDisplay");
  postInputP.classList.add("d-flex");
  postInputP.classList.remove("noDisplay");
  postInputP.children[0].focus();
};

// export const updatePost = async (event) => {
//   event.preventDefault();
//   const newPost = event.target.parentNode.children[0].value;
//   const id = event.target.parentNode.id;

//   const parentNode = event.target.parentNode.parentNode;
//   const postText = parentNode.children[0];
//   postText.classList.remove("noDisplay");
//   const postInputP = parentNode.children[1];
//   postInputP.classList.remove("d-flex");
//   postInputP.classList.add("noDisplay");

//   const commentRef = doc(dbService, "comments", id);
//   try {
//     await updateDoc(commentRef, { text: newPost });
//     getCommentList();
//   } catch (error) {
//     alert(error);
//   }
// };

// export const savePost = async (event) => {
//   event.preventDefault();
//   const comment = document.getElementById("comment");
//   const { uid, photoURL, displayName } = authService.currentUser;
//   try {
//     await addDoc(collection(dbService, "comments"), {
//       text: comment.value,
//       createdAt: Date.now(),
//       creatorId: uid,
//       profileImg: photoURL,
//       nickname: displayName,
//     });
//     comment.value = "";
//     getCommentList();
//   } catch (error) {
//     alert(error);
//     console.log("error in addDoc:", error);
//   }
// };
