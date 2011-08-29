var term_code = require('../lib/display_administrivia').color;

var underline = term_code("4");
var italic = term_code("1");
var bold = term_code("1");

exports.init = function(chat,client) {

  client.addDisplayHook(
    function(text, cc) {
      // Pulled straight form official_client.js
      text = text.replace( /\[b\](.+?)\[\/b\]/gi, bold("$1") );
      text = text.replace( /\[i\](.+?)\[\/i\]/gi, italic("$1") );
      text = text.replace( /\[u\](.+?)\[\/u\]/gi, underline("$1") );

      // URLs
      text = text.replace(/(\b(https?|ftp|file):\/\/([^<>\"\s]+|[a-z0-9/\._\- !&\#;,%\+\?:=]+))/ig, underline("$1"));

      cc(text);
    });

  var verbatim=false;

  client.addMessageHook(
    function(msg, cc){
      // Now do the reverse, converting *this* into [b]this[/b].
      if (verbatim) { return cc(msg); }
      cc(msg
         .replace(/\*\*(.+?)\*\*/gi, "[b]$1[/b]")
         //.replace(/\/(.+?)\//gi, "[i]$1[/i]")
         //.replace(/\_(.+?)\_/gi, "[u]$1[/u]")
      );
    });

  client.addCommand("say",
                    function(line) {
                      chat.say(line);
                      client.display.refreshLine();
                    });
  client.addCommand("me",
                    function(line) {
                      chat.say("/me "+line);
                      client.display.refreshLine();
                    });
};
