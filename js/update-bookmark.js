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

// * 로직
// 커피 아이콘을 누르면, (화면)
// 북마크 데이터에 접근해 값을 + 1해 업데이트 해준다. (Firestore)
// 	updateDoc : 문서의 필드 업데이트
// 	post 컬렉션에서 xx라는 postID를 가진 문서를 찾아 bookmark 필드를 업데이트 한다.

// 문제1 클릭 안해도 업데이트가 됨. // ! 해결 router.js L57에서 실행되고 있었음
// 문제2 필드값 변수를 어떻게 만들어야 되지? // ! 해결 : (이벤트에서 부모 노드로 접근)
// 문제3 아이디로 변수화 해야 됨 //
// 문제4 새로고침을 해야 결과가 반영됨.

// * 너무 허무하게 해결되어 버렸다.. 올포스트에서 변수로 지정하고 그걸 가져오면 되는 거였어...

export const handleBookmark = async event => {
  // ! 최초 성공
  // const docRef = doc(dbService, "post", "id");
  // const bookmark = Number(event.currentTarget.parentNode.innerText);
  // const data = { bookmark: bookmark + 1 };
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
