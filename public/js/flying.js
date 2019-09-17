var flying = {};
var Avion = require('../../models/avion');

flying.getAvions = (socket) => {
	Avion.find({isDeparted: true, isLanded: false},(err, avions) => {
		if(!err && avions.length > 0){
			flying.checkAvionStatus(avions,socket);
		}
	});
}

// Check si l'avion a décollé est en vol
flying.checkAvionStatusOnce = (socket) =>{
	var date = Date.now();
	Avion.find({isDeparted: true, isLanded: false},(err, avions) => {
		if(!err && avions.length > 0){
			avions.forEach((avion) => {
				if(avion.DateArriv > date){
					socket.emit('departed',{'id' : avion._id});
				}
			});
		}
	});
}

// update l'atterissage dans la bdd
flying.checkAvionStatus = (avions,socket) => {
	var date = Date.now();
	avions.forEach((avion) => {
		if(avion.DateArriv < date && !avion.isLanded){
			Avion.update({_id: avion._id},{isLanded: true},(err) => {
				if(err){
					console.log(err)
				}else{
					socket.emit('landed',{'id' : avion._id});
				}
			});
		}
	});
}

// boucler ces requetes tous les 100 milis
flying.checkAvionStatusLoop = (socket) => {
	setInterval(() => {
		flying.getAvions(socket);
	},5000);
}

// Initiliaser tous ses requetes
flying.init = (socket) => {
	flying.getAvions(socket);
	flying.checkAvionStatusOnce(socket);
	flying.checkAvionStatusLoop(socket);
}

// Exporter le module
module.exports = flying;