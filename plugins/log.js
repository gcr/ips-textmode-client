var fs = require('fs');

exports.init = function(chat,client) {

  chat.on('message', function(msg, username, uid, timestamp) {
    // log this message
    fs.open("clientlog.imstyle", "a", function(err,fd) {
              if (err) {
                return;
              }
              var message = new Buffer("<"+username+"> "+msg.replace(/\n/g," ")+"\n");
              fs.write(fd, message, 0, message.length, null, function(err){
                  if (!err) {
                    fs.close(fd);
                  }
              });
          });
      });
};
