  var socket = io();

    $.post("/access_game", {}, function(result){
	    	var tk = JSON.parse(result);
	            $("#duzydiv").append( "POŁĄCZONO, WEWNĘTRZNY TOKEN GRY:");
	            $("#duzydiv").append(tk.token);
	            $("#duzydiv").append("<br>");
		    console.log(tk.token);
		    socket.emit('hi', tk.token);
  socket.on('msg', function(msg){
	  var msg2 = JSON.parse(msg);
	  if(msg2.type == "server")
	  {
	            $("#duzydiv").append("<b>");
	  }
	            $("#duzydiv").append(msg2.message.info);
		if(msg2.type == "server")
	  {
	            $("#duzydiv").append("</b>");
	  }
	            $("#duzydiv").append("<br>");
	        });
		        });

