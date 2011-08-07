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
  chat.on('message', function(msg, username, uid, timestamp) {
            if (uid == chat.userId || !chat.settled) { return; } // ignore self
            sendNotification(username+":", msg);
          });
  chat.on('user_enter', function(username, uid, timestamp) {
            if (uid == chat.userId || !chat.settled) { return; } // ignore self
            sendNotification("Join: "+username);
          });
  chat.on('user_exit', function(username, uid, timestamp) {
            if (uid == chat.userId || !chat.settled) { return; } // ignore self
            sendNotification("Part: "+username);
          });
};