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
const jwt = require("jsonwebtoken");
const key = require("../config/keys");
const sendMail = require("../middlewares/nodemailer.userActive");
const mailModel = require("../models/SendEmail");
moment.locale();
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
      res.render("./client/homePage", {
        dataPT,
        dataAllProduct,
        status,
        csrfToken: req.csrfToken(),
      });
      return;
    }
    res.render("./client/homePage", {
      dataPT,
      dataAllProduct,
      csrfToken: req.csrfToken(),
    });

    return;
  } catch (err) {
    console.log(err);
  }
};

//render view Order history
clientController.renderCusInfo_orderManager = async function (req, res) {
  const dataOrder = await Order.find(
    { C_id: req.session.customer._id },
    "O_status O_create_at _id  cart address"
  );
  // console.log(dataOrder);

  let data = dataOrder.map(function (x) {
    let result = {};
    result.O_status = x.O_status;
    result.O_create_at = moment(x.O_create_at).format("L");
    result.cart = x.cart;
    result._id = x._id;
    result.address = x.address;
    return result;
  });

  return res.render("./client/orderManager", { order: data });
};
// render order detail View
clientController.renderCusInfo_detailOrderView = async function (req, res) {
  let findOrder = await Order.findById(
    req.params._id,
    "O_status O_description cart C_id address O_create_at"
  );

  let findCus = await customer.findById(findOrder.C_id, "full_name phone");

  let data = {
    _id: findOrder._id,
    cart: findOrder.cart,
    O_create_at: moment(findOrder.O_create_at).format("LLL"),
    O_status: findOrder.O_status,
    O_description: findOrder.O_description,
    address: findOrder.address,
    full_name: findCus.full_name,
    phone: findCus.phone,
  };

  return res.render("./client/orderDetail", { data });
};
// render user Page info account info
clientController.renderCusInfo_accountInfo = async function (req, res) {
  let matchCus = await customer.findById(
    req.session.customer._id,
    "_id full_name email phone"
  );
  return res.render("./client/customerInfo", {
    values: matchCus,
    csrfToken: req.csrfToken(),
  });
};

