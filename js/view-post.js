import { dbService, authService } from './firebase.js';
import { query } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js';

export const viewPost = async path => {
  const html = await fetch('/pages/view-post.html').then(data => data.text());
  const mainPage = document.querySelector('#main-page');
  mainPage.innerHTML = html;

  const postNum = path.replace('/view-post-', '');
  console.log('postNum: ' + postNum);
  const nickname = '닉네임';
  const profileImg = '/img/profile-img.png';
  const date = '2022-11-22 13:30';
  const bookmarks = '200';
  const postImg = '/img/cafe.png';
  const title = '제목';
  const description = '내용';

  const tempHtml = `
    <div class="post-header">
      <div class="post-user">
        <img class="post-profile-img" src=${profileImg} alt="profile-img"/>
        <div class="post-user-name">${nickname}</div>
      </div>
      <div class="post-create-date">${date}</div>
    </div>
    <div class="post-box">
      <div class="bookmark"><i class="fas fa-mug-hot"></i>${bookmarks}</div>
      <div class="post-container">
        <img class="post-img" src=${postImg} alt="post-img" />
        <div class="post-content">
          <div class="title">${title}</div>
          <div class="description">${description}</div>
        </div>
      </div>
      <div class="post-buttons">
        <button class="post-modify-btn">수정</button>
        <button class="post-delete-btn">삭제</button>
      </div>
    </div>`;

  const article = document.createElement('article');
  article.classList.add('post');
  article.innerHTML = tempHtml;

  const container = document.querySelector('.container');
  container.appendChild(article);
};
