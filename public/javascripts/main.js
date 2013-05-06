
var socket,
    game_socket,
    game_port,
    host,
    port,
    delim = String.fromCharCode(166);


function start_connection(){

	host = $('#host').val();
  port = $('#port').val();
  var inc = 0;
      
	
	//var socket = io.connect('', {'resource': '/chat'});
	 
    



    if ("WebSocket" in window)
      {
         console.log("WebSocket is supported by your Browser!");
         // Let us open a web socket
         console.log("ws://" + host + ":" + port + "/server");
         var ws = new WebSocket("ws://" + host + ":" + port + "/server");
         ws.onopen = function()
         {
            // Web Socket is connected, send data using send()
            ws.send("0" + delim + "0" + delim + "0\n");
            console.log("sending preferences...");
         };


         ws.onmessage = function (evt) 
         { 
            var received_msg = evt.data;

            var tokens = received_msg.split(delim);

            if(tokens.length == 2)
            {
                game_port = parseInt(tokens[1]);
                if( game_port == -1 )
                {
                    ws.send("0" + delim + "0" + delim + "0\n");
                }else
                {
                    ws.close();
                    start_game_connection(game_port);
                }
            }

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


}


function start_game_connection(port)
{
    console.log("ws://" + host + ":" + game_port + "/labyrinth");
    game_socket = new WebSocket("ws://" + host + ":" + game_port + "/labyrinth");

    game_socket.onopen = function()
    {
        /*

        lançar ambiente de jogo e iniciar comunicação de jogo
        */
    }

    game_socket.onmessage = function(evt)
    {
        message = evt.data;

        /*

        por fazer tratamento de mensagens que o servidor envia


        */
    }


    game_socket.onclose = function()
    {
        /*
            por fazer fechar ambiente de jogo e voltar para o menu de ligaçao. 

        */
    }

}