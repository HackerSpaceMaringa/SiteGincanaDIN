module.exports = function(router) {
  var forms = require('forms');
  var fields = forms.fields;
  var validators = forms.validators;

  var login_form = forms.create({
      usuário: fields.string({ required: true }),
      senha: fields.password({ required: true }),
  });

  router.get('/end', function(req, res, next) {
    if (global.finished) {
      res.render('end', {});
    } else {
      res.redirect('/');
    }
  });

  /* GET home page. */
  router.get('/', function(req, res, next) {
    var sess = req.session; 
    if (sess.username == "admin") {
      res.redirect('/painel');
    } else {
      res.render('index', { form: login_form.toHTML(), error: "ok" });
    }
  });

  function handleLogin(req, res) {
    var sess      = req.session; 
    login_form.handle(req, {
      success: function (form) {
        if (form.data.usuário == "admin" && form.data.senha == "rpa8djs9") {
          sess.username = "admin";
          res.redirect('/painel');
        } else if (form.data.usuário.indexOf("sala") == 0) {
            if(form.data.senha == ("kazord123"+form.data.usuário)) {
              if (global.started) {
                sess.username = form.data.usuário;
                res.redirect('/room');
              } else if (global.finished) {
                res.render('index', { form: login_form.toHTML(), 
                  error: "Gincana finalizada!" });
              } else {
                res.render('index', { form: login_form.toHTML(), 
                  error: "Gincana ainda não foi iniciada!" });
              }
            } else {
              res.render('index', { form: login_form.toHTML(), 
                error: "usuário ou senha inválidos" });
            }
        } else {
          res.render('index', { form: login_form.toHTML(), 
            error: "usuário ou senha inválidos" });
        }
      },
      error: function (form) {
        res.render('index', { form: login_form.toHTML(), 
          error: "Usuário ou senha inválidos" });
      },
      empty: function (form) {
        res.render('index', { form: login_form.toHTML(),
          error: "Obrigatório preencher todos os campos" });
      }
    });
  }

  router.all('/login', function(req, res, next) {
    var sess      = req.session; 
    if (sess.username == "admin") {
      res.redirect('/painel');
    } else {
      handleLogin(req, res);
    }
  });

  router.all('/logout', function(req, res, next) {
    req.session.destroy(function(err){
      res.redirect("/");
    });
  });
}
