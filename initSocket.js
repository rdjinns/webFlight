var initSocket = {};
var notDeparted = require('./public/js/not-departed');
var flying = require('./public/js/flying');
var landed = require('./public/js/landed');
// Initialiser tous les scripts socket
initSocket.init = (socket) => {
	notDeparted.init(socket);
	flying.init(socket);
	landed.init(socket);
}

// Exporter le module
module.exports = initSocket;