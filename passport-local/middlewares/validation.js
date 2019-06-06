const User = require('../models/User');

module.exports = async function(req, res, next) {
  const { name, email, password, password2 } = req.body;
  console.log(name, email, password, password2);
  let errors = [];
  // is required
  if (!name || !email || !password || !password2)
    errors.push({ msg: 'Fields not allowed to be empty.' });
  // 6 character or more password
  if (password.length < 6)
    errors.push({ msg: 'Password must be more than 6 character.' });
  // match password
  if (password !== password2)
    errors.push({ msg: 'Provided passwords not match.' });
  // already registered
  const user = await User.findOne({ email }, (err, doc) => {
    if (err) throw new Error(err);
    // not pushing error!
    // if (doc) errors.push({ msg: 'Email already registered.' });
  });
  if (user) errors.push({ msg: 'Email already registered.' });

  console.log(errors.length);
  return errors.length !== 0
    ? res.render('register', { errors, name, email, password, password2 })
    : next();
};
