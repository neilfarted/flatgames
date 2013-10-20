/*
 * GET home page.
 */

exports.index = function(req, res){
    res.render('index', { title: 'Flat Games Simulator 5000' });
};

exports.mock = function(req, res){
    res.render('mock', { title: 'Flat Games Simulator 5000' });
};

exports.partials = function(req, res){
    var name = req.params.name;
    res.render('partials/' + name);
};