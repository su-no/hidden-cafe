import { dbService, authService } from "./firebase.js";
import {
query,
collection,
where,
getDocs,
orderBy,
addDoc,
deleteDoc,
doc,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
import { getDate } from "./util.js";
import { viewPost } from "./view-post.js";

// Firebase DB에서 댓글 불러와서 보여주는 함수
export const viewComments = async path => {
const postId = path.split("/view-post-")[1];
// 댓글 작성자 프로필이미지, 닉네임 가져오기
const user = authService.currentUser;
const userProfile = document.querySelector(".comment-profile-img");
userProfile.setAttribute("src", user.photoURL ?? "/img/profile-img.png");
const userNickname = document.querySelector(".comment-user-name");
userNickname.textContent = user.displayName ?? user.email.split("@")[0];

// 댓글 등록 버튼에 이벤트 등록
const createBtn = document.querySelector(".comment-post-btn");
createBtn.onclick = () => {
  const value = document.querySelector(".new-comment").value;
  if (!value) {
    alert("댓글을 입력하세요.");
    return;
  }
  createComment(path);
};

// Firebase에서 해당 게시글의 댓글 받아오기
const q = query(
  collection(dbService, "comment"),
  where("postId", "==", postId),
  orderBy("createdAt"),
);
const querySnapshot = await getDocs(q);
const commentObjList = [];
querySnapshot.forEach(doc => {
  const commentObj = {
    id: doc.id,
    ...doc.data(),
  };
  commentObjList.push(commentObj);
});
// 댓글 목록을 비우고 하나씩 추가
const commentList = document.querySelector(".comment-list");
commentList.innerHTML = "";
commentObjList.forEach(commentObj => {
  const isOwner = user.uid === commentObj["creatorId"];
  const tempHtml = `
  <div class="comment-user">
    <img
      class="comment-profile-img"
      src="${commentObj.profileUrl ?? "/img/profile-img.png"}"
      alt="profile-img"
    />
    <div class="comment-user-name">${commentObj.nickname}</div>
  </div>
  <div class="comment-description">${commentObj.contents}</div>
  <div class="comment-create-date">${commentObj.createdAt}</div>
  <div class="comment-buttons">
    <button id=${commentObj.commentID} name=${commentObj.id} class="${
      isOwner ? "comment-modify-btn" : "noDisplay"
    }">수정</button>
    <button id=${commentObj.commentID} name=${commentObj.id}
      class="${isOwner ? "comment-delete-btn" : "noDisplay"}">
      삭제
    </button>
  </div>`;

  const commentRow = document.createElement("div");
  commentRow.classList.add("comment-row");
  commentRow.innerHTML = tempHtml;
  commentList.appendChild(commentRow);
});

// 문서에 있는 모든 삭제 버튼에 이벤트 등록
const deleteBtns = document.querySelectorAll(".comment-delete-btn");
deleteBtns.forEach(btn => {
  btn.addEventListener("click", deleteComment);
});
// 문서 있는 모든 수정 버튼에 이벤트 등록
const modifyBtns = document.querySelectorAll(".comment-modify-btn");
modifyBtns.forEach(btn => {
  btn.addEventListener("click", deleteComment);
});

};

// 댓글 작성 함수
const createComment = async path => {
const postId = path.split("/view-post-")[1];
const user = authService.currentUser;

const newComment = document.querySelector(".new-comment");
const newCommentValue = newComment.value;

await addDoc(collection(dbService, "comment"), {
  commentID: Date.now(),
  contents: newCommentValue,
  createdAt: getDate(),
  creatorId: user.uid,
  email: user.email,
  nickname: user.displayName ?? user.email.split("@")[0],
  postId: postId,
  profileUrl: user.photoURL,
})
  .then(() => {
    console.log("댓글 작성 완료");
    newComment.value = "";
    newComment.focus();
    viewComments(path);
  })
  .catch(console.error);
};
//댓글 삭제
const deleteComment = async event => {
const commentID = event.target.name;
const ok = window.confirm("정말 삭제하시겠습니까?");
if (ok) {
  try {
    await deleteDoc(doc(dbService, "comment", commentID));
    // 댓글 삭제 완료되면 페이지 다시 불러오기
    const path = window.location.hash.replace("#", "/");
    viewPost(path).then(() => {
      viewComments(path);
    });
  } catch (error) {
    console.error(error);
  }
}
};
// 댓글창 수정하기
// 수정 버튼 누르면 댓글창 다시 활성화(썼던 내용 그대로!!)
const modifyComment = async event => {
  const commentID = event.target.name;
  const user = authService.currentUser;
  //   const newComment = document.querySelector(".new-comment");
  const newCommentValue = newComment.value;
    await addDoc(collection(dbService, "comment"), {
    commentID: Date.now(),
    contents: newCommentValue,
    createdAt: getDate(),
    creatorId: user.uid,
    email: user.email,
    nickname: user.displayName ?? user.email.split("@")[0],
    postId: postId,
    profileUrl: user.photoURL,
  })
    .then(() => {
      console.log("댓글 수정 완료");
      newComment.value = "";
      newComment.focus();
      viewComments(path);
    })
    .catch(console.error);
  };

//댓글창작성 다시 실행

// 저장 버튼으로 변경 -> 저장 누르면 alert(저장하시겠습니까?) -> 저장 -> alert(저장되었습니다.)
// 저장된 댓글 다시 불러오기 & 수정 삭제 버튼 복귀