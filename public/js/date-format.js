$(document).ready(function() {
  var now = new Date()
  var today = now.toLocaleTimeString('en-US', {
    weekday: 'long',
    month: 'long',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  var year = now.getFullYear();
  $('p.date').html(today);
  $('p.copyright').html('&copy; ' + year + ' Skeletor, Inc.');
});