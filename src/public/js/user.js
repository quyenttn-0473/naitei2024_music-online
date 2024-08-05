$(document).ready(function () {
  $('#email').on('change', function () {
    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test($(this).val())) {
      // Hiển thị thông báo lỗi nếu email không hợp lệ
      $('#emailHelp').show();
    } else {
      $('#emailHelp').hide();
    }
  });
});

$(document).ready(function () {
  $('#registerUserform').on('submit', function (event) {
    const passwordInput = $('#password').val();
    const confirmPasswordInput = $('#confirmPassword').val();

    if (passwordInput !== confirmPasswordInput) {
      event.preventDefault(); // Ngăn chặn gửi biểu mẫu
      $('#passwordError').show(); // Hiển thị thông báo lỗi
    } else {
      $('#passwordError').hide(); // Ẩn thông báo lỗi
    }
  });
});

$(document).ready(function () {
  $('#username').on('input', async function () {
    const username = $(this).val();
    const messageDiv = $('#responseMessage');
    if (!username) {
      messageDiv.text('');
      return;
    }

    try {
      const response = await fetch('/check-username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      const result = await response.json();

      if (response.ok) {
        messageDiv.text(result.message);
        messageDiv.css('color', 'green');
      } else {
        messageDiv.text(result.message);
        messageDiv.css('color', 'red');
      }
    } catch (error) {
      messageDiv.text(t('error.checkingUsername'));
      messageDiv.css('color', 'red');
    }
  });
});

$(document).ready(function () {
  const $errorAlert = $('#errorAlert');
  const $successAlert = $('#successAlert');
  if ($errorAlert.length) {
    $errorAlert.show();
    setTimeout(() => {
      $errorAlert.hide();
    }, 3000);
  }
  if ($successAlert.length) {
    $successAlert.show();
    setTimeout(() => {
      $successAlert.hide();
    }, 3000);
  }
});

$(document).ready(function () {
  $('#avatar').on('change', function (event) {
    var file = event.target.files[0];
    var reader = new FileReader();

    reader.onload = function (e) {
      $('#previewImage').attr('src', e.target.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  });
});
