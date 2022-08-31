const moduleSchema = require("../model/module_schema");
const billSchema = require("../model/billSchema");
var mongoXlsx = require("mongo-xlsx");

exports.controller = async (req, res) => {
  // console.log(req.body)
  moduleSchema(req.body).save(async (err, result) => {
    if (err) {
      next(new Error("Data not saved"));
    } else {
      res.status(200).send({ result });
    }
  });
};
// exports.getProductDetails = async (req, res) => {
//     const product = req.body.product
//     console.log(req.body.product)
//     // const amount = parseInt(req.body.amount)
//     const { quantity, payment, billing_to } = req.body
//     const find = await moduleSchema.findOne({ product: product })
//     if (find) {

//         console.log(product, quantity, payment, billing_to)
//         let data = {
//             product: product,
//             gst: "5%",
//             amount: 10,
//             quantity: quantity,
//             date: new Date(),
//             discount: 10,
//             payment: payment,
//             status: "success",
//             billing_to: billing_to

//         }
//         // console.log("qqqqqq",find)
//         // var model = mongoXlsx.buildDynamicModel(find);

//         // mongoXlsx.mongoData2Xlsx(data, model, function(err, data){
//         //   res.send(data);
//         // });

//         let result = await moduleSchema.find({ product })
//         console.log("vvvvvvvvvv", result)
//         let myprice = (result.myprice / result.quantity) * quantity
//         console.log(myprice, "price")
//         let pricewithgst = (myprice * 5 / 100 + myprice);
// //         console.log("priceGst", pricewithgst)
// //         let resPrice = parseInt(pricewithgst - (pricewithgst * 10 / 100))
// //         console.log("final price", resPrice)
// //         data.amount = resPrice

// //         // res.status(200).send({data})
// //         billSchema(req.body).save({ data })
// //         res.send({ data })
// //     }
// //     else {
// //         res.status(400).send({ msg: "product is not in our stock" })
// //     }
// // }

// exports.updateStock = async (req, res) => {

//     let { product, quantity, amount } = req.body
//     let productDetail = await moduleSchema.find({ product })
//     // find( { name: { $in: [ "User1", "User2" ] } } )

//     let myprice = parseInt(productDetail.myprice) - parseInt(amount)
//     priceAccount = parseInt(productDetail.price) / parse(productDetail.quantity)
//     console.log("aaaaaaaa", priceAccount)

//     let productQuantity = await billSchema.findOne({ product })
//     custemorquantity = (productQuantity.quantity)
//     console.log("ssssss", custemorquantity)
//     let price = (productDetail.price) - (custemorquantity * priceAccount)

//     quantity = productDetail.quantity - quantity
//     console.log(quantity)

//     if ((quantity) < (custemorquantity)) {

//         res.send(`i have product quantity: ${quantity}`);
//     }

//     else {

//         const resData = await moduleSchema.findOneAndUpdate({ product }, { $set: { quantity, myprice, price } }, { new: true })
//         if (resData) res.send({ resData })
//         else res.send({ err: "err occured" })

//     }
// }

exports.addStock = async (req, res) => {
  let { product, quantity, price, myprice, unit, myunit } = req.body;
  let productDetail = await moduleSchema.findOne({ product });
  if (productDetail) {
    const netQuantity =
      parseFloat(productDetail.quantity) + parseFloat(req.body.quantity);
    const netMyprice =
      parseFloat(productDetail.myprice) + parseFloat(req.body.myprice);
    const netPrice =
      parseFloat(productDetail.price) + parseFloat(req.body.price);
    console.log(netPrice);
    console.log("ddddd", netMyprice);
    req.body.quantity = netQuantity;
    const resuData = await moduleSchema.updateOne(
      { product },
      { $set: { quantity: netQuantity, myprice: netMyprice, price: netPrice } },
      { new: true }
    );

    if (resuData) res.send({ resuData });
    else res.send({ err: "err occured" });
  } else {
    const resuData = await moduleSchema.insertMany({
      product: product,
      quantity: quantity,
      myprice: myprice,
      price: price,
      unit: unit,
      myunit: myunit,
    });

    if (resuData) res.send({ resuData });
    else res.send({ err: "err occured" });
  }
};

