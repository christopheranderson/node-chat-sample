
module.exports = function(chat) {
  chat.on('connection', function(socket) {
    var currMsg = 0;
    console.log("Connected");
    // Check for logon
    if(!socket.handshake.session && !socket.handshake.session.user) {
      socket.emit('message', {from: "Error", text: "You're not logged in. Please login and then refresh the page."})
      socket.volatile.emit('status', {text: "You're disconnected.", type: "disconnect"});
    }

    // Test message
    socket.emit('message', {from: "Admin", text: messages[currMsg++]});

    socket.on('new-message', function(message) {
      console.log("New Message:" + JSON.stringify(message));

      // Check for slash command
      if(message.text && message.text.indexOf('/') === 0) {
        return slashCommand(message.text, socket);
      }

      //Process message
      message.from = socket.handshake.session.user.name;
      socket.broadcast.emit(message);

      // Auto respond
      if(currMsg < messages.length){
        console.log("Sending message");
        socket.volatile.emit('status', {text: "Admin is typing...", type: "typing"});
        setTimeout(function(){
          socket.emit('message', {from: "Admin", text: messages[currMsg++]});
          socket.emit('status', {text: false, type: "typing"});

          if(currMsg >= messages.length) {
            socket.emit('status', {text: "Admin has disconnected", type: "disconnect"});
          }
        }, 2000);
      }

      if(currMsg >= messages.length) {
        socket.emit('status', {text: "Admin has disconnected"});
      }
    });
  });
}

var testInterval = null;

var slashCommand = function(text, socket) {
  var commands = text.split(' ');

  switch(commands[0]) {
    case '/test':
      switch (commands[1]) {
        case 'start':
          if(testInterval) return;
          testInterval = setInterval(function(){
            socket.emit('message', {from: "Admin", text: "test" + Math.random()})
          }, commands.length === 3 ? parseInt(commands[2]) || 500 : 500);
          socket.emit('status', {text: "Test started: type /test end to stop", type: "command"});
          break;
        case 'stop':
        case 'end':
          if(!testInterval) return;
          clearInterval(testInterval);
          delete testInterval;
          socket.emit('status', {text: "Test ended!", type: "command"});
          break;
        default:
          socket.emit('status', {text: "Test command syntax: /test {start|end}", type: "error"});
          break;
      }
      break; // '/test' case
    default:
      socket.emit('status', {text: "Unknown Command: " + commands.join(' '), type: "error"});
  }
}

var messages = [
  "Hi, my name is Admin. How are you doing today?",
  "How can I help you today?",
  "That's unfortunate; how long have you been experiencing the issues?",
  "Have you tried any self help methods to allieviate the issue?",
  "Ok, well let's start with turning it on and off again; let me know when that's finished.",
  "Great, glad that helped. Have a nice day!"
]
