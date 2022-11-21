//오늘 날짜 https://www.delftstack.com/ko/howto/html/html-todays-date/
date = new Date();
year = date.getFullYear();
month = date.getMonth() + 1;
day = date.getDate();
document.getElementById("date").innerHTML = `${year}. ${month}. ${day}`;

//이미지 변경
//참고: https://iamiet.tistory.com/m/68
//참고: https://dahanweb.tistory.com/58
//출처: http://yoonbumtae.com/?p=3304

const realUpload = document.querySelector("#input-image");
const upload = document.querySelector(".image-container");

upload.addEventListener("click", () => realUpload.click());

function readImage(input) {
  // 인풋 태그에 파일이 있는 경우
  if (input.files && input.files[0]) {
    // 이미지 파일인지 검사 (생략)
    // FileReader 인스턴스 생성
    const reader = new FileReader();
    // 이미지가 로드가 된 경우
    reader.onload = (e) => {
      const previewImage = document.getElementById("preview-image");
      previewImage.src = e.target.result;
    };
    // reader가 이미지 읽도록 하기
    reader.readAsDataURL(input.files[0]);
  }
}
// input file에 change 이벤트 부여
const inputImage = document.getElementById("input-image");
inputImage.addEventListener("change", (e) => {
  readImage(e.target);
});
