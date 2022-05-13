var dayQuote = require('../lib/dayQuotes.js');
var expect = require('chai').expect;

suite('Day Quote tests', function () {
    var dayQuotesExpected = [
        "It's Sunday.",
        "It's Monday.",
        "It's Tuesday.",
        "It's Wednesday.",
        "It's Thursday.",
        "It's Friday.",
        "It's Saturday.",
    ];

    test('getDayQuote() should return a quote based on current day of the week', function () {
        expect(typeof dayQuote.getDayQuote() === 'string');
        expect(dayQuotesExpected).to.contain(dayQuote.getDayQuote());
    });

});
