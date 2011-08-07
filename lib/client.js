var rl = require('./alt_readline');
var disp = require('./display_administrivia');

function startsWith(str, x) {
  return str.toLowerCase().slice(0,x.length) == x.toLowerCase();
}

function pickCase(word, target) {
  var smallword = word.slice(0,target.length);
  if (smallword == target) {
    return word;
  } else if (target.toLowerCase() == target) {
    return word.toLowerCase();
  } else if (target.toUpperCase() == target) {
    return word.toUpperCase();
  } else {
    return word;
  }
}


function Client(chat) {
  this.completers = [];
  this.messageDisplayHooks = [];
  this.chat = chat;
  var self = this;
  this.intr = rl.createInterface(process.stdin, process.stdout,
                                 function(line) {
                                   return self.complete(line);
                                 });

  var display = new disp.Display(this.intr);
  this.display = display;


  this.intr.on('line', function(line) {
                 return self.outgoingMsg(line);
               });

  this.intr.on('attemptClose', function(){
                 chat.leave();
                 display.out("Bye...");
                 setTimeout(function(){process.exit(0);}, 500);
               });


  chat.on('message', function(message,username) {
            return self.incomingMsg(message,username);
          });
  chat.on('system_message', function(msg) {
            return display.systemMessage(msg);
          });
  chat.on('user_enter', function(username) {
            return display.userEnter(username);
          });
  chat.on('user_exit', function(username) {
            return display.userExit(username);
          });
  chat.on('debug', function() {
            return display.userExit.debug(
              Array.prototype.slice.call(arguments));
          });

}

Client.prototype.addCompleter = function(c) {
  this.completers.push(c);
}

Client.prototype.complete = function(line) {
  var words = line.split(" "),
  lastWord = words[words.length-1].replace(/@/g, "");
  var possibleCompletions = [];
  for (var i=0,l=this.completers.length; i<l; i++) {
    if (typeof this.completers[i] == "string") {
      possibleCompletions.push(this.completers[i]);
    } else {
      possibleCompletions.push.apply(possibleCompletions,
                                     this.completers[i](lastWord));
    }
  }

  possibleCompletions = possibleCompletions
    .filter(function(x) {
              return startsWith(x, lastWord);
            })
    .map(function(word) {
           return pickCase(word, lastWord);
         });

  return [possibleCompletions, lastWord];
}

Client.prototype.addDisplayHook = function(hook) {
  this.messageDisplayHooks.push(hook);
}

Client.prototype.incomingMsg = function(msg, username) {
  // Display the message
  var nhooks = this.messageDisplayHooks.length;
  var self = this;
  // Pass msg through each hook, sending it at the end of the chain.
  // Each hook should accept the message and the rest of the action in
  // CPS
  function nextHookOrSend(i, msg) {
    if (i < nhooks) {
      self.messageDisplayHooks[i](msg, function(msg){
                                    nextHookOrSend(i+1,msg);
                                  });
    } else {
      self.display.message(msg, username);
    }
  }
  nextHookOrSend(0, msg);

}

Client.prototype.outgoingMsg = function(line) {
  // Send the message
  if (line.length) {
    this.chat.say(line);
  } else {
    this.display.out("");
  }
  this.display.refreshLine();
}

exports.Client = Client;

