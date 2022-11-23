import { dbService, authService, storageService } from "./firebase.js";
import {
  addDoc,
  collection,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";
import { getDate } from "./util.js";

export const viewComments = path => {
  // 댓글 작성자 프로필이미지, 닉네임 가져오기
  const user = authService.currentUser;
  const userProfile = document.querySelector(".comment-profile-img");
  userProfile.setAttribute("src", user.photoURL ?? "/img/profile-img.png");
  const userNickname = document.querySelector(".comment-user-name");
  userNickname.textContent = user.displayName ?? user.email.split("@")[0];

  // 댓글 등록 버튼 이벤트 등록
  const btn = document.querySelector(".comment-post-btn");
  btn.addEventListener("click", () => createComment(path));
};

const createComment = async path => {
  const postId = path.split("/view-post-")[1];
  const user = authService.currentUser;

  const comments = document.querySelector(".comments");
  const newComment = comments.querySelector(".new-comment");
  const newCommentValue = newComment.value;

  if (!newCommentValue) {
    alert("댓글을 입력하세요.");
    return;
  }

  await addDoc(collection(dbService, "comment"), {
    commentID: uuidv4(),
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
    })
    .catch(console.error);
};
