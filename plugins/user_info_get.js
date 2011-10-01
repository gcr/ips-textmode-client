var xml2js = require('xml2js');
var child_process = require('child_process');

var BROWSER = "chromium";

exports.init = function(chat, client){

  function getUserInfo(id, cb) {
    chat.boardGet({
                    app: 'members',
                    secure_key: chat.secureHash,
                    module: 'ajax',
                    section: 'card',
                    mid: id
                  })
      .on('response', function(res) {
            var body = '';
            res.on('data', function(b) { body += b; });
            res.on('end', function(end) {
                     parse(body, function(res) {
                             cb(res);
                           });
                   });
          })
      .end();
  }

  function parse(xml, cb) {
    var parser = new xml2js.Parser();
    parser.on('end', cb);
    parser.parseString(xml);
  }

  function getChatId(name) {
    name = name.toLowerCase();
    for (var un in chat.users) {
      if (chat.users.hasOwnProperty(un) &&  name == un.toLowerCase()) {
        return chat.users[un].forumId;
      }
    }
    return false;
  }


  client.addCommand(
    "user_info",
    function(line) {
      var id = getChatId(line);
      if (id) {
        getUserInfo(
          id,
          function(res) {
            client.display.debug(
              "   "+res.h3.a["#"],
              // Active posts:
              res.div.div.dl.dt[1]+" "+res.div.div.dl.dd[1]["#"],
              // Joined:
              res.div.div.dl.dt[2]+" "+res.div.div.dl.dd[2]
            );
          });
        client.display.refreshLine();
      } else {
        client.display.debug("No info on "+line+" (we only get info if they joined during your session)");
      }
    });

  client.addCommand(
    "user_profile",
    function(line) {
      var id = getChatId(line);
      if (id) {
        getUserInfo(
          id,
          function(res) {
            child_process.spawn(BROWSER, [res.h3.a["@"]["href"]]);
            client.display.debug("Opening "+res.h3.a["#"]+"'s profile page...");
          });
        client.display.refreshLine();
      } else {
        client.display.debug("No info on "+line+" (we only get info if they joined during your session)");
    }
    });

};