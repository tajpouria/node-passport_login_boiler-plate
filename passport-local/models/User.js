const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});
// encrypting password before save
userSchema.pre('save', function(next) {
  bcrypt.genSalt(10, (err, salt) => {
    if (err) throw new next(err);

    bcrypt.hash(this.password, salt, (err, encrypted) => {
      if (err) throw new next(err);

      this.password = encrypted;
      next();
    });
  });
});

module.exports = mongoose.model('User', userSchema);
