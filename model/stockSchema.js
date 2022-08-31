const mongoose = require('mongoose')
const stock_schema = new mongoose.Schema({
    product:{
        type:String,
        require:true,
    },
    quantity:{
        type:Number,
        min:0,
        require:true,
    },
    myPrice:{
        type:Number,
        require:true,
    }

})

const stockSchema = mongoose.model("stock_schema",stock_schema);
module.exports = stockSchema

