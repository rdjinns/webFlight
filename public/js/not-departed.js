var notDeparted = {};
var Avion = require('../../models/avion');

notDeparted.getAvions = (socket) => {
	Avion.find({isDeparted: false},(err, avions) => {
		if(!err && avions.length > 0){
			notDeparted.checkAvionStatus(avions,socket);
		}
	});
}

// Checker si l'avion est encore au sol
notDeparted.checkAvionStatusOnce = (socket) =>{
	var date = Date.now();
	Avion.find({isDeparted: false},(err, avions) => {
		if(!err && avions.length > 0){
			avions.forEach((avion) => {
				if(avion.DateDepart > date){
					socket.emit('not-departed',{'id' : avion._id});
				}
			});
		}
	});
}

// Check si l'avion a commencé à décoller
notDeparted.checkAvionStatus = (avions,socket) => {
	var date = Date.now();
	avions.forEach((avion) => {
		if(avion.DateDepart < date && !avion.isDeparted){
			Avion.update({_id: avion._id},{isDeparted: true},(err) => {
				if(err){
					console.log(err)
				}else{
					socket.emit('departed',{'id' : avion._id});
				}
			});
		}
	});
}

// Boucler les requetes
notDeparted.checkAvionStatusLoop = (socket) => {
	setInterval(() => {
		notDeparted.getAvions(socket);
	},5000);
}

// Initialiser les requetes
notDeparted.init = (socket) => {
	notDeparted.getAvions(socket);
	notDeparted.checkAvionStatusOnce(socket);
	notDeparted.checkAvionStatusLoop(socket);
}

// Exporter le module
module.exports = notDeparted;