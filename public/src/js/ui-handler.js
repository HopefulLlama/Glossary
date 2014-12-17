/** @module UI Handler */
var host = location.origin.replace(/^http/, 'ws');
var ws = new WebSocket(host);
ws.onmessage = function(event) {
  var reply = JSON.parse(event.data);
  addToEntries('<span class="output-text">' + reply.message + '</span>');
  if(reply.obfuscateInput) {
    $('#input').attr('type', 'password');
    $('#input-type-indicator').html('***');
  } else {
    $('#input').attr('type', 'text');
    $('#input-type-indicator').html('abc');
  }
  $('#input').removeAttr("disabled"); 
  $('#input').focus();
};
ws.onclose = function(event) {
  addToEntries('<span class="output-text">Connection lost. Please refresh to begin a new session.</span>');
  $('#input').attr("disabled", "disabled"); 
};

var entries = [];

/**
  * Adds an entry to the output window, while deleting entries from the top if there are more than 50 entries.
  * @func
  * @param {string} output - The output to be added to the entries window.
  */
function addToEntries(output) {
  if(entries.length > 50) {
    entries = entries.splice(1, input.length-1);
  }
  entries.push(output);

  var html = "";
  entries.forEach(function(entry){
    html += entry + "<br/>";
  });

  $('#output').html(html);
}

/** 
  * Submits data to the server to be interpreted.
  * @func
  */
function submitInput() {
  var input = $('#input').val();
  if(input !== "") {
    $('#input').val("");
    var placeholder = "";
    if($('#input').attr('type') === 'password') {
      input = CryptoJS.SHA3(input);
      ws.send(input);
      placeholder = '******';
    } else {
      ws.send(input);
      placeholder = input;
    }
    addToEntries('<span class="input-text">' + placeholder + '</span>');
  }
  $('#input').attr("disabled", "disabled"); 
}

$(window).load(function(event) {
  addToEntries('<span class="output-text">' + "Welcome to TextWorld." + '</span>');
  $('#send').click(submitInput);
  $('#input').keyup(function (e) {
    if(e.keyCode == 13){
        submitInput();
    }
  });
});

$(window).on('beforeunload', function() {
  ws.close();
});