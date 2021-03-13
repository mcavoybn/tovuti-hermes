var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/comments', function(req, res, next) {
  // Connect to the db and retrieve comments based on the 
  // give params
  res.json({});
});

router.post('/comment', function(req, res, next) {
  // Connect to the db and create the comments
  res.json({});
});

module.exports = router;
