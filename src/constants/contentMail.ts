export const transMailLockAccount = {
  subject: 'Email thông báo khóa tài khoản trên ứng dụng Music Online',
  template: (data: any) => {
    return `<h3>Tài khoản ${data.username} của bạn trong ứng dụng Music Online bị khóa</h3>
    <div>Lí do: <b>${data.reason}</b></div>
    <br>
    <h4>Cảm ơn bạn đã sử dụng dịch vụ của Music Online!</h4>
    <h4>Trân trọng!</h4> 
    <div>Nếu có thắc mắc hãy gửi mail phản hồi tại địa chỉ mail <b>tranngocquyen262dc@gmail.com</b></div>`;
  },
};

export const transMailUpdateRole = {
  subject: 'Email thông báo thay đổi loại tài khoản trên ứng dụng Music Online',
  template: (data: any) => {
    return `<h3>Loại tài khoản ${data.username} của bạn trong ứng dụng Music Online đã được thay đổi</h3>
    <div>Tài khoản của bạn được đổi thành tài khoản: <b>${data.role}</b></div>
    <br>
    <h4>Cảm ơn bạn đã sử dụng dịch vụ của Music Online!</h4>
    <h4>Trân trọng!</h4> 
    <div>Nếu có thắc mắc hãy gửi mail phản hồi tại địa chỉ mail <b>tranngocquyen262dc@gmail.com</b></div>`;
  },
};
