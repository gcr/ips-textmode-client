// automela.js:
// map my typing quirks onto Elamind's typing quirks.

exports.init = function(chat,client) {
  client.addMessageHook(
    function(msg, send){
      // This function changes each word we send into something else.
      //
      // Elamind has a few very distinct typing quirks that are often
      // hard to emulate when speed is desired. Unfortunately, the
      // details of her particular characteristics can be easily
      // forgotten. Because consistency is key in any serious compaign
      // of comprehensive linguistic imitation, this script is my
      // attempt to automate the effort.
      //
      // The astute forum chatter can now type without fear of
      // unintentionally relinquishing his illusion. Now, not a single
      // 'i' will be left UNCAPiTALiZED; not a single "Oooh" will be
      // forgotten, not a single "Hai" will be overseen. As such,
      // unconventional diction will seem just that much more clever.
      //
      // The logic of this script is based upon the lexical analysis
      // of a corpus of over 110,000 messages from last November and
      // 12,000 messages from a single week early in Sepetember. Among
      // these two corpora, Elamind accounted for 22,786 messages. The
      // most distinct words were identified, extracted, and
      // incorporated into this script, allowing one to achieve
      // convincingly similar articulation to Elamind with little to
      // no effort.

      var newMessage = npartition(msg, " !@#$%^&*(){}[]+=\|?-'\"<>.,")
        .map(function(word) {


               if (word.length == 0)
                 return word;

               var uppercased = (word == word.toUpperCase());
               var capitalized = (word[0] == word[0].toUpperCase());
               var lowercase_word = word.toLowerCase();

               // Don't mess with URLs
               if (word.match(/(\b(https?|ftp|file):\/\/([^<>\"\s]+|[a-z0-9/\._\- !&\#;,%\+\?:=]+))/ig))
                 return word;

               // Greetings and salutations
               if (lowercase_word == "hi")
                 word = (uppercased?    "HAI"
                         : capitalized? "Hai"
                         :              "hai");

               // CAPiTALiZE PROPERLY
               if (uppercased && word != 'I')
                 word = word.replace(/I/g, "i");

               // Unconventional emoticons
               if (lowercase_word =="xd")
                 word = ":p";

               if (lowercase_word == ":/")
                 word = "]:";

               // Oooh!
               if (lowercase_word == "oh")
                 word = (uppercased?    (Math.random()>0.5? "OOOH" : "OOH")
                         : capitalized? (Math.random()>0.5? "Oooh" : "Ooh")
                         :              (Math.random()>0.5? "oooh" : "ooh"));

               if (lowercase_word == "because")
                 word = (uppercased?    "'CAUSE"
                         : capitalized? "'Cause"
                         :              "'cause");

               if (lowercase_word == "with")
                 word = (capitalized? "W/" : "w/");

               if (word == "JUST")
                 word = "jUST";

               if (word == "BYE")
                 word = (Math.random()>0.5? "BYE" : "BAi");



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