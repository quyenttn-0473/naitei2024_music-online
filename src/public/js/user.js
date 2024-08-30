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

  // an thong bao
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

  // Show image
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

  $('#toggleBio').on('click', function () {
    const bioContent = $('.bio-content');
    const showMoreText = 'Show more';
    const showLessText = 'Show less';

    if (bioContent.css('max-height') === 'none') {
      bioContent.css('max-height', '100px');
      $(this).text(showMoreText);
    } else {
      bioContent.css('max-height', 'none');
      $(this).text(showLessText);
    }
  });

  $('[data-bs-toggle="modal"]').on('click', function () {
    const modal = new bootstrap.Modal(document.getElementById('songsModal'));
    modal.show();
  });

  // show/hidden password
  $('.togglePassword').on('click', function () {
    const target = $(this).data('target');
    const passwordField = $(target);
    const type =
      passwordField.attr('type') === 'password' ? 'text' : 'password';
    passwordField.attr('type', type);

    // Toggle the eye icon
    $(this).toggleClass('fa-eye fa-eye-slash');
  });

  // Check currentPassword
  $('#currentPassword').on('change', function () {
    var currentPassword = $(this).val();
    const messageDiv = $('#responseMessage');

    fetch('/check-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ currentPassword: currentPassword }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.message);
          });
        }
        return response.json();
      })
      .then((data) => {
        if (data.isValid) {
          // Enable the password fields
          $('#newPassword, #confirmNewPassword').prop('disabled', false);
          // $('.forgot-password-link').hide(); // Hide the forgot password link
          messageDiv.text('');
        }
      })
      .catch((error) => {
        // Handle errors here
        messageDiv.text(error.message);
        $('#newPassword, #confirmNewPassword').prop('disabled', true);
        // $('.forgot-password-link').show(); // Show the forgot password link
        messageDiv.css('color', 'red');
      });
  });

  // Nhap OTP
  $('.otp-digit').each(function (idx) {
    $(this).on('input', function () {
      if ($(this).val().length === 1 && idx < $('.otp-digit').length - 1) {
        $('.otp-digit')
          .eq(idx + 1)
          .focus();
      }
    });

    $(this).on('keydown', function (e) {
      if (e.key === 'Backspace' && idx > 0 && $(this).val() === '') {
        $('.otp-digit')
          .eq(idx - 1)
          .focus();
      }
    });
  });

  const form = $('#userSearchForm');
  const buttons = $('.btn-group button');

  function setButtonState($activeButton) {
    buttons.each(function () {
      if ($(this).is($activeButton)) {
        $(this).addClass('btn-primary');
      } else {
        $(this).removeClass('btn-primary');
      }
    });
  }

  buttons.on('click', function (event) {
    event.preventDefault();
    const type = $(this).data('type');
    form.attr('action', `/user/search/${type}`);
    form.submit();
    setButtonState($(this));
  });
});

function confirmDeletion(message) {
  var message = $('#confirmation-message').text();
  return confirm(message);
}

function toggleReasonLockUser() {
  const statusSelect = document.getElementById('status');
  const reasonLockUser = document.getElementById('reasonLockUser');
  const selectedStatus = statusSelect.value;
  const DeactiveStatus = 'Deactive';
  const Rejected = 'Rejected';
  const reasonInput = document.getElementById('reason');
  if (selectedStatus === DeactiveStatus || selectedStatus === Rejected) {
    reasonLockUser.classList.remove('d-none');
    reasonInput.setAttribute('required', 'required');
  } else {
    reasonLockUser.classList.add('d-none');
    reasonInput.removeAttribute('required');
  }
}
