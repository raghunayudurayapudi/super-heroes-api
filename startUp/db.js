const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require('mongoose');
const {Heroes} = require('../models/Heroes');
const {Teams} = require('../models/Teams');
module.exports = () => {
const mongoServer = new MongoMemoryServer();

mongoose.Promise = Promise;
mongoServer.getUri().then((mongoUri) => {
  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true
    };

  mongoose.connect(mongoUri, mongooseOpts);
  mongoose.connection.on('error', (e) => {
    if (e.message.code === 'ETIMEDOUT') {
      console.log(e);
      mongoose.connect(mongoUri, mongooseOpts);
    }
    console.log(e);
  });
  mongoose.connection.once('open', () => {
    Heroes.collection.insertMany([{
        name: 'Arrow',
        alignment: 'GOOD',
        teams: [
        ]
    },
    {
      name: 'Super Man',
      alignment: 'GOOD',
      teams: [
      ]
  },
  {
    name: 'Dark Side',
    alignment: 'Bad',
    teams: [
    ]
}], function (err, doc) {
      if (err){ 
        return console.error(err);
    } else {
      console.log("Multiple documents inserted to Collection");
    }
    });
    Teams.collection.insertMany([{
      name: 'JusticeLeage',
      meanAlignment: 'NEUTRAL',
      heroes: [
      ]
  }], function (err, doc) {
    if (err){ 
      return console.error(err);
  } else {
    console.log("Multiple documents inserted to Collection");
  }
  });
    console.log(`MongoDB successfully connected to ${mongoUri}`);
  });
  
});
}