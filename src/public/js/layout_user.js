$(document).ready(function () {
  $('.like-button').on('click', function () {
    var $icon = $(this).find('i');
    var isLiked = $(this).attr('data-liked') === 'true';
    var songId = $(this).data('song-id');
    var errorAlert = $('#errorAlert');
    var successAlert = $('#successAlert');
    if (isLiked) {
      fetch('/user/liked-songs', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ songId: songId }),
      })
        .then((response) => response.json())
        .then((data) => {
          $(this).attr('data-liked', 'false');
          $icon.removeClass('fas').addClass('far');
          successAlert.text(data.message);
          successAlert.removeClass('d-none').addClass('d-flex');
          setTimeout(() => {
            successAlert.removeClass('d-flex').addClass('d-none');
            location.reload();
          }, 3000);
        })
        .catch((error) => {
          console.error('Error removing song from Liked Song:', error);
          errorAlert.text(data.message);
          errorAlert.removeClass('d-none').addClass('d-flex');
          setTimeout(() => {
            errorAlert.removeClass('d-flex').addClass('d-none');
          }, 3000);
        });
    } else {
      fetch('/user/liked-songs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ songId: songId }),
      })
        .then((response) => response.json())
        .then((data) => {
          $(this).attr('data-liked', 'true');
          $icon.removeClass('far').addClass('fas');
          successAlert.text(data.message);
          successAlert.removeClass('d-none').addClass('d-flex');
          setTimeout(() => {
            successAlert.removeClass('d-flex').addClass('d-none');
          }, 3000);
        })
        .catch((error) => {
          console.error('Error adding song to Liked Song:', error);
          errorAlert.text(data.message);
          errorAlert.removeClass('d-none').addClass('d-flex');
          setTimeout(() => {
            errorAlert.removeClass('d-flex').addClass('d-none');
          }, 3000);
        });
    }
  });

  $('#artist').select2({
    placeholder: 'Select an artist',
    allowClear: true,
    tags: true,
    createTag: function (params) {
      var term = $.trim(params.term);
      if (term === '') {
        return null;
      }
      return {
        id: term,
        text: term,
        newTag: true,
      };
    },
  });

  $('#form_suggest_song').on('submit', function (e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', $('#title').val());
    formData.append('authorId', $('#artist').val());
    formData.append('lyrics', $('#lyrics').val());
    formData.append('image', $('#image')[0].files[0]);
    formData.append('song', $('#song')[0].files[0]);
    formData.append('genresIds', $('#genre').val());
    const $errorAlert = $('#errorAlert');
    const $successAlert = $('#successAlert');
    fetch('/user/suggest-song/send', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === true) {
          $successAlert.text(data.message).removeClass('d-none');
          $errorAlert.addClass('d-none');
          setTimeout(function () {
            location.reload();
          }, 3000);
        } else {
          $errorAlert.text(data.message).removeClass('d-none');
          $successAlert.addClass('d-none');
          setTimeout(function () {
            location.reload();
          }, 3000);
        }
      })
      .catch((error) => {
        $errorAlert.text(error).removeClass('d-none');
        $successAlert.addClass('d-none');
        setTimeout(function () {
          location.reload();
        }, 3000);
      });
  });
});
