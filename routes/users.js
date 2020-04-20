const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const querystring = require('query-string')
const dotenv = require('dotenv')
const getAccessTokenFromCodeg = require('../facebook_google_auth/google')
const getGoogleDriveFiles = require('../facebook_google_auth/google')
const getAccessTokenFromCodef = require('../facebook_google_auth/facebook')
const getFacebookUserData = require('../facebook_google_auth/facebook')

dotenv.config()
// Load User model
const User = require('../models/User');

// Login Page
router.get('/login', (req, res) => res.render('login',{gLogin:googleLoginUrl,fbLogin:facebookLoginUrl}));

// Register Page
router.get('/register', (req, res) => res.render('register'));

// Register
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });
        // Hash passowrd
        bcrypt.genSalt(10, (err, salt)=>
        bcrypt.hash(newUser.password, salt, (err, hash)=>{
          newUser.password =hash
          newUser.save()
          .then(user=> {
            req.flash('success_msg', "you can login now")
            res.redirect('/users/login')
          })
          .catch(err => console.log(err))
        }))

      }
    });
  }
});

// login handle
router.post('/login', (req, res, next)=> {
  passport.authenticate('local', {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash :true
  })(req, res, next)
})

//logout handle
router.get('/logout', (req, res)=> {
  req.logOut();
  req.flash("success_msg","you are logout")
  res.redirect('/users/login')
})

// generating GOOGLE login URL
const stringifiedParams = querystring.stringify({
  client_id: "<your client id>",
  redirect_uri: 'http://localhost:5000/users/google',
  scope: [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  ].join(' '), // space seperated string
  response_type: 'code',
  access_type: 'offline',
  prompt: 'consent',
  });
  const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`;
// google authentication
  router.get('/google',(req,res)=>{
    var code = req.query.code;
    const gData = getGoogleDriveFiles(getAccessTokenFromCodeg(code));
    res.render('dashboard',{user:gData});
    });

  // generating FACEBOOK login url
  const stringifiedParamsFB = querystring.stringify({
    client_id: "<your client id>",
    redirect_uri: 'http://localhost:5000/users/facebook/',
    scope: ['email', 'user_friends'].join(','), // comma seperated string
    response_type: 'code',
    auth_type: 'rerequest',
    display: 'popup',
  });
  
  const facebookLoginUrl = `https://www.facebook.com/v4.0/dialog/oauth?${stringifiedParamsFB}`;
// FACBOOK authentication
router.get('/facebook',(req,res)=>{
  var codef = req.query.code;
  const fbData = getFacebookUserData(getAccessTokenFromCodef(codef));
  res.render('dashboard',{user:fbData});
  });

module.exports = router;
