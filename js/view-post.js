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

export const viewPost = async (path) => {
  // 비어 있는 view-post.html 페이지를 불러온다.
  // 게시글 정보를 저장한 tempHtml을 생성하고 view-post.html 페이지에 추가한다.

  const html = await fetch("/pages/view-post.html").then((data) => data.text());
  const mainPage = document.querySelector("#main-page");
  mainPage.innerHTML = html;

  // 게시글 번호 저장
  const postId = path.replace("/view-post-", "");
  // Firebase에서 게시글 번호와 일치하는 글 불러오기
  const q = query(collection(dbService, "post"), where("postId", "==", postId));
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
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
      localname,
    } = doc.data();
    const id = doc.id;
    const currentUid = authService.currentUser.uid;
    const isOwner = currentUid === creatorId;

    const tempHtml = `
    <div class="post-header">
    <div class="post-user">
      <img class="post-profile-img" src="${
        profileImg ?? "/img/profile-img.png"
      }"
      alt="profile-img" />
      <div class="post-user-name">${nickname ?? email.split("@")[0]}</div>
    </div>
    <div class="post-create-date">${createdAt}</div>
  </div>
  <div class="post-box">
    <div class="post-container">
      <img class="post-img" src="${postImg}" alt="post-img" />
      <div class="alignlocal">
        <div class="post-content">
          <div id="title">${title}</div>
          <div class="input" style="display: none">
            <input
              id="input-title"
              maxlength="22"
              type="text"
              placeholder="${title}"
            />
          </div>
          <div id="description">${contents}</div>
          <div class="input" style="display: none">
            <textarea
              col="10"
              rows="1"
              maxlength="220"
              spellcheck="false"
              id="input-post"
            >${contents}</textarea>
          </div>
        </div>
        <p id="localname">#${localname}</p>
        <select id="local-select" style="display:none">
            <option value="서울">서울</option>
            <option value="경기">경기</option>
            <option value="인천">인천</option>
            <option value="부산">부산</option>
            <option value="대전">대전</option>
            <option value="대구">대구</option>
          </select>
      </div>
      </div>
      <div class="alignBookBtn">
        <div class-"bookmark">
          <a name=${id}  class="fas fa-mug-hot" onclick="handleBookmark(event)">
          </a>
          <div id="bookmarkcount">${bookmark}</div>
        </div>
        <div class="${isOwner ? "post-buttons" : "noDisplay"}">
        <button onclick="onEditing(event)" class="post-modify-btn">수정</button>
        <button name="${id}" onclick="deletePost(event)" class="post-delete-btn">
          삭제
        </button>
        </div>
        </div>
    <button
      name="${postId}"
      id="${id}"
      onclick="updatePost(event)"
      class="post-modify-done-btn"
    >
      완료
    </button>`;

    // article 태그에 담아서 container에 추가
    const article = document.querySelector(".post");
    article.innerHTML = tempHtml;
  });
};

export const deletePost = async (event) => {
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

export const onEditing = (event) => {
  // 수정버튼 클릭
  event.preventDefault();
  const udBtns = document.querySelectorAll(".alignBookBtn"); //수정, 삭제 버튼
  const doneBtn = document.querySelectorAll(".post-modify-done-btn"); //완료버튼
  const title = document.getElementById("title"); //기존 제목
  const description = document.getElementById("description"); //기존 설명
  const modifying = document.querySelectorAll(".input"); //수정용 제목, 내용
  const localselect = document.getElementById("local-select");
  const localname = document.getElementById("localname"); //지역명
  const preTitle = document.getElementById("input-title");

  udBtns.forEach((udBtn) => (udBtn.style.display = "none")); //수정,삭제 버튼 안보이게
  doneBtn.forEach((doneBtn) => (doneBtn.style.display = "flex")); //완료버튼 보이게
  title.style.display = "none";
  description.style.display = "none";
  localname.style.display = "none";
  localselect.style.display = "flex";
  modifying.forEach((mod) => (mod.style.display = "flex"));
  preTitle.setAttribute("value", preTitle.placeholder);
  //제목 input 내부에 미리 이전 데이터 넣어놓기 textarea는 미리설정이 되는데 input은 안돼서 여기서 설정함
  // console.log(modifying[1].children[0].placeholder);
};

//수정완료 버튼
export const updatePost = async (event) => {
  event.preventDefault();

  const modifiedTitle = document.getElementById("input-title").value; //input 삽입, 수정 제목
  const modifiedPost = document.getElementById("input-post").value; //textarea 삽입, 수정 내용
  const localname = document.getElementById("local-select").value; //기존 지역명
  const id = event.target.id; //firebase "post"컬렉션의 문서 id

  const postRef = doc(dbService, "post", id);
  console.log(postRef);
  try {
    await updateDoc(postRef, {
      title: modifiedTitle,
      contents: modifiedPost,
      localname: localname,
    });
    const path = window.location.hash.replace("#", "/");
    viewPost(path).then(() => {
      viewComments(path);
    });
  } catch (error) {
    alert(error);
  }
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
