exports.init = function(chat,client) {
  client.addCommand("quit", function(){
                      process.exit(0);
                    });
};