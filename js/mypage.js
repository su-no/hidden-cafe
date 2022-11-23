import { authService, storageService } from "./firebase.js";
import {
  ref,
  uploadString,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js";
import { updateProfile } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";

export const changeProfile = async event => {
  event.preventDefault();
  document.getElementById("profileBtn").disabled = true;

  const imgRef = ref(storageService, `${authService.currentUser.uid}/${uuidv4()}`);

  const newNickname = document.getElementById("profileNickname").value;
  // 프로필 이미지 dataUrl을 Storage에 업로드 후 다운로드 링크를 받아서 photoURL에 저장.
  const imgProfileUrl = localStorage.getItem("imgDataUrlPost");
  // imgDataUrl이 script-create-post.js 게시글 사진과 변수가 겹쳐서 imgProfileUrl로 변경할까 함...
  let downloadUrl;
  if (imgProfileUrl) {
    const response = await uploadString(imgRef, imgProfileUrl, "data_url");
    downloadUrl = await getDownloadURL(response.ref);
  }
  console.log("updateProfile");
  console.log(authService);
  await updateProfile(authService.currentUser, {
    //if문 shortcut - 변수 반환
    displayName: newNickname ? newNickname : null,
    photoURL: downloadUrl ? downloadUrl : null,
  })
    .then(() => {
      alert("프로필 수정 완료");
      window.location.hash = "#mypage";
    })
    .catch(error => {
      console.log("error:", error);
      alert("프로필 수정 실패");
    });
};
//게시물과 같은 이름의 함수이면 안돼 바꿔!! 그리고 html과 연결

export const onFileChangeProfile = event => {
  const theFile = event.target.files[0]; // file 객체
  const reader = new FileReader();
  // if (theFile && theFile.type.match('image.*')) {
  //   reader.readAsDataURL(theFile); // file 객체를 브라우저가 읽을 수 있는 data URL로 읽음.
  // }
  reader.readAsDataURL(theFile);

  reader.onloadend = finishedEvent => {
    const imgDataUrl = finishedEvent.currentTarget.result;
    // console.log(imgDataUrl);
    localStorage.setItem("imgDataUrlPost", imgDataUrl);
    document.getElementById("profileView").src = imgDataUrl;
  };
};
