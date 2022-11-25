import {
  getDoc,
  getDocs,
  doc,
  query,
  collection,
  where,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
import { authService, dbService } from "./firebase.js";

// 로그인한 사용자의 북마크 리스트 가져오기
export const getBookmarkList = async () => {
  const userId = sessionStorage.getItem("user");

  // bookmark 문서 중 userId 필드가 일치하는 문서 가져오기
  const q = query(
    collection(dbService, "bookmark"),
    where("userId", "==", userId),
  );
  const querySnapshot = await getDocs(q);
  // 일치하는 문서의 bookmarks 필드 가져오기
  let bookmarkList;
  querySnapshot.forEach(doc => {
    bookmarkList = doc.data().bookmarks;
  });

  // 만약 북마크가 없거나, 존재하는데 길이가 0이면 리턴
  if (!bookmarkList || bookmarkList.length === 0) {
    const postList = document.getElementById("container");
    postList.innerHTML = `
    <div style="text-align: center; height: 100px; padding-top: 200px">
    <h2>북마크를 추가해주세요! ☕️</h2>
    </div>`;
    return;
  }
  // 북마크가 존재하면 다음 함수 실행
  getBookmarkPost(bookmarkList);
};

// 북마크 리스트에서 게시글 하나씩 DOM에 추가하기
const getBookmarkPost = async bookmarkList => {
  const postList = document.getElementById("container");
  const sessionUser = sessionStorage.getItem("user");
  const sessionUserProfile = sessionStorage.getItem("userProfile");
  const sessionUserNickname = sessionStorage.getItem("userNickname");

  for (let i = 0; i < bookmarkList.length; i++) {
    const postId = bookmarkList[i];
    const docRef = doc(dbService, "post", postId);
    const docSnap = await getDoc(docRef);
    const postObj = {
      id: docSnap.id,
      ...docSnap.data(),
    };

    const temp_html = `
    <article class="post">
      <div class="post-header">
        <div class="post-user">
          <img class="post-profile-img" src=${
            postObj.creatorId === sessionUser
              ? sessionUserProfile
              : postObj.profileImg ?? "/img/profile-img.png"
          } alt="profile-img" />
          <div class="post-user-name">
            ${
              postObj.creatorId === sessionUser
                ? sessionUserNickname
                : postObj.nickname ?? postObj.email.split("@")[0]
            }
          </div>
        </div>
        <div class="post-create-date">${postObj.createdAt}</div>
      </div>
      <div class="post-box">
        <div class="post-container">
          <a href="#view-post-${postObj.postId}">
            <img class="post-img" src="${postObj.postImg}" alt="post-img" />
          </a>
          <div class="alignlocal">
            <div class="post-content">
              <a href="#view-post-${postObj.postId}">
                <h2 class="title">${postObj.title}</h2>
                <div class="description">${postObj.contents}</div>
              </a>
            </div>
            <p class="localname">#${postObj.localname}</p>
          </div>
        </div>
        <div class-"bookmark">
          <a name=${
            postObj.id
          } class="fas fa-mug-hot" onclick="handleBookmark(event)"></a>
          ${postObj.bookmark}
        </div>
      </div>
    </article>
  `;

    const div = document.createElement("div");
    div.classList.add("mycards");
    div.innerHTML = temp_html;
    postList.append(div);
  }
};
