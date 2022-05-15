module.exports = (req, res, next) => {
    res.locals.flash = req.session.flash;
    console.log("THISSSS",res.locals.flash);
    delete req.session.flash;
    next();
};