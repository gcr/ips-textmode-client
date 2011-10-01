var child_process = require('child_process');
var imgpost = require('./image_post');


exports.init = function(chat,client) {

  var notifyEnabled = "only_enter_exit"; //true;

  client.addCommand("antileak",
                    function(line) {
                      chat.say(imgpost.buildImageForge(
                                 "http://img405.imageshack.us/img405/2553/antileak.jpg",
                                 301, 315
                               ), function(){
                                 chat.say(
                                   imgpost.buildColor("red", "R E S I S T"),
                                   function(){}, false);
                               }, false);
                    });
};
