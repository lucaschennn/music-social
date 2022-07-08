var express = require('express');
const path = require('path');
var router = express.Router();

//var db = require(path.join(__dirname, '..', 'db', '/db'))
var db = require('../db/database')

/* GET users listing. */
router.get('/', function(req, res, next) {
  var sql = "select * from user"
  var params = []
  db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.json({
          "message":"success",
          "data":rows
      })
    });
});

//name=test&username=test_user&email=test%40example.com"
router.post('/create-user', (req, res) => {
  var errors=[]
  if (!req.body.name){
      errors.push("No name specified");
  }
  if (!req.body.email){
      errors.push("No email specified");
  }
  if (errors.length){
      res.status(400).json({"error":errors.join(",")});
      return;
  }
  var data = {
      name: req.body.name,
      username: req.body.username,
      email : req.body.email
  }
  var sql ='INSERT INTO user (name, username, email) VALUES (?,?,?)'
  var params =[data.name, data.username, data.email]
  db.run(sql, params, function (err, result) {
      if (err){
          res.status(400).json({"error": err.message})
          return;
      }
      res.json({
          "message": "success",
          "data": data,
          "id" : this.lastID
      })
  });
})

router.get('/:userid', (req, res) => {
  var sql = "select * from user where id = ?"
  var params = [req.params.userid]
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({"error":err.message})
      return;
    }
    console.log(row)
    res.json({
      "data":row
    })
  })
})

router.patch("/update-songs", (req, res, next) => {
  var new_post = req.body
  var email = req.oidc.user.email
  var sql = "select * from user where email = ?"
  db.get(sql, email, (err, row) => {
    if(row.posts == null){posts = [];}
    else {var posts = JSON.parse(row.posts);}
    posts.push(new_post)
    //var new_posts = Object.assign(posts, new_post)
    db.run(
      "UPDATE user SET posts = ? WHERE email = ?",
      [JSON.stringify(posts), email],
      function (err, result) {
        res.json({
          message: "success",
          data: posts,
          changes: this.changes
        })
      }
    )
  })
})

module.exports = router;
