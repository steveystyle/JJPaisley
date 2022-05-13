const express = require('express')
const app = express();

//handlebars view engine selected to use default layouts and apply logic to views for efficiency of menu display
const handlebars = require('express-handlebars')
.create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');


app.set('port', process.env.PORT || 3000);

app.get('/', function (req, res) {
    res.type('text/plain');
    res.send('Jam Jar');
});

app.get('/about', function (req, res) {
    res.type('text/plain');
    res.send('About Jam Jar');
});


//custom 404 - update to view later
app.use(function (req, res) {
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not Found');
});

// custom 500 - update to view later
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.type('text/plain');
    res.status(500);
    res.send('500 - Server Error');
});

app.listen(app.get('port'), function () {
    console.log('Server started on http://localhost:%s; press Ctrl-C to terminate.', app.get('port'));
});

