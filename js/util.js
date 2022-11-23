// 2022-11-11 13:52 포맷으로 날짜를 받아오는 함수
export const getDate = () => {
  const date = new Date();
  const year = String(date.getFullYear()).padStart(4, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minuites = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hour}:${minuites}`;
};
