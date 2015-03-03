var webSocketHandler = {
  createWebSocket: function() {
    console.log("Attempting to connect...");
    var webSocket = new WebSocket(host);
    this.timeoutId = null;

    webSocket.onopen = function(e){
      console.log("Connected");
      clearTimeout(this.timeoutId);

      ui.updateConnectedUI();
    };

    webSocket.onmessage = function(e) {
      // This whole mess is in need of clean up
      var message = JSON.parse(e.data);
      angular.element('[data-ng-controller=cardController]').scope().parsedJSON = message;
      angular.element('[data-ng-controller=cardController]').scope().$apply();
      var container = document.querySelector('#masonry-container');
      ui.masonry = new Masonry( container, {
        // options
        itemSelector: '.masonry-element'
      });
      ui.masonry.reloadItems();
      ui.masonry.layout();
    };
    
    webSocket.onclose = function(e) {
      ui.updateDisconnectedUI();

      this.timeoutId = setTimeout(function () {
          // Connection has closed so try to reconnect every 10 seconds.
          createWebSocket(); 
      }, 10*1000);
    };
  return webSocket;
  }
};
