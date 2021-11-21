const mongoose = require("mongoose");

//const uri = "mongodb+srv://mjovicic:Marijonis1@cluster0.s2rhj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const uri = process.env.DB_URI;

function connect() {
  const options = { useNewUrlParser:true };
  mongoose.connect(uri, options).then(
    () => { console.log("Database connection established!"); },
    err => { console.log("Error connecting Database instance due to: ", err); }
  )}

module.exports = connect
