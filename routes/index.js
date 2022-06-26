//https://stackoverflow.com/questions/1967370/git-replacing-lf-with-crlf

const { request } = require('express');
const axios = require('axios');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
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



router.use(express.static('public'))
module.exports = router;
