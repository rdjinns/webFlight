const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// User modele
let User = require('../models/user');

// Formulaire register !! 
router.get('/register', function(req, res){
  res.render('register');
});

// Requete inscription !
router.post('/register', function(req, res){

  const admin = req.body.admin;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;

  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();

  let errors = req.validationErrors();

  if(errors){
    res.render('register', {
      errors:errors
    });
  } else {
    let newUser = new User({
      admin:admin,
      email:email,
      username:username,
      password:password
    });

    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(newUser.password, salt, function(err, hash){
        if(err){
          console.log(err);
        }
        newUser.password = hash;
        newUser.save(function(err){
          if(err){
            console.log(err);
            return;
          } else {
            req.flash('success','Vous êtes inscrit et pouvez maintenant vous connecter');
            res.redirect('/users/login');
          }
        });
      });
    });
  }
});

// Formulaire login
router.get('/login', function(req, res){
  res.render('login');
});

// Quand il veut acceder à la page de son compte
router.get('/account',ensureAuthenticated, function(req, res){
  res.render('account');
});

// requete de login
router.post('/login', function(req, res, next){
  passport.authenticate('local', {
    successRedirect:'/',
    failureRedirect:'/users/login',
    failureFlash: true
  })(req, res, next);
});

// update compte 

// editer un user formulaire!!!
router.get('/edit/:id', ensureAuthenticated, function(req, res){
  User.findById(req.params.id, function(err, user){
    res.render('edit_account', {
      title:'Editer votre compte',
      user:user
    });
  });
});

// Requete pour updaté
router.post('/edit/:id', function(req, res){
  let user = {};

  user.email = req.body.email;
  user.username = req.body.username;
  user.password = req.body.password;

  let query = {_id:req.params.id}


  bcrypt.genSalt(10, function(err, salt){
    bcrypt.hash(user.password, salt, function(err, hash){
      if(err){
        console.log(err);
      }
      user.password = hash;
      User.update(query, user, function(err){
        if(err){
          console.log(err);
          return;
        } else {
          req.flash('success', 'User updaté avec succès');
          res.redirect('/');
        }
      });
    });
  });
});



///// Supprimer compte 

router.delete('/:id', function(req, res){
  if(!req.user._id){
    res.status(500).send();
  }

  let query = {_id:req.params.id}

  User.findById(req.params.id, function(err, user){
    if(user.admin == '0'){
      res.status(500).send();
    } else {
      User.remove(query, function(err){
        if(err){
          console.log(err);
        }
        res.send('Success');
      });
    }
  });
});

// deconnexion
router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'A BIENTOT ! ');
  res.redirect('/users/login');
});


function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}



module.exports = router;
