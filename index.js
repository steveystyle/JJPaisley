const express = require('express');
const expressHandlebars = require('express-handlebars');

const app = express();

app.engine('handlebars', expressHandlebars({
    defaultLayout: 'main',
}));

app.set('view engine', 'handlebars');

const bodyParser = require('body-parser');

const formidable = require('formidable');
const jqupload = require('jquery-file-upload-middleware');
const credentials = require('./credentials.js');
const path = require('path');
const port = process.env.PORT || 3000;
var dayQuote = require('./lib/dayQuotes');

//handlebars view engine selected to use default layouts and apply logic to views for efficiency of menu display


app.disable('x-powered-by');

app.use(express.static(__dirname + '/public'));
app.use(require('express-session')());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('cookie-parser')(credentials.cookieSecret));
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));

function getWeatherData() {
    return {
        locations: [
            {
                name: 'Portland',
                forecastUrl: 'http://www.wunderground.com/US/OR/Portland.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
                weather: 'Overcast',
                temp: '54.1 F (12.3 C)',
            },
            {
                name: 'Bend',
                forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
                weather: 'Partly Cloudy',
                temp: '55.0 F (12.8 C)',
            },
            {
                name: 'Manzanita',
                forecastUrl: 'http://www.wunderground.com/US/OR/Manzanita.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/rain.gif',
                weather: 'Light Rain',
                temp: '55.0 F (12.8 C)',
            },
        ],
    };
}
app.use('/upload', function (req, res, next) {
    var now = Date.now();
    jqupload.fileHandler({
        uploadDir: function () {
            return __dirname + '/public/uploads/' + now;
        },
        uploadUrl: function () {
            return '/uploads/' + now;
        },
    })(req, res, next);
});

app.use(function (req, res, next) {
    if (!res.locals.partials) res.locals.partials = {};
    res.locals.partials.weatherData = getWeatherData();
    next();
});

app.get('/newsletter', function (req, res) {
    res.render('newsletter', { csrf: 'CSRF token goes here' });
});
app.post('/process', function (req, res) {
    if (req.xhr || req.accepts('json,html') === 'json') {
        // if there were an error, we would send { error: 'error description' }
        res.send({ success: true });
    } else {
        // if there were an error, we would redirect to an error page
        res.redirect(303, '/thank-you');
    }
});

app.get('/contest/vacation-photo', function (req, res) {
    var now = new Date();
    res.render('contest/vacation-photo', {
        year: now.getFullYear(), month: now.getMonth()
    });
});
app.post('/contest/vacation-photo/:year/:month', function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if (err) return res.redirect(303, '/error');
        console.log('received fields:');
        console.log(fields);
        console.log('received files:');
        console.log(files);
        res.redirect(303, '/thank-you');
    });
});

app.get('/', (req, res) => res.render(
    'home',
    { dayQuote: dayQuote.getDayQuote() }
));


app.get('/about', (req, res) => res.render(
    'about',
    { pageTestScript: '/tests/tests-about.js' }
));


app.get('/jtest', function (req, res) {
    res.render('jquery-test', {});
});

app.get('/nursery-rhyme', function (req, res) {
    res.render('nursery-rhyme');
});

app.get('/data/nursery-rhyme', function (req, res) {
    res.json({
        animal: 'squirrel',
        bodyPart: 'tail',
        adjective: 'bushy',
        noun: 'heck',
    });
});

app.use((req, res) => {
    res.status(404);
    res.render(
        '404',
        { layout: null });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500);
    res.render(
        '500',
        { layout: null });
});

app.listen(port, () =>
    console.log('Server started on http://localhost:%s; press Ctrl-C to terminate.', port)
);

