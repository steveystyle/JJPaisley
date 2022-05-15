const express = require('express');
const expressHandlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const multiparty = require('multiparty');
const port = process.env.PORT || 3000;
const { credentials } = require('./config');
const app = express();

const handlers = require('./lib/handlers');
const weatherMiddlware = require('./lib/middleware/weather');

app.engine('handlebars', expressHandlebars.engine({
    defaultLayout: 'main',
    helpers: {
        section: function (name, options) {
            if (!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser(credentials.cookieSecret));
app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: credentials.cookieSecret,
}));

app.use(express.static(__dirname + '/public'));

app.use(weatherMiddlware);

app.disable('x-powered-by');

app.get('/', handlers.home);
app.get('/about', handlers.about);

app.get('/newsletter-signup', handlers.newsletterSignup.Home);
app.post('/newsletter-signup/process', handlers.newsletterSignup.Process);
app.get('/newsletter-signup/thank-you', handlers.newsletterSignup.ThankYou);

app.get('/newsletter', handlers.newsletter);
app.post('/api/newsletter-signup', handlers.api.newsletterSignup);

app.get('/contest/vacation-photo', handlers.vacationPhotoContest.Home);
app.post('/contest/vacation-photo/:year/:month', (req, res) => {
    const form = new multiparty.Form();
    form.parse(req, (err, fields, files) => {
        if (err) return handlers.vacationPhotoContest.ProcessError(req, res, err.message);
        console.log('got fields: ', fields);
        console.log('and files: ', files);
        handlers.vacationPhotoContest.Process(req, res, fields, files);
    });
});
app.get('/contest/vacation-photo-thank-you', handlers.vacationPhotoContest.ProcessThankYou);

app.get('/contest/vacation-photo-ajax', handlers.vacationPhotoContestAjax);
app.post('/api/vacation-photo-contest/:year/:month', (req, res) => {
    const form = new multiparty.Form();
    form.parse(req, (err, fields, files) => {
        if (err) return handlers.api.vacationPhotoContestError(req, res, err.message);
        handlers.api.vacationPhotoContest(req, res, fields, files);
    });
});

app.use(handlers.notFound);
app.use(handlers.serverError);

if (require.main === module) {
    app.listen(port, () => {
        console.log('Server started on http://localhost:%s; press Ctrl-C to terminate.', port);
    });
} else {
    module.exports = app;
}