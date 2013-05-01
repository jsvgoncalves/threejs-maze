
/*
 * GET users listing.
 */

var net;
var delim = String.fromCharCode(166);
exports.list =  function(req, res){
  res.send("respond with a resource");
};


exports.connect = function(req, res){
  res.render('connect', { title: 'Connection to server'});
};



exports.start_connection = function(req,res){
	net = require('net');
	if(req.body.name == null || req.body.port == null || req.body.host == null)
	{
		return res.render('connect', { title: 'Please fullfill all parameters'});
	}



	var client = net.connect({port: req.body.port, host: req.body.host},
	    function() { //'connect' listener
	  console.log('client connected');
	  var message = 0 + delim+ 0 + delim + 0 + "\n";	
	  client.write(message);
	  res.render('connect', { title: 'Connected'});
	});
	client.on('data', function(data) {
	  console.log(data.toString());
	  client.end();
	});
	client.on('end', function() {
	  console.log('client disconnected');
	});

};