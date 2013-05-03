
var socket;


function start_connection(){

	var host = $('#host').val(),
		port = $('#port').val();
	var link = 	"ws:" + host + ":" + port + "/chat";
	var socket = io.connect('', {'resource': '/chat'});
	 var loginurl = "";
    var pathname = document.location.pathname;
    var lastdot = pathname.lastIndexOf("/");
    if (lastdot > 1) {
        loginurl = pathname.substr(1, lastdot);
    }

    alert(loginurl + 'chat');

    var socket = io.connect('ws://127.0.0.1:8080', {'resource':loginurl + 'chat'});

    socket.on('error', function(reason){
    	alert('error:' + reason);
    });
    
	
	socket.on('connect', function () {
        /*content.html($('<p>', { text: 'Atmosphere connected using ' + this.socket.transport.name}));
        input.removeAttr('disabled').focus();
        status.text('Choose name:');

        $.each(this.socket.transports, function(index, item) {
            $("#transport").append(new Option(item, item));
        });*/

		alert('connected');
		socket.on('disconnect', function () {
	        console.log('DISCONNESSO!!! ');
	        //count--;
	        //io.sockets.emit('count', {
	          //  number: count
        });
    });





}