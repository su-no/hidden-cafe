// router.js 안에 있는 getpostList 밑에 .then으로 달아야 됨.

// - script-create-post / 글쓰기를 하고 게시하면 그때 북마크 데이터를

// #### 북마크 구현
// `<div class="bookmark"><i class="fas fa-mug-hot"></i>${bookmarks}</div>`
// - 메인페이지 북마크는 글 내에 북마크와 연동 되어 있음
// - all-post.js에서는 포스트 콜렉션에서 북마크 데이터를 가져와 보여주고 있음.
// - 북마크 데이터는 post 콜렉션 문서들에 들어 있음

// 지금 보여주기는 다 되고 있음.
// 내가 하면 되는 것은
// 	- 커피 아이콘을 눌렀을 때 북마크 데이터에 접근해 + 1을 해줘야 함.
// 1. 북마크를 클릭했을 때
// 2. 파이어베이스 내 북마크 값을 + 1 해줘야 함

// ! 로직
// 커피 아이콘을 누르면, (화면)
// 북마크 데이터에 접근해 값을 + 1해 업데이트 해준다. (Firestore)
// 	updateDoc : 문서의 필드 업데이트
// 	post 컬렉션에서 xx라는 postID를 가진 문서를 찾아 bookmark 필드를 업데이트 한다.

// 진행상황
// 아이콘에 onclick="handleBookmark"까지는 달았음

// ? ....
// 특정 게시글의 아이디를 어떻게 가져올지
// 아이콘을 클릭했을 때, 해당 게시물(문서)의 북마크 필드를 가져와서 그것을 + 1하고 하고 싶은데..

// * firestore = dbService
// view-post-id 사용?

import { dbService } from "./firebase.js";

import {
  doc,
  updateDoc,
  collection,
  query,
  getDocs,
  where,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";

export const handleBookmark = async (event) => {
  const querySnapshot = await getDocs(collection(dbService, "post"));
  console.log(event.target);
  querySnapshot.forEach((doc) => {
    // console.log(doc.id, " => ", doc.data());
  });
};

//firebase post query

// const q = query(
//   collection(dbService, "comment"),
//   where("postId", "==", postId),
//   orderBy("createdAt")
// );

// constructor(...fieldNames: bookmark[]);
