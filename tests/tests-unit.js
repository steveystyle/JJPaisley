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

    test('getDayQuote() should return string', function () {

        expect(typeof dayQuote.getDayQuote() === 'string');
    });

    test('getDayQuote() should return a quote from array at index equal to the day of the week number', function () {

        expect(dayQuotesExpected).to.contain(dayQuote.getDayQuote());
    });

});
