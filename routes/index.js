
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};


/*
 * GET users listing.
 */

exports.connect = function(req, res) {
	res.render('connect', { title: 'Connection to server'});
};


