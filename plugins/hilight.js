var hilightColor=require('../lib/display_administrivia').white;
var HILIGHTS=[
    /gcr/gi,
    /blank/gi
];

exports.init = function(chat, client) {
  client.addDisplayHook(function(msg,cc) {
                          for (i=0,l=HILIGHTS.length; i<l; i++) {
                            msg = msg.replace(HILIGHTS[i],
                                              hilightColor("$&"));
                          }
                          cc(msg);
                        });

};