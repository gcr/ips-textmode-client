exports.init = function(chat, client) {
  client.addCompleter(function tab_compl(x){
                        results = [];
                        for (var k in chat.users) {
                          if (chat.users.hasOwnProperty(k)) {
                            results.push(k);
                          }
                        }
                        return results;
                      });
};