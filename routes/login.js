const express = require("express");
const path = require("path");

const expressSession = require("express-session");
const passport = require("passport");
const Auth0Strategy = require("passport-auth0");

require("dotenv").config();
var router = express.Router();

const session = {
    secret: process.env.SESSION_SECRET,
    cookie: {},
    resave: false,
    saveUninitialized: false
  };
  
if (router.get("env") === "production") {
// Serve secure cookies, requires HTTPS
session.cookie.secure = true;
}

/*
router.set("views", path.join(__dirname, "views"));
router.set("view engine", "pug");
router.use(express.static(path.join(__dirname, "public")));
**/
const strategy = new Auth0Strategy(
    {
      domain: process.env.AUTH0_DOMAIN,
      clientID: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      callbackURL: process.env.AUTH0_CALLBACK_URL
    },
    function(accessToken, refreshToken, extraParams, profile, done) {
      return done(null, profile);
    }
  );
 

  //https://auth0.com/blog/create-a-simple-and-secure-node-express-app/#Set-up-Passport-js-with-Node-and-Express
module.exports = router;