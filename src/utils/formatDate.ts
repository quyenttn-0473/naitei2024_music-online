export function formatDate(dateString: Date): string {
  const date = new Date(dateString);

  // Kiểm tra nếu ngày không hợp lệ
  if (isNaN(date.getTime())) {
    return 'Invalid date'; // Hoặc bất kỳ thông báo lỗi nào bạn muốn
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export function formatDateYMD(dateString: Date): string {
  const date = new Date(dateString);

  // Kiểm tra nếu ngày không hợp lệ
  if (isNaN(date.getTime())) {
    return 'Invalid date'; // Hoặc bất kỳ thông báo lỗi nào bạn muốn
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
}
