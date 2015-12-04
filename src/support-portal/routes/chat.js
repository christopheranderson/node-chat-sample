var express = require('express');
var router = express.Router();

/* GET chat page. */
router.get('/', function(req, res, next) {
  res.render('chat', {siteName: (process.env['WEBSITE_HOSTNAME'] ? "http://" + process.env['WEBSITE_HOSTNAME'] : null)});
});

module.exports = router;
