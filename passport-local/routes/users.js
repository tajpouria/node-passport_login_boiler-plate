const router = require('express').Router();

router.get('/login', (req, res) => res.render('login'));

router.get('/register', (req, res) => res.render('register'));

router.post('/register', (req, res) => {
  console.log(req.body);
  res.send('eh');
});

module.exports = router;
