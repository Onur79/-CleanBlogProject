const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create schema
const PhotoSchema = new Schema({
  title: String,
  description: String,
  image: String,
  dateCreated:{
    type: Date,
    default: Date.now,
  },
});

const Photo = mongoose.model("Photo", PhotoSchema); 

module.exports = Photo;

//connect DB
mongoose.connect('mongodb://127.0.0.1:27017/cleanblog-test-db',{
  useNewUrlParser:true,

}

);

