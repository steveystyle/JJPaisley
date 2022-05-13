const express = require('express');
const app = express();
var dayQuote = require('./lib/dayQuotes');

//handlebars view engine selected to use default layouts and apply logic to views for efficiency of menu display
const handlebars = require('express-handlebars')
    .create({ defaultLayout: 'main' });

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);

app.disable('x-powered-by');

app.use(express.static(__dirname + '/public'));

app.use(function (req, res, next) {
    res.locals.showTests = app.get('env') !== 'production' &&
        req.query.test === '1';
    next();
});
   
app.get('/', function (req, res) {
    res.render('home',
    {dayQuote: dayQuote.getDayQuote()}
    );
});

app.get('/about', function (req, res) {
    res.render('about', {
        pageTestScript: '/tests/tests-about.js'
    });
});


//custom 404 - update to view later
app.use(function (req, res) {
    res.status(404);
    res.render('404');
});

// custom 500 - update to view later
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function () {
    console.log('Server started on http://localhost:%s; press Ctrl-C to terminate.', app.get('port'));
});

