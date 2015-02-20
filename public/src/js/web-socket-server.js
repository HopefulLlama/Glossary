
function createWebSocket() {
  console.log("Attempting to connect...");
  ws = new WebSocket(host);
  this.timeoutId = null;

  ws.onopen = function(e){
    console.log("Connected");
    clearTimeout(this.timeoutId);

    $("#add-card-button").removeAttr('disabled');
    $('.remove-card').removeAttr('disabled');
    $('#connection-text').html('Connected');
    
    $('#connection-image').show();
    $('#disconnection-image').hide();
  };

  ws.onmessage = function(e) {
    var message = JSON.parse(e.data);
    angular.element('[data-ng-controller=cardController]').scope().parsedJSON = message;
    angular.element('[data-ng-controller=cardController]').scope().$apply();

    var container = document.querySelector('#masonry-container');
    masonry = new Masonry( container, {
      // options
      itemSelector: '.masonry-element'
    });

    masonry.reloadItems();
    masonry.layout();
  };
  
  ws.onclose = function(e) {
    $("#add-card-button").attr('disabled', 'disabled');
    $('.remove-card').attr('disabled', 'disabled');
    $('#connection-text').html('Disconnected');
    
    $('#connection-image').hide();
    $('#disconnection-image').show();

    this.timeoutId = setTimeout(function () {
        // Connection has closed so try to reconnect every 10 seconds.
        createWebSocket(); 
    }, 10*1000);
  };
}