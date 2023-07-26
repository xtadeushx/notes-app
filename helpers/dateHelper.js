function formatDateLong(date) {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const year = date.getFullYear();
  const monthIndex = date.getMonth();
  const day = date.getDate();

  const formattedDate = `${months[monthIndex]}, ${day} ${year}`;
  return formattedDate;
}

function formatDateShort(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Months are zero-based, so we add 1.
  const day = date.getDate();

  const formattedDate = `${month}/${day}/${year}`;
  return formattedDate;
}

export { formatDateLong, formatDateShort };
