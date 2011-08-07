exports.init = function(chat, client) {
  client.addCompleter(function(word) {
                        if (word[0] == "/") {
                          var commands = [];
                          for (c in client.commands) {
                            if (client.commands.hasOwnProperty(c)) {
                              commands.push("/"+c);
                            }
                          }
                          return commands;
                        } else {
                          return [];
                        }
                      });
};