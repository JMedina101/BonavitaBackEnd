const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const app      = require('./app');


// config enfironment setup
dotenv.config({path:'./config.env'});


const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.PASSWORD
);

mongoose
  // local database version
  // .connect(process.env.DATABASE_LOCAL, {
  // hosted database version
  .connect(DB, {
    // just some options to deal with deprecation warnings.
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  }).then(() => console.log('DB connection successful!'))
  .catch(err => console.log(error));

const touristSchema =  new mongoose.Schema({
    name: {
        type:String,
        required:true

    },
    email: {
        type:String,
    },
    age: {
        type:String,
        
    }
});

 