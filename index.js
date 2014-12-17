var http = require('http');
var express = require('express');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

var pkg = require('./package');
var winston = require('winston');

var exec = require('child_process').exec;
var WebSocketServer = require('ws').Server;

var clients = [];
var port = process.env.PORT || 5000;

var app = express();
var server = http.createServer(app);
app.use(cookieParser());
app.use(expressSession({secret:'glossary-da-best'}));

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));

app.set('port', (port));
app.get('/', function (req, res) {
  res.render('main', {title: pkg.name, debug: pkg.debug});
});

winston.info('WebSocketServer wss created');

var fs = require('fs');
var cards = JSON.parse(fs.readFileSync('./cards.json', 'utf8'));

var wss = new WebSocketServer({server: server});
wss.broadcast = function(data) {
  for(var i in this.clients) {
    this.clients[i].send(data);
  }
};

wss.on('connection', function(ws) {
  ws.session = {};
  ws.session.id = ws._socket.remoteAddress;
  winston.info("New client.", {sessionId: ws.session.id});

  ws.on('message', function(data) {
  });

  ws.on('close', function close() {
    winston.info("Connection closed.", {sessionId: ws.session.id});
    clients.splice(clients.indexOf(ws), 1);
    winston.info({connections: clients.length});
  });
  ws.send(JSON.stringify(cards));
  clients.push(ws);
  winston.info({connections: clients.length});

});

server.listen(port, function() {
  winston.info("package.json");
  winston.info({name: pkg.name});
  winston.info({version: pkg.version});
  winston.info({database: pkg.database});
  winston.info({debug: pkg.debug});
  winston.info("Packages");
  winston.info({nodejs: process.version});
  exec('npm list --depth=0', function(error, stdout, stderr){ 
    winston.info({dependencies: stdout});
  });
  winston.info(cards);

  winston.info({appStatus: "running", port: port, pid: process.pid});
});