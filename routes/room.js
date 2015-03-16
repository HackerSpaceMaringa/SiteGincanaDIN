/* GET home page. */
module.exports = function(router, db) {

  function checkSession(req, res) {
    if (global.finished) { 
      res.redirect("/end");
      return false;
    }
    return true;
  }

  router.all('/room', function(req, res, next) {
    var sess = req.session; 
    if (sess.username != undefined && sess.username.indexOf("sala") == 0) {

      if (checkSession(req, res)) {
        db.find({ type: 'team' }).sort({points: -1, time: 1, name: 1}).exec( 
          function (err, docs) {
            res.render('room', { name: sess.username, active: "rank",  
              teams: docs})
          });
      }

    } else {
      res.redirect("/");
    }
  });

  router.all('/room/teams', function(req, res, next) {
    var sess = req.session; 
    if (sess.username != undefined && sess.username.indexOf("sala") == 0) {

      if (checkSession(req, res)) {
        db.find({ type: 'team' }, function (err, docs) {
          res.render('room', { name: sess.username, active: "team", teams: docs});
        });
      }

    } else {
      res.redirect("/");
    }
  });

  router.all('/room/points', function(req, res, next) {
    var sess = req.session; 
    if (sess.username != undefined && sess.username.indexOf("sala") == 0) {

      if (checkSession(req, res)) {
        db.find({ type: 'team' }, function (err, docs) {
          res.render('room', { name: sess.username, 
            active: "points", 
            teams: docs, status: "ok" });
        });
      }

    } else {
      res.redirect("/");
    }
  });

  router.post('/room/points/add', function(req, res, next) {
    var sess = req.session; 
    if (sess.username != undefined && sess.username.indexOf("sala") == 0) {

      if (checkSession(req, res)) {
        if (req.param('roomPassword') == ("kazord123"+sess.username)) {
          db.find({ type: 'team' , name: req.param('teamName')},
            function (err, docs) {
              db.update( { type: 'team', name: req.param('teamName') }, 
                { $set: { points: docs[0].points+parseInt(req.param('points')), time: global.clock } }, 
                          function(err, num) {
                            res.redirect('/room');
                          });
            });
        } else {
          db.find({ type: 'team'}, function(err, docs) {
            res.render('room', { name: sess.username, 
              active: "points", 
              teams: docs, status: "Senha incorreta!" });
          });
        }
      }

    } else {
      res.redirect("/");
    }
  });
}
