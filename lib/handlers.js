var dayQuote = require('./dayQuotes');
// slightly modified version of the official W3C HTML5 email regex:
// https://html.spec.whatwg.org/multipage/forms.html#valid-e-mail-address
const VALID_EMAIL_REGEX = new RegExp('^[a-zA-Z0-9.!#$%&\'*+\/=?^_`{|}~-]+@' +
    '[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?' +
    '(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$');

const pathUtils = require('path');
const fs = require('fs');

const dataDir = pathUtils.resolve(__dirname, '..', 'data');
const vacationPhotosDir = pathUtils.join(dataDir, 'vacation-photos');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
if (!fs.existsSync(vacationPhotosDir)) fs.mkdirSync(vacationPhotosDir);


function saveContestEntry(contestName, email, year, month, photoPath) {
    // TODO...this will come later
}


const { promisify } = require('util');
const mkdir = promisify(fs.mkdir);
const rename = promisify(fs.rename);



//this will be used for uploading reviews and limiting the amount of posts (to stop spam bloat attacks)
class NewsletterSignup {
    constructor({ name, email }) {
        this.name = name;
        this.email = email;
    }
    async save() {
    }
}

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

exports.newsletter = {
    Signup: (req, res) => {
        res.render(
            'newsletter-signup',
            { csrf: 'CSRF token goes here' }
        );
    },
    Process: (req, res) => {
        const name = req.body.name || '', email = req.body.email || '';
        if (!VALID_EMAIL_REGEX.test(email)) {
            req.session.flash = {
                type: 'danger',
                intro: 'Validation error!',
                message: 'The email address you entered was not valid.',
            };
            return res.redirect(
                303,
                '/newsletter-signup'
            );
        }
        new NewsletterSignup({ name, email }).save()
            .then(() => {
                req.session.flash = {
                    type: 'success',
                    intro: 'Thank you!',
                    message: 'You have now been signed up for the newsletter.',
                };
                return res.redirect(
                    303,
                    '/newsletter-archive'
                );
            })
            .catch(err => {
                req.session.flash = {
                    type: 'danger',
                    intro: 'Database error!',
                    message: 'There was a database error; please try again later.',
                };
                console.log('Upload Error: ', err);
                return res.redirect(
                    303,
                    //this should redirect to signup
                    '/newsletter-archive'
                );
            });

        console.log('CSRF token (from hidden form field): ' + req.body._csrf);
        console.log('Name (from visible form field): ' + req.body.name);
        console.log('Email (from visible form field): ' + req.body.email);
    },
    ThankYou: (req, res) => {
        res.render(
            'newsletter-signup-thank-you'
        );
    },
    Archive: (req, res) => {
        res.render(
            'newsletter-archive'
        );
    }
};

exports.vacationPhoto = {
    Contest: (req, res) => {
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

exports.ajax = {
    newsletter: (req, res) => {
        res.render(
            'newsletter',
            { csrf: 'CSRF token goes here' }
        );
    },
    vacationPhotoContest: (req, res) => {
        const now = new Date();
        res.render(
            'contest/vacation-photo-ajax',
            {
                year: now.getFullYear(), month: now.getMonth()
            }
        );
    }
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
    vacationPhotoContest: async (req, res, fields, files) => {
        const photo = files.photo[0];
        const dir = vacationPhotosDir + '/' + Date.now();
        const path = dir + '/' + photo.originalFilename;
        await mkdir(dir);
        await rename(photo.path, path);
        saveContestEntry('vacation-photo', fields.email,
            req.params.year, req.params.month, path);
        console.log('field data: ', fields);
        console.log('files: ', files);
        res.send({ result: 'success' });
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