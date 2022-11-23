// 2022-11-11 13:52 포맷으로 날짜를 받아오는 함수
export const getDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minuites = date.getMinutes();
  return `${year}-${month}-${day} ${hour}:${minuites}`;
};
