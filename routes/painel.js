/* GET home page. */
module.exports = function(router, db) {
  router.all('/start', function(req, res, next) {
    var sess = req.session; 
    if (sess.username == "admin") { 
      global.started = true;
      res.redirect("/painel");
    } else {
      res.redirect("/");
    }
  });


  router.all('/painel', function(req, res, next) {
    var sess = req.session; 
    if (sess.username == "admin") {
      db.find({ type: 'team' }).sort({points: -1, time: 1, name: 1}).exec( 
        function (err, docs) {
          res.render('painel', { name: sess.username, active: "rank",  
                                 teams: docs})
        });

    } else {
      res.redirect("/");
    }
  });

  router.get('/painel/add/:name', function(req, res, next) {
    var sess = req.session; 
    if (sess.username == "admin") {
      db.insert( { type: 'student', name: req.param('name') } );

      res.redirect('/painel/list');
    } else {
      res.redirect("/");
    }
  });

  router.all('/painel/list', function(req, res, next) {
    var sess = req.session; 
    if (sess.username == "admin") {
      db.find({ type: 'student' }, function (err, docs) {
        res.render('painel', { name: sess.username, active: "list", list: docs});
      });
    } else {
      res.redirect("/");
    }
  });

  router.all('/painel/teams', function(req, res, next) {
    var sess = req.session; 
    if (sess.username == "admin") {
      db.find({ type: 'team' }, function (err, docs) {
        res.render('painel', { name: sess.username, active: "team", teams: docs});
      });
    } else {
      res.redirect("/");
    }
  });

  router.all('/painel/generateteams', function(req, res, next) {
    var sess = req.session; 
    if (sess.username == "admin") {

      db.remove({type: 'team'}, { multi: true });

      db.find({ type: 'student' }, function (err, docs) {
        var names = ['Alizarina', 'Âmbar', 'Aspargo', 'Borgonha', 'Carmesim', 
                     'Escarlate', 'Grená', 'Índigo', 'Jambo', 'Maná', 'Ocre', 
                     'Quantum', 'Rútilo', 'Urucum'];
        var size = docs.length;
        teams = [];
        
        for (var i = 0; i < size - size%4; i++) {
          var pos = Math.floor(i/4)
          if (teams[pos] == undefined) teams[pos] = []

          teams[pos].push(docs[i]);
        }
        
        for (var i = size-size%4; i < size; i++) {
          teams[i % teams.length].push(docs[i]);
        }
  
        for (var i = 0; i < teams.length; i++) {
          db.insert({ type: "team", name: names[i], members: teams[i], 
                      points: 0, time: 0, activites: []});
        }

        res.redirect('/painel/teams');
      });
    } else {
      res.redirect("/");
    }
  });



}
