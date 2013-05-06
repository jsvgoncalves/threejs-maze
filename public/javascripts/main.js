
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



    if ("WebSocket" in window)
      {
         alert("WebSocket is supported by your Browser!");
         // Let us open a web socket
         var ws = new WebSocket("ws://" + host + ":" + port + "/labyrinth");
         ws.onopen = function()
         {
            // Web Socket is connected, send data using send()
            ws.send("Message to send");
            alert("Message is sent...");
         };
         ws.onmessage = function (evt) 
         { 
            var received_msg = evt.data;
            alert(received_msg);
         };
         ws.onclose = function()
         { 
            // websocket is closed.
            alert("Connection is closed..."); 
         };
      }
      else
      {
         // The browser doesn't support WebSocket
         alert("WebSocket NOT supported by your Browser!");
      }



    //alert('login url' + loginurl);
    //loginurl + 'labyrinth'  
    /*var socket = io.connect('ws://' + host + ':' + port, {'resource':'labyrinth'});

    socket.on('error', function(e){
    	console.log('error:' + e);
    });
    
    socket.on('chat', function(data){
        console.log('resposta recebidac: ' + data);
    });




    




	socket.on('connect', function () {
      
		console.log('connected');

        socket.emit('chat', 'lol\n');
		socket.on('disconnect', function (e) {
	        console.log('DISCONNESSO!!! ' + e);
	        socket.disconnect();
        });


    });*/





}