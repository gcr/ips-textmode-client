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
      cc(text);
    });
};