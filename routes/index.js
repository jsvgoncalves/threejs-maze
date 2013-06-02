
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
	// console.log(req.query.ip)
	
	var ip = "127.0.0.1"
	if(req.query.ip != undefined) {
		ip = req.query.ip
	}
	res.render('connect', { title: 'LabyrinthJS', ip: ip});
};


