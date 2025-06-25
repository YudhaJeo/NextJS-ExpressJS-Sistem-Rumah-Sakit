export const formatDate = () => {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

// export const formatMariaDBDatetime = (date) =>
//   new Date(date).toISOString().slice(0, 19).replace("T", " ");

export const formatMariaDBDatetime = (argsDate) => {
  const date = new Date(argsDate);
  const pad = (n) => n.toString().padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  console.log(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`);

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
