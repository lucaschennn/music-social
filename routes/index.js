//https://stackoverflow.com/questions/1967370/git-replacing-lf-with-crlf
//const expressSession = require("express-session");
//const passport = require("passport");
//const Auth0Strategy = require("passport-auth0");
//require("dotenv").config();

const path = require("path");
const { request } = require('express');
const axios = require('axios');
const fs = require('fs');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  if (req.oidc.isAuthenticated()) {
    const cur_user = req.oidc.user
    data = {href: "/profile", message: "Profile"}
    axios
      .post("http://localhost:3000/users/create-user", {
        "name": cur_user.nickname,
        "username": cur_user.nickname,
        "email": cur_user.email
      })
      .catch(error => {
        console.error(error.message)
      })
  }
  else {
    data = {href: "/login", message: "Login/Register"}
  }
  res.render('index', data);
});

router.get('/test', (req, res) => {
  res.render("index.pug")
})

router.get('/profile', (req, res) => {
  //res.send(JSON.stringify(req.oidc.user));
  res.render('profile.pug', {href: "/profile", message: "Profile", name: req.oidc.user.nickname})
});

router.get('/user_profile', (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
})

router.get('/listen', (req, res) => {
  if (req.oidc.isAuthenticated()) {
    res.render('listen.pug', {href: "/profile", message: "Profile"})
  }
  else {
    res.redirect("/login")
    //res.render('login', {href: "/login", message: "Login/Register"})
  }
})

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

router.get('/song-moods', (req, res) => {
  if(!req.query.moods) {
    fs.readFile("./resources/mood_catalog.json", "utf8", function(err, data) {
      console.log(req.query)
      res.json(data)
    })
  }
  else {
    fs.readFile("./resources/mood_catalog.json", "utf8", function(err, data) {
      dataJSON = JSON.parse(data);
      let to_return = {}
      for(song of dataJSON.songs) {
        const arrIntersect = req.query.moods.every(value => {
          let score = 0
          if(song.moods[value]) {
            score += song.moods[value]
          }
          return Object.keys(song.moods).includes(value)
        })
        if(arrIntersect) {
          let score = 0
          for(mood of req.query.moods) {
            score += song.moods[mood]
          }

          if(score in to_return) {
            to_return[score].push(song)
          }
          else {
            to_return[score] = [song]
          }
        }
/*
        for(mood of req.query.moods) {
          if(mood in song.moods) {
            if(song.moods[mood] in to_return) {
              let count = song.moods[mood]
              to_return[count].push(song)
            }
            else{
              let count = song.moods[mood]
              to_return[count] = [song]
            }
          }
        }
**/
      }

      res.json(to_return)
    })
  }
})

router.patch('/song-moods', (req, res) => {
  var errors=[]
  if (!req.body.songid){
      errors.push("No song specified");
  }
  if (!req.body.moods){
      errors.push("No moods selected");
  }
  if (errors.length){
      res.status(400).json({"error":errors.join(",")});
      return;
  }
  var params = {
      id: req.body.songid,
      moods: req.body.moods
  }
  fs.readFile("./resources/mood_catalog.json", "utf8", function(err, data) {
    JSONsongs = JSON.parse(data);
    for(const song of JSONsongs.songs) {
      console.table([song.trackId, params.id])
      if(song.trackId == params.id) {
        for(const mood of params.moods) {
          if(mood in song.moods) {
            song.moods[mood] += 1
          }
          else {
            song.moods[mood] = 1
          }
        }
        fs.writeFile("./resources/mood_catalog.json", JSON.stringify(JSONsongs), function (err) {
          if (err) throw err;
        })

      }
    }
    console.error("404 Song not found!")
  })
//FS STREAM OF MOOD_CATALOG MIGHT IMPACT THE REQUIRING OF THAT SAME FILE
})

router.use(express.static('public'))
module.exports = router;
