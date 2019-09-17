const express = require('express');
const router = express.Router();

// Avion modele
let Avion = require('../models/avion');
// User Modele
let User = require('../models/user');

// chemin de la page ajouter pug
router.get('/add', ensureAuthenticated, function(req, res){
  res.render('ajouter_avion', {
    title:'Ajouter un Avion'
  });
});

// Rajouter un avion avec formulaire !! 
router.post('/add', function(req, res){

  req.checkBody('NumVol','Le numéro de vol est requis').notEmpty();
  req.checkBody('DateDepart','La date départ est requise').notEmpty();
  req.checkBody('DateArriv','La date atterrisage est requise').notEmpty();
  req.checkBody('type','Le type avion est requis').notEmpty();
  req.checkBody('transporteur','Le transporteur est requis').notEmpty();
  req.checkBody('pisteDecol','La piste de decollage est requise').notEmpty();
  req.checkBody('pisteAtterri','La piste atterrissage est requise').notEmpty();
  

  // erreurs
  let errors = req.validationErrors();

  if(errors){
    res.render('ajouter_avion', {
      title:'Ajouter un Avion',
      errors:errors
    });
  } else {
    let avion = new Avion();

    avion.NumVol = req.body.NumVol;
    avion.DateDepart = req.body.DateDepart;
    avion.DateArriv = req.body.DateArriv;
    avion.type = req.body.type;
    avion.transporteur = req.body.transporteur;
    avion.pisteDecol = req.body.pisteDecol;
    avion.pisteAtterri = req.body.pisteAtterri;
  

    avion.save(function(err){
      if(err){
        console.log(err);
        return;
      } else {
        req.flash('success','Avion rajouté');
        res.redirect('/');
      }
    });
  }
});

// editer un avion formulaire!!!
router.get('/edit/:id', ensureAuthenticated, function(req, res){
  Avion.findById(req.params.id, function(err, avion){
    if(avion.admin == '0'){
      req.flash('danger', 'Not Authorized');
      res.redirect('/');
    }
    res.render('edit_avion', {
      title:'Edit Avion',
      avion:avion
    });
  });
});

// Requete pour updaté
router.post('/edit/:id', function(req, res){
  let avion = {};

  avion.NumVol = req.body.NumVol;
  avion.DateDepart = req.body.DateDepart;
  avion.DateArriv = req.body.DateArriv;
  avion.type = req.body.type;
  avion.transporteur= req.body.transporteur;
  avion.pisteDecol = req.body.pisteDecol;
  avion.pisteAtterri = req.body.pisteAtterri;

  let query = {_id:req.params.id}

  Avion.update(query, avion, function(err){
    if(err){
      console.log(err);
      return;
    } else {
      req.flash('success', 'Avion updaté');
      res.redirect('/');
    }
  });
});

// Supprimer un avion
router.delete('/:id', function(req, res){
  if(!req.user._id){
    res.status(500).send();
  }

  let query = {_id:req.params.id}

  Avion.findById(req.params.id, function(err, avion){
    if(avion.admin == '0'){
      res.status(500).send();
    } else {
      Avion.remove(query, function(err){
        if(err){
          console.log(err);
        }
        res.send('Success');
      });
    }
  });
});

// Fetch un seul avion
router.get('/:id', function(req, res){
  Avion.findById(req.params.id, function(err, avion){
    User.findById(avion.type, function(err, user){
      res.render('avion', {
        avion:avion,
      });
    });
  });
});

// Controler les accès au utilisateur !!
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}

module.exports = router;
