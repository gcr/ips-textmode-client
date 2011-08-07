/*
 * main.js -- run this file with node
 */
var child_process = require('child_process'),
    ipschat = require('./ips/ipschat'),
    fs = require('fs'),
    path = require('path'),
    display = require('./display'),
    ips = require('./ips/ips');

// Log in and load plugins
var login = JSON.parse(fs.readFileSync('./passwd').toString().trim());
var global_chat = null;

function tab_compl(x){
  if (global_chat != null) {
    results = [];
    for (var k in global_chat.users) {
      if (global_chat.users.hasOwnProperty(k)) {
        results.push(k);
      }
    }
    return results;
  } else {
    return [];
  }
}
var scr = display.display(tab_compl);
scr.out("* Logging in "+login.user);

// Once we start up, log in to the forum.
ips.ipsLogin('http://board.iamlights.com/', login.user, login.pass,
  function(error, ipsconnect) {
    if (error) { return console.log(error); }
    scr.out("* Joining chat...");
    // Once we log in, join the chat.
    ipschat.ipsChatLogin(ipsconnect, function(error, chat) {
      global_chat = chat;
      if(error) { return console.log(error); }
          startup(chat);
      });
  });




function startup(chat) {
  // LEAVING -----------
  scr.on('attemptClose', function() {
      chat.leave();
      scr.out("Bye...");
      setTimeout(function(){process.exit(0);}, 500);
    });

  // OUTPUT ------------
  // colored output! :3
  function color(col) {
    // returns a function that wraps text in a certain color
    return function(text) {
      return "\x1b["+col+"m"+text+"\x1b[0m";
    };
  }

  // some common colors
  var black = color('1;30'),
      blue = color("1;34"),
      white = color("1;37");

  // format a date with great justice
  function formatDate() {
    var d = new Date();
    return "00".substr((""+d.getHours()).length)+
            d.getHours() +
            ":" +
            "00".substr((""+d.getMinutes()).length)+
            d.getMinutes();
  }

  var attn = "  ";//"  "+blue("-")+white("!")+blue("-")+"  "; // -!-

  chat.on('message', function(message, username) {
            scr.out(black(formatDate()+"  "+username+": ")+message
                    .replace(/gcr|blank/gi, white("$&")));
    });
  chat.on('system_message', function(msg) {
            scr.out(black(formatDate())+attn+blue(msg));
    });
  // chat.on('user_noticed', function(username) {
  //           scr.out(black(formatDate())+attn+blue("just noticed "+username));
  //   });
  chat.on('user_enter', function(username) {
            scr.out(black(formatDate())+attn+blue(username+" joined"));
    });
  // chat.on('settled', function() {
  //           scr.out(black(formatDate())+attn+blue("Joined."));
  //  });
  chat.on('user_exit', function(username) {
            scr.out(black(formatDate())+attn+blue(username+" left"));
    });
  chat.on('debug', function() {
            scr.out.apply(this, [black(formatDate())+attn]
                    .concat(Array.prototype.slice.call(arguments))
                    .filter(function(x){return typeof x != 'undefined';}));
    });

  function sendNotification(title, body) {
    body = (body || "")
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
      //.replace(/\"/g, '&quot;') // vim fails at syntax hilighting"
      //.replace(/\'/g, "&#39;"); // '
    child_process.spawn('notify-send', [title, body||""]);
  }

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

  scr.on('line', function(line) {
           if (line.length) {
             chat.say(line);
           } else {
             scr.out("");
           }
           scr._refreshLine();
         });

  scr.on('SIGINT', function(){});

  scr.setPrompt(black("       > "), 9);

};