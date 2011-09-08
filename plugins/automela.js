exports.init = function(chat,client) {

  // automela.js:
  // map my typing quirk onto Elamind's typing quirk

  client.addMessageHook(
    function(msg, send){
      var newMessage = npartition(msg, " !@#$%^&*(){}[]+=\|?-'\"<>.,")
        .map(function(word) {
               // Don't mess with URLs
               if (word.match(/(\b(https?|ftp|file):\/\/([^<>\"\s]+|[a-z0-9/\._\- !&\#;,%\+\?:=]+))/ig))
                 return word;

               if (word == "HI")
                 word = "HAI";

               if (word == "Hi")
                 word = "Hai";

               if (word.toUpperCase() == word && word != 'I')
                 word = word.replace(/I/g, "i");

               if (word.toUpperCase() == "XD")
                 word = ":p";

               if (word == ":/")
                 word = "]:";

               if (word.toLowerCase() == "oh")
                 word = Math.random()>0.5? "oooh" : "ooh";

               if (word.toLowerCase() == "because")
                 word = "'cause";

               if (word.toLowerCase() == "with")
                 word = "w/";



               return word;
             });

      send(newMessage.join(""));
    });

};

function npartition(message, splits) {
  var last = "";
  var result = [];
  for (var i = 0; i < message.length; i++) {
    if (splits.indexOf(message[i]) != -1) {
      if (last)
        result.push(last);
      result.push(message[i]);
      last="";
    } else {
      last += message[i];
    }
  }
  result.push(last);
  return result;
}