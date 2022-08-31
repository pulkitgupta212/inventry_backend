const { text } = require('express');
const mongoose = require('mongoose')
const bill_schema = new mongoose.Schema({
    product:{
        type:Array,
        required:true,
    },
    amount:{

        type:Number,
        required:true,
    },
    gst:{
        
        type:String,
        required:true,
    },
     date :{
         type:Date
     },

    discount :{
        type:Array,
        required:true,
    },
    payment : {
        type:String,
        required:true,
    },
    status :{
        default:"success",
        type:String,
        required:true,
    },
    billing_to:{
        type:String,
        required:true,
    },
})

const billSchema = mongoose.model("bill_schema",bill_schema);
module.exports = billSchema


