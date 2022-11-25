// * 추가사항
// * 1. 회원가입 시, 로그인 성공 및 메인 페이지 이동 (83)
// * 2. 구글 계정으로 가입하기 기능 구현
// * 3. 로그인 / 회원가입 유효성 검사 기능 구현
// * 4. 회원가입 시, 아이디 기억하기 체크박스 감추기 구현

// TODO :

// 이메일, 비밀번호 정규식 포맷 가져오기
import { emailRegex, pwRegex } from "./regex.js";

// firebase getAuth 가져오기
import { authService } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";

// 로그인 / 회원가입 (로그인 성공 시 메인 화면으로 이동)
export const handleAuth = (event) => {
  event.preventDefault();
  const email = document.getElementById("email");
  const emailVal = email.value;
  const pw = document.getElementById("pw");
  const pwVal = pw.value;

  // 로그인 유효성 검사
  if (!emailVal) {
    alert("이메일을 입력해 주세요");
    email.focus();
    return;
  }
  if (!pwVal) {
    alert("비밀번호를 입력해 주세요");
    pw.focus();
    return;
  }

  // 로그인 / 회원가입 요청
  const authBtnText = document.querySelector("#authBtn").value;
  if (authBtnText === "로그인") {
    signInWithEmailAndPassword(authService, emailVal, pwVal)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("user:", user);
        //세션설정
        window.sessionStorage.setItem("user", user.uid);
        window.sessionStorage.setItem("userProfile", user.photoURL);
        window.sessionStorage.setItem("userNickname", user.displayName);
        window.sessionStorage.setItem("userEmail", user.email);
        window.location.hash = "main";
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log("errorMessage:", errorMessage);
        if (errorMessage.includes("user-not-found")) {
          alert("가입되지 않은 회원입니다.");
          return;
        } else if (errorMessage.includes("wrong-password")) {
          alert("비밀번호가 잘못 되었습니다.");
        }
      });
  } else {
    // 회원가입 유효성 검사 + 회원가입 요청
    const matchedEmail = emailVal.match(emailRegex);
    const matchedPw = pwVal.match(pwRegex);

    if (matchedEmail === null) {
      alert("가입할 수 없는 이메일 형식입니다.");
      email.focus();
      return;
    }
    if (matchedPw === null) {
      alert(
        "비밀번호는 10자리 이상이어야 하고 영문자, 숫자, 특수문자를 모두 포함해야 합니다."
      );
      pw.focus();
      return;
    }
    // 회원가입 버튼 클릭의 경우
    createUserWithEmailAndPassword(authService, emailVal, pwVal)
      .then((userCredential) => {
        // Signed in
        // 초기 닉네임, 프로필사진 설정
        authService.currentUser.displayName = emailVal.split("@")[0];
        authService.currentUser.photoURL = "/img/profile-img.png";
        console.log("회원가입 성공!");
        const user = userCredential.user;
        window.location.hash = "main";
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log("errorMessage:", errorMessage);
        if (errorMessage.includes("email-already-in-use")) {
          alert("이미 가입된 이메일입니다.");
        }
      });
  }
};

// 구글 로그인
export const socialLogin = (event) => {
  const { name } = event.target;
  let provider;
  if (name === "google") {
    provider = new GoogleAuthProvider();
  }
  signInWithPopup(authService, provider)
    .then((result) => {
      // const credential = GoogleAuthProvider.credentialFromResult(result);
      // const token = credential.accessToken;
      const user = result.user;
      console.log("로그인 성공!");
      window.location.hash = "main";
    })
    .catch((error) => {
      // Handle Errors here.
      console.log("error:", error);
      const errorCode = error.code;
      const errorMessage = error.message;
    });
};

// 로그인 <-> 회원가입 토글 기능 구현
export const onToggle = () => {
  const authBtn = document.querySelector("#authBtn");
  const authToggle = document.querySelector("#authToggle");
  const rememberId = document.querySelector("#rememberIdArea");
  if (authBtn.value === "로그인") {
    authBtn.innerText = "회원가입";
    authBtn.value = "회원가입";
    authToggle.textContent = "로그인하러 가기";
    rememberId.childNodes[1].hidden = true;
  } else {
    authBtn.innerText = "로그인";
    authBtn.value = "로그인";
    authToggle.textContent = "지금 이메일로 가입하기";
    rememberId.childNodes[1].hidden = false;
  }
};

// 로그인 상태에 따라 로그인, 로그아웃 버튼 구현
onAuthStateChanged(authService, (user) => {
  const loginBtn = document.querySelector("header .btn-login");
  if (user) {
    loginBtn.textContent = "로그아웃";
  } else {
    loginBtn.textContent = "로그인";
  }
});

// 로그인, 로그아웃 버튼 클릭시 핸들 함수
export const onLoginButton = (event) => {
  // 로그인 버튼일 경우, 페이지 이동
  if (event.target.textContent === "로그인") {
    window.location.hash = event.target.hash;
  } else {
    // 로그아웃 버튼일 경우, 로그아웃 처리 후 메인페이지 이동
    authService.signOut();
    window.location.hash = "main";
    console.log("로그아웃 성공!");
    //세션초기화
    window.sessionStorage.setItem("user", "");
    window.sessionStorage.setItem("userProfile", "");
    window.sessionStorage.setItem("userNickname", "");
    window.sessionStorage.setItem("userEmail", "");
  }
};
