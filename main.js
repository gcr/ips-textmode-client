/*
 * main.js -- run this file with node
 */
var ipschat = require('./ips/ipschat'),
    chatclient = require('./lib/client'),
    fs = require('fs'),
    path = require('path'),
    ips = require('./ips/ips'),

    stdin = process.openStdin(),
    stdout = process.stdout,
    stdio = process.binding("stdio"),

    PLUGIN_DIR="plugins";

function startup(user,pass) {
  // Once we start up, log in to the forum.
  console.log("\n       Logging in...");
  ips.ipsLogin(
    'http://board.iamlights.com/', user, pass,
    function(error, ipsconnect) {
      if (error) { return console.log(error); }
      console.log("       Joining chat...");
      // Once we log in, join the chat.
      ipschat.ipsChatLogin(
        ipsconnect, function(error, chat) {
          if(error) { return console.log(error.stack); }
          console.log("");
          //console.log("* Joined! Loading plugins...");

          var client = new chatclient.Client(chat);

          // Once we join the chat, load plugins.
          var files = fs.readdirSync(PLUGIN_DIR);
          for (var i=0,l=files.length; i<l; i++) {
            // allow two types of plugins
            // plugin/foo.js
            // plugin/foo/foo.js
            var plugin=null;
            if (files[i].match(/\.js$/)) {
              //console.log("   - " + files[i] + "...");
              plugin = require('./'+PLUGIN_DIR+'/'+path.basename(files[i],'.js'));
            } else if (
              fs.statSync('./'+PLUGIN_DIR+'/'+files[i]).isDirectory() &&
                path.existsSync(['.',PLUGIN_DIR,files[i],files[i]+'.js'].join('/'))) {
              //console.log("   - " + files[i] + "...");
              plugin = require(['.',PLUGIN_DIR,files[i],files[i]].join('/'));
            }
            if (plugin !== null && typeof plugin.init == 'function') {
              plugin.init(chat, client);
            }
          }
          // load plugins
        });
    });

}

function read(secure, prompt, cb) {
  stdio.setRawMode(true);

  stdout.write(prompt);
  var password = "";
  stdin.on("data", function foo(c) {
             c = c + "";
             switch (c) {
             case "\n": case "\r": case "\u0004":
               stdio.setRawMode(false);
               stdout.write("\n");
               stdin.removeListener('data', foo);
               cb(password);
               break;
             case "\u0003":
               process.exit();
               break;
             default:
               password += c;
               if (!secure) {
                 stdout.write(c);
               }
               break;
             }
           });
}

read(false, "User: ", function(user) {
       read(true, "Pass: ", function(pass) {
              startup(user,pass);
            });
     });