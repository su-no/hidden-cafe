import { authService, dbService } from "./firebase.js";

import {
  doc,
  updateDoc,
  arrayUnion,
  addDoc,
  collection,
  getDocs,
  query,
  where,
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
  // 현재 사용자 uid
  const userId = authService.currentUser.uid.toString();

  // bookmark 컬렉션 문서에서 userId 필드의 값이 uid와 일치하는 문서 가져오기
  const q = query(
    collection(dbService, "bookmark"),
    where("userId", "==", userId),
  );
  const querySnapshot = await getDocs(q);
  let userDataId; // bookmark 컬렉션에 저장된 유저 문서 id
  let userData; // 유저 문서의 데이터
  querySnapshot.forEach(doc => {
    userDataId = doc.id;
    userData = doc.data();
  });

  // 만약 bookmark 컬렉션에 사용자 문서가 존재하지 않으면 추가
  if (!userData) {
    await addDoc(collection(dbService, "bookmark"), {
      userId: userId,
      bookmarks: [postId], //게시물 내용
    });
  } else {
    // bookmark 컬렉션에 사용자 문서가 존재하면, 업데이트
    const docRef = doc(dbService, "bookmark", userDataId);
    await updateDoc(docRef, {
      bookmarks: arrayUnion(postId),
    }).then(() => {
      // console.log(`postId: ${postId} 북마크 성공!`);
    });
  }
};

const removeFromBookmarkList = async postId => {};
