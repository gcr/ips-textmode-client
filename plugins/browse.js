var child_process = require('child_process');
var BROWSER="chromium-browser";

exports.init = function(chat, client) {

  // This plugin provides a command you can use to browse and visit
  // the last URL someone sent.

  var last_url = "";

  var exp = /(\b(https?|ftp|file):\/\/([^<>\"\s]+|[a-z0-9/\._\- !&\#;,%\+\?:=]+))/ig;
  chat.on('message', function(msg,username,uid) {
            //if (!chat.settled || uid == chat.userId) { return; }
            if (msg.match(exp)) {
              last_url = msg.match(exp)[0];
            }
          });

  client.addCommand("browse", function(){
                      child_process.spawn(BROWSER, [last_url]);
                      client.display.refreshLine();
                    });

};