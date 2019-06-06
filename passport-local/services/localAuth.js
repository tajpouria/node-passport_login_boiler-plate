const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/User');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      User.findOne({ email })
        .then(user => {
          if (!user)
            return done(null, false, {
              message: 'The email is not registered.'
            });

          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw new Error(err);

            if (isMatch) return done(null, user);

            return done(null, false, { massage: 'Password incorrect.' });
          });
        })
        .catch(err => new Error(err));

      passport.serializeUser((user, done) => done(null, user.id));
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
    })
  );
};
