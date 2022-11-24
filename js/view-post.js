import { dbService, authService } from "./firebase.js";
import {
  query,
  collection,
  where,
  doc,
  getDocs,
  deleteDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
import { viewComments } from "./comments.js";

export const viewPost = async path => {
  // 비어 있는 view-post.html 페이지를 불러온다.
  // 게시글 정보를 저장한 tempHtml을 생성하고 view-post.html 페이지에 추가한다.

  const html = await fetch("/pages/view-post.html").then(data => data.text());
  const mainPage = document.querySelector("#main-page");
  mainPage.innerHTML = html;

  // 게시글 번호 저장
  const postId = path.replace("/view-post-", "");
  // console.log("postId :", postId);

  // Firebase에서 게시글 번호와 일치하는 글 불러오기
  const q = query(collection(dbService, "post"), where("postId", "==", postId));
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach(doc => {
    const {
      nickname,
      profileImg,
      createdAt,
      creatorId,
      email,
      bookmark,
      postImg,
      title,
      contents,
    } = doc.data();
    const id = doc.id;
    const currentUid = authService.currentUser.uid;
    const isOwner = currentUid === creatorId;

    const tempHtml = `
    <div class="post-header">
      <div class="post-user">
        <img class="post-profile-img" src="${
          profileImg ?? "/img/profile-img.png"
        }" alt="profile-img" />
        <div class="post-user-name">${nickname ?? email.split("@")[0]}</div>
      </div>
      <div class="post-create-date">${createdAt}</div>
    </div>
    <div class="post-box">
      <div class="post-container">
        <img class="post-img" src="${postImg}" alt="post-img" />
        <div class="post-content">
          <div id="title">${title}</div>
          <div class="input" style="display: none">
            <input id="input-title" maxlength="22" type="text" placeholder="${title}" />
          </div>
          <div class="description">${contents}</div>
          <div class="input" style="display: none">
            <textarea
              col="10"
              rows="1"
              maxlength="220"
              spellcheck="false"
              id="input-post"
              placeholder="${contents}"
            ></textarea>
          </div>
        </div>
      </div>
      <div class="alignBookBtn">
        <div class="bookmark"><i class="fas fa-mug-hot"></i>${bookmark}</div>
        <div class="${isOwner ? "post-buttons" : "noDisplay"}">
        <button onclick="onEditing(event)" class="post-modify-btn">수정</button>
        <button name="${id}" onclick="deletePost(event)" class="post-delete-btn">삭제</button>
      </div>
    </div>
    <button name="${id}" id="${postId}" onclick="updatePost(event)" class="post-modify-done-btn">
      완료
    </button>`;

    // article 태그에 담아서 container에 추가
    const article = document.querySelector(".post");
    article.innerHTML = tempHtml;
  });
};

export const deletePost = async event => {
  event.preventDefault();
  console.log(event.target);
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

export const onEditing = event => {
  // 수정버튼 클릭
  event.preventDefault();
  const udBtns = document.querySelectorAll(".alignBookBtn");
  const doneBtn = document.querySelectorAll(".post-modify-done-btn");
  const title = document.querySelectorAll("#title");
  const modifyTitle = document.querySelectorAll(".input"); //수정용 제목, 내용
  const description = document.querySelectorAll(".description");
  // udBtns.forEach((udBtn) => (udBtn.disabled = "true"));
  //수정버튼 누르면 수정, 삭제 버튼 안보이고 완료버튼 보임
  udBtns.forEach(udBtn => (udBtn.style.display = "none"));
  doneBtn.forEach(doneBtn => (doneBtn.style.display = "flex"));
  title.forEach(udBtn => (udBtn.style.display = "none"));
  modifyTitle.forEach(udBtn => (udBtn.style.display = ""));
  description.forEach(udBtn => (udBtn.style.display = "none"));
};

//수정완료 버튼
export const updatePost = async event => {
  event.preventDefault();

  //input 삽입 제목
  const modifiedTitle =
    event.target.parentNode.children[0].children[1].children[1].children[0].value;
  //textarea 삽입 내용
  const modifiedPost =
    event.target.parentNode.children[0].children[1].children[3].children[0].value;
  const id = event.target.name;

  const postRef = doc(dbService, "post", id);
  try {
    await updateDoc(postRef, { title: modifiedTitle, contents: modifiedPost });
    const postId = event.target.id;
    viewPost(`/view-post-${postId}`);
    // window.location.reload();
  } catch (error) {
    alert(error);
  }

  const path = window.location.hash.replace("#", "/");
  viewPost(path).then(() => {
    viewComments(path);
  });
};

// export const savePost = async (event) => {
//   event.preventDefault();
//   const post = document.getElementById("post");
//   const { uid, photoURL, displayName } = authService.currentUser;
//   try {
//     await addDoc(collection(dbService, "comments"), {
//       text: post.value,
//       createdAt: Date.now(),
//       creatorId: uid,
//       profileImg: photoURL,
//       nickname: displayName,
//     });
//     post.value = "";
//     getpostList();
//   } catch (error) {
//     alert(error);
//     console.log("error in addDoc:", error);
//   }
// };
