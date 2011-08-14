var imgur = require('imgur');
var fs = require('fs');
var path = require('path');
var IMAGE_DIR="/home/michael/Dropbox/Public/gifs/";

imgur.setKey(imgur.getKey());

function uploadToImgur(fname, client, cb) {
  imgur.upload(fname,
               function(response) {
                 if (!response.success) {
                   client.display.debug("Upload failed: "+response.file+" "+response.error);
                   if (response.rate) {
                     console.log(response);
                     client.display.debug("Upload credits left: "+(response.rate.remaining));
                   }
                 } else {
                   cb(response.links.original, response.image.width, response.image.height);
                 }
               });
};

function buildCraftedLink(style,content) {
  content = content || "__A__nbsp;";
  // This is where the real magic happens. ;)
  //
  // Take a look at line 2288 of ips.chat.js linked above.
  // From there on out, [url=foo]bar[/url] is parsed into <a href='foo'>bar</a>
  // but improperly escaped. We're exploiting that here.
  //
  // the server escapes quotes, so we have to do our... own thing, heh. %25
  // turns into just a normal % we need this for some reason. then %27 gets
  // turned into a raw ' (see line 1034) which lets us break out of the
  // esacping
  //
  // CAVEATS: do not have any = in there, instead escape it to an __E__
  // also, you MUST have a URL somewhere in the link or else isValidUrl on
  // line 2247 will catch it.
  //
  // you have 500 characters so use them wisely.

  var css = "";
  for (var k in style) {
    if (style.hasOwnProperty(k)) {
      css+=k+":"+style[k]+";";
    }
  }
  return "[url__E__#%2527style__E__%2527"+css+"]"+content+"[/url]";
  //chat.say("[url__E__#%2527 style__E__%2527display:block;width:586px;height:147px;background-image: url("+line+");]  [/url]", function(){}, false);
}


function buildImageForge(imageUrl, width, height) {
  return buildCraftedLink({
                            "text-decoration": "none",
                            display:'inline-block',
                            width:width+"px",
                            height:height+"px",
                            "background-image":"url("+imageUrl+")"
                          });
}

function buildColor(color,content) {
  return buildCraftedLink({
                            "text-decoration": "none",
                            "color": color,
                            "background-image":"url(http://)"
                          }, content);
}

exports.init  = function(chat,client) {
  client.addCommand("color", function(line) {
                      var words = line.split(" ");
                      var color = words[0];
                      var rest = words.slice(1).join(" ");
                      chat.say(buildColor(color,rest), function(){}, false);
                    });

  client.addCommand("lord_english", function(line) {
                      line = line.replace(/lord/gi, "L"+buildImageForge("http://goo.gl/WYRQc",10,10)+"rd");
                      chat.say(line, function(){}, false);
                    });

  client.addCommand("image_post", function(line) {
                      // THIS WORKS.
                      client.display.debug("Uploading "+line+" to imgur...");
                      uploadToImgur(line, client, function(r,w,h) {
                                      chat.say(buildImageForge(r,w,h),
                                               function(){}, false);
                                   });
                    });
  client.addCompleter(
    function(word,line) {
      // Tab completion for filenames
      var words = line.split(" ");
      if (words[0] != "/image_post") { return []; }

      var dir = words.slice(1).join(" ") || "./";
      if (!path.existsSync(dir)) {
        dir = path.dirname(dir);
      }

      try {
        return fs.readdirSync(dir)
          .map(function(img){
                 if (path.existsSync(path.join(dir,img)) &&
                     fs.statSync(path.join(dir,img)).isDirectory()) {
                   return path.join(dir,img)+"/";
                 } else {
                   return path.join(dir,img);
                 }
               });
      } catch(e) {
        return [];
      }
    });
};
