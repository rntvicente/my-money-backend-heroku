const restful = require('node-restful');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true },
  password: { type: String, required: true }
});

module.exports = restful.model('Users', userSchema);
