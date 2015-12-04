var express = require('express');
var router = express.Router();

/* GET getstarted page. */
router.get('/', function(req, res, next) {
  res.render('getstarted', {});
});

module.exports = router;
