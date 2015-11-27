

module.exports = {
  login: function(req, res, next) {
    req.session.user = {
      name: "Carla Davis",
      email: "carla.davis@contosoweb.net"
    }
    var path = '/'
    if(req.session.redirectURL) {
      path = req.session.redirectURL;
    }
    res.redirect(path);
  },
  logout: function(req, res, next) {
    req.session.destroy(function(err) {
      next(err);
      res.redirect('/');
    })
  },
  requireAuth: function(req, res, next) {
    if(!req.session.user && req.session){
      req.session.redirectURL = req.header('Referer') || '/';
      return res.redirect('/login');
    }
    next();
  }
}
