import {
  addDoc,
  collection,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
import { dbService, authService } from "../firebase.js";

// 포스트 버튼 클릭시 내용 전달 코드
export const postUpload = async (event) => {
  event.preventDefault();
  const post = document.getElementById("input-post");
  const title = document.getElementById("input-title");
  const localname = document.getElementById("local-select");
  const postImg = document.getElementById("input-image");

  // const { uid, photoURL, displayName } = authService.currentUser
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  try {
    await addDoc(collection(dbService, "post"), {
      postId: `${year}${month}${day}001`, //지역번호를 쓰면 더 구분하기 쉬운가?
      title: title.value,
      contents: post.value,
      createdAt: `${year}. ${month}. ${day}`,
      creatorId: "tempID",
      // profileImg: postImg.value,
      // https://simsimjae.tistory.com/405
      nickname: "nickname",
      localname: localname.value,
      //작성할 땐 북마크 개수 0 그래도 여기서 0으로 정의 해야하나?
    });
    post.value = "";
  } catch (error) {
    alert(error);
    console.log("error in addDoc:", error);
  }
};

// 이미지 업로드 코드
// export const changeProfile = async (event) => {
//   event.preventDefault();
//   document.getElementById("profileBtn").disabled = true;
//   const imgRef = ref(
//     storageService,
//     `${authService.currentUser.uid}/${uuidv4()}`
//   );

//   const newNickname = document.getElementById("profileNickname").value;
//   // 프로필 이미지 dataUrl을 Storage에 업로드 후 다운로드 링크를 받아서 photoURL에 저장.
//   const imgDataUrl = localStorage.getItem("imgDataUrl");
//   let downloadUrl;
//   if (imgDataUrl) {
//     const response = await uploadString(imgRef, imgDataUrl, "data_url");
//     downloadUrl = await getDownloadURL(response.ref);
//   }
//   await updateProfile(authService.currentUser, {
//     displayName: newNickname ? newNickname : null,
//     photoURL: downloadUrl ? downloadUrl : null,
//   })
//     .then(() => {
//       alert("프로필 수정 완료");
//       window.location.hash = "#fanLog";
//     })
//     .catch((error) => {
//       alert("프로필 수정 실패");
//       console.log("error:", error);
//     });
// };
