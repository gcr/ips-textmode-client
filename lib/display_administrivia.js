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
  this.intr.out(black(formatDate()+"  "+username+": ")+message);
};
Display.prototype.systemMessage = function(msg) {
  this.intr.out(black(formatDate())+attn+blue(msg));
};
// chat.on('user_noticed', function(username) {
//           scr.out(black(formatDate())+attn+blue("just noticed "+username));
//   });
Display.prototype.userEnter = function(username) {
  this.intr.out(black(formatDate())+attn+blue(username+" joined"));
};
// chat.on('settled', function() {
//           scr.out(black(formatDate())+attn+blue("Joined."));
//  });
Display.prototype.userExit = function(username) {
  this.intr.out(black(formatDate())+attn+blue(username+" left"));
};
Display.prototype.debug = function(what){
  this.intr.out.apply(this, [black(formatDate())+attn]
                      .concat(what)
                      .filter(function(x){return typeof x != 'undefined';}));
};
exports.Display = Display;