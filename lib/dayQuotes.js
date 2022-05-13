var dayQuotes = [
    "It's Sunday.",
    "It's Monday.",
    "It's Tuesday.",
    "It's Wednesday.",
    "It's Thursday.",
    "It's Friday.",
    "It's Saturday.",
];

exports.getDayQuote = function () {
    return dayQuotes[new Date().getDay()];
};