exports.postProductDetail = async (req, res) => {
  let { product, quantity, discount, payment, billing_to } = req.body;
  let products = [];

  var promise = product.map(async (val, i) => {
    products.push({ product: val, quantity: quantity[i] });
    let result = await moduleSchema.findOne({ product: val });
    let myprice = (result.myprice / result.quantity) * quantity[i];
    console.log("1==========>",result,myprice,quantity)
    let resPrice = parseFloat(myprice - (myprice * discount[i]) / 100);
    console.log("res price", resPrice);
    return resPrice;
  });

  Promise.all(promise).then(function (results) {
    // promise to return: [410, 425, 200]
    console.warn("promise_all: "+results);
    let amount = results.reduce((a, b) => a + b, 0);
    let data = {
      product: products,
      gst: "5%",
      amount: (amount * 5) / 100 + amount, 
      date: new Date(),
      discount: discount,
      payment: payment,
      status: "success",
      billing_to: billing_to,
    };
    console.warn("after promis data" + JSON.stringify(data));
    const bill = new billSchema(data);
    bill.save((err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
      }
    }); //(data).save({ data })
    res.send(data);
  });
};

exports.updateStock = async (req, res) => {
  let { product } = req.body;
  console.log("dddd", product);
  // let products = [];

  let updated_products = product.map(async (val, i) => {
    let productDetail = await moduleSchema.findOne({ product: val.product });
    console.log("ggggggg", productDetail);

    // let myprice = parseInt(productDetail.myprice) - parseInt(amount)
    let priceAccount =
      parseInt(productDetail?.price) / parseInt(productDetail?.quantity);
    console.log("aaaaaaaa", val.quantity);
    let totalPurchasedAmount = priceAccount * val.quantity;
    let resPrice = productDetail.price - totalPurchasedAmount;
    let resQuantity = productDetail.quantity - val.quantity;
    console.log("hhsdfg", resPrice, resQuantity);
    let result = await moduleSchema.findOneAndUpdate(
      { product: val.products },
      { quantity: resQuantity, price: resPrice },
      { new: true }
    );
    return result;
  });

  Promise.all(updated_products).then((result) => {
    res.send({ msg: "successdully stock is updated", result });
  });
};

exports.deletebill = async (req, res) => {
  let response = await billSchema.find({});
  let deldata = response[response.length - 1];
  console.log("========>>>>>>>>", deldata);
  //  await billSchema.findOneAndDelete({ product }, { $set: { quantity: parseFloat(result.quantity - quantity[i]), myprice: parseFloat(result.myprice - myprice), price: parseFloat(result.price - (result.price / result.quantity) * quantity[i]) } }, { new: true })

  var id = deldata._id;
  billSchema.findByIdAndDelete(id, function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      console.log("Deleted : ", docs);
      res.status(200).send({ msg: docs });
    }
  });
  //    res.status(200).send({msg:'ok'});
};

exports.getbillview = async (req, res) => {
  let last_inserted_doc = await billSchema.find({}).sort({ _id: -1 }).limit(1);
  console.warn("last inserted doc: " + last_inserted_doc);
  res.status(200).send({ msg: last_inserted_doc[0] });

  // To be used when to query for a single record

  // let response = await billSchema.find({})
  //  await billSchema.findOneAndDelete({ product }, { $set: { quantity: parseFloat(result.quantity - quantity[i]), myprice: parseFloat(result.myprice - myprice), price: parseFloat(result.price - (result.price / result.quantity) * quantity[i]) } }, { new: true })
  //  var id = deldata._id;
  //  billSchema.findOne(id, function (err, docs) {
  //      if (err){
  //          console.log(err)
  //          res.status(500).send({"msg": "Error in api: " + err})
  //      }
  //      else{
  //          console.log("result", docs);
  //          res.status(200).send({msg:docs});
  //      }
  //  });
};
