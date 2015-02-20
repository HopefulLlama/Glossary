var webSocket; 
var host = location.origin.replace(/^http/, 'ws');

function sendData(data){
  data.cards.forEach(function(card){
    delete card.$$hashKey;
  });
  webSocket.send(JSON.stringify(data));  
  masonry.reloadItems();
  masonry.layout();
}


/** @module UI Handler */
$(window).load(function(event) {
  updateConnectedUI();
  createWebSocket();  
});

$(window).on('beforeunload', function() {
  webSocket.close();
});