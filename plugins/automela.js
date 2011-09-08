exports.init = function(chat,client) {

  // automela.js:
  // map my typing quirk onto Elamind's typing quirk

  client.addMessageHook(
    function(msg, send){
      var newMessage = npartition(msg, " !@#$%^&*(){}[]+=\|?-'\"<>.,")
        .map(function(word) {
               if (word.length == 0)
                 return word;

               var uppercase = (word == word.toUpperCase());
               var capitalized = (word[0] == word[0].toUpperCase());
               var lowercase_word = word.toLowerCase();

               // Don't mess with URLs
               if (word.match(/(\b(https?|ftp|file):\/\/([^<>\"\s]+|[a-z0-9/\._\- !&\#;,%\+\?:=]+))/ig))
                 return word;

               if (lowercase_word == "hi")
                 word = (uppercase?     "HAI"
                         : capitalized? "Hai"
                         :              "hi");

               if (uppercase && word != 'I')
                 word = word.replace(/I/g, "i");

               if (lowercase_word =="xd")
                 word = ":p";

               if (lowercase_word == ":/")
                 word = "]:";

               if (lowercase_word == "oh")
                 word = (uppercase?     (Math.random()>0.5? "OOOH" : "OOH")
                         : capitalized? (Math.random()>0.5? "Oooh" : "Ooh")
                         :              (Math.random()>0.5? "oooh" : "ooh"));

               if (lowercase_word == "because")
                 word = (uppercase?     "'CAUSE"
                         : capitalized? "'Cause"
                         :              "'cause");

               if (lowercase_word == "with")
                 word = (capitalized? "W/" : "w/");

               if (word == "JUST")
                 word = "jUST";



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