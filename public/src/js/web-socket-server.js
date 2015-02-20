
function createWebSocket() {
  console.log("Attempting to connect...");
  webSocket = new WebSocket(host);
  this.timeoutId = null;

  webSocket.onopen = function(e){
    console.log("Connected");
    clearTimeout(this.timeoutId);

    updateConnectedUI();
  };

  webSocket.onmessage = function(e) {
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
  
  webSocket.onclose = function(e) {
    updateDisconnectedUI();
    
    this.timeoutId = setTimeout(function () {
        // Connection has closed so try to reconnect every 10 seconds.
        createWebSocket(); 
    }, 10*1000);
  };
}