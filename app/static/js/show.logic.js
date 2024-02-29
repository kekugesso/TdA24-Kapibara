$(document).ready(function() {
    const urlParams = new URLSearchParams(window.location.search);
    const lecturerTag = urlParams.get('lecturer');
    const successParam = urlParams.get('success');

    if (lecturerTag) {
      $("#rezervacni-formular").show();
      return;
    }
    if (successParam) {
      $("#success-message").show();
      return;
    }
    $("#error-message").show();
  });