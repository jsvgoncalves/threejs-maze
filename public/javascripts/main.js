
/*socket,
game_socket,
game_port,
host,
port,
status = $('#absoluteCenter'),
form,*/
var delim = String.fromCharCode(166),
    $status = null,
    $form = null,
    game_started = false;


function start_connection(){

	host = $('#host').val();
  port = $('#port').val();
  var inc = 0;
    
  $form = $('.container');
  $status = $('#absoluteCenter');


  $form.hide();
  $status.show();

   
	
	//var socket = io.connect('', {'resource': '/chat'});
	 
    



    if ("WebSocket" in window)
      {
         console.log("WebSocket is supported by your Browser!");
         // Let us open a web socket
         write_status("connecting...");
         console.log("ws://" + host + ":" + port + "/server");
         var ws = new WebSocket("ws://" + host + ":" + port + "/server");
         ws.onopen = function()
         {
            //Web Socket is connected, send data using send()
            ws.send("0" + delim + "0" + delim + "0\n");
            write_status("sending preferences...");
         };


         ws.onmessage = function (evt) 
         { 
            var received_msg = evt.data;

            var tokens = received_msg.split(delim);
            console.log('message received: ' + received_msg);
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

            
            /*if(inc < 1)
            {
                ws.send("0" + delim + "0" + delim + "0\n");
                inc++;
            }*/
            
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
         reset();
         console.log("WebSocket NOT supported by your Browser!");
         
         if(!game_started){
          reset();
         }
      }


}


function start_game_connection(port)
{
    console.log('connecting to game in port ' + game_port);
    write_status("connecting to game...");
    //console.log("ws://" + host + ":" + game_port + "/labyrinth");
    game_socket = new WebSocket("ws://" + host + ":" + game_port + "/labyrinth");

    game_socket.onopen = function()
    {
        game_started = true;
        console.log('ligado ao jogo');
        game_socket.send("5" + delim + "0" + delim + "0" + delim + "testes\n");

        /*

        lançar ambiente de jogo e iniciar comunicação de jogo
        */
    }

    game_socket.onmessage = function(evt)
    {
        message = evt.data;
        write_status("Connected to game");
        console.log('message received game: ' + message);
        /*

        por fazer tratamento de mensagens que o servidor envia


        */
    }


    game_socket.onclose = function()
    {
      console.log("game connection closed");
      reset();
        /*
            por fazer fechar ambiente de jogo e voltar para o menu de ligaçao. 

        */
    }

}



function write_status(message){
  $status.html(message);
}

function reset(){
  $form.show();
  $status.hide();
  $status.html("");
  game_started = false;
}