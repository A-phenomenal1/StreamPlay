function formatDate(timestamp) {
  let date = new Date(timestamp);
  let str =
    date.getDate() +
    "-" +
    (date.getMonth() + 1) +
    "-" +
    date.getFullYear() +
    " " +
    date.getHours() +
    ":" +
    date.getMinutes() +
    ":" +
    date.getSeconds();

  console.log("date: ", str);
  return str;
}

module.exports = formatDate;
