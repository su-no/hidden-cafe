import {
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  collection,
  orderBy,
  query,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
import { dbService, authService } from "./firebase.js";

export const getpostList = async () => {
  let postObjList = [];
  const q = query(collection(dbService, "post"), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const postObj = {
      id: doc.id,
      ...doc.data(),
    };
    postObjList.push(postObj);
  });
  const postList = document.getElementById("container");
  const currentUid = authService.currentUser.uid;
  postList.innerHTML = "";
  postObjList.forEach((postObj) => {
    const isOwner = currentUid === postObj.creatorId;
    const temp_html = `<article class="post">
    <!-- 게시글 헤더 -->
    <div class="post-header">
      <!-- 사용자 정보 -->
      <div class="post-user">
        <img
          class="post-profile-img"
          src=${postObj.photoURL ?? "/img/profile-img.png"}
          alt="profile-img"
        />
        <div class="post-user-name">${
          postObj.nickname ?? postObj.email.split("@")[0]
        }</div>
      </div>
      <!-- 작성 날짜 -->
      <div class="post-create-date">${postObj.createdAt}</div>
    </div>
    <!-- 게시글 본문 -->
    <div class="post-box">
      <!-- 북마크 버튼 -->
      <div class="bookmark"><i class="fas fa-mug-hot"></i>${
        postObj.bookmark
      }</div>
      <!-- 내용 -->
      <div class="post-container">
        <!-- 이미지 -->
        <img class="post-img" src=${postObj.postImg} alt="post-img" />
        <div class="post-content">
          <!-- 제목 -->
          <a href="#view-post-${postObj.postId}"><h2 class="title">${
      postObj.title
    }</h2></a>
          <!-- 설명 -->
          <div class="description">
            ${postObj.contents}
          </div>
        </div>
      </div>
      <!-- 수정, 삭제 버튼 -->
      <div class="${isOwner ? "post-buttons" : "noDisplay"}">
        <button class="post-modify-btn">수정</button>
        <button class="post-delete-btn">삭제</button>
      </div>
    </div>
  </article>`;

    // `<div class="card commentCard">
    //         <div class="card-body">
    //             <blockquote class="blockquote mb-0">
    //                 <p class="commentText">${postObj.text}</p>
    //                 <p id="${postObj.id}" class="noDisplay">
    //<input class="newCmtInput" type="text" maxlength="30" />
    // <button class="updateBtn" onclick="update_comment(event)">완료</button></p>
    //                 <footer class="quote-footer"><div>BY&nbsp;&nbsp;<img class="cmtImg" width="50px" height="50px" src="${
    //                   postObj.profileImg
    //                 }" alt="profileImg" /><span>${
    //     postObj.nickname ?? "닉네임 없음"
    //   }</span></div><div class="cmtAt">${new Date(postObj.createdAt)
    //     .toString()
    //     .slice(0, 25)}</div></footer>
    //             </blockquote>
    //             <div class="${isOwner ? "updateBtns" : "noDisplay"}">
    //                  <button onclick="onEditing(event)" class="editBtn btn btn-dark">수정</button>
    //               <button name="${
    //                 postObj.id
    //               }" onclick="delete_comment(event)" class="deleteBtn btn btn-dark">삭제</button>
    //             </div>
    //           </div>
    //    </div>`;
    const div = document.createElement("div");
    div.classList.add("mycards");
    div.innerHTML = temp_html;
    postList.appendChild(div);
  });
};
