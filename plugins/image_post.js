var imgur = require('imgur');
var fs = require('fs');
var path = require('path');
var IMAGE_DIR="/home/michael/Dropbox/Public/gifs/";

imgur.setKey("6f4afb014fbbdc28dfe22b100dc56b6b");

function uploadToImgur(fname, client, cb) {
  imgur.upload(fname,
               function(response) {
                 if (!response.success) {
                   client.display.debug("Upload failed: "+response.file+" "+response.error);
                   if (response.rate) {
                     client.display.debug("Upload credits left: "+(response.rate.remaining));
                   }
                 } else {
                   cb(response.links.original, response.image.width, response.image.height);
                 }
               });
};

function buildCraftedLink(style) {
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
  return "[url__E__#%2527style__E__%2527"+css+"]__A__nbsp;[/url]";
  //chat.say("[url__E__#%2527 style__E__%2527display:block;width:586px;height:147px;background-image: url("+line+");]  [/url]", function(){}, false);
}


function buildImageForge(imageUrl, width, height) {
  return buildCraftedLink({
                            "text-decoration": "none",
                            display:'block',
                            width:width+"px",
                            height:height+"px",
                            "background-image":"url("+imageUrl+")"
                          });
}


exports.init  = function(chat,client) {
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
