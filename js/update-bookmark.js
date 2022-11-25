import { authService, dbService } from "./firebase.js";

import {
  doc,
  updateDoc,
  arrayUnion,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";

export const handleBookmark = async (event) => {
  event.preventDefault();
  const id = event.target.name;
  const docRef = doc(dbService, "post", id);
  const bookmark = Number(event.currentTarget.parentNode.innerText);
  const data = { bookmark: bookmark + 1 };
  // 함수 기능 : 북마크 누르면 + 1
  updateDoc(docRef, data)
    .then(docRef => {
      console.log("북마크 성공");
    })
    .catch(error => {
      console.log("북마크 실패");
    });
  addToBookmarkList(id);
};

// 북마크 업데이트 시, 현재 사용자의 bookmark 컬렉션에 게시글을 추가한다.
const addToBookmarkList = async postId => {
  // 현재 사용자의 uid
  // bookmark colletion의 uid문서를 찾고
  // 그 안에 bookmark 배열에 현재 게시글 번호 추가
  const userId = authService.currentUser.uid.toString();
  const docRef = doc(dbService, "bookmark", userId);

  await updateDoc(docRef, {
    bookmarks: arrayUnion(postId),
  }).then(() => {
    console.log(`postId: ${postId} 북마크 성공!`);
  });
};
