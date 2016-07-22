var mongoose = require('mongoose');
mongoose.connect( process.env.MONGOLAB_URI ||
                      process.env.MONGOHQ_URL || 
                      'mongodb://localhost/LeishSIC')
//Lets connect to our database using the DB server URL.
module.exports.User= require("./users.js");
module.exports.Historique = require("./actionsHistorique.js");
module.exports.Temp= require("./tempFile.js");
module.exports.File = require("./fileInformation.js");
module.exports.Action = require("./actionDone.js");