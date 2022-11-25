import { dbService } from "./firebase.js";

import {
  doc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";

export const handleBookmark = async (event) => {
  event.preventDefault();
  const id = event.target.name;
  const docRef = doc(dbService, "post", id);
  const bookmark = Number(event.currentTarget.parentNode.innerText);
  const data = { bookmark: bookmark + 1 };

  window.location.hash = "";
  try {
    await updateDoc(docRef, data)
      .then((docRef) => {
        console.log("북마크 성공");
        window.location.hash = "main";
      })
      .catch((error) => {
        console.log("북마크 실패");
      });
  } catch (error) {
    console.log("북마크 업데이트 함수 에러", error);
  }
  // // 함수 기능 : 북마크 누르면 + 1
  // updateDoc(docRef, data)
  //   .then((docRef) => {
  //     console.log("북마크 성공");
  //   })
  //   .catch((error) => {
  //     console.log("북마크 실패");
  //   });

  // setTimeout(() => {
  //   $("#test").load(window.location.href + " event.currentTarget.parentNode.innerText")
  // }, 2000);
};
