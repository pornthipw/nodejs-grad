var express = require("express");
var mongodb = require('mongodb');
var handlebars = require('hbs');
var _ = require('underscore');
//var user_role = require('connect-roles');

var config = require('./config');


var app = module.exports.app = express();

var passport = require('./passport-gradnu').passport;
var ensureAuthenticated = require('./passport-gradnu').ensureAuthenticated;

app.configure(function() {
  app.use(express.bodyParser());
  app.use(express.static(__dirname + '/public'));    
  app.set('views', __dirname + '/views');
  app.engine('html', handlebars.__express);  
  app.set('view engine', 'html');      
  app.use(express.cookieParser());  
  app.use(express.methodOverride());  
  app.use(express.session({ secret: 'keyboard cat' }));
    
  app.use(passport.initialize());
  app.use(passport.session());
  
  //app.use(user_role);
});

var helpers = {};


/*

function requireRole(role) {
    return function(req, res, next) {
        if(req.session.user && req.session.user.role === role)
            next();
        else
            res.send(403);
    }
}

*/





app.param('db', function(req, res, next) {
  var db = new mongodb.Db(req.params.db, new mongodb.Server(config.mongodb.server, config.mongodb.port, {'auto_reconnect':true}));
  db.open(function(err,db) {
    if(err) {
      res.send(500, err);
    } else {
        var required_authen = false;
        for(var idx in config.mongodb.auth) {            
            if(config.mongodb.auth[idx].name == req.params.db) {
                required_authen = true;
                db.authenticate(config.mongodb.auth[idx].username, config.mongodb.auth[idx].password, function(err,result) {
                    if(err) {
                        res.send(500, err);
                    } else {
                        if(result) {
                            req.db = db;
                            next();
                        } else {    
                            res.send(403, 'Unauthorized');
                        }
                    }
                });        
            }            
        }                    
        if(!required_authen) {
            req.db = db;
            next();
        }
      }
    });  
});




app.locals({        
  baseHref:config.site.baseUrl
});


app.post('/login',
    function(req, res, next) {
        passport.authenticate('local', function(err, user) {
            if (err) { return next(err) }                        
            if (!user) {
                res.locals.username = req.param('username');
                return res.render('index', { error: true });
            }

            // make passportjs setup the user object, serialize the user, ...
            req.login(user, {}, function(err) {
                if (err) { return next(err) };
                //return res.redirect("/#/list/");
                res.json({success:true,user: req.user}); 
                //return res.render('index', { user: req.user,success: true });

                
                
            });
        })(req, res, next);
        return;
    }
);

require('./gradfiles/app');

app.listen(config.site.port || 3000);

console.log("Mongo Express server listening on port " + (config.site.port || 3000));



