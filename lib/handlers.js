var dayQuote = require('./dayQuotes');

exports.home = (req, res) => {
    res.render('home',
        { dayQuote: dayQuote.getDayQuote() }
    );
};

exports.about = (req, res) => {
    res.render('about');
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