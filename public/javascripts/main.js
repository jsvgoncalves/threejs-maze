
var socket;


function start_connection(){

	var host = $('#host').val(),
		port = $('#port').val();
	
	//var socket = io.connect('', {'resource': '/chat'});
	 var loginurl = "";
    var pathname = document.location.pathname;
    var lastdot = pathname.lastIndexOf("/");
    if (lastdot > 1) {
        loginurl = pathname.substr(1, lastdot);
    }
    alert('login url' + loginurl);
    //loginurl + 'labyrinth'  
    var socket = io.connect('ws://' + host + ':' + port, {'resource':'labyrinth'});

    socket.on('error', function(e){
    	alert('error:' + e);
    });
    
    socket.on('chat', function(data){
        alert('resposta recebidac: ' + data);
    });




    




	socket.on('connect', function () {
      
		alert('connected');

        socket.emit('chat', 'lol\n');
		socket.on('disconnect', function () {
	        alert('DISCONNESSO!!! ');
	        
        });


    });





}