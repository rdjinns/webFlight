const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const http = require('http');
const initSocket = require('./initSocket');
mongoose.connect('mongodb://localhost:27017/FlightSimu');

// utiliser express
const app = express();

// apporter les modèles
let Avion = require('./models/avion');

// Lancer le moteur de vue ( pug )
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body Parser M
// parse x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Apporter le dossier public contenant le css ajax etc
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

// Express Messages (message d'erreur etc)
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator 
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//Apporter  Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

// Route de l'index
app.get('/', function(req, res){
  Avion.find({}, function(err, avions){
    if(err){
      console.log(err);
    } else {
      res.render('index', {
        title:'Avions actuel',
        avions:avions
      });
    }
  });
});

// Fichier api route
let Avions = require('./routes/avions');
let users = require('./routes/users');
app.use('/avions', Avions);
app.use('/users', users);


// lancer le serveur
const server = http.createServer(app);
var io = require('socket.io').listen(server);

server.listen(3000);


io.on('connection', function (socket) {


  setInterval(() => {

  initSocket.init(socket);
  
},10000);


}); 
  
  
 
 


