var express = require('express');
var router = express.Router();

/* GET portal page. */
router.get('/', function(req, res, next) {
  res.render('supportportal', {});
});

module.exports = router;
