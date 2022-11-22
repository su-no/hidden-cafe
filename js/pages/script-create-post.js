import {
  addDoc,
  collection,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
import { dbService, authService } from "../firebase.js";
// import { authService, storageService } from "../firebase.js";
// import {
//   ref,
//   uploadString,
//   getDownloadURL,
// } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js";
// import { updateProfile } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
// import { v4 as uuidv4 } from "https://jspm.dev/uuid";

// 포스트 버튼 클릭시 내용 전달 코드
export const postUpload = async (event) => {
  event.preventDefault();
  // document.getElementById("profileBtn").disabled = true;
  const post = document.getElementById("input-post");
  const title = document.getElementById("input-title");
  const localname = document.getElementById("local-select");
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  // const { uid, photoURL, nickName } = authService.currentUser
  // const imgRef = ref(
  //   storageService,
  //   `${authService.currentUser.uid}/${uuidv4()}`
  // );

  // // 프로필 이미지 dataUrl을 Storage에 업로드 후 다운로드 링크를 받아서 photoURL에 저장.
  // const imgDataUrl = localStorage.getItem("imgDataUrl");
  // let downloadUrl;
  // if (imgDataUrl) {
  //   const response = await uploadString(imgRef, imgDataUrl, "data_url");
  //   downloadUrl = await getDownloadURL(response.ref);
  // }

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

//Uncaught TypeError: Failed to execute 'readAsDataURL' on 'FileReader': parameter 1 is not of type 'Blob'.오류해결
//https://stackoverflow.com/questions/32508191/uncaught-typeerror-failed-to-execute-readasdataurl-on-filereader-parameter
//실시간으로 이미지 변경 안되고 한번더 이미지 버튼 눌러야 변경됨...why??
export const onFileChange = (event) => {
  if (window.FileReader) {
    const theFile = event.target.files[0]; // file 객체
    const reader = new FileReader();
    if (theFile && theFile.type.match("image.*")) {
      reader.readAsDataURL(theFile); // file 객체를 브라우저가 읽을 수 있는 data URL로 읽음.
    }

    reader.onload = (finishedEvent) => {
      // 파일리더가 파일객체를 data URL로 변환 작업을 끝났을 때
      const imgDataUrl = finishedEvent.currentTarget.result;
      console.log(imgDataUrl);
      localStorage.setItem("imgDataUrl", imgDataUrl);
      document.getElementById("preview-image").src = imgDataUrl;
    };
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

//   // const newNickname = document.getElementById("profileNickname").value;
//   // 프로필 이미지 dataUrl을 Storage에 업로드 후 다운로드 링크를 받아서 photoURL에 저장.
//   const imgDataUrl = localStorage.getItem("imgDataUrl");
//   let downloadUrl;
//   if (imgDataUrl) {
//     const response = await uploadString(imgRef, imgDataUrl, "data_url");
//     downloadUrl = await getDownloadURL(response.ref);
//   }
//   await updateProfile(authService.currentUser, {
//     // displayName: newNickname ? newNickname : null,
//     photoURL: downloadUrl ? downloadUrl : null,
//   })
//     .then(() => {
//       // alert("프로필 수정 완료");
//       window.location.hash = "#fanLog";
//     })
//     .catch((error) => {
//       alert("프로필 수정 실패");
//       console.log("error:", error);
//     });
// };
