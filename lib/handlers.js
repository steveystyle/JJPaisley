var dayQuote = require('./dayQuotes');

exports.home = (req, res) => {
    res.render(
        'home',
        { dayQuote: dayQuote.getDayQuote() }
    );
};

exports.about = (req, res) => {
    res.render(
        'about'
    );
};

exports.newsletterSignup = {
    Home: (req, res) => {
        res.render(
            'newsletter-signup',
            { csrf: 'CSRF token goes here' }
        );
    },
    Process: (req, res) => {
        console.log('Form (from querystring): ' + req.query.form);
        console.log('CSRF token (from hidden form field): ' + req.body._csrf);
        console.log('Name (from visible form field): ' + req.body.name);
        console.log('Email (from visible form field): ' + req.body.email);
        res.redirect(
            303,
            '/newsletter-signup/thank-you'
        );
    },
    ThankYou: (req, res) => {
        res.render(
            'newsletter-signup-thank-you'
        );
    }
};

exports.vacationPhotoContest = {
    Home: (req, res) => {
        const now = new Date();
        res.render(
            'contest/vacation-photo',
            { year: now.getFullYear(), month: now.getMonth() }
        );
    },
    Process: (req, res, fields, files) => {
        console.log('field data: ', fields);
        console.log('files: ', files);
        res.redirect(
            303,
            '/contest/vacation-photo-thank-you'
        );
    },
    ProcessError: (req, res, fields, files) => {
        res.redirect(
            303,
            '/contest/vacation-photo-error'
        );
    },
    ProcessThankYou: (req, res) => {
        res.render(
            'contest/vacation-photo-thank-you'
        );
    }
};

exports.newsletter = (req, res) => {
    res.render(
        'newsletter',
        { csrf: 'CSRF token goes here' }
    );
};

exports.vacationPhotoContestAjax = (req, res) => {
    const now = new Date();
    res.render(
        'contest/vacation-photo-ajax',
        {
            year: now.getFullYear(), month: now.getMonth()
        }
    );
};

exports.api = {
    newsletterSignup: (req, res) => {
        console.log('CSRF token (from hidden form field): ' + req.body._csrf);
        console.log('Name (from visible form field): ' + req.body.name);
        console.log('Email (from visible form field): ' + req.body.email);
        res.send(
            { result: 'success' }
        );
    },
    vacationPhotoContest: (req, res, fields, files) => {
        console.log('field data: ', fields);
        console.log('files: ', files);
        res.send(
            { result: 'success' }
        );
    },
    vacationPhotoContestError: (req, res, message) => {
        res.send(
            { result: 'error', error: message }
        );
    }
};

exports.notFound = (req, res) => {
    res.render(
        '404',
        { layout: null }
    );
};

exports.serverError = (err, req, res, next) => {
    res.render(
        '500',
        { layout: null }
    );
};