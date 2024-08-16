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
    const showMoreText = "#{t('common.showMore')}";
    const showLessText = "#{t('common.showLess')}";

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
  const reasonInput = document.getElementById('reason');
  if (selectedStatus === DeactiveStatus) {
    reasonLockUser.classList.remove('d-none');
    reasonInput.setAttribute('required', 'required');
  } else {
    reasonLockUser.classList.add('d-none');
    reasonInput.removeAttribute('required');
  }
}
