$(document).ready(function () {
  const $audioPlayer = $('#main-audio-player');
  const $playPauseBtn = $('#play-pause-btn');
  const $prevBtn = $('#prev-btn');
  const $nextBtn = $('#next-btn');
  const $progress = $('#progress');
  const $volume = $('#volume');
  const $currentTimeElem = $('#current-time');
  const $durationElem = $('#duration');
  const form = $('#searchForm');
  const buttons = $('.btn-group button');

  let isPlaying = false;
  let currentSongIndex = 0;

  const $playlistDataElem = $('#playlist-data');
  let playlistData = null;

  if ($playlistDataElem.length) {
    const playlistDataAttr = $playlistDataElem.attr('playlist-datas');
    try {
      playlistData = JSON.parse(playlistDataAttr);
      if (playlistData && playlistData.songs) {
        playlistData.songs = playlistData.songs.filter(
          (song) => song.status !== 'Deleted'
        );
      }
    } catch (error) {}
  }

  function playFirstAvailableSong() {
    if (playlistData && playlistData.songs) {
      const availableSongs = playlistData.songs.filter(
        (song) => song.status !== 'Deleted'
      );
      if (availableSongs.length > 0) {
        const firstSong = availableSongs[0];
        updateAudioPlayer_a(
          firstSong.url,
          firstSong.imageUrl,
          firstSong.title,
          firstSong.author.fullname,
          0
        );
      } else {
        req.flash('error', req.t('error.noSongs'));
      }
    }
  }

  if (playlistData) {
    let idTmp = localStorage.getItem('playlistIdTmp');
    if (idTmp != playlistData.id) {
      idTmp = playlistData.id;
      localStorage.setItem('playlistIdTmp', idTmp);
      playFirstAvailableSong();
    }
  }

  function updateAudioPlayer_a(songUrl, imageUrl, title, artist, index) {
    if (index > -1) {
      currentSongIndex = index;
    }

    if (songUrl) {
      $('#song-image').attr('src', imageUrl || 'default-image.jpg');
      $('#song-title').text(title);
      $('#song-artist').text(artist);

      $audioPlayer.attr('src', songUrl)[0].play();
      isPlaying = true;
      updatePlayPauseBtn();
      savePlayerState(imageUrl, title, artist);
    } else {
      playFirstAvailableSong();
    }
  }

  function updateTime() {
    const currentTime = $audioPlayer[0].currentTime;
    const duration = $audioPlayer[0].duration;
    $currentTimeElem.text(formatTime(currentTime));
    $durationElem.text(` / ${formatTime(duration)}`);
    $progress.val((currentTime / duration) * 100);
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  function loadPlayerState() {
    const savedUrl = localStorage.getItem('audioUrl');
    const savedTime = localStorage.getItem('audioTime');
    const savedVolume = localStorage.getItem('audioVolume');
    isPlaying = localStorage.getItem('audioIsPlaying') === 'true';

    const savedImage = localStorage.getItem('songImage');
    const savedTitle = localStorage.getItem('songTitle');
    const savedArtist = localStorage.getItem('songArtist');

    if (savedUrl) {
      $audioPlayer.attr('src', savedUrl);
      $audioPlayer[0].currentTime = savedTime ? parseFloat(savedTime) : 0;
      $audioPlayer[0].volume = savedVolume ? parseFloat(savedVolume) : 1;

      $('#song-image').attr('src', savedImage || 'default-image.jpg');
      $('#song-title').text(savedTitle);
      $('#song-artist').text(savedArtist);

      if (isPlaying) {
        $audioPlayer[0].play();
      }
    }
    updatePlayPauseBtn();
  }

  function savePlayerState(imageUrl, title, artist) {
    localStorage.setItem('audioUrl', $audioPlayer.attr('src'));
    localStorage.setItem('audioTime', $audioPlayer[0].currentTime);
    localStorage.setItem('audioVolume', $audioPlayer[0].volume);
    localStorage.setItem('audioIsPlaying', isPlaying);

    localStorage.setItem('songImage', imageUrl || 'default-image.jpg');
    localStorage.setItem('songTitle', title);
    localStorage.setItem('songArtist', artist);
  }

  window.updateAudioPlayer = function (url, imageUrl, title, artist, index) {
    updateAudioPlayer_a(url, imageUrl, title, artist, index);
  };

  function updatePlayPauseBtn() {
    if (isPlaying) {
      $playPauseBtn.html('<i class="fas fa-pause"></i>');
    } else {
      $playPauseBtn.html('<i class="fas fa-play"></i>');
    }
  }

  $playPauseBtn.on('click', function () {
    if (isPlaying) {
      $audioPlayer[0].pause();
    } else {
      $audioPlayer[0].play();
    }
    isPlaying = !isPlaying;
    updatePlayPauseBtn();
    savePlayerState(
      $('#song-image').attr('src'),
      $('#song-title').text(),
      $('#song-artist').text()
    );
  });

  $prevBtn.on('click', function () {
    if (playlistData.songs.length > 0) {
      currentSongIndex =
        (currentSongIndex - 1 + playlistData.songs.length) %
        playlistData.songs.length;
      const prevSong = playlistData.songs[currentSongIndex];
      updateAudioPlayer(
        prevSong.url,
        prevSong.imageUrl,
        prevSong.title,
        prevSong.author.fullname,
        currentSongIndex
      );
    }
  });

  $nextBtn.on('click', function () {
    if (playlistData.songs.length > 0) {
      currentSongIndex = (currentSongIndex + 1) % playlistData.songs.length;
      const nextSong = playlistData.songs[currentSongIndex];
      updateAudioPlayer(
        nextSong.url,
        nextSong.imageUrl,
        nextSong.title,
        nextSong.author.fullname,
        currentSongIndex
      );
    }
  });

  $progress.on('input', function () {
    const seekTime = ($progress.val() / 100) * $audioPlayer[0].duration;
    $audioPlayer[0].currentTime = seekTime;
    savePlayerState(
      $('#song-image').attr('src'),
      $('#song-title').text(),
      $('#song-artist').text()
    );
  });

  $volume.on('input', function () {
    $audioPlayer[0].volume = $volume.val();
    savePlayerState(
      $('#song-image').attr('src'),
      $('#song-title').text(),
      $('#song-artist').text()
    );
  });

  setInterval(function () {
    savePlayerState(
      $('#song-image').attr('src'),
      $('#song-title').text(),
      $('#song-artist').text()
    );
  }, 1000);

  $audioPlayer.on('timeupdate', updateTime);

  $audioPlayer.on('ended', function () {
    if (playlistData.songs.length > 0) {
      currentSongIndex = (currentSongIndex + 1) % playlistData.songs.length;
      const nextSong = playlistData.songs[currentSongIndex];
      updateAudioPlayer(
        nextSong.url,
        nextSong.imageUrl,
        nextSong.title,
        nextSong.author.fullname,
        currentSongIndex
      );
    }
  });

  loadPlayerState();

  function loadNewPage(url) {
    $.get(url)
      .done(function (html) {
        const $newContent = $('<div>').html(html);
        const newMainContent = $newContent.find('.container').html();
        const $currentMainContent = $('.container');
        $currentMainContent.html(newMainContent);

        updatePlayPauseBtn();

        window.history.pushState({ path: url }, '', url);
      })
      .fail(function () {
        req.flash('error', req.t('error.errorLoadingPage'));
      });
  }

  $('a[data-page]').on('click', function (e) {
    e.preventDefault();
    const url = $(this).attr('href');
    loadNewPage(url);
  });

  $(window).on('popstate', function (e) {
    if (e.originalEvent.state && e.originalEvent.state.path) {
      loadNewPage(e.originalEvent.state.path);
    }
  });

  function setButtonState(activeButton) {
    buttons.each(function () {
      if ($(this).is(activeButton)) {
        $(this).addClass('btn-primary');
      } else {
        $(this).removeClass('btn-primary');
      }
    });
  }

  buttons.on('click', function () {
    const type = $(this).data('type');
    form.attr('action', `/admin/search/${type}`);
    form.submit();
    setButtonState($(this));
  });

  $('#form_put_suggest_song').on('submit', function (e) {
    e.preventDefault();
    const formData = {
      status: $('#status').val(),
      reason: $('#reason').val(),
    };
    const id = $('#id').text();
    fetch(`/admin/suggest-song/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ formData }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === true) {
          setTimeout(function () {
            location.reload();
          }, 3000);
        } else {
          setTimeout(function () {
            location.reload();
          }, 3000);
        }
      })
      .catch((error) => {
        setTimeout(function () {
          location.reload();
        }, 3000);
      });
  });
});
