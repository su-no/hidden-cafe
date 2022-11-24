import { dbService } from "./firebase.js";

import {
  doc,
  updateDoc,
  collection,
  query,
  getDocs,
  where,
  FieldValue,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";

// * 로직
// 커피 아이콘을 누르면, (화면)
// 북마크 데이터에 접근해 값을 + 1해 업데이트 해준다. (Firestore)
// 	updateDoc : 문서의 필드 업데이트
// 	post 컬렉션에서 xx라는 postID를 가진 문서를 찾아 bookmark 필드를 업데이트 한다.

// 문제1 클릭 안해도 업데이트가 됨. // ! 해결 router.js L57에서 실행되고 있었음
// 문제2 필드값 변수를 어떻게 만들어야 되지? // ! 해결 : (이벤트에서 부모 노드로 접근)
// 문제3 아이디로 변수화 해야 됨 //

export const handleBookmark = async (event) => {
  document.querySelector(".post-container").childNodes[1].hash
  console.log(event.currentTarget.parentNode);
  // 변수 저장 (북마크 변수화, 업데이트값 변수화, 참조문서 변수화)
  const docRef = doc(dbService, "post", "mmAz6CxZCKNISkWo5gFW");
  const bookmark = Number(event.currentTarget.parentNode.innerText);
  const data = { bookmark : bookmark + 1 };

  updateDoc(docRef, data)
    .then((docRef) => {
      console.log("북마크 성공");
    })
    .catch((error) => {
      console.log("북마크 실패");
    });

  // const querySnapshot = await getDocs(collection(dbService, "post"));
  // console.log(event.target);
  // console.log(querySnapshot)
  // querySnapshot.forEach((doc) => {
  //   console.log(doc.id, " => ", doc.data());
  //   console.log(doc.id);
  // });
};
