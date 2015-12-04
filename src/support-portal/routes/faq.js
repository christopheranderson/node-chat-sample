var express = require('express');
var router = express.Router();

/* GET faq page. */
router.get('/', function(req, res, next) {
  res.render('faq', {});
});

module.exports = router;
