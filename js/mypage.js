import { authService, storageService } from "./firebase.js";
import {
  ref,
  uploadString,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js";
import { updateProfile } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
// import { updateProfile } from "";

export const changeProfile = async (event) => {
    event.preventDefault();
    document.getElementById("profileBtn").disabled = true;
   

    const newNickname = document.getElementById("profileNickname").value;
  // 프로필 이미지 dataUrl을 Storage에 업로드 후 다운로드 링크를 받아서 photoURL에 저장.
    // const imgDataUrl = localStorage.getItem("imgDataUrl");
    // let downloadUrl;
    // if (imgDataUrl) {
    //     const response = await uploadString(imgRef, imgDataUrl, "data_url");
    //     downloadUrl = await getDownloadURL(response.ref);
    // }
    console.log('updateProfile');
    console.log(authService);
    await updateProfile(authService.currentUser, {
        //if문 shortcut - 변수 반환
        displayName: newNickname ? newNickname : null,
        // photoURL: downloadUrl ? downloadUrl : null,
    }).then(() => {
        alert("프로필 수정 완료");
        window.location.hash = "#mypage";
        })
        .catch((error) => {
        console.log("error:", error);
        alert("프로필 수정 실패");
        });
        
};