var express =          require('express'),
    path =             require('path'),
    favicon =          require('static-favicon'),
    logger =           require('morgan'),
    cookieParser =     require('cookie-parser'),
    bodyParser =       require('body-parser'),
    MongoClient =      require('mongodb').MongoClient,
    mongoose =         require('mongoose'),
    async =            require('async'),

    User =             require('./models/user.js'),
    // ClientCollection = require('./models/client-collection.js'),

    routes =           require('./routes/index'),
    users =            require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

app.get('/dashboard', function(req, res) {
  res.render('dashboard', {
    user: {
        username: 'raine'
    },
    collections: [
        { name: 'users', }
    ]
  })
})

app.post('/register', function(req, res) {
  return res.redirect('/dashboard');

  var user = new User({
    username: req.body.username,
    password: 'test',
    created: new Date()
  });
  user.save(function(err, docs) {
    if(err) throw err;
    res.redirect('/dashboard');
  });
})

var dbConnectionString = 'mongodb://127.0.0.1:27017/whip';
mongoose.connect(dbConnectionString);

/** Connects to the database and gets the given client collection. */
var getClientCollection = function(clientName, collectionName, cb) {
    MongoClient.connect(dbConnectionString, function(err, db) {
        if(err) { cb(err); return; }
        var collection = db.collection('client-' + clientName + '-' + collectionName);
        cb(null, collection, function() {
            db.close();
        });
    })
};

app.get('/:user', function(req, res, next) {
    MongoClient.connect(dbConnectionString, function(err, db) {
        if(err) throw err;
        var collection = db.collection('users');
        collection.find({ username: req.params.user }).toArray(function(err, results) {
            if(err) throw err;
            res.send(results);
            db.close();
        });
    })
});

app.get('/:client/:collection', function(req, res, next) {
    getClientCollection(req.params.client, req.params.collection, function(err, collection, next) {
        collection.find().toArray(function(err, results) {
            if(err) throw err;
            res.send(results);
            next();
        });
    })
});

app.get('/:client/:collection', function(req, res, next) {
    getClientCollection(req.params.client, req.params.collection, function(err, collection, next) {
        collection.insert(req.body, function(err, docs) {
            if(err) throw err;
            res.send(docs);
            next();
        });
    })
});

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
