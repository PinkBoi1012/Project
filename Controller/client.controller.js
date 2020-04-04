const User = require("../models/User");
const clientController = {};
const customer = require("../models/Customer");
const product = require("../models/Product");
const productType = require("../models/TypeProduct");
const Cart = require("../models/Cart");
const moment = require("moment");
// Render Home Page
clientController.renderHome = async function(req, res) {
  try {
    // Get data of product type and product in that and number of that product.
    let dataProductType = await productType.find({}, "_id TP_name");
    let promisesDataPT = dataProductType.map(async function(x) {
      let PTdata = await product.find({ TP_id: x._id }, "TP_id");
      return { TP_id: x._id, TP_name: x.TP_name, data: PTdata };
    });

    let dataPT = await Promise.all(promisesDataPT);
    // Get all product data

    let dataAllProduct = await product
      .find({}, "TP_id P_name P_description P_unit_price P_unit P_picture")
      .sort({ P_name: 1 });
    if (req.query.valid) {
      let status = req.query.valid;
      res.render("./client/homePage", { dataPT, dataAllProduct, status });
      return;
    }
    res.render("./client/homePage", { dataPT, dataAllProduct });

    return;
  } catch (err) {
    console.log(err);
  }
};
// Render Product Info
clientController.renderProductInfo = async function(req, res) {
  let exitProduct = await product.findById(
    req.params._id,
    "P_create_at _id P_name P_description P_content P_unit_price P_unit P_picture"
  );
  if (!exitProduct) {
    return res.redirect("/");
  }

  let data = {
    id: exitProduct._id,
    name: exitProduct.P_name,
    content: exitProduct.P_content,
    date: moment(exitProduct.P_create_at).format("MMMM D, YYYY"),
    picture: exitProduct.P_picture.slice(7),
    description: exitProduct.P_description,
    price: exitProduct.P_unit_price,
    stock: exitProduct.P_unit
  };
  console.log(data.picture);
  return res.render("./client/productInfo", { data });
};
// .replace(new RegExp("\r?\n", "g"), " <br> ")
// add To cart
clientController.addToCart = async function(req, res) {
  let productID = req.params._id;
  let cart = new Cart(req.session.cart ? req.session.cart : {});

  let productFind = await product.findById(
    productID,
    "P_unit P_unit_price P_picture P_name _id"
  );
  if (!productFind) {
    res.redirect("/");
    return;
  }

  let addCart = await cart.add(productFind, productFind._id);

  if (addCart === "ERROR qty") {
    let data = "This items can not buy more than 5 items";
    res.redirect("/?valid=" + data);
    return;
  }
  if (addCart === "ERROR totalQty") {
    let data = "Cart quantity items can not more than 20 items";
    res.redirect("/?valid=" + data);
    return;
  }
  if (addCart === "ERROR P_unit") {
    let data = "Product quantity is not enough. Please choose another product";
    res.redirect("/?valid=" + data);
    return;
  }

  req.session.cart = cart;
  res.redirect("/");
  return;
};

module.exports = clientController;
