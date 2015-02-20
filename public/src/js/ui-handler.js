var masonry;

function updateConnectedUI() {
  $("#add-card-button").removeAttr('disabled');
  $('.remove-card').removeAttr('disabled');
  $('#connection-text').html('Connected');
  
  $('#connection-image').show();
  $('#disconnection-image').hide();
}

function updateDisconnectedUI() {
  $("#add-card-button").attr('disabled', 'disabled');
  $('.remove-card').attr('disabled', 'disabled');
  $('#connection-text').html('Disconnected');
  
  $('#connection-image').hide();
  $('#disconnection-image').show();
}