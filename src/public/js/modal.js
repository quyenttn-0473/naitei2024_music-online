$(document).ready(function () {
  console.log('jQuery loaded successfully');
  $('#showModal').click(function (event) {
    event.preventDefault();
    console.log('Button clicked');
    $('#accountModal').modal('show');
  });
});
