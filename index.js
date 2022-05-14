const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const handlers = require('./lib/handlers');
const weatherMiddlware = require('./lib/middleware/weather');
const bodyParser = require('body-parser');
//handlebars view engine selected to use default layouts and apply logic to views for efficiency of menu display
const expressHandlebars = require('express-handlebars');
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

app.disable('x-powered-by');

app.use(express.static(__dirname + '/public'));

app.use(weatherMiddlware);

app.get('/', handlers.home);
app.get('/about', handlers.about);
app.get('/newsletter-signup', handlers.newsletterSignup);
app.post('/newsletter-signup/process', handlers.newsletterSignupProcess);
app.get('/newsletter-signup/thank-you', handlers.newsletterSignupThankYou);

app.use(handlers.notFound);
app.use(handlers.serverError);

if (require.main === module) {
    app.listen(port, () =>
        console.log('Server started on http://localhost:%s; press Ctrl-C to terminate.', port)
    );
} else {
    module.exports = app;
}