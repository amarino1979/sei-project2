//___________________
//Dependencies
//___________________
const express = require('express');
const methodOverride  = require('method-override');
const mongoose = require('mongoose');
const workoutsController = require('./controllers/workouts.js');
const app = express();
const db = mongoose.connection;
const session = require('express-session')
const bcrypt = require('bcrypt')

require('dotenv').config()
//___________________
//Port
//___________________
// Allow use of Heroku's port or your own local port, depending on the environment
const PORT = process.env.PORT || 3000;

//___________________
//Database
//___________________
// How to connect to the database either via heroku or locally
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/'+ 'projectTwo';

// Connect to Mongo
mongoose.connect(MONGODB_URI, { 
  useUnifiedTopology: true, 
  useNewUrlParser: true,
  useCreateIndex: true,
 });

// Error / success
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', MONGODB_URI));
db.on('disconnected', () => console.log('mongo disconnected'));

// open the connection to mongo
db.on('open' , ()=>{});

//___________________
//Middleware

//___________________

//use public folder for static assets
app.use(express.static('public'));
//use method override
app.use(methodOverride('_method'));// allow POST, PUT and DELETE from a form

// populates req.body with parsed info from forms - if no data from forms will return an empty object {}
app.use(
    session({
      secret: process.env.SECRET, //a random string do not copy this value or your stuff will get hacked
      resave: false, // default more info: https://www.npmjs.com/package/express-session#resave
      saveUninitialized: false // default  more info: https://www.npmjs.com/package/express-session#resave
    })
  )
app.use(express.urlencoded({ extended: false }));// extended: false - does not allow nested objects in query strings
app.use(express.json());// returns middleware that only parses JSON - may or may not need it depending on your project
app.use('/workoutxpress', workoutsController)

//User Controller
const userController = require('./controllers/users.js')
app.use('/users', userController)

//Session Controller
const sessionController = require('./controllers/sessions.js')
app.use('/sessions', sessionController)
//___________________
// Routes
//___________________
//localhost:3000
app.get('/' , (req, res) => {
  res.redirect('/workoutxpress');
});

//___________________
//Listener
//___________________
app.listen(process.env.PORT, () => console.log( 'Listening on port:', PORT));