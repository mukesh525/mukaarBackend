
const mongoose = require('mongoose');

const config = require('../config');

const db = config.DB_URI;

module.exports = function() {
  //const db = config.DB_URI;
  mongoose.connect(db,{ useNewUrlParser: true,useFindAndModify:false,useCreateIndex:true })
    .then(() => {this.db = db;console.log(`Connected to ${db}...`)})
    .catch((e)=> console.log(e));
}

