//https://stackoverflow.com/questions/1967370/git-replacing-lf-with-crlf
//const expressSession = require("express-session");
//const passport = require("passport");
//const Auth0Strategy = require("passport-auth0");
//require("dotenv").config();

const path = require("path");
const { request } = require('express');
const axios = require('axios');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
  res.send(
    req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out'
  )
  //console.log(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out')

});

router.get('/test', (req, res) => {
  res.render('test.html')
})

router.get('/profile', (req, res) => {
  res.send(
    req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out'
  )
  res.send(JSON.stringify(req.oidc.user, null, 2));
});

router.get('/songs-list', (req, res) => {
  if(req.query.term) {
    const url = "https://itunes.apple.com/search"; //{'term': term, 'media': 'music'}
    const terms = req.query.term;
    axios
      .get(url, {params: {'term': terms, 'media': 'music', 'limit': 5, 'lang':'en_us'}})
      .then(i_res => {
        res.json(i_res.data);
      })
      .catch(error => {
        console.error(error);
      })
  }
  else if(req.query.add) {
    const song_id = req.query.add;
    res.send(song_id);
  }
})

router.get('/song-info', (req, res) => {
  res.render('song-info', {title: 'SONG!!!'})
});

router.get('/login', (req, res) => {
  res.render();
})

router.use(express.static('public'))
module.exports = router;
