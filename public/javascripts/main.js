
var socket;


function start_connection(){

	var host = $('#host').val(),
		port = $('#port').val(),
        inc = 0,
        delim = String.fromCharCode(166);
	
	//var socket = io.connect('', {'resource': '/chat'});
	 var loginurl = "";
    var pathname = document.location.pathname;
    var lastdot = pathname.lastIndexOf("/");
    if (lastdot > 1) {
        loginurl = pathname.substr(1, lastdot);
    }



    if ("WebSocket" in window)
      {
         console.log("WebSocket is supported by your Browser!");
         // Let us open a web socket
         var ws = new WebSocket("ws://" + host + ":" + port + "/labyrinth");
         ws.onopen = function()
         {
            // Web Socket is connected, send data using send()
            ws.send("9" + delim + "0" + delim + "0\n");
            console.log("Message is sent...");
         };
         ws.onmessage = function (evt) 
         { 
            var received_msg = evt.data;
            console.log('message received: ' + received_msg);
            if(inc < 1)
            {
                ws.send("0" + delim + "0" + delim + "0\n");
                inc++;
            }
            
         };
         ws.onclose = function()
         { 
            // websocket is closed.
            console.log("Connection is closed..."); 
         };
      }
      else
      {
         // The browser doesn't support WebSocket
         console.log("WebSocket NOT supported by your Browser!");
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