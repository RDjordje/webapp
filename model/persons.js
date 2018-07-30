var mongoose = require('mongoose');
var personSchema = new mongoose.Schema({
  Name: String,
  Surname: String,
  CreatedDate: String,
  City: String,
  Adress: String,
  Phone: String
});
mongoose.model('Person', personSchema);
