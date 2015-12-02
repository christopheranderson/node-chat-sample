
var Chat = function(host) {
  var chat = io(host);
  var previous = null;

  // Process new message
  $("#chat-form").submit(function(){
    var message = {
      text: $("#chat-message").val()
    };

    handleMessage(message);

    return false;
  });

  chat.on('status', function(status) {
    console.log("Status changed");
    console.log(status);
    if(status.type === 'disconnect') {
      $("#chat-message").prop('disabled', true);
    }
    changeStatus(status);
  })

  chat.on('message', function(message) {
    console.log("message received");
    console.log(message);
    addMessage(message);
  });

  var handleMessage = function(message) {
    // Check for command slash
    if(message.text && message.text.indexOf('/') === 0 && processCommand(message)) {
      $("#chat-message").val('');
      console.log("Local command processed");
      return;
    }

    // Send new message
    chat.emit('new-message', message);
    addMessage(message);

    $("#chat-message").val('');

    console.log("Message sent!");
  }

  var addMessage = function(message) {
    var isUserMessage = !message.from;
    var div;
    if(previous === isUserMessage) {
        div = $('.last-message');
    } else {
      $('.last-message').removeClass('last-message');
      div = $("<div>").addClass('last-message');

      if(isUserMessage) {
        div.addClass('bg-blue margin10 popover marker-on-left user-message');
      }
      else {
        div.addClass('bg-green margin10 popover marker-on-right align-right admin-message')
      }

      $("#chat-container").append(div);
    }
    var messageDiv = $("<div>").addClass('padding10');
    var messageSpan = $("<span>").addClass('chat-message fg-white text-shadow').html(message.text);
    messageDiv.append(messageSpan);
    div.append(messageDiv);

    $("#chat-container").animate({ scrollTop: $('#chat-container').prop("scrollHeight")}, 500);

    previous = isUserMessage;
  }

  var changeStatus = function(status) {
    var text;
    if(!status) {
      text = false;
    }else if(typeof status === typeof "string") {
      text = status;
    } else {
      text = status.text;
    }

    if(text) {
      $("#chat-status").text(text);
    } else {
      $("#chat-status").html("&nbsp");
    }
  }

  var processCommand = function(message) {
    var commands = message.text.split(' ');
    switch (commands[0]) {
      case '/clear':
        switch (commands[1]) {
          case 'messages':
          case 'm':
            $("#chat-container").html('');
            return true;
            break;
          case 'status':
          case 's':
            changeStatus(false);
            return true;
            break;
          default:
            changeStatus("Invalid option; valid options: /clear {(m)essages|(s)tatus}");
        }
        return true;
        break; // /clear
      default:
        return false;
    }
  }
}
