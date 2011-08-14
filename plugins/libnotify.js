var child_process = require('child_process');

function sendNotification(title, body) {
  body = (body || "")
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  //.replace(/\"/g, '&quot;') // vim fails at syntax hilighting"
  //.replace(/\'/g, "&#39;"); // '
  child_process.spawn('notify-send', [title, body||""]);
}

exports.init = function(chat,client) {

  var notifyEnabled = "only_enter_exit"; //true;

  function messageIsImportant(msg) {
    return msg.match(/gcr|blank/gi);
  }

  chat.on('message', function(msg, username, uid, timestamp) {
            if (uid == chat.userId || !chat.settled) { return; } // ignore self
            if (notifyEnabled === true ||
                (notifyEnabled=="only_enter_exit" && messageIsImportant(msg))) {
                  sendNotification(username+":", msg);
                }
          });
  chat.on('user_enter', function(username, uid, timestamp) {
            if (uid == chat.userId || !chat.settled) { return; } // ignore self
            if (!notifyEnabled) {return;}
            sendNotification("Join: "+username);
          });
  chat.on('user_exit', function(username, uid, timestamp) {
            if (uid == chat.userId || !chat.settled) { return; } // ignore self
            if (!notifyEnabled) {return;}
            sendNotification("Part: "+username);
          });

  client.addCommand("notify_all", function(line) {
                      notifyEnabled = true;
                      client.display.debug("Notifications are now always on");
                    });
  client.addCommand("notify_disabled", function(line) {
                      notifyEnabled = false;
                      client.display.debug("Notifications are now off");
                    });
  client.addCommand("notify_only_joins_and_parts", function(line) {
                      notifyEnabled = "only_enter_exit";
                      client.display.debug("Notifications only for enters and exits");
                    });
};