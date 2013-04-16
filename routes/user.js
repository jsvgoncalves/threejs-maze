
/*
 * GET users listing.
 */

var net;


exports.list = function(req, res){
  res.send("respond with a resource");
};


exports.connect = function(req, res){


  res.render('connect', { title: 'Connection to server'});
};



exports.start_connection = function(req,res){
	net = require('net');
	var client = net.connect({port: 4000},
	    function() { //'connect' listener
	  console.log('client connected');

	  client.write('world!\r\n');
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