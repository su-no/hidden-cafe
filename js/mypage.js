import { authService, storageService } from './firebase.js';
import {
    ref,
    uploadString,
    getDownloadURL,
} from "";
import { updateProfile } from "";
import { v4 as uuidv4 } from "";

export const changeProfile = async (event) => {
    event.preventDefault();
    document.getElementById("profileBtn").disabled = true;
    // 변경 완료 버튼 여러번 누르지 않도록 한번 누르면 실행될때까지 비활성화
    const imgRef = ref(
        storageService,
        `${authService.currentUser.uid}/${uuidv4()}`
    );

    const newNickname = document.getElementById("profileNickname");
    // 프로필 이미지 dataUrl을 Storage에 업로드 후 다운로드 링크를 받아서
    const imgDataUrl = localStorage.getItem("imgDataUrl");
    let downloadUrl;
    if (imgDataUrl) {
        const response = await uploadString(imgRef, imgDataUrl);
        downloadUrl = await getDownloadURL(response.ref);
    }
    await updateProfile(authService.currentUser, {
        displayName: newNickname ? newNickname : null, 
        photoURL: downloadUrl ? downloadUrl : null, 
    })
        .then(() => {
            alert("프로필 수정 완료");
            window.location.hash = "#fanlog";
        })
        .catch((error) => {
            alert("프로필 수정 실패");
            console.log("error:", error);
        })
};

export const onFileChange = (event) => {
    const thefile = event.target. files [0]: // file 2%
    const reader = new FileReder();
    reader , readAsDatauRL (thefile): // file 객체들 브라우저가 읽을
    reader.onloadend = (finishedEvent) => {
        //파일리더가 파일객채를 data URL로 변한 작업을 끝났을 때
        const imgDataUrl = finishedEvent.currentTarget. result;
        localStorage.setItem("imgDataUrl", imgDataUrl);
        document. getElementById("profileView").sc = imgDataUr
    };
};