const express = require('express');
const expressHandlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const multiparty = require('multiparty');
const nodemailer = require('nodemailer');
const port = process.env.PORT || 3000;
const { credentials } = require('./config');
const morgan = require('morgan');
const fs = require('fs');
const cluster = require('cluster');

const app = express();
switch (app.get('env')) {
    case 'development':
        app.use(morgan('dev'));
        break;
    case 'production':
        const stream = fs.createWriteStream(__dirname + '/access.log',
            { flags: 'a' });
        app.use(morgan('combined', { stream }));
        break;
}

app.use((req, res, next) => {
  if(cluster.isWorker)
    console.log(`Worker ${cluster.worker.id} received request`);
  next();
});

const handlers = require('./lib/handlers');
const weatherMiddlware = require('./lib/middleware/weather');
const flashMiddleware = require('./lib/middleware/flash');

//to return an email confirmation of uploaded review
const mailTransport = nodemailer.createTransport({
    auth: {
        user: credentials.sendgrid.user,
        pass: credentials.sendgrid.password,
    }
});



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
app.use(flashMiddleware);

app.disable('x-powered-by');

app.get('/', handlers.home);
app.get('/about', handlers.about);

app.get('/newsletter-signup', handlers.newsletter.Signup);
app.post('/newsletter-signup/process', handlers.newsletter.Process);
app.get('/newsletter-signup/thank-you', handlers.newsletter.ThankYou);
app.get('/newsletter-archive', handlers.newsletter.Archive);

app.get('/contest/vacation-photo', handlers.vacationPhoto.Contest);
app.post('/contest/vacation-photo/:year/:month', (req, res) => {
    const form = new multiparty.Form();
    form.parse(req, (err, fields, files) => {
        if (err) return handlers.vacationPhoto.ProcessError(req, res, err.message);
        console.log('got fields: ', fields);
        console.log('and files: ', files);
        handlers.vacationPhoto.Process(req, res, fields, files);
    });
});
app.get('/contest/vacation-photo-thank-you', handlers.vacationPhoto.ProcessThankYou);

app.get('/newsletter', handlers.ajax.newsletter);
app.post('/api/newsletter-signup', handlers.api.newsletterSignup);

app.get('/contest/vacation-photo-ajax', handlers.ajax.vacationPhotoContest);
app.post('/api/vacation-photo-contest/:year/:month', (req, res) => {
    const form = new multiparty.Form();
    form.parse(req, (err, fields, files) => {
        if (err) return handlers.api.vacationPhotoContestError(req, res, err.message);
        handlers.api.vacationPhotoContest(req, res, fields, files);
    });
});

app.use(handlers.notFound);
app.use(handlers.serverError);

function startServer(port) {
    app.listen(port, function () {
        console.log(
            'Server started in %s mode at http://localhost:%s; press Ctrl-C to terminate.',
            app.get('env'),
            port);
    });
}

if (require.main === module) {
    startServer(port);
} else {
    module.exports = {app, startServer};
}