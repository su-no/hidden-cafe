import { dbService, authService, storageService } from "./firebase.js";
import {
  ref,
  uploadString,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js";
import {
  query,
  collection,
  where,
  doc,
  getDocs,
  deleteDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
import { updateProfile } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";

//닉네임, 이미지 수정
export const changeProfile = async (event) => {
  event.preventDefault();
  document.getElementById("profileBtn").disabled = true;
  const sessionUser = sessionStorage.getItem("user");
  let postObjList = [];
  const q = query(
    collection(dbService, "post"),
    where("creatorId", "==", authService.currentUser.uid)
  );
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    const postObj = {
      id: doc.id,
      ...doc.data(),
    };
    postObjList.push(postObj);
  });

  const imgRef = ref(
    storageService,
    `${authService.currentUser.uid}/${uuidv4()}`
  );
  const preNickname = document.getElementById("profileNickname").placeholder; // 이전닉네임
  const newNickname = document.getElementById("profileNickname").value; //새로운 닉네임
  const imgProfileUrl = localStorage.getItem("imgDataUrl");
  let downloadUrl;
  if (imgProfileUrl) {
    const response = await uploadString(imgRef, imgProfileUrl, "data_url");
    downloadUrl = await getDownloadURL(response.ref);
  }
  postObjList.forEach((postObj) => {
    const docRef = doc(dbService, "post", postObj.id);
    const data = { nickname: newNickname, profileImg: downloadUrl };
    updateDoc(docRef, data).then(() => console.log("데이터 성공"));
  });
  //닉네임이 빈칸이면 이전 닉네임으로 설정
  window.sessionStorage.setItem(
    "userNickname",
    newNickname.length !== 0 ? newNickname : preNickname
  );

  await updateProfile(authService.currentUser, {
    displayName: newNickname ? newNickname : preNickname,
    photoURL: downloadUrl ? downloadUrl : null,
  })
    .then(() => {
      alert("프로필 수정 완료");
      window.location.hash = "#mypage";
    })
    .catch((error) => {
      console.log("error:", error);
      alert("프로필 수정 실패");
    });
};

//게시물과 같은 이름의 함수이면 안돼 바꿔!! 그리고 html과 연결

export const onFileChangeProfile = (event) => {
  const theFile = event.target.files[0]; // file 객체
  const reader = new FileReader();
  // if (theFile && theFile.type.match('image.*')) {
  //   reader.readAsDataURL(theFile); // file 객체를 브라우저가 읽을 수 있는 data URL로 읽음.
  // }
  reader.readAsDataURL(theFile);

  reader.onloadend = (finishedEvent) => {
    const imgDataUrl = finishedEvent.currentTarget.result;
    // console.log(imgDataUrl);
    localStorage.setItem("imgDataUrl", imgDataUrl);
    window.sessionStorage.setItem("userProfile", imgDataUrl);
    document.getElementById("profileView").src = imgDataUrl;
  };
};
