const User = require("../models/User");
const clientController = {};
const customer = require("../models/Customer");
const product = require("../models/Product");
const productType = require("../models/TypeProduct");
const Cart = require("../models/Cart");
const moment = require("moment");
const Order = require("../models/Order");
const validate = require("../Validate/customer/validate.customer");
const bcrypt = require("bcryptjs");

// Render Login Customer
clientController.renderLogin = async function (req, res) {
  res.render("./client/login", { csrfToken: req.csrfToken() });
  return;
};
// Render Forger Password Customer

clientController.renderForgotPassword = async function (req, res) {
  res.render("./client/forgotPassword", { csrfToken: req.csrfToken() });
  return;
};
// Render Register Customer
clientController.renderRegister = async function (req, res) {
  res.render("./client/register", { csrfToken: req.csrfToken() });
  return;
};
// Render Home Page
clientController.renderHome = async function (req, res) {
  try {
    // Get data of product type and product in that and number of that product.
    let dataProductType = await productType.find({}, "_id TP_name");
    let promisesDataPT = dataProductType.map(async function (x) {
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
//Render Cart info
clientController.renderCartInfo = async function (req, res) {
  if (req.session.cart) {
    if (!req.query.valid) {
      let cart = new Cart(req.session.cart);

      return res.render("client/viewCart", { csrfToken: req.csrfToken() });
    }
    if (req.query.valid) {
      let status = req.query.valid;

      let cart = new Cart(req.session.cart);
      return res.render("client/viewCart", {
        status,
        csrfToken: req.csrfToken(),
      });
    }
  }

  return res.render("client/viewCart", { csrfToken: req.csrfToken() });
};
// Remove item cart
clientController.deleteItemCart = async function (req, res) {
  let cart = new Cart(req.session.cart);
  let id = req.params._id;
  cart.removeItem(id);
  req.session.cart = cart;
  return res.redirect("/cartInfo");
};
// Render Product Info
clientController.renderProductInfo = async function (req, res) {
  let exitProduct = await product.findById(
    req.params._id,
    "P_create_at _id P_name P_description P_content P_unit_price P_unit P_picture TP_id"
  );
  if (!exitProduct) {
    return res.redirect("/");
  }

  let similarProduct = await product
    .find({ TP_id: { $in: exitProduct.TP_id } })
    .limit(3)
    .sort({ P_create_at: -1 });

  let arraySimilarProduct = similarProduct.filter(function (x) {
    return x._id.toString() !== exitProduct._id.toString();
  });

  let arSimilarP = arraySimilarProduct.map(function (x) {
    return {
      name: x.P_name,
      picture: x.P_picture,
      id: x._id,
      date: moment(x.P_create_at.P_create_at).format("MMMM D, YYYY"),
      price: x.P_unit_price,
      unit: x.P_unit,
    };
  });

  let data = {
    id: exitProduct._id,
    name: exitProduct.P_name,
    content: exitProduct.P_content,
    date: moment(exitProduct.P_create_at).format("MMMM D, YYYY"),
    picture: exitProduct.P_picture.slice(7),
    description: exitProduct.P_description,
    price: exitProduct.P_unit_price,
    stock: exitProduct.P_unit,
  };
  if (req.query.valid) {
    let status = req.query.valid;
    return res.render("./client/productInfo", { data, arSimilarP, status });
  }
  return res.render("./client/productInfo", { data, arSimilarP });
};
// .replace(new RegExp("\r?\n", "g"), " <br> ")

// handling Login customer
clientController.handleLogin = async function (req, res) {
  let { errors, isValid } = validate.login(req.body);
  console.log(req.body);
  if (!isValid) {
    return res.render("./client/login", { errors, data: req.body });
  }
  let findCusMatch = await customer.findOne({ email: req.body.email });
  if (findCusMatch === null) {
    errors.email = "This email is not exist";
    return res.render("./client/login", { errors, values: req.body });
  }

  // check email and pass word.

  // check password
  let checkpass = await findCusMatch.validPassword(req.body.password);

  if (!checkpass) {
    errors.password = "Password is wrong";
    return res.render("./client/login", { errors, values: req.body });
  }
  res.cookie("customerID", findCusMatch._id, {
    signed: true,
    expires: new Date(Date.now() + 8 * 3600000),
  });
  res.cookie("customerName", findCusMatch.full_name, {
    signed: true,
    expires: new Date(Date.now() + 8 * 3600000),
  });
  return;
};
// handling Register Customer
clientController.handleRegister = async function (req, res) {
  // check input valid if not re-render
  const { errors, isValid } = validate.register(req.body);
  // Check Customer is exist
  let findCusMatch = await customer.findOne({ email: req.body.email });
  if (findCusMatch) {
    errors.email = "This email is exist.";
    return res.render("./client/register", { errors, value: req.body });
  }
  if (!isValid) {
    res.render("./client/register", { errors, values: req.body });
    return;
  }
  let newPassword = await customer.encryptPassword(req.body.password);

  let newCus = new customer({
    full_name: req.body.fullname,
    email: req.body.email,
    phone: req.body.phone,
    password: newPassword,
  });
  newCus.save(function (err, data) {
    res.render("./client/login");
  });
};
// handling Forget password customer
// handling send mail active customer

// add To cart
clientController.addToCart = async function (req, res) {
  let productID = req.params._id;

  let unitProduct = req.body.unitProduct ? req.body.unitProduct : 1;
  let cart = new Cart(req.session.cart ? req.session.cart : {});

  let productFind = await product.findById(
    productID,
    "P_unit P_unit_price P_picture P_name _id P_description"
  );
  if (!productFind) {
    res.redirect("/");
    return;
  }

  let addCart = await cart.add(productFind, productFind._id, unitProduct);

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

clientController.addCartProductInfo = async function (req, res) {
  let productID = req.params._id;
  let unitProduct = req.body.unitProduct ? req.body.unitProduct : 1;
  let cart = new Cart(req.session.cart ? req.session.cart : {});
  let productFind = await product.findById(
    productID,
    "P_unit P_unit_price P_picture P_name _id"
  );
  if (!productFind) {
    res.redirect("/");
    return;
  }
  let addCart = await cart.add(productFind, productFind._id, unitProduct);
  let link = "/productInfo/" + productID + "/?valid=";
  if (addCart === "ERROR qty") {
    let data = "This items can not buy more than 5 items";
    res.redirect(link + data);
    return;
  }
  if (addCart === "ERROR totalQty") {
    let data = "Cart quantity items can not more than 20 items";
    res.redirect(link + data);
    return;
  }
  if (addCart === "ERROR P_unit") {
    let data = "Product quantity is not enough. Please choose another product";
    res.redirect(link + data);
    return;
  }
  req.session.cart = cart;

  res.redirect(link + "Add Cart Success");
  return;
  // console.log(productID);
};

// minus One View Cart

clientController.minusOne = async function (req, res) {
  let productID = req.params._id;

  let unitProduct = -1;
  let cart = new Cart(req.session.cart ? req.session.cart : {});

  let productFind = await product.findById(
    productID,
    "P_unit P_unit_price P_picture P_name _id P_description"
  );
  if (!productFind) {
    res.redirect("/");
    return;
  }

  let addCart = await cart.add(productFind, productFind._id, unitProduct);

  if (addCart === "ERROR qty") {
    let data = "This items can not buy more than 5 items";
    res.redirect("/cartInfo/?valid=" + data);
    return;
  }
  if (addCart === "ERROR totalQty") {
    let data = "Cart quantity items can not more than 20 items";
    res.redirect("/cartInfo/?valid=" + data);
    return;
  }
  if (addCart === "ERROR P_unit") {
    let data = "Product quantity is not enough. Please choose another product";
    res.redirect("/cartInfo/?valid=" + data);
    return;
  }
  if (addCart === "ERROR qty 2") {
    let data = "This items quantity need more than 1";
    res.redirect("/cartInfo/?valid=" + data);
    return;
  }

  req.session.cart = cart;

  res.redirect("/cartInfo/");
  return;
};

clientController.plusOne = async function (req, res) {
  let productID = req.params._id;

  let unitProduct = 1;
  let cart = new Cart(req.session.cart ? req.session.cart : {});

  let productFind = await product.findById(
    productID,
    "P_unit P_unit_price P_picture P_name _id P_description"
  );
  if (!productFind) {
    res.redirect("/");
    return;
  }

  let addCart = await cart.add(productFind, productFind._id, unitProduct);

  if (addCart === "ERROR qty") {
    let data = "This items can not buy more than 5 items";
    res.redirect("/cartInfo/?valid=" + data);
    return;
  }
  if (addCart === "ERROR totalQty") {
    let data = "Cart quantity items can not more than 20 items";
    res.redirect("/cartInfo/?valid=" + data);
    return;
  }
  if (addCart === "ERROR P_unit") {
    let data = "Product quantity is not enough. Please choose another product";
    res.redirect("/cartInfo/?valid=" + data);
    return;
  }
  if (addCart === "ERROR qty 2") {
    let data = "This items quantity need more than 1";
    res.redirect("/cartInfo/?valid=" + data);
    return;
  }

  req.session.cart = cart;

  res.redirect("/cartInfo/");
  return;
};
//Render and check cart if product not enough unit minimus m update cart and show alert
clientController.rendercheckOut = async function (req, res) {
  res.render("client/checkout");
};

clientController.checkOut = async function (req, res) {
  let cartArr = new Cart(req.session.cart).generateArray();
  let cartData = new Cart(req.session.cart);
  let totalQty = req.session.cart.totalQty;
  let totalPrice = req.session.cart.totalPrice;

  await cartArr.forEach(async function (data) {
    let id = data.item._id;
    let checkUnit = await product.findById(id, "_id P_unit");
    let cartItemQty = cartData.items[id].qty;
    let productQty = checkUnit.P_unit;
    if (cartItemQty > productQty) {
    }
  });
};

// Payment
clientController.payment = async function (req, res) {
  if (!req.session.cart) {
    res.redirect("/");
    return;
  }
  var cart = new Cart(req.session.cart);
  const stripe = require("stripe")(
    "sk_test_4tkyEOasqlYKV0kclVp3cXk900geCCC4PS"
  );

  stripe.charges.create(
    {
      currency: "usd",
      amount: cart.totalPrice * 100,
      source: req.body.stripeToken,
      description: "Test Charge",
      receipt_email: "bop5565237@gmail.com",
    },
    function (err, charge) {
      // console.log(charge);
      if (err) {
        console.log(err);
        res.redirect("/checkout");
      }
      // neu khong bi loi
      // create new order and save it to database
      // const order = new Order({
      //   user: req.
      // })
      req.session.cart = null;
      res.redirect("/");
      return;
    }
  );
};

module.exports = clientController;
