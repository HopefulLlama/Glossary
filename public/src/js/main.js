var webSocket; 
var host = location.origin.replace(/^http/, 'ws');

function sendData(data){
  data.cards.forEach(function(card){
    delete card.$$hashKey;
  });
  webSocket.send(JSON.stringify(data));  
  ui.masonry.reloadItems();
  ui.masonry.layout();
}


/** @module UI Handler */
$(window).load(function(event) {
  ui.updateConnectedUI();
  createWebSocket();  
});

$(window).on('beforeunload', function() {
  webSocket.close();
});