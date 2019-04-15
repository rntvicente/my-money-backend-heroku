const mongoose = require('mongoose');
const debug = require('debug')('server:database');

mongoose.Promise = global.Promise;

const uri = process.env.MLAB_URI
  ? process.env.MLAB_URI
  : 'mongodb://localhost:27017/myMoney';

const options = {
  connectTimeoutMS: 1000,
  useMongoClient: true
};

const database = mongoose.connect(uri, options, (err) => {
  if (err) {
    debug(err.stack);
    return;
  }

  debug('Connect database success.');
});

mongoose.Error.messages.general.required = 'Attribute {PATH} is required.';
mongoose.Error.messages.Number.min = '{VALUE} is less than the limit of {MIN}.';
mongoose.Error.messages.Number.max = '{VALUE} is greater than the limit of {MAX}.';
mongoose.Error.messages.String.enum = '{VALUE} is not valid for {PATH} attribute.';

module.exports = database;
