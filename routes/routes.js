const routes = require('express').Router();
const {controller, updateStock, addStock,postProductDetail, deletebill , getbillview} = require('../controller/result_controller');
const {result_validator} = require('../middleware/globalmiddleware');
const{product_validator, addProduct_validator} = require('../validation/product_validation');

(()=>{
   post_request()
   patch_request()
   delete_request()
   get_request()
})();

function post_request(){
   routes.post("/invetoryProduct",result_validator,addStock)
   routes.post("/getbill",postProductDetail)

}
function patch_request(){
   routes.patch("/updatestock",updateStock)
   routes.patch('/addStock',addProduct_validator(),result_validator,addStock)

}
function delete_request(){
   routes.delete("/deletebill",deletebill)
}
function get_request(){
   routes.get("/getbillview",getbillview)
}

   

module.exports = routes