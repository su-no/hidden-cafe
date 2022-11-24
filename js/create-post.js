import {
  addDoc,
  collection,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
import { dbService, authService, storageService } from "./firebase.js";
import { getDate } from "./util.js";
import {
  ref,
  uploadString,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";

// 포스트 버튼 클릭시 내용 전달 코드
export const postUpload = async (event) => {
  event.preventDefault();

  const post = document.getElementById("input-post");
  const title = document.getElementById("input-title");
  const localname = document.getElementById("local-select");
  const { uid, email, photoURL, displayName } = authService.currentUser;
  const imgRef = ref(
    storageService,
    `${authService.currentUser.uid}/img/${uuidv4()}`
  );

  // 프로필 이미지 dataUrl을 Storage에 업로드 후 다운로드 링크를 받아서 photoURL에 저장.

  const imgDataUrl = localStorage.getItem("imgDataUrlPost");
  let downloadUrl;
  if (imgDataUrl) {
    const response = await uploadString(imgRef, imgDataUrl, "data_url");
    downloadUrl = await getDownloadURL(response.ref);
  }

  // document.getElementById("post").disabled = true;
  const alertM = document.getElementById("alert");

  // if (title.value && post.value && response) {
  // console.log(downloadUrl);
  // console.log(document.getElementById("preview-image").src);

  if (title.value.length === 0) {
    alertM.innerHTML = "제목을 추가하세요";
    // document.getElementById("post").disabled = true;
  } else if (post.value.length === 0) {
    alertM.innerHTML = "내용을 추가하세요";
    // document.getElementById("post").disabled = true;
  } else if (document.getElementById("preview-image").src !== imgDataUrl) {
    alertM.innerHTML = "사진을 추가하세요";
    // document.getElementById("post").disabled = true;
  } else {
    try {
      await addDoc(collection(dbService, "post"), {
        contents: post.value, //게시물 내용
        createdAt: getDate(), //메인에 띄울때 사용
        creatorId: uid, //사용자 uid
        email: email, //닉네임없어서 이메일로 대체함
        localname: localname.value, //카테고리 분류시 사용
        postId: `${Date.now()}`, //postID 겹치지 않도록 uuid사용
        postImg: downloadUrl, //이미지 url
        profileImg: photoURL,
        title: title.value, //게시물 제목
        nickname: displayName,
        bookmark: 0,
      });

      alert("포스트 완료!");
      window.location.hash = "#main";

      post.value = "";
    } catch (error) {
      alert(error);
      console.log("error in addDoc:", error);
    }
    // } else {
    //   alert("경고");
    // }
  }
};

//Uncaught TypeError: Failed to execute 'readAsDataURL' on 'FileReader': parameter 1 is not of type 'Blob'.오류해결
//https://stackoverflow.com/questions/32508191/uncaught-typeerror-failed-to-execute-readasdataurl-on-filereader-parameter
//실시간으로 이미지 변경 안되고 한번더 이미지 버튼 눌러야 변경됨...why?? ==> html onclick을 onchange로 바꾸기
export const onFileChange = (event) => {
  event.preventDefault();
  // let theFile = event.target.files[0]; // file 객체
  let theFile = event.target.files;
  let reader = new FileReader();

  reader.readAsDataURL(theFile[0]); // file 객체를 브라우저가 읽을 수 있는 data URL로 읽음.
  reader.onloadend = (finishedEvent) => {
    // 파일리더가 파일객체를 data URL로 변환 작업을 끝났을 때
    const imgDataUrl = finishedEvent.currentTarget.result;
    localStorage.setItem("imgDataUrlPost", imgDataUrl);
    document.getElementById("preview-image").src = imgDataUrl;
  };
};
