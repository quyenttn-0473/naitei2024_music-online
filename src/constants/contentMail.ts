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

export const transOTPEmail = {
  subject: 'Mã OTP Để Đổi Mật Khẩu Tài Khoản Trên Ứng Dụng Music Online',
  template: (data: any) => {
    return `<h3>Yêu Cầu Đổi Mật Khẩu</h3>
      <p>Kính gửi ${data.username},</p>
      <p>Chúng tôi đã nhận được yêu cầu đổi mật khẩu cho tài khoản của bạn trên ứng dụng Music Online.</p>
      <p>Mã OTP (Mật Khẩu Một Lần) của bạn là: <b>${data.otp}</b></p>
      <p>Vui lòng nhập mã OTP này để xác thực và tiếp tục quy trình đổi mật khẩu.</p>
      <p>Nếu bạn không yêu cầu đổi mật khẩu, hãy bỏ qua email này.</p>
      <br>
      <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
      <p>Trân trọng,</p>
      <p>Đội ngũ hỗ trợ của Music Online</p>
      <div>Nếu bạn có bất kỳ câu hỏi nào, xin vui lòng gửi email đến <b>tranngocquyen262dc@gmail.com</b>.</div>`;
  },
};

export const transSuggestSong = {
  subject: 'Gửi Bài Hát Gợi Ý Lên Ứng Dụng Music Online',
  template: (data: any) => {
    return `<h3>Yêu Cầu Gửi Bài Hát Gợi Ý</h3>
      <p>Kính gửi ${data.username},</p>
      <p>Chúng tôi đã nhận được yêu cầu gửi bài hát gợi ý trên ứng dụng Music Online.</p>
      <p>Cảm ơn bạn đã gửi bài hát cho hệ thống. Hệ thống của chúng tôi đã nhận được bài hát của bạn</b></p>
      <p>Đây là thông tin bài hát của bạn: </p>
      <p>Tên bài hát: <b>${data.song.title}</b></p>
      <p>Ca sĩ: <b>${data.song.author.fullname}</b></p>
      <p>Chúng tôi sẽ gửi mail duyệt bài hát sớm nhất cho bạn.</p>
      <br>
      <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
      <p>Trân trọng,</p>
      <p>Đội ngũ hỗ trợ của Music Online</p>
      <div>Nếu bạn có bất kỳ câu hỏi nào, xin vui lòng gửi email đến <b>tranngocquyen262dc@gmail.com</b>.</div>`;
  },
};

export const transSuggestSongApproved = {
  subject: 'Phản Hồi Bài Hát Gợi Ý Lên Ứng Dụng Music Online',
  template: (data: any) => {
    return `<h3>Kết Quả Bài Hát Gợi Ý</h3>
      <p>Kính gửi ${data.username},</p>
      <p>Chúng tôi đã nhận được yêu cầu gửi bài hát gợi ý trên ứng dụng Music Online.</p>
      <p>Cảm ơn bạn đã gửi bài hát cho hệ thống. <b>Bài hát của bạn đã được duyệt</b></p>
      <p>Đây là thông tin bài hát của bạn: </p>
      <p>Tên bài hát: <b>${data.song.title}</b></p>
      <p>Ca sĩ: <b>${data.song.author.fullname}</b></p>
      <p>Bài hát của bạn đã được đăng tải trên ứng dụng Music Online. Bạn có thể truy cập vào ứng dụng để có thể nghe bài hát.</p>
      <br>
      <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
      <p>Trân trọng,</p>
      <p>Đội ngũ hỗ trợ của Music Online</p>
      <div>Nếu bạn có bất kỳ câu hỏi nào, xin vui lòng gửi email đến <b>tranngocquyen262dc@gmail.com</b>.</div>`;
  },
};

export const transSuggestSongRejected = {
  subject: 'Phản Hồi Bài Hát Gợi Ý Lên Ứng Dụng Music Online',
  template: (data: any) => {
    return `<h3>Kết Quả Bài Hát Gợi Ý</h3>
      <p>Kính gửi ${data.username},</p>
      <p>Chúng tôi đã nhận được yêu cầu gửi bài hát gợi ý trên ứng dụng Music Online.</p>
      <p>Cảm ơn bạn đã gửi bài hát cho hệ thống. <b>Bài hát của bạn đã bị từ chối</b></p>
      <p>Lý do từ chối: <b>${data.reason}</b></p>
      <p>Đây là thông tin bài hát của bạn: </p>
      <p>Tên bài hát: <b>${data.song.title}</b></p>
      <p>Ca sĩ: <b>${data.song.author.fullname}</b></p>
      <p>Bài hát của bạn đã được không được đăng tải trên ứng dụng Music Online. Bạn có thể truy cập vào ứng dụng để có thể nghe bài hát khác.</p>
      <br>
      <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
      <p>Trân trọng,</p>
      <p>Đội ngũ hỗ trợ của Music Online</p>
      <div>Nếu bạn có bất kỳ câu hỏi nào, xin vui lòng gửi email đến <b>tranngocquyen262dc@gmail.com</b>.</div>`;
  },
};