// render user page info change password
clientController.renderCusInfo_changePass = async function (req, res) {
  let matchCus = await customer.findById(
    req.session.customer._id,
    "_id full_name email phone"
  );
  if (req.query.valid) {
    let status = req.query.valid;
    return res.render("./client/changepass", {
      csrfToken: req.csrfToken(),
      values: matchCus,
      status,
    });
  }
  return res.render("./client/changepass", {
    csrfToken: req.csrfToken(),
    values: matchCus,
  });
};
// render user page show order manager

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
      date: moment(x.P_create_at).format("LLL"),
      price: x.P_unit_price,
      unit: x.P_unit,
    };
  });

  let data = {
    id: exitProduct._id,
    name: exitProduct.P_name,
    content: exitProduct.P_content,
    date: moment(exitProduct.P_create_at).format("LLL"),
    picture: exitProduct.P_picture.slice(7),
    description: exitProduct.P_description,
    price: exitProduct.P_unit_price,
    stock: exitProduct.P_unit,
  };
  if (req.query.valid) {
    let status = req.query.valid;
    return res.render("./client/productInfo", {
      data,
      arSimilarP,
      status,
      csrfToken: req.csrfToken(),
    });
  }
  return res.render("./client/productInfo", {
    data,
    arSimilarP,
    csrfToken: req.csrfToken(),
  });
};
// .replace(new RegExp("\r?\n", "g"), " <br> ")
//Render ResetPassword page
clientController.renderResetPasswordPage = async function (req, res) {
  let decoded = await jwt.verify(req.params.id, key.secret, function (
    err,
    decoded
  ) {
    if (err) {
      return res.redirect("/");
    }
    return decoded;
  });
  let findCus = await customer.findById(decoded._id);
  if (findCus) {
    return res.render("./client/resetPassword", {
      values: findCus._id,
      csrfToken: req.csrfToken(),
    });
  }
  // neu khong co tra ve 404
};
//handle change customer info
clientController.handleChangeCustomerInfo = async function (req, res) {
  const { errors, isValid } = validate.changeCusInfo(req.body);
  if (!isValid) {
    let matchCus = await customer.findById(
      req.session.customer._id,
      "_id full_name email phone"
    );
    return res.render("./client/customerInfo", {
      values: matchCus,
      csrfToken: req.csrfToken(),
      errors,
    });
  }

  let newPhone = req.body.phone;
  let newName = req.body.full_name;
  await customer.findByIdAndUpdate(req.body._id, {
    phone: newPhone,
    full_name: newName,
  });
  req.session.customer = { _id: req.session.customer._id, full_name: newName };
  let matchCus = await customer.findById(
    req.session.customer._id,
    "_id full_name email phone"
  );
  let mess = "Change Information Success";
  return res.render("./client/customerInfo", {
    values: matchCus,
    csrfToken: req.csrfToken(),
    status: mess,
  });
};
// handling change password
clientController.handleChangePass = async function (req, res) {
  const { errors, isValid } = validate.changeCusPassword(req.body);
  if (!isValid) {
    return res.render("./client/changepass", {
      csrfToken: req.csrfToken(),
      errors,
      values: req.body,
    });
  }
  let oldPass = req.body.curPass;
  let findCus = await customer.findById(req.body._id, "_id password");

  // check password is right
  let matchPass = await bcrypt.compareSync(oldPass, findCus.password);
  if (!matchPass) {
    errors.curPass = "Password is wrong";
    return res.render("./client/changepass", {
      csrfToken: req.csrfToken(),
      errors,
      values: { _id: req.body._id, curPass: oldPass },
    });
  }
  let newpassword = await bcrypt.hashSync(
    req.body.password,
    bcrypt.genSaltSync(10)
  );

  let findAnUpdate = await customer.findByIdAndUpdate(req.body._id, {
    password: newpassword,
  });
  return res.render("./client/changepass", {
    csrfToken: req.csrfToken(),
    errors,
    values: { _id: req.body._id },
    status: "Change password success",
  });
};
// handling resetPassword
clientController.resetForgetPassword = async function (req, res) {
  const { errors, isValid } = validate.resetPassword(req.body);
  if (!isValid) {
    return res.render("./client/resetPassword", {
      errors,
      values: req.body,
      csrfToken: req.csrfToken(),
    });
  }
  let newPass = await bcrypt.hashSync(
    req.body.password,
    await bcrypt.genSaltSync(10)
  );
  await customer.findByIdAndUpdate(req.body._id, {
    password: newPass,
  });
  return res.render("./client/login", { csrfToken: req.csrfToken() });
};
// handling Login customer
clientController.handleLogin = async function (req, res) {
  let { errors, isValid } = validate.login(req.body);
  if (!isValid) {
    return res.render("./client/login", {
      errors,
      data: req.body,
      csrfToken: req.csrfToken(),
    });
  }

  let findCusMatch = await customer.findOne({ email: req.body.email });
  if (findCusMatch === null) {
    errors.email = "This email is not exist";
    return res.render("./client/login", {
      errors,
      values: req.body,
      csrfToken: req.csrfToken(),
    });
  }
  // check password
  let checkpass = await findCusMatch.validPassword(req.body.password);

  if (!checkpass) {
    errors.password = "Password is wrong";
    return res.render("./client/login", {
      errors,
      values: req.body,
      csrfToken: req.csrfToken(),
    });
  }
  let customerData = {
    _id: findCusMatch._id,
    full_name: findCusMatch.full_name,
  };
  req.session.customer = customerData;
  console.log(req.session.cart);
  if (req.session.cart == null || req.session.cart.items == null) {
    res.redirect("/");
    return;
  }
  return res.redirect("/cartInfo");
};
// handling Register Customer
clientController.handleRegister = async function (req, res) {
  // check input valid if not re-render
  const { errors, isValid } = validate.register(req.body);
  // Check Customer is exist
  let findCusMatch = await customer.findOne({ email: req.body.email });
  if (findCusMatch) {
    errors.email = "This email is exist.";
    return res.render("./client/register", {
      errors,
      value: req.body,
      csrfToken: req.csrfToken(),
    });
  }
  if (!isValid) {
    res.render("./client/register", {
      errors,
      values: req.body,
      csrfToken: req.csrfToken(),
    });
    return;
  }

  let newCus = new customer({
    full_name: req.body.fullname,
    email: req.body.email,
    phone: req.body.phone,
  });
  newCus.password = await newCus.encryptPassword(req.body.password);

  newCus.save(function (err, data) {
    res.render("./client/login", { csrfToken: req.csrfToken() });
  });
};
// handling Forget password customer
clientController.handleSendForgotPassword = async function (req, res) {
  const { errors, isValid } = validate.forgot(req.body);
  if (!isValid) {
    res.render("./client/forgotPassword", {
      errors,
      values: req.body,
      csrfToken: req.csrfToken(),
    });
    return;
  }
  let findUser = await customer.findOne({ email: req.body.email });
  if (!findUser) {
    errors.email = "Email is not exist Please input again";
    res.render("./client/forgotPassword", {
      errors,
      values: req.body,
      csrfToken: req.csrfToken(),
    });
    return;
  }
  let token = await jwt.sign({ _id: findUser._id }, key.secret, {
    expiresIn: "24h",
  });
  let subject = `Recovery Account ${findUser.email}`;
  let content =
    "<p>Please Click This Link To reset password Account:</p><a href=http://localhost:8080/customer/resetpassword/" +
    token +
    ">Link";
  sendMail(req.body.email, subject, content);
  res.redirect("/");
  return;
};

// handling logout customer
clientController.handleLogout = async function (req, res) {
  req.session.customer = null;
  return res.redirect("/");
};
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
  res.render("client/checkout", { csrfToken: req.csrfToken() });
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
      amount: parseInt(cart.totalPrice) * 100,
      source: req.body.stripeToken,
      description: "Test Charge",
      receipt_email: "bop5565237@gmail.com",
    },
    async function (err, charge) {
      if (err) {
        console.log(err);
        res.redirect("/checkout");
      }
      //save order
      delete cart.add;
      delete cart.generateArray;
      delete cart.removeItem;

      let order = new Order({
        C_id: req.session.customer._id,
        cart: cart,
        address: charge.source.address_line1,
        paymentId: charge.id,
      });

      //minus product unit and plus product sale number

      const cartItems = cart.items;
      for (let key in cartItems) {
        let data = cartItems[key];
        let findProduct = await product.findById(cartItems[key].item._id);
        // tru san pham
        let newP_unit = findProduct.P_unit - data.qty;
        let newP_unit_sale = findProduct.P_unit_sale + data.qty;
        findProduct.P_unit = newP_unit;
        findProduct.P_unit_sale = newP_unit_sale;
        await findProduct.save();
        await order.save();
      }

      req.session.cart = null;
      res.redirect("/");
      return;
    }
  );
};
// handle subscribe
clientController.handleSubscribe = async function (req, res) {
  console.log(req.body);
  let newSub = new mailModel({ email: req.body.email });
  await newSub.save();
  res.redirect("/");
  return;
};
module.exports = clientController;
