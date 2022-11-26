import { authService, dbService } from "./firebase.js";
import { getBookmarkList } from "./view-bookmark.js";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  addDoc,
  collection,
  getDocs,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";

export const handleBookmark = async event => {
  event.preventDefault();
  const id = event.target.name;
  const bookmarkDiv = event.currentTarget.parentNode.lastChild.previousSibling;
  const docRef = doc(dbService, "post", id);
  const bookmark = Number(event.currentTarget.parentNode.innerText);

  //
  const userId = sessionStorage.getItem("user");

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
  //

  const bookmarkList = userData.bookmarks;

  // * 북마크 삭제 완료 부
  if (bookmarkList.includes(id)) {
    const data = { bookmark: bookmark - 1 };
    await updateDoc(docRef, data)
      .then(docRef => {
        const bookmarkCount = bookmarkDiv; // 북마크 값을 가지고 있는 div
        const countNum = Number(bookmarkCount.innerText); // 위 div의 innerText를 가져와 숫자로 만듬
        bookmarkCount.innerText = countNum - 1; // 위에서 만든 값에 + 1을 함
        console.log("북마크 -1 성공");
      })
      .catch(error => {
        console.log("북마크 -1 실패");
      });

    // * 북마크 추가 완료 부
  } else {
    const data = { bookmark: bookmark + 1 };
    await updateDoc(docRef, data)
      .then(docRef => {
        const bookmarkCount = bookmarkDiv; // 북마크 값을 가지고 있는 div
        const countNum = Number(bookmarkCount.innerText); // 위 div의 innerText를 가져와 숫자로 만듬
        bookmarkCount.innerText = countNum + 1; // 위에서 만든 값에 + 1을 함
        console.log("북마크 +1 성공");
      })
      .catch(error => {
        console.log("북마크 +1 실패");
      });
  }

  // 함수 기능 : 북마크 누르면 + 1
  // ! 문제 1 : 첫번째 것만 숫자가 업데이트됨. -> 해결
  // 북마크 -1 기능은 아래 함수로 하면 됨 ( -1로)
  // updateDoc(docRef, data)
  //   .then((docRef) => {
  //     const bookmarkCount = bookmarkDiv; // 북마크 값을 가지고 있는 div
  //     const countNum = Number(bookmarkCount.innerText); // 위 div의 innerText를 가져와 숫자로 만듬
  //     bookmarkCount.innerText = countNum + 1; // 위에서 만든 값에 + 1을 함
  //     console.log("북마크 성공");
  //   })
  //   .catch((error) => {
  //     console.log("북마크 실패");
  //   });

  handleBookmarkList(id);
};

// 북마크 업데이트 시, 현재 사용자의 bookmark 컬렉션에 게시글을 추가한다.
const handleBookmarkList = async postId => {
  // 현재 사용자 uid
  const userId = sessionStorage.getItem("user");

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
    return;
  }
  // bookmark 컬렉션에 사용자 문서가 존재하고, 해당 게시글이 존재하지 않으면, 추가
  const bookmarkList = userData.bookmarks;
  const docRef = doc(dbService, "bookmark", userDataId);
  // * 북마크 삭제 완료 부
  if (bookmarkList.includes(postId)) {
    await updateDoc(docRef, {
      bookmarks: arrayRemove(postId),
    });
    console.log(`postId: ${postId} 북마크 삭제 완료!`);
    // * 북마크 추가 완료 부
  } else {
    await updateDoc(docRef, {
      bookmarks: arrayUnion(postId),
    });
    console.log(`postId: ${postId} 북마크 추가 완료!`);
  }

  if (window.location.hash === "#bookmark") {
    getBookmarkList();
  }
};
