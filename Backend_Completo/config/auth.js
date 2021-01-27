//import de bibliotecas, e modelos necessarios
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// carrega o modelo de user
const User = require('../models/User');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {//estrategia de confirmacao por email
      // Match user
      User.findOne({where:{//pesquisa o email na base de dados e confirma o email solicita
        email: email
      }}).then(user => {
        if (!user) {
          return done(null, false, { message: 'Humm este emaill não esta registado' });
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Password parece Incorrecta' });
          }
        });
      });
    })
  );
//serializacao do user
  passport.serializeUser(function(user, done) {
    done(null, user);
  });
//deserializao  
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });
};