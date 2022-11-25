import {
  collection,
  orderBy,
  query,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
import { dbService } from "./firebase.js";

// 모든 게시글 가져오기
export const getpostList = async () => {
  const q = query(collection(dbService, "post"), orderBy("createdAt", "desc"));
  getFirebaseDocs(q);
};

// 지역별 게시글 가져오기
export const getPostByLocal = async (local) => {
  const q = query(
    collection(dbService, "post"),
    orderBy("createdAt", "desc"),
    where("localname", "==", local)
  );
  getFirebaseDocs(q);

  // 사이드바 색상 토글
  const sidebar = document.querySelector("#sidebar ul");
  const sidebarList = [...sidebar.children];
  sidebarList.forEach((li) => {
    const a = li.childNodes[0];
    if (a.textContent === local) {
      a.classList.add("clicked");
    } else {
      a.classList.remove("clicked");
    }
  });
};

// Firebase에서 모든 게시글 데이터 가져오기
const getFirebaseDocs = async (q) => {
  // 조건(q)에 맞는 데이터를 가져와서 배열에 담는다.
  let postObjList = [];
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const postObj = {
      id: doc.id,
      ...doc.data(),
    };
    postObjList.push(postObj);
  });

  // 게시글 DOM들을 추가할 컨테이너
  const postList = document.getElementById("container");

  // 게시글 데이터가 담겨 있는 배열을 돌면서, 컨테이너에 돔을 추가한다.
  postObjList.forEach((postObj) => {
    // console.log(postObj);
    const temp_html = `
    <article class="post">
    <div class="post-header">
      <div class="post-user">
        <img class="post-profile-img" src=${
          postObj.profileImg ?? "/img/profile-img.png"
        } alt="profile-img" />
        <div class="post-user-name">
          ${postObj.nickname ?? postObj.email.split("@")[0]}
        </div>
      </div>
      <div class="post-create-date">${postObj.createdAt}</div>
    </div>
    <div class="post-box">
      <div class="post-container">
        <a href="#view-post-${postObj.postId}">
          <img class="post-img" src="${postObj.postImg}" alt="post-img" /> </a>
          <div class="alignlocal">
            <div class="post-content">
            <a href="#view-post-${postObj.postId}">
              <h2 class="title">${postObj.title}</h2>
              <div class="description">${postObj.contents}</div></a>
            </div>
            <p class="localname">#${postObj.localname}</p>
          </div>
      </div>
      <div class-"bookmark">
        <a name=${
          postObj.id
        }  class="fas fa-mug-hot" onclick="handleBookmark(event)">
        </a>${postObj.bookmark}
      </div>
    </div>

  </article>
  `;

    const div = document.createElement("div");
    div.classList.add("mycards");
    div.innerHTML = temp_html;
    postList.append(div);
  });
};
