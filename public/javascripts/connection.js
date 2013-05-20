
var delim = String.fromCharCode(166),
    $status = null,
    $form = null,
    player_name = null,
    server_connected = false,
    game_connected = false,
    socket = null,
    game_socket = null,
    $errorp = null;


window.onbeforeunload = function(e){
    console.log("closing");
    write_status("closing connection...");
    if(server_connected && socket != null){
      socket.close();
    }

    if(game_connected && game_socket != null){
      console.log("desliga o socket de jogo");
      game_socket.close();
    }

}


function start_connection(){

	host = $('#host').val();
  port = $('#port').val();
  player_name = $('#name').val();
  var inc = 0;
    
  $form = $('.container');
  $status = $('#absoluteCenter');
  $errorp = $('#error_panel');

  $errorp.html("");
  $form.hide();
  $status.show();

	//var socket = io.connect('', {'resource': '/chat'});
	 

    if ("WebSocket" in window)
      {
         console.log("WebSocket is supported by your Browser!");
         // Let us open a web socket
         write_status("connecting...");
         console.log("ws://" + host + ":" + port + "/server");
         socket = new WebSocket("ws://" + host + ":" + port + "/server");
         socket.onopen = function()
         {
            server_connected = true;
            //Web Socket is connected, send data using send()
            socket.send("0" + delim + "0" + delim + "1\n");
            write_status("sending preferences...");
         };


         socket.onmessage = function (evt) 
         { 
            var received_msg = evt.data;

            var tokens = received_msg.split(delim);
            console.log('message received: ' + received_msg);
            if(tokens.length == 2)
            {
                game_port = parseInt(tokens[1]);
                if( game_port == -1 )
                {
                    socket.send("0" + delim + "0" + delim + "1\n");
                }else
                {
                    socket.close();
                    start_game_connection(game_port);
                }
            }

           
            
         };
         socket.onclose = function()
         { 
            // websocket is closed.
            server_connected = false;
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

/**
var ID_INFO = 0,
  ID_INFO_PORT = 1,
  ID_INFO_MAP = 2,
  ID_INFO_PLAYER = 3,
  ID_INFO_GAME = 4,
  ID_PLAYER_INFO = 5,
  ID_PLAYER_EXIT = 6,
  ID_INFO_SERVER = 7,
  ID_INFO_GAME_STATUS = 8,
  ID_INFO_GAME_COUNT_PLAYERS = 9,
  ID_INFO_ADD_PLAYER = 10,
  ID_INFO_REMOVE_PLAYER = 11,
  ID_INFO_EXIT = 12,
  ID_UPDATE_PLAYER = 13;

var SERVER_ACCEPTED = 0,
  SERVER_REJECTED = 1;

var ID_ERROR_NAME_DUPLICATE = 0,
  ID_ERROR_INVALID_PARAMS = 1,
  ID_ERROR_CLOSED = 2;

var GAME_STATUS_INIT = 0,
  GAME_STATUS_RUNNING = 1,
  GAME_STATUS_STOPPED = 2,
  GAME_STATUS_BREAK = 3,
  GAME_STATUS_IDLE = 4;
  */

function start_game_connection(port)
{
    console.log('connecting to game in port ' + game_port);
    write_status("connecting to game...");
    //console.log("ws://" + host + ":" + game_port + "/labyrinth");
    game_socket = new WebSocket("ws://" + host + ":" + game_port + "/labyrinth");

    game_socket.onopen = function()
    {
        game_connected = true;
        console.log('ligado ao jogo');
        game_socket.send(ID_PLAYER_INFO.toString() + delim + "0" + delim + "1" + delim + player_name + "\n");

        /*

        lançar ambiente de jogo e iniciar comunicação de jogo
        */
    }

    game_socket.onmessage = function(evt)
    {
        message = evt.data;
        
        console.log('message received from game: ' + message);
        var tokens = message.split(delim);

        switch(parseInt(tokens[0])){
          case ID_INFO_EXIT:
            switch(parseInt(tokens[1])){
              case ID_ERROR_NAME_DUPLICATE:
                write_error("Name Allready in use. Please use another one or retry again");
                break;
              case ID_ERROR_INVALID_PARAMS:
                write_error("Invalid params or invalid communication between client and server. Refresh your browser or try again");
                break;
              case ID_ERROR_CLOSED:
                write_error("Server closed this connection. Try again to connect");
                break;
              default:
                write_error("Unknown error.");
                break;
            }
           
            break;
          case ID_INFO_SERVER:
          console.log("received answer: " + parseInt(tokens[1]));
            if(parseInt(tokens[1]) == 0){
                write_status("Connected to game");
                game_socket.send(ID_INFO_GAME.toString() + "\n");
            }else{
              write_error("Connection rejected. Try again");
              game_socket.close();
              reset();

            }

            break;
          case ID_INFO_GAME_STATUS:
            var game_status = parseInt(tokens[1]),
                player_status = parseInt(tokens[2]),
                info_players = jQuery.parseJSON(tokens[3]);
              console.log("info players received: " + JSON.stringify(info_players));
              console.log("game state : " + game_status + " player status: " + player_status);

              /**----------------------------------------------------------------------------------------------------------------
              aqui fazes alocaçao da informação recebida como determinar se o jogo acabou ou se um existe jogadores novos, etc etc 
              **/


            break;
          case ID_INFO_MAP:
            var map = jQuery.parseJSON(tokens[1]);
            console.log("received map: " + JSON.stringify(map));

            /**----------------------------------------------------------------------------------------------------------------
             aqui recebes o mapa. defines ele no teu ambiente webgl
             **/
            break;
          case ID_UPDATE_PLAYER:
            var name = tokens[1],
                status = parseInt(tokens[2]),
                coords = tokens[3].replace("[", "").replace("]","").split(",");

            /**----------------------------------------------------------------------------------------------------------------
            aqui recebes update de um player , deves verificar se ele existe ,caso nao existe adicionas, fazes update da sua posiçao e do seu estado
            **/
            break;
          default:
            break;
        }
       

        /*

        por fazer tratamento de mensagens que o servidor envia


        */
    }


    game_socket.onclose = function()
    {
      console.log("game connection closed");
      write_error("game connection closed");
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
  game_connected = false;
  $form.show();
  $status.hide();
  $status.html("");
}


function write_error(msg)
{
  if($errorp.html().length == 0){
    $errorp.html(msg);
  }
   
}





function disconnect(){
  if(game_connected){
    game_socket.close();
    reset();
  }
}