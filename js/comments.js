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
  updateDoc,
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
  const q = query(collection(dbService, "comment"), where("postId", "==", postId), orderBy("createdAt"));
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
    // console.log("comment", commentObj.id);
    const isOwner = user.uid === commentObj["creatorId"];
    const tempHtml = `
    <div class="comment-user">
      <img class="comment-profile-img" src="${commentObj.profileUrl ?? "/img/profile-img.png"}" alt="profile-img" />
      <div class="comment-user-name">${commentObj.nickname}</div>
    </div>
    <div id="preContent-${commentObj.id}" class="comment-description">${commentObj.contents}</div>
    <div class="modifyComment">
      <input
        id="modifiedComment-${commentObj.id}"
        class="modifycomment-description"
        type="text"
        style="display: none"
        placeholder="${commentObj.contents}"
      />
    </div>
    <div class="comment-create-date">${commentObj.createdAt}</div>
    <div class="comment-buttons"></div>
    <button onclick="modifyComment(event)" id=${commentObj.id} name=${commentObj.id} class="${
      isOwner ? "comment-modify-btn" : "noDisplay"
    }">수정
    <button
      id="comment-modify-done-btn-${commentObj.id}"
      name="${commentObj.id}"
      style="display: none"
      onclick="updateComment(event)"
    >
      완료<button>
        <button onclick="deleteComment(event)" id=${commentObj.commentID} name=${commentObj.id} class="${
      isOwner ? "comment-delete-btn" : "noDisplay"
    }">삭제
      </button>
    </button>`;
    //77줄 id값 바꿈!!

    //댓글창이 인풋창이어야 하고 등록을 누르면 사라졌다가 수정을 누르면 다시 나타나게 한다


    const commentRow = document.createElement("div");
    commentRow.classList.add("comment-row");
    commentRow.innerHTML = tempHtml;
    commentList.appendChild(commentRow);
  });

  // 문서에 있는 모든 삭제 버튼에 이벤트 등록
  const deleteBtns = document.querySelectorAll(".comment-delete-btn");
  deleteBtns.forEach((btn) => {
    btn.addEventListener("click", deleteComment);
  });
  // 문서 있는 모든 수정 버튼에 이벤트 등록
  const modifyBtns = document.querySelectorAll(".comment-modify-btn");
  modifyBtns.forEach((btn) => {
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
export const deleteComment = async event => {
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

// 수정버튼 클릭
export const modifyComment = event => {
  // console.log(event.currentTarget.id);

  event.preventDefault();
  const id = event.currentTarget.id;
  // console.log("modivyComment", id);
  const udBtns = document.querySelectorAll(".comment-modify-btn"); //수정, 삭제 버튼
  const doneBtn = document.getElementById(`comment-modify-done-btn-${id}`); //완료버튼
  // console.log(doneBtn);
  // const content = document.getElementById("content"); //기존 내용 class="content">${commentObj.contents}
  const modifying = document.getElementById(`modifiedComment-${id}`); //수정 내용
  const preContent = document.getElementById(`preContent-${id}`);
  preContent.classList.add("noDisplay");

  udBtns.forEach(udBtn => (udBtn.style.display = "none")); //수정,삭제 버튼 안보이게
  doneBtn.forEach((doneBtn) => (doneBtn.style.display = "flex")); //완료버튼 보이게 지금 안보여!!!!!!!
  content.description.forEach((contents) => (contents.style.display = "flex"));
  modifying.focus();
  //제목 input 내부에 미리 이전 데이터 넣어놓기 textarea는 미리설정이 되는데 input은 안돼서 여기서 설정함
  console.log(modifying[1].children[0].placeholder); 
};

//수정완료 버튼
export const updateComment = async event => {
  event.preventDefault();
  const id = event.currentTarget.name;
  // console.log(id);
  const modifiedComment = document.getElementById(`modifiedComment-${id}`).value; //textarea 삽입, 수정 내용
  const postId = event.target.id; //firebase "post"컬렉션의 문서 id --> 필요없음
  // console.log(modifiedComment);

  const commentRef = doc(dbService, "comment", id);
  // console.log(commentRef);
  try {
    await updateDoc(commentRef, {
      contents: modifiedComment,
    });
    const path = window.location.hash.replace("#", "/");
    viewPost(path).then(() => {
      viewComments(path);
    });
  } catch (error) {
    alert(error);
  }
};

//댓글창작성 다시 실행

// 저장 버튼으로 변경 -> 저장 누르면 alert(저장하시겠습니까?) -> 저장 -> alert(저장되었습니다.)
// 저장된 댓글 다시 불러오기 & 수정 삭제 버튼 복귀
