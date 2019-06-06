# Passport authentication Strategies boiler-plate

## Section One (Local)

```javascript
// > yarn add express express-session ejs express-ejs-layouts connect-flash mongoose bcrypt passport passport-local

// 1. setup ejs engine
const expressLayouts = require('express-ejs-layouts');

app.use(expressLayouts);
app.set('view engine', 'ejs');
// assume have some view on views folder ./views/index.ejs

//render views:
router.get('/', (req, res) => res.render('index', { errors }));

// 2. BodyParser nowadays added to express!!
app.use(express.urlencoded({ extended: false }));

// 3. bcrypt password
const bcrypt = require('bcrypt');

bcrypt.genSalt(10, (err, salt) =>
  bcrypt.hash(newUser.password, salt, (err, hashedPassword) => {
    if (err) throw new Error(err);

    newUser.password = hashedPassword;

    newUser
      .save()
      .then(user => res.redirect('/users/login'))
      .catch(err => new Error(err));
  })
);

// 4. mongooseSchema.pre
// Pre middleware functions are executed one after another, when each middleware calls next
schema.pre('save', async function(next) {
  await doStuff();
  await doMoreStuff();
  next();
});

// 5. setup session and flash
const session = require('express-session');
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);
// flash
app.use(flash());
//global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});
// call flash from req ./routes/users
req.flash('success_msg', 'Successfully SignUp.');

// 6. Login using passport

// 1. setup passport local-strategy ./services/localAuth

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

// 2. setup passport middleware ./app
const passport = require('passport');

require('./services/localAuth')(passport);
// *** after app.use(session)
app.use(passport.initialize());
app.use(passport.session());

// 3. handle login ./routes/users
const passport = require('passport');

router.post('/users/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// 4. handle logout

router.get('/users/logout', (req, res) => {
  req.logout();
  res.redirect('user/login');
});

// 5. ensure isAuthenticated function
// ./middlewares/ensureAuthenticated
module.exports = function(req, res, next) {
  if (req.isAuthenticated()) return next();

  req.flash('error_msg', 'Please log in to view this resource');
  return res.redirect('/users/login');
};

// also user is available in req.user !!
```
