// ## Section One (Local)
// > yarn add express express-session ejs express-ejs-layouts connect-flash mongoose bcrypt passport passport-local

// 1. setup ejs engine
const expressLayouts = require('express-ejs-layouts');

app.use(expressLayouts);
app.set('view engine', 'ejs');
// assume have some view on views folder ./views/index.ejs

//render views:
router.get('/', (req, res) => res.render('index'));

// 2. BodyParser nowadays added to express
app.use(express.urlencoded({ extended: false }));
