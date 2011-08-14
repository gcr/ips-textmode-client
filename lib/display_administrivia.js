var rl = require('./alt_readline');
var crc32 = require("./crc32").crc32;

// colored output! :3
function color(col) {
  // returns a function that wraps text in a certain color
  return function(text) {
    return "\x1b["+col+"m"+text+"\x1b[0m";
  };
}
exports.color = color;

function pickRandom256color(key, text) {
  // Return text wrapped in a random color chosen by key
  var c = ( Math.abs(crc32(key)) % 256 );
  if (c==0 || c==16 || c==232 || (c > 232 && c < 245)) {
    // solid black or thereabouts
    c = 99;
  }

  return "\x1b[0;38;5;"+c+"m"+text+"\x1b[0m";
}
exports.pickRandom256color = pickRandom256color;

// some common colors
var black = color('1;30'),
    blue = color("1;34"),
    white = color("1;37");

exports.black = black;
exports.blue = blue;
exports.white = white;

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

function Display(intr) {
  this.intr = intr;
  intr.on('SIGINT', function(){});
  intr.setPrompt(black("       > "), 9);
}

Display.prototype.out = function(str) {
  this.intr.out(str);
};
Display.prototype.refreshLine = function() {
  this.intr._refreshLine();
};

Display.prototype.message = function(message, username) {
  function repeat(s, n) { var r=""; for (var a=0;a<n;a++) r+=s; return r;}
  var words = message.split(" ");
  var first = (formatDate()+"  "+username+":");
  var clen = first.length;
  var currentLine = black(formatDate())+"  "+pickRandom256color(username,username)+":";
  // Add words until currentLine exceeds the space available, and then
  // output and wrap.
  while (words.length) {
    var word = words.shift();
    if (clen+1+word.length < rl.columns) {
      currentLine += " "+word;
      clen += 1+word.length;
    } else {
      this.intr.out(currentLine);
      currentLine = repeat(" ",first.length)+" "+word;
      clen = first.length+1+word.length;
    }
  }
  this.intr.out(currentLine);
};

Display.prototype.systemMessage = function(msg) {
  this.intr.out(black(formatDate())+attn+blue(msg));
};
// chat.on('user_noticed', function(username) {
//           scr.out(black(formatDate())+attn+blue("just noticed "+username));
//   });
Display.prototype.userEnter = function(username) {
  this.intr.out(black(formatDate())+attn+pickRandom256color(username,username+" joined"));
};
// chat.on('settled', function() {
//           scr.out(black(formatDate())+attn+blue("Joined."));
//  });
Display.prototype.userExit = function(username) {
  this.intr.out(black(formatDate())+attn+pickRandom256color(username,username+" left"));
};
Display.prototype.debug = function(){
  var args = Array.prototype.slice.call(arguments);
  for (var i=0,l=args.length; i<l; i++) {
    if (typeof args[i] != "undefined") {
      this.intr.out(black("       "+args[i]));
    }
  }
};
exports.Display = Display;