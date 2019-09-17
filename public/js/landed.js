var landed = {};
var Avion = require('../../models/avion');

// Emettre le socket d'atterissage
landed.init = (socket) => {
	var date = Date.now();
	Avion.find({isDeparted: true, isLanded: true},(err, avions) => {
		if(!err && avions.length > 0){
			avions.forEach((avion) => {
				if(avion.DateArriv < date){
					socket.emit('landed',{'id' : avion._id});
				}
			});
		}
	});
}
// Exporter le module
module.exports = landed;