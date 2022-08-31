const express = require("express")
 const mongoose = require("mongoose")
 const app = express();
const routes = require('./routes/routes')
const cors= require("cors")
 

 const api_version ="api/v1";
 
 
 (() =>{
     body_parser();
     cors_config();
     db_config();
     router_config();
     global_Error_Handler();
 })();
 
 
 
 function db_config(){
    mongoose.connect("mongodb+srv://inventry:inventry123@cluster0.tzuzazk.mongodb.net/?retryWrites=true&w=majority",(err)=>{
    if(!err){
         console.log("DB Connected Successfully");
     }
     else{
         console.log("Error:",err);
       }
     })
 }

 function body_parser() {
     app.use(express.json());
 }
function cors_config(){
  app.use(cors());
}

 function router_config(){
    app.use('/',routes);
 }
 function global_Error_Handler() {
    app.use((err, req, res, next) => {
      res.status(500).send({error: JSON.stringify(err)})
// function global_Error_Handler() {
//   app.use((err, req, res, next) => {
//     const errorStatus = req.status || 500;
//     const error = err.message && [err.message] || err || "Internal Server Error";
//     res.status(errorStatus).send({error})
    })
  }
  


 module.exports = app;

