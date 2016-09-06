var http = require('http');
var express = require('express');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var fs = require('fs');
var winston = require('winston');

var pkg = require('./package');
var route = pkg.route;
var port = process.env.PORT || pkg.port;
var dataFile = pkg.dataFile;

var exec = require('child_process').exec;
var WebSocketServer = require('ws').Server;

var clients = [];

var app = express();
var server = http.createServer(app);
app.use(cookieParser());
app.use(expressSession({secret:'glossary-da-best'}));

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));

app.set('port', (port));
app.get(route, function (req, res) {
  res.render('main', {title: pkg.name, debug: pkg.debug});
});

winston.info('WebSocketServer wss created');

var cards = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
var getCards = function() {
  return JSON.parse(fs.readFileSync(dataFile, 'utf8'));
};
var writeCards = function(cards, successCallback, errorCallback) {
  fs.writeFile(dataFile, JSON.stringify(cards), function(err) {
    if(err) {
      console.log(err);
      if(typeof errorCallback === "function") {
        errorCallback();
      }
    } else {
      console.log("JSON saved to " + dataFile);
      if(typeof successCallback === "function") {
        successCallback();
      }
    }
  });
};

var wss = new WebSocketServer({server: server});
wss.broadcast = function(code, data, ws) {
  for (var i in this.clients) {
    if (this.clients[i] !== ws) {
      this.clients[i].send(JSON.stringify({
        code: code,
        data: data
      }));
    }
  }
};

wss.on('connection', function(ws) {
  ws.session = {};
  ws.session.id = ws._socket.remoteAddress;
  winston.info("New client.", {sessionId: ws.session.id});

  ws.on('message', function(payload) {
    winston.info(payload);
    data = JSON.parse(payload);

    var cards = getCards();
    switch(data.code) {
      case "LS":
        ws.send(JSON.stringify({
          code: "LS",
          data: cards
        }));
        break;
      case "MK":
        cards.cards.push(data.data);
        writeCards(cards, function() {
          wss.broadcast("MK", data.data, ws);
        });
        break;
      case "RM":
        var card = cards.cards.find(function(c) {
          return c.title.toLowerCase() === data.data.title.toLowerCase();
        });
        var index = cards.cards.indexOf(card);
        cards.cards.splice(index, 1);
        writeCards(cards, function() {
          wss.broadcast("RM", data.data, ws);
        });
        break;
      case "HB":
        ws.send(JSON.stringify({
          code: "HB",
          data: "pong"
        }));
        break;
      default:
        break;
    }
  });

  ws.on('close', function close() {
    winston.info("Connection closed.", {sessionId: ws.session.id});
    clients.splice(clients.indexOf(ws), 1);
    winston.info({connections: clients.length});
  });

  ws.send(JSON.stringify({
    code: "LS",
    data: JSON.parse(fs.readFileSync(dataFile, 'utf8'))
  }));
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