const mongoose = require('mongoose')
const add_schema = new mongoose.Schema({
    product:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    quantity:{
        type:Number,
        min:0,
        required:true,
    }, 
    unit:{
        type:String,
        required:true,
    },
    myprice:{
        type:Number,
        required:true,
    },
    myunit:{
        type:String,
        required:true,
    },
    updated_on:{
        type: Date,
        default : new Date()
    }
    
})
const moduleSchema = mongoose.model("module_schema",add_schema);


    

module.exports = moduleSchema