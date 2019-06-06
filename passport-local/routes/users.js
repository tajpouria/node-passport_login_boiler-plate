const passport = require('passport');
const router = require('express').Router();

const validation = require('../middlewares/validation');
const User = require('../models/User');

router.get('/login', (req, res) => res.render('login'));

router.get('/register', (req, res) => res.render('register'));

router.post('/register', validation, async (req, res) => {
  const { name, email, password } = req.body;

  const user = new User({ name, email, password });
  await user.save();
  req.flash('success_msg', 'Successfully SignUp.');
  res.redirect('/users/login');

  // not working by pre('save')
  // User.collection.insertOne({ name, email, password }, err => {
  //   if (err) throw new Error(err);
  //   res.redirect('/users/login');
  // });
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logOut();
  req.flash('success_msg', 'You are logged out.');
  res.redirect('/users/login');
});

module.exports = router;